import GlobalState from '../GlobalState';
import loadProjectConfigPage, {redirectToProjectConfigPage} from './page-project-config';
// eslint-disable-next-line import/no-cycle
import {updateActiveProjectDisplayName} from './page-projects';
import {api, apiError} from '../utils/api-request';
import {simulateClick} from '../utils/commonUtils';
import XLSX from '../external/scripts/xlsx.full.min';
import {PRODUCTS} from '../config/products-config';
import {backgroundMap} from '../config/mapping-config';
import Notify from '../external/scripts/notify';

import '../external/styles/iziModal.css';
import iziModal from '../external/scripts/iziModal';
import link from '../reporting_speech.htm';

export default function loadProjectHomePage() {
  hideActiveProjectMenuItems();
  if (GlobalState.activeProject) {
    loadActiveProjectData();
  }

  $('#refresh-data_button').on('click', refreshProjectData);
  $('#back-to-project').on('click', () => {
    GlobalState.updateProject();
  });
  enableEditProjectName();
  $('#download-report-button').on('click', () => {
    document.querySelector('#download-report-button').classList.add('hidden');
    document.querySelector('#download-report-loader').classList.remove('hidden');

    import('./powerpoint')
      .then(ppt => {
        ppt.default();
      })
      .catch(() => 'An error occurred while loading the component');
  });
  $('#preview-report-button').on('click', () => {
    //let url = 'https://survey.us.confirmit.com/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/McKDev/reporting_speech.html';

    //const width = window.outerWidth;
    //const height = window.outerHeight;
    //const features = `width=${width},height=${height}`;
    //window.open(link, '_blank', features);
    //var container = document.getElementById('reportingData');
    //var frame = document.createElement('iframe');
    //var frame = '<iframe id="modal" src="' + link + '"></iframe>';
    //frame.setAttribute('src', link);
    //container.innerHTML = frame;
    //document.body.appendChild(frame);
    let rdata = GlobalState.activeProject.ReportingData;

    if (Object.keys(rdata.Data).length === 0) {
      new Notify('Error', 'No data available for this project!', 'error', {
        autoClose: true,
      });
    } else {
      $('#ReportingDataModal').iziModal({
        iframe: true,
        headerColor: '#00a9f4',
        title: 'Reporting Data',
        subtitle: '',
        width: 1000,
        iframeHeight: 400,
        iframeURL: link,
        closeButton: true,
        fullscreen: true,
        borderBottom: false,
        background: '#051c2c',
        onOpened: function() {
          var frame = document.querySelector('#ReportingDataModal iframe');
          frame.contentWindow.postMessage({call: 'sendRepData', value: rdata});
        },
      });
      $('#ReportingDataModal').iziModal('open');
    }
  });
  $('.fa-solid.fa-gear').on('click', redirectToProjectConfigPage);
  $('#config_button').on('click', redirectToProjectConfigPage);

  $('#download-import-form').on('click', exportPPTX);
  document.getElementById('upload-respondents').addEventListener(
    'change',
    function(e) {
      importPPTX(e.target.files[0]);
    },
    false
  );
  document.getElementById('upload-respondents').addEventListener(
    'click',
    function(e) {
      e.target.value = '';
    },
    false
  );

  $('#send-emails-icon').on('click', () => {
    simulateClick('#send-emails-button');
  });

  $('#preview-report-icon').on('click', () => {
    simulateClick('#preview-report-button');
  });

  $('#menuitem-active-project-info').on('click', () => {
    $('.modal-ui').css('display', 'none');
  });
}

export function redirectToProjectHome() {
  simulateClick('#menuitem-active-project-info');
}

export function loadActiveProjectData() {
  clearProjectData();
  showActiveProjectMenuItems();
  updateOnScreenProjectName();
  loadProjectRespondentCount();
  loadProjectConfigPage();

  // Temporary Code for Timeline
  addTimeline();

  $('.project-tile').removeClass('active-project-tile');
  $('.project-tile-wrapper').removeClass('active-project-tile-wrapper');

  $(`#project-tile-${GlobalState.activeProject.ProjectId}`).addClass('active-project-tile');
  $(`#project-tile-wrapper-${GlobalState.activeProject.ProjectId}`).addClass(
    'active-project-tile-wrapper'
  );

  //$('.page-title').text(GlobalState.activeProject.DisplayName);
  $('#active-project-info h2').text(GlobalState.activeProject.DisplayName);

  /*$('#wording-help').on('click', function() {
    simulateClick('#help-tile-2');
  });*/
}

