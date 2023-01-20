import './external/styles/notify.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import './external/styles/plugins.css';
import './external/styles/cavani-styles.css';
import './styles.css';
import './external/styles/trumbowyg.css';
import spinner from './assets/images/spinner.gif';

import './external/scripts/init';
import './external/scripts/velocity.min';
import Notify from './external/scripts/notify';
import XLSX from './external/scripts/xlsx.full.min';

import GlobalState from './GlobalState';
import {api, apiError} from './utils/api-request';
import {PRODUCTS} from './config/products-config';
import {loadProjectRespondentCount} from './pages/page-project-home';

import loadHomePage, {loginSuccess} from './pages/page-home';
import loadAboutPage from './pages/page-about';
import './pages/page-users';
import './pages/page-companies';

function SimulateClick(x) {
  var item = $(x);
  item.trigger('mouseover');
  item.trigger('click');
}

function insertVersion() {
  var year = new Date().getFullYear();
  $('.copyright').text('© ' + year + ' Version: ' + __MAJOR_VERSION__ + '.' + __MINOR_VERSION__);
}

// Email stuff

function AddRespondents_Success(o) {
  var data = o.Data;

  loadProjectRespondentCount();
  $('#respondent-emails').empty();

  var upload_button = $('#upload-respondents-button');
  upload_button.prop('disabled', true);
  upload_button.addClass('disabled-button');
  upload_button.text('Upload emails');

  var validate_button = $('#validate-respondents-button');
  validate_button.prop('disabled', false);
  validate_button.removeClass('disabled-button');

  new Notify('Success', data.RespondentCount + ' email(s) successfully uploaded', 'success', {
    autoClose: true,
  });
  $('#upload-respondents-ui').slideUp();
}

function EmailingCount_Success(o) {
  var records = o.Data.Records;

  var counts = [0, 0, 0];

  records.forEach(e => {
    if (e.EmailCount == 0 || !e.EmailCount) {
      counts[0]++;
    } else if (e.EmailCount == 1 && e.status != 'complete') {
      counts[1]++;
    } else if (e.EmailCount == 2 && e.status != 'complete') {
      counts[2]++;
    }
  });

  if (counts[0] > 0) {
    $('#send-invites-button').prop('disabled', false);
    $('#send-invites-button').removeClass('disabled-button');
  }
  if (counts[1] > 0) {
    $('#send-reminders1-button').prop('disabled', false);
    $('#send-reminders1-button').removeClass('disabled-button');
  }
  if (counts[2] > 0) {
    $('#send-reminders2-button').prop('disabled', false);
    $('#send-reminders2-button').removeClass('disabled-button');
  }

  //$('#send_count').text('To be sent: ' + counts[0]);
  //$('#reminder1_count').text('To be sent: ' + counts[1]);
  //$('#reminder2_count').text('To be sent: ' + counts[2]);

  $('#send-invites-button').text('Send invitations (' + counts[0] + ')');
  $('#send-reminders1-button').text('Send reminders (' + counts[1] + ')');
  $('#send-reminders2-button').text('Send final reminders (' + counts[2] + ')');
}

function ReviewRespondents_Success(o) {
  var records = o.Data.Records;

  var o = [];
  for (var i = 0; i < records.length; ++i) {
    o.push(
      i +
        1 +
        '. ' +
        records[i].Email +
        (records[i].EmailCount == null ? '' : ' (Email Count: ' + records[i].EmailCount + ')')
    );
  }

  $('#review-respondent-emails').val(o.join('\n'));
}

function SendInvitations_Success(o) {
  if (o.Status == 'OK') {
    new Notify('Success', o.Data.SentCount + ' email invitation(s) sent', 'success', {
      autoClose: true,
    });
  } else {
    new Notify('Failure', 'Unable to send invitations', 'error', {
      autoClose: true,
    });
  }
  loadProjectRespondentCount();
}

function SendReminders1_Success(o) {
  if (o.Status == 'OK') {
    new Notify('Success', emailCount + ' email reminder(s) sent', 'success', {
      autoClose: true,
    });
  } else {
    new Notify('Failure', 'Unable to send reminders', 'error', {
      autoClose: true,
    });
  }
  loadProjectRespondentCount();
}

function SendReminders2_Success(o) {
  if (o.Status == 'OK') {
    new Notify('Success', emailCount + ' email reminder(s) sent', 'success', {
      autoClose: true,
    });
  } else {
    new Notify('Failure', 'Unable to send reminders', 'error', {
      autoClose: true,
    });
  }
  loadProjectRespondentCount();
}

