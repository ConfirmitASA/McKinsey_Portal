import {api, apiError} from '../utils/api-request';
import 'datatables.net-dt';
import '../external/styles/dataTables.css';
import Notify from '../external/scripts/notify';

$('img.logo-preview')[0].setAttribute('srcdef', $('img.logo-preview')[0].src);
$('img.logo-preview')[1].setAttribute('srcdef', $('img.logo-preview')[1].src);
$('img.logo-preview')[0].onerror = logoError;

window.onmessage = function(e) {
  if (typeof e.data == 'object' && e.data.call == 'sendLogoLink') {
    $('#edit-company-logo').val(e.data.value);
    changePreviewLogo();
  }
};

function logoError() {
  // $('img.logo-preview').attr('broken', true);
  new Notify(
    'Failure',
    'Please check the link to your logo. Supported image formats: jpeg, jpg, gif, png, svg',
    'error',
    {
      autoClose: true,
    }
  );
  resetLogoPreview('reset');
}

jQuery(function() {
  $('.transition_link a[href="#companies"]').on('click', () => {
    api('GetCompanies', {}, onCompanyListLoaded, apiError);
  });

  $('#add-company-button').on('click', () => onCompanyLoaded({Data: {}}));
  $('#system-companies').on('click', '.edit-company-link', e => {
    var companyId = $(e.currentTarget).attr('data-companyid');
    api('GetCompany', {CompanyId: companyId}, onCompanyLoaded, apiError);
  });

  $('#edit-company-logo').on('change', function() {
    changePreviewLogo();
  });

  //$('#preview-logo_button').on('click', () => changePreviewLogo());

  $('#reset-logo_button').on('click', () => {
    resetLogoPreview('clear');
    $('#edit-company-logo').val('');
  });

  $('#edit-company-save-button').on('click', () => {
    var img = new Image();
    img.onload = function() {
      sendCompany();
    };
    img.onerror = function() {
      if ($('#edit-company-logo').val() != '') {
        return;
      } else {
        sendCompany();
      }
    };
    img.src = $('#edit-company-logo').val();
  });

  $('#edit-company-cancel-button').on('click', () => {
    $('#company-list').fadeIn();
    $('#edit-company-form').hide();
  });
});

function sendCompany() {
  const parameters = {
    CompanyId: $('#edit-company-companyid').val(),
    CompanyName: $('#edit-company-name').val(),
    SupportEmail: $('#edit-company-supportemail').val(),
    CompanyLogo: $('#edit-company-logo').val(),
    UseLogoInEmail: $('#use-logo-in-email').prop('checked') ? 'y' : null,
  };
  api('UpsertCompany', parameters, onCompanyUpdated, apiError);
}

function onCompanyLoaded(result) {
  let data = result.Data;
  $('#edit-company-companyid').val(data.CompanyId);
  $('#edit-company-name').val(data.CompanyName);
  $('#edit-company-supportemail').val(data.CompanyEmail);
  $('#edit-company-logo').val(data.CompanyLogo);
  $('#use-logo-in-email').prop('checked', data.UseLogoInEmail === 'y');
  $('#company-list').hide();
  $('#edit-company-form').fadeIn();
  $('#file-upload_container').empty();
  $('#file-upload_container').html(
    '<iframe src="https://survey.us.confirmit.com/wix/p544362285564.aspx" height="250" width="500"></iframe>'
  );
  if (data.CompanyLogo) {
    changePreviewLogo();
  } else {
    resetLogoPreview('clear');
  }
}

function resetLogoPreview(command) {
  if (command == 'clear') {
    $('img.logo-preview')[0].setAttribute('src', $('img.logo-preview')[0].getAttribute('srcdef'));
    $('img.logo-preview')[1].setAttribute('src', $('img.logo-preview')[1].getAttribute('srcdef'));
  } else if (command == 'reset') {
    api('GetCompany', {CompanyId: $('#edit-company-companyid').val()}, returnLogo, apiError);
  }
}

function returnLogo(input) {
  $('#edit-company-logo').val(input.Data.CompanyLogo);
  changePreviewLogo();
}

function changePreviewLogo() {
  const url = $('#edit-company-logo').val();
  if (url == '') {
    resetLogoPreview('clear');
  } else if (url.includes('?')) {
    $('img.logo-preview').attr('src', url + '&' + new Date().getTime());
  } else {
    $('img.logo-preview').attr('src', url + '?' + new Date().getTime());
  }
}

function onCompanyUpdated(result) {
  $('#edit-company-form').hide();
  $('#company-list').fadeIn();
  api('GetCompanies', {}, onCompanyListLoaded, apiError);
}

function onCompanyListLoaded(result) {
  var companies = result.Data;
  companies.sort((a, b) => a.CompanyName.localeCompare(b.CompanyName));
  let o = [];
  o.push('<table border=1>');
  o.push(`
          <thead>
              <th class="data-cell header-cell" style="width: 50%">Company Name</th>
              <th class="data-cell header-cell" style="width: 50%">Support Email</th>
          </thead>
      `);

  companies.forEach(company => {
    o.push(`
              <tr class="edit-company-link" data-companyid="${company.CompanyId.toLowerCase()}">
                  <td class="data-cell">
                  ${company.CompanyName}</td>                 
                  <td class="data-cell">
                  ${company.SupportEmail || 'N/A'}
                  </td>                 
              </tr>
          `);
  });
  o.push('</table>');
  $('#system-companies')
    .html(o.join(''))
    .children()
    .DataTable();
}