export function updateProjectName(id) {
  const newName = $('#' + id + '-edit').val();

  $('#' + id /*, #page-title'*/).text(newName);
  //$('.page-title').text(newName);
  GlobalState.activeProject.DisplayName = newName;

  updateActiveProjectDisplayName();

  $('#' + id).show();
  $('#' + id + '-edit').hide();

  document
    .querySelectorAll('.project-name-edit-button')
    .forEach(element => (element.innerText = newName));

  document.querySelector('.place span').innerText = newName;

  GlobalState.updateProject();
}

function clearProjectData() {
  $('.project-data').val('');
  $('.modal-ui').hide();

  $('#project-complete-count').text('--');
  $('#project-respondent-count').text('--');
  $('#project-invited-count').text('--');
  $('#project-incomplete-rate').text('--');
  $('#project-complete-rate').text('--');

  $('#respondent-emails').empty();
}

function showActiveProjectMenuItems() {
  $('.active-project-bullet').removeClass('hidden');
}

function hideActiveProjectMenuItems() {
  $('.active-project-bullet').addClass('hidden');
}

function updateOnScreenProjectName() {
  $('#active-project-name, .project-name').text(GlobalState.activeProject.DisplayName);
}

function enableEditProjectName() {
  const idList = ['project-info-name', 'project-home-name', 'project-config-name'];
  idList.forEach(id => {
    $('#' + id + '-edit').on('change, focusout', function() {
      updateProjectName(id);
    });
    $('#' + id + '-edit').on('keypress', event => {
      if (event.key === 'Enter') {
        updateProjectName(id);
      }
    });

    $('#' + id).on('click', () => {
      $('#' + id + '-edit').val($('#' + id).text());

      $('#' + id).hide();
      const edit = $('#' + id + '-edit');
      edit.show();
      edit.trigger('focus');
    });
  });

  $('#rename_button').on('click', () => {
    $('#project-home-name-edit').val($('#project-home-name').text());

    $('#project-home-name').hide();
    const edit = $('#project-home-name-edit');
    edit.show();
    edit.trigger('focus');
  });
}

export function loadProjectRespondentCount() {
  const parameters = {
    ProjectId: GlobalState.activeProject.ProjectId,
    ProductId: GlobalState.activeProject.ProductId,
  };

  api('GetRespondentAndInviteCounts', parameters, getRespondentCountsSuccess, apiError);
}

function getRespondentCountsSuccess(o) {
  $('.cavani_tm_project_info').fadeIn();

  const respondentCount = o.Data.RespondentCount;
  const inviteCount = o.Data.InviteCount;
  const responseCount = o.Data.Responses;
  const completesCount = o.Data.Completes;
  const incompleteCount = parseInt(responseCount, 10) - parseInt(completesCount, 10);
  let responseRate = '--';
  let completeRate = '--';
  let incompleteRate = '--';

  /*if (parseInt(inviteCount, 10) !== 0) {
    responseRate = `${Math.round((responseCount / inviteCount) * 100).toString()}%`;
  }*/

  if (parseInt(inviteCount, 10) !== 0) {
    incompleteRate = `${Math.round((incompleteCount / inviteCount) * 100).toString()}%`;
  }

  if (parseInt(inviteCount, 10) !== 0) {
    completeRate = `${Math.round((completesCount / inviteCount) * 100).toString()}%`;
  }

  $('#project-respondent-count').text(respondentCount);
  $('#project-invited-count').text(inviteCount);
  $('#project-complete-count').text(completesCount);
  $('#project-incomplete-rate').text(incompleteRate);
  $('#project-complete-rate').text(completeRate);

  GlobalState.activeProject.RespondentCount = respondentCount;
  GlobalState.activeProject.InviteCount = inviteCount;
}