function SendToSelf_Success(o) {
  if (o.Status == 'OK') {
    new Notify('Success', o.Data.EmailCount + ' email sent to ' + o.Data.EmailSent, 'success', {
      autoClose: true,
    });
  } else {
    new Notify('Failure', 'Unable to send email', 'error', {
      autoClose: true,
    });
  }
}

function parseExcel(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, {type: 'binary'});
    workbook.SheetNames.forEach(function(sheetName) {
      var XL_json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      // remap object to lowercase 'email' col if present
      XL_json.forEach(function(obj) {
        Object.keys(obj).forEach(function(key) {
          if (key.toLowerCase() === 'email') {
            let value = obj[key];
            delete obj[key];
            obj.email = value;
          }
        });
      });

      if (!XL_json[0].hasOwnProperty('email')) {
        new Notify('Error', 'No "email" column!', 'error', {autoClose: true});
      } else {
        validateEmails(XL_json);
      }
    });
  };

  reader.onerror = function(ex) {
    new Notify('Error', 'Error occured: ' + ex, 'error', {autoClose: true});
  };

  reader.readAsBinaryString(file);
}

function validateEmails(obj) {
  const elem = document.getElementById('respondent-emails');
  var validEmails = [];
  var errors = [];
  var html = [];

  //var textContent = elem.innerText;
  //var textArr = textContent.split('\n');
  //var trimLines = textArr.map(item => item.trim());
  //var filterEmptyLines = trimLines.filter(item => item != '');

  obj.forEach(item => {
    let regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/gi;
    if (regexp.test(item.email) == true) {
      validEmails.push(item.email);
      item.email = '<div style="color: green">' + item.email + '</div>';
    } else {
      errors.push(item.email);
      item.email = '<div style="color: red">' + item.email + '</div>';
    }
    html.push(item.email);
  });

  let str = html.join('');
  elem.innerHTML = str;

  if (validEmails.length == 0) {
    new Notify('Error', 'No valid email addresses found in input!', 'error', {autoClose: true});
  } else {
    if (errors.length != 0) {
      var errorString =
        errors.length +
        ' email' +
        (errors.length > 1 ? 's' : '') +
        ' ' +
        (errors.length > 1 ? 'have' : 'has') +
        ' errors!';
      errorString += '<p style="color: #FFF;">' + errors.join('<br>') + '</p>';
      new Notify('Error', errorString, 'error', {autoClose: false});
    } else {
      var upload_button = $('#upload-respondents-button');
      upload_button.prop('disabled', false);
      upload_button.removeClass('disabled-button');
      upload_button.text('Load validated emails (' + validEmails.length + ')');

      var validate_button = $('#validate-respondents-button');
      validate_button.prop('disabled', true);
      validate_button.addClass('disabled-button');
    }
  }
}
//PRY
function emailTemplate(type) {
  var cssLinks = document.querySelectorAll('[data-template="email-template"]');
  var cssString = '';
  Array.from(cssLinks).forEach(item => {
    cssString += item.outerHTML + '\n';
  });

  let emailTemplate = {};
  let companyLogo = '';
  let config = JSON.parse(GlobalState.activeProject.Config);
  let invite = config.Invitation.replace(/&quot;/g, '"');
  let reminder = config.Reminder.replace(/&quot;/g, '"');
  let freminder = config.FinalReminder.replace(/&quot;/g, '"');
  let companyEmail =
    GlobalState.user.CompanyEmail === '' ? '[not set]' : GlobalState.user.CompanyEmail;
  if (GlobalState.user.UseCompanyLogoInEmail != null) {
    companyLogo =
      GlobalState.user.CompanyLogo === ''
        ? ''
        : `<img src="${GlobalState.user.CompanyLogo}" alt="Logo" height=50>`;
  }
  const surveyUrl = `${PRODUCTS[GlobalState.activeProject.ProductId].SurveyUrl}?preview=true&pid=${
    GlobalState.activeProject.ProjectId
  }`;
  if (type == 'invitation') {
    emailTemplate.subject =
      'YOUR INPUT NEEDED - Invitation to the Organizational Health Index Survey - Link';
    emailTemplate.body = `
        <html>
        <head>
        ${cssString}
        </head>
        <body style="background: #FFFFFF;" bgcolor="#FFFFFF">
        
        <table border="0" cellpadding="10" cellspacing="10" width="100%" style="background-color: #FFFFFF;">
        <tr><td style="background-color: #FFFFFF;">${companyLogo}</td></tr>
        <tr><td style="background-color: #FFFFFF;">
        
        <p>${invite}</p>
        <br>
        <p>
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <a rel="noopener" target="_blank" name="surl" href="${surveyUrl}" style="font-size: 16px; color: #7d7789; font-weight: 500; text-decoration: none; padding: 12px 18px; border: 1px solid #7d7789; display: inline-block;">Start the survey <span style="font-weight:200;">&rarr;</span></a>
            </td>
          </tr>
        </table>
        </p>
        <p style='font-size: 12px; color: #7d7789; margin-top: 10px;'>If you have any questions about the survey or encounter any technical difficulties in completing it, please email ${companyEmail}</p>

        </td></tr>
        </table>
        </body></html>
    `;
  }
  if (type == 'reminder') {
    emailTemplate.subject =
      'REMINDER - Invitation to the Organizational Health Index Survey - Link';
    emailTemplate.body = `
        <html>
        <head>
        ${cssString}
        </head>
        <body style="background: #FFFFFF;" bgcolor="#FFFFFF">
        
        <table border="0" cellpadding="10" cellspacing="10" width="100%" style="background-color: #FFFFFF;">
        <tr><td style="background-color: #FFFFFF;">${companyLogo}</td></tr>
        <tr><td style="background-color: #FFFFFF;">

        <p>${reminder}</p>
        <br>
        <p>
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <a rel="noopener" target="_blank" name="surl" href="${surveyUrl}" style="font-size: 16px; color: #7d7789; font-weight: 500; text-decoration: none; padding: 12px 18px; border: 1px solid #7d7789; display: inline-block;">Start the survey <span style="font-weight:200;">&rarr;</span></a>
            </td>
          </tr>
        </table>
        </p>
        <p style='font-size: 12px; color: #7d7789; margin-top: 10px;'>If you have any questions about the survey or encounter any technical difficulties in completing it, please email ${companyEmail}</p>

        </td></tr>
        </table>
        </body></html>
    `;
  }
  if (type == 'finalreminder') {
    emailTemplate.subject =
      'YOUR INPUT NEEDED - Invitation to the Organizational Health Index Survey - Link';
    emailTemplate.body = `
    <html>
    <head>
    ${cssString}
    </head>
    <body style="background: #FFFFFF;" bgcolor="#FFFFFF">
        
    <table border="0" cellpadding="10" cellspacing="10" width="100%" style="background-color: #FFFFFF;">
    <tr><td style="background-color: #FFFFFF;">${companyLogo}></td></tr>
    <tr><td style="background-color: #FFFFFF;">
    
    <p>${freminder}</p>
    <br>
    <p>
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <a rel="noopener" target="_blank" name="surl" href="${surveyUrl}" style="font-size: 16px; color: #7d7789; font-weight: 500; text-decoration: none; padding: 12px 18px; border: 1px solid #7d7789; display: inline-block;">Start the survey <span style="font-weight:200;">&rarr;</span></a>
          </td>
        </tr>
      </table>
    </p>
    <p style='font-size: 12px; color: #7d7789; margin-top: 10px;'>If you have any questions about the survey or encounter any technical difficulties in completing it, please email ${companyEmail}</p>

    </td></tr>
    </table>
    </body></html>
        
    `;
  }
  return emailTemplate;
}