function getRemainingTime(input) {
  var today = new Date();
  today = today.toISOString().split('T')[0];

  var differenceDays = Math.round((Date.parse(input) - Date.parse(today)) / (1000 * 60 * 60 * 24));
  if (differenceDays >= 0) {
    var weeks = Math.floor(differenceDays / 7);
  } else {
    var weeks = Math.ceil(differenceDays / 7);
  }
  var daysWithoutWeeks = differenceDays % 7;
  var msg = 'TBD';

  if (differenceDays >= 14) {
    var msg =
      'In ' +
      weeks +
      ' weeks ' +
      (daysWithoutWeeks != 0 ? daysWithoutWeeks + ' day' + (daysWithoutWeeks > 1 ? 's' : '') : '');
  } else if (differenceDays < 14 && differenceDays > 1) {
    var msg = 'In ' + differenceDays + ' day' + (differenceDays > 1 ? 's' : '');
  } else if (differenceDays == 1) {
    var msg = 'Tomorrow!';
  } else if (differenceDays == 0) {
    var msg = 'Today!';
  } else if (differenceDays < 0 && differenceDays > -14) {
    var msg = Math.abs(differenceDays) + ' day' + (differenceDays > 1 ? 's' : '') + ' overdue';
  } else if (differenceDays <= -14) {
    var msg =
      Math.abs(weeks) +
      ' weeks ' +
      (daysWithoutWeeks != 0
        ? Math.abs(daysWithoutWeeks) + ' day' + (Math.abs(daysWithoutWeeks) > 1 ? 's' : '')
        : '') +
      ' overdue';
  }

  return msg;
}

function updateTimeline() {
  const dateItems = $('.date_changeable');
  var output = {};
  for (var i = 0; i < dateItems.length; i++) {
    const date = document.getElementById(dateItems[i].id).value;

    $('#' + dateItems[i].id + '_estimate').text(getRemainingTime(date));
    output[dateItems[i].id] = Date.parse(date);
  }

  const timelinesJSON = JSON.stringify(output);

  GlobalState.activeProject.Timelines = timelinesJSON;

  const parameters = {
    Id: GlobalState.activeProject.ProjectId,
    Timelines: timelinesJSON,
  };

  api('UpdateTimelines', parameters, timelineUpdated, apiError);
  //console.log(timelinesJSON);
}

function timelineUpdated() {
  console.log('Timelines updated!');
}

function addTimeline() {
  //const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const creationDate = new Date(GlobalState.activeProject.CreatedDate);

  if (GlobalState.activeProject.Timelines != undefined) {
    var timelines = JSON.parse(GlobalState.activeProject.Timelines);
    var date1 = new Date(timelines.date1);
    var date2 = new Date(timelines.date2);
    var date3 = new Date(timelines.date3);
    // console.log(GlobalState);
    // console.log('date1 ' + date1);
    // console.log('date2 ' + date2);
    // console.log('date3 ' + date3);
  } else {
    var date1 = new Date(creationDate.getTime());
    date1.setMonth(date1.getMonth() + 1);

    var date2 = new Date(date1.getTime());
    date2.setMonth(date2.getMonth() + 1);

    var date3 = new Date(date2.getTime());
    date3.setMonth(date3.getMonth() + 1);
    //console.log('New timeline');
  }

  const items = [
    {
      Time: creationDate.toISOString().split('T')[0],
      Text: 'Project Created',
      Subtext: GlobalState.activeProject.DisplayName,
    },
    {
      Time: date1.toISOString().split('T')[0],
      Text: 'Launch (Invitations Sent)',
      Subtext: getRemainingTime(date1),
    },
    {
      Time: date2.toISOString().split('T')[0],
      Text: 'Survey closed',
      Subtext: getRemainingTime(date2),
    },
    {
      Time: date3.toISOString().split('T')[0],
      Text: 'Insights Delivered',
      Subtext: getRemainingTime(date3),
    },
  ];

  $('#project-timeline').html(createTimeline(items));
  $('.date_changeable').on('change', updateTimeline);
}

function createTimeline(items) {
  const o = [];

  o.push(`
      <div class="section_inner" style="padding-left: 0; padding-top: 10px;">
          <div class="cavani_tm_about">
              <div class="resume">
                  <div class="wrapper">
                      <div class="education">
                          <div class="cavani_tm_title">
                              <span>Timeline</span>
                          </div>
                          <div class="instruction">
                              <span>Put your estimated dates here</span>
                          </div>
                          <div class="list">
                              <div class="univ">
                                  <ul>
      `);

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    o.push(
      `
                                          <li>
                                              <div class="list_inner">
                                                  <div class="time">
                                                      <input type="date" ${
                                                        i < 1
                                                          ? 'disabled="true"'
                                                          : "class='date_changeable'"
                                                      } id="date${i}"
                                                      value=${item.Time}
                                                      min="${
                                                        new Date().toISOString().split('T')[0]
                                                      }" max="2035-12-31">
                                                  </div>
                                                  <div class="place">
                                                      <h3>${item.Text}</h3>
                                                      <span id="date${i}_estimate">${
        item.Subtext
      }</span>
                                                  </div>
                                              </div>
                                          </li>
          `
    );
  }

  o.push(`
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`);

  return o.join('');
}

function refreshProjectData() {
  $('.cavani_tm_project_info').fadeOut();
  loadProjectRespondentCount();
}

function exportPPTX() {
  var headerRow = ['email'];
  const options = PRODUCTS[1].Config.Contents.Contents.Demos.Options;

  for (const item in options) {
    const checkbox = document.getElementById(item);
    if (checkbox.checked) {
      headerRow.push(options[item].Label);
    }
  }

  var book = XLSX.utils.book_new();
  var sheet = XLSX.utils.aoa_to_sheet([headerRow]);
  XLSX.utils.book_append_sheet(book, sheet, 'Respondents');
  XLSX.writeFile(book, GlobalState.activeProject.DisplayName + ' form.xlsx', {
    type: 'xlsx',
    compression: true,
  });
  new Notify(
    'Info',
    "Your download is starting. You can add respondents data to the Excel document, please don't change the top row.",
    'info',
    {autoClose: true}
  );
}

function importPPTX(file) {
  var ext = file.name.split('.');
  ext = ext[ext.length - 1];
  if (ext != 'xlsx') {
    new Notify('Error', 'Incorrect file. Please choose another file', 'error', {
      autoClose: true,
    });
    return;
  }
  var reader = new FileReader();

  reader.onload = function(e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, {type: 'binary'});
    workbook.SheetNames.forEach(function(sheetName) {
      var XL_json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      var remappedJson = inputFileCheckRemap(XL_json);

      if (typeof remappedJson == 'string') {
        new Notify('Error', remappedJson, 'error', {
          autoClose: true,
        });
      } else {
        uploadFromFile(remappedJson);
      }
    });
  };

  reader.onerror = function(ex) {
    new Notify('Error', 'Error occured: ' + ex, 'error', {autoClose: false});
  };

  reader.readAsBinaryString(file);
}