$(() => {
  loadHomePage();
  loadAboutPage();
  insertVersion();

  // Click Handlers

  //PRY
  $('#respondent-emails').keydown(e => {
    var upload_button = $('#upload-respondents-button');
    upload_button.prop('disabled', true);
    upload_button.addClass('disabled-button');
    upload_button.text('Upload emails');

    var validate_button = $('#validate-respondents-button');
    validate_button.prop('disabled', false);
    validate_button.removeClass('disabled-button');

    if (e.key == 'Enter') {
      document.execCommand('styleWithCSS', false, true);
      document.execCommand('foreColor', false, '#7d7789');
    }
  });
  // validate emails
  $('#validate-respondents-button').click(() => {
    const elem = document.getElementById('respondent-emails');
    var validEmails = [];
    var errors = [];
    var html = [];

    var textContent = elem.innerText;
    var textArr = textContent.split('\n');
    var trimLines = textArr.map(item => item.trim());
    var filterEmptyLines = trimLines.filter(item => item != '');

    filterEmptyLines.forEach(item => {
      let regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/gi;
      if (regexp.test(item) == true) {
        validEmails.push(item);
        item = '<div style="color: green">' + item + '</div>';
      } else {
        errors.push(item);
        item = '<div style="color: red">' + item + '</div>';
      }
      html.push(item);
    });

    let str = html.join('');
    elem.innerHTML = str;

    if (validEmails.length == 0) {
      new Notify('Error', 'No valid email addresses found in input!', 'error', {autoClose: true});
    } else {
      if (errors.length != 0) {
        var errorString =
          errors.length +
          ' email' +
          (errors.length > 1 ? 's' : '') +
          ' ' +
          (errors.length > 1 ? 'have' : 'has') +
          ' errors!';
        errorString += '<p style="color: #FFF;">' + errors.join('<br>') + '</p>';
        new Notify('Error', errorString, 'error', {autoClose: false});
      } else {
        var upload_button = $('#upload-respondents-button');
        upload_button.prop('disabled', false);
        upload_button.removeClass('disabled-button');
        upload_button.text('Load validated emails (' + validEmails.length + ')');

        var validate_button = $('#validate-respondents-button');
        validate_button.prop('disabled', true);
        validate_button.addClass('disabled-button');
      }
    }
  });
  // upload emails
  $('#upload-respondents-button').click(() => {
    var emails = [];
    var id = '#respondent-emails';
    var inputArr = document.querySelectorAll(id + ' div');

    inputArr.forEach(div => {
      let regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/gi;
      if (div.textContent != '') {
        if (regexp.test(div.textContent)) {
          emails.push(div.textContent);
        }
      }
    });

    for (var i = 0; i < emails.length; i++) {
      emails[i] = {email: emails[i]};
    }

    const parameters = {
      ProjectId: GlobalState.activeProject.ProjectId,
      Respondents: emails, // array
    };

    api('AddRespondentsAndEmails', parameters, AddRespondents_Success, apiError);
  });

  $('#close-respondents-upload-button').click(() => {
    $('#upload-respondents-button').prop('disabled', true);
    $('#upload-respondents-button').addClass('disabled-button');
    $('#upload-respondents-button').text('Upload emails');
    $('#upload-respondents-ui').slideUp();
  });

  $('#add-respondents-launch-button').click(() => {
    $('.modal-ui').hide();
    $('#respondent-emails').empty();
    $('#upload-respondents-ui').slideDown();
  });
  $('#add-respondents-launch-icon').click(() => {
    $('.modal-ui').hide();
    $('#respondent-emails').empty();
    $('#upload-respondents-ui').slideDown();
  });
  $('#add-emails-button').click(() => {
    $('.modal-ui').hide();
    $('#respondent-emails').empty();
    $('#upload-respondents-ui').slideDown();
  });

  $('#clear-emails-button').click(() => {
    $('#respondent-emails').empty();
    $('#validate-respondents-button').prop('disabled', true);
    $('#validate-respondents-button').addClass('disabled-button');
    $('#upload-respondents-button').prop('disabled', true);
    $('#upload-respondents-button').addClass('disabled-button');

    $('#upload-respondents-button').text('Load validated emails');
  });

  $('#close-respondents-review-button').click(() => {
    $('#review-respondent-emails').val('');
    $('#review-respondents-ui').slideUp();
  });

  $('#review-emails-button').click(() => {
    $('#review-respondent-emails').val('Loading...');
    $('.modal-ui').hide();
    $('#review-respondents-ui').slideDown();

    var parameters = {
      ProjectId: GlobalState.activeProject.ProjectId,
    };

    api('GetCurrentProjectRespondentData', parameters, ReviewRespondents_Success, apiError);
  });

  $('#send-emails-button').click(() => {
    $('#select-email-template')
      .val('0')
      .prop('selected', true);

    var iframe = document.getElementById('email-template');
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write('');
    iframe.contentWindow.document.close();

    $('.modal-ui').hide();
    $('#send-emails-ui').slideDown();

    $('#send-invites-button').html(`Send invitations <img src="${spinner}"></img>`);
    $('#send-reminders1-button').html(`Send reminders <img src="${spinner}"></img>`);
    $('#send-reminders2-button').html(`Send final reminders <img src="${spinner}"></img>`);

    $('#send-invites-button').prop('disabled', true);
    $('#send-invites-button').addClass('displaynone disabled-button');

    $('#send-reminders1-button').prop('disabled', true);
    $('#send-reminders1-button').addClass('displaynone disabled-button');

    $('#send-reminders2-button').prop('disabled', true);
    $('#send-reminders2-button').addClass('displaynone disabled-button');

    $('#send-self').prop('disabled', true);
    $('#send-self').addClass('displaynone disabled-button');

    //const parameters = {
    //ProjectId: GlobalState.activeProject.ProjectId,
    //};

    //api('GetCurrentProjectRespondentData', parameters, EmailingCount_Success, apiError);

    //scrollup
    var scrollDiv = document.getElementById('send-emails-ui');
    var activeDiv = document.getElementById('active-project-info');
    activeDiv.scrollTop = scrollDiv.scrollHeight;
  });

  $('#send-invites-button').on('click', () => {
    const parameters = {
      ProjectId: GlobalState.activeProject.ProjectId,
      SurveyUrl: PRODUCTS[GlobalState.activeProject.ProductId].SurveyUrl,
      EmailSubject: `Feedback Requested: ${GlobalState.activeProject.DisplayName}`,
      EmailBody: emailTemplate('invitation').body,
    };

    api('SendLinkToNewSurveyRespondents', parameters, SendInvitations_Success, apiError);
    SimulateClick('#close-send-emails-button');
  });

  $('#send-reminders1-button').on('click', () => {
    const parameters = {
      ProjectId: GlobalState.activeProject.ProjectId,
      SurveyUrl: PRODUCTS[GlobalState.activeProject.ProductId].SurveyUrl,
      EmailSubject: `Reminder: ${GlobalState.activeProject.DisplayName}`,
      EmailBody: emailTemplate('reminder').body,
    };

    api('SendFirstReminder', parameters, SendReminders1_Success, apiError);
    SimulateClick('#close-send-emails-button');
  });

  $('#send-reminders2-button').on('click', () => {
    const parameters = {
      ProjectId: GlobalState.activeProject.ProjectId,
      SurveyUrl: PRODUCTS[GlobalState.activeProject.ProductId].SurveyUrl,
      EmailSubject: `Last reminder: ${GlobalState.activeProject.DisplayName}`,
      EmailBody: emailTemplate('finalreminder').body,
    };

    api('SendLastReminder', parameters, SendReminders2_Success, apiError);
    SimulateClick('#close-send-emails-button');
  });

  $('#send-self').on('click', () => {
    var templateValue = document.getElementById('select-email-template').value;
    const parameters = {
      ProjectId: GlobalState.activeProject.ProjectId,
      SurveyUrl: PRODUCTS[GlobalState.activeProject.ProductId].SurveyUrl,
      EmailSubject: emailTemplate(templateValue).subject,
      EmailBody: emailTemplate(templateValue).body,
      UserEmail: GlobalState.user.Email,
    };

    api('SendToSelf', parameters, SendToSelf_Success, apiError);
  });

  $('#close-send-emails-button').on('click', () => {
    $('#send-emails-ui').slideUp();
  });
  document.getElementById('uploadXL').addEventListener(
    'change',
    function(e) {
      parseExcel(e.target.files[0]);
    },
    false
  );
  document.getElementById('uploadXL').addEventListener(
    'click',
    function(e) {
      e.target.value = '';
    },
    false
  );

  $('#select-email-template').on('change', function(e) {
    const elements = document.querySelectorAll('.email-button_container button');
    Array.from(elements).forEach((element, index) => {
      element.setAttribute('disabled', true);
      element.classList.add('displaynone');
    });

    if (e.target.value == 'invitation') {
      $('#send-invites-button').removeClass('displaynone');
    }
    if (e.target.value == 'reminder') {
      $('#send-reminders1-button').removeClass('displaynone');
    }
    if (e.target.value == 'finalreminder') {
      $('#send-reminders2-button').removeClass('displaynone');
    }

    if (e.target.value == '0') {
      $('#send-self').addClass('displaynone');
      $('#send-self').addClass('disabled-button');
      $('#send-self').prop('disabled', true);
    } else {
      $('#send-self').removeClass('displaynone');
      $('#send-self').removeClass('disabled-button');
      $('#send-self').prop('disabled', false);
    }

    var htmlcode = emailTemplate(e.target.value).body;
    var iframe = document.getElementById('email-template');
    iframe.contentWindow.document.open();
    if (htmlcode) iframe.contentWindow.document.write(htmlcode);
    iframe.contentWindow.document.close();

    api(
      'GetCurrentProjectRespondentData',
      {ProjectId: GlobalState.activeProject.ProjectId},
      EmailingCount_Success,
      apiError
    );
  });

  // for testing
  // if (document.location.href.split('/localhost').length > 1) {
  //   const parameters = {
  //     Id: 'espen',
  //     Password: 'pw',
  //   };

  //   api('Login', parameters, loginSuccess, apiError);
  // }
  api('GetCurrentUser', {}, loginSuccess, () => {});
});