function inputFileCheckRemap(input) {
  // console.log('Input to remap:');
  // console.log(input);

  if (input.length < 1) {
    return 'Uploaded file is empty. Please upload a file with data';
  }

  //Checking headers integrity
  const options = PRODUCTS[1].Config.Contents.Contents.Demos.Options;
  var databaseLabels = [];
  var headersMap = {};
  const fileLabels = Object.keys(input[0]);
  var errors = [];
  var errMsg = '';

  for (const item in options) {
    const checkbox = document.getElementById(item);
    if (checkbox.checked) {
      databaseLabels.push(options[item].Label);
      headersMap[options[item].Label] = item;
    }
  }

  if (fileLabels.filter(x => x.toLowerCase() == 'email').length == 0) {
    return 'No "email" column! Please review file headers';
  } else if (fileLabels.filter(x => x.toLowerCase() == 'email').length != 1) {
    return 'More than one "email" column! Please review file headers';
  }

  for (const key in fileLabels) {
    if (!databaseLabels.includes(fileLabels[key]) && fileLabels[key].toLowerCase() != 'email') {
      errors.push(fileLabels[key]);
      errMsg = 'Please review following column headers: ' + errors.join(', ');
    }
  }

  if (errMsg != '') return errMsg;

  for (var i = 0; i < input.length; i++) {
    Object.keys(input[i]).forEach(oldKey => {
      if (oldKey.toLowerCase() != 'email') {
        input[i][headersMap[oldKey]] = input[i][oldKey];
        delete input[i][oldKey];
      }
    });
  }

  //Email validation
  for (var i = 0; i < input.length; i++) {
    let regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/gi;

    if (regexp.test(input[i].email) != true) {
      errors.push('Invalid email format in row ' + (+i + 2));
    }
  }

  if (errors.length > 0 && errors.length < 5) {
    errMsg = errors.join('<br>');
    return errMsg;
  } else if (errors.length >= 5) {
    errMsg =
      'Respondent file has ' +
      errors.length +
      ' errors in the email fields. Please check email fields and try again';
    return errMsg;
  }

  //Checking if cells are filled correctly
  for (var i = 0; i < input.length; i++) {
    for (var [key, value] of Object.entries(input[i])) {
      if (key.toLowerCase() != 'email' && backgroundMap.hasOwnProperty(key)) {
        var match = false;
        for (const answer in backgroundMap[key].Answers) {
          if (
            backgroundMap[key].Answers[answer].findIndex(
              item => value.toString().toLowerCase() === item.toLowerCase()
            ) != -1
          ) {
            input[i][key] = answer;
            match = true;
          } else if (key == 'demo_Tenure') {
            //Case for tenure
            var tenure = parseInt(input[i][key]);
            switch (true) {
              case tenure < 1 && tenure >= 0:
                input[i][key] = 'Tenure_1';
                match = true;
                break;

              case tenure >= 1 && tenure < 3:
                input[i][key] = 'Tenure_2';
                match = true;
                break;

              case tenure >= 3 && tenure < 6:
                input[i][key] = 'Tenure_3';
                match = true;
                break;

              case tenure >= 6 && tenure < 11:
                input[i][key] = 'Tenure_4';
                match = true;
                break;

              case tenure >= 11 && tenure < 20:
                input[i][key] = 'Tenure_5';
                match = true;
                break;

              case tenure >= 20:
                input[i][key] = 'Tenure_6';
                match = true;
                break;
            }
          } else if (key == 'demo_AgeYear') {
            //Case for birth year
            const ageYear = parseInt(input[i][key]);
            switch (true) {
              case ageYear >= 1900 && ageYear <= 1945:
                input[i][key] = 'AgeYear_1';
                match = true;
                break;

              case ageYear >= 1946 && ageYear <= 1964:
                input[i][key] = 'AgeYear_2';
                match = true;
                break;

              case ageYear >= 1965 && ageYear <= 1980:
                input[i][key] = 'AgeYear_3';
                match = true;
                break;

              case ageYear >= 1981 && ageYear <= 1995:
                input[i][key] = 'AgeYear_4';
                match = true;
                break;

              case ageYear >= 1996 && ageYear <= new Date().getFullYear() - 5:
                input[i][key] = 'AgeYear_5';
                match = true;
                break;
            }
          } else if (!value) {
            input[i][key] = null;
            match = true;
          }
        }
        if (!match) {
          errors.push(
            'Row number ' + (+i + 2) + ' has invalid value in "' + options[key].Label + '" column'
          );
        }
      }
    }
  }
  if (errors.length > 0 && errors.length <= 5) {
    errMsg = errors.join('<br>');
    return errMsg;
  } else if (errors.length > 5) {
    const numberOfErrors = errors.length;
    errors.length = 5;
    errMsg =
      errors.join('<br>') +
      '<br>' +
      'And ' +
      (numberOfErrors - 5) +
      ' more error' +
      (numberOfErrors - 5 > 1 ? 's' : '') +
      ' in the data fields. Please make sure it is filled according to the guidelines';
    return errMsg;
  }
  return input;
}

function uploadFromFile(input) {
  // console.log('To API:');
  //console.log(input);
  const parameters = {
    ProjectId: GlobalState.activeProject.ProjectId,
    Respondents: input, // array
  };

  api('AddRespondentsAndEmails', parameters, AddFromFile_Success, apiError);
}

function AddFromFile_Success(o) {
  var data = o.Data;

  loadProjectRespondentCount();

  new Notify('Success', data.RespondentCount + ' email(s) successfully uploaded', 'success', {
    autoClose: true,
  });
  $('#upload-respondents-ui').slideUp();
}
