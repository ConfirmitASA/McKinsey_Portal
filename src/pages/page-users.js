import {api, apiError} from '../utils/api-request';
import 'datatables.net-dt';
import '../external/styles/dataTables.css';

jQuery(function() {
  $('#system-users').on('click', '.edit-user-link', editUser);

  $('.transition_link a[href="#users"]').on('click', () => {
    loadUsers();
  });

  $('#add-user-button').on('click', () => {
    api(
      'GetCompanies',
      {},
      result => {
        const companies = result.Data;
        onUserLoaded({Data: {UserState: '2', Company: 'N/A'}}, companies);
      },
      apiError
    );
  });

  $('#edit-user-save-button').on('click', () => {
    const parameters = {
      UserId: $('#edit-user-userid').val(),
      UserIdEdit: $('#edit-user-useridedit').val(),
      Email: $('#edit-user-email').val(),
      Name: $('#edit-user-name').val(),
      CompanyId: $('#edit-user-company').val(),
      Password: $('#edit-user-password').val(),
      UserState: $('#edit-user-userstate').val(),
      Roles: $('#edit-user-roles-admin').prop('checked') ? 'admin' : null,
    };
    api('UpsertUser', parameters, onUserUpdated, apiError);
  });

  $('#edit-user-cancel-button').on('click', () => {
    $('#user-list').fadeIn();
    $('#edit-user-form').hide();
  });
});

const userStates = {
  '1': 'Pending approval',
  '2': 'Active',
  '3': 'No longer active',
};

function editUser(e) {
  var userid = $(e.currentTarget).attr('data-userid');
  api(
    'GetCompanies',
    {},
    result => {
      const companies = result.Data;
      api('GetUser', {userid}, result => onUserLoaded(result, companies), apiError);
    },
    apiError
  );
}

function onUserLoaded(result, companies) {
  let data = result.Data;
  $('#edit-user-useridedit').val(data.UserId);
  $('#edit-user-userid').val(data.UserId);
  $('#edit-user-name').val(data.Name);
  $('#edit-user-email').val(data.Email);
  $('#edit-user-password').val('');
  $('#edit-user-roles-admin').prop('checked', data.Roles && data.Roles.indexOf('admin') !== -1);
  $('#edit-user-userstate').val('' + data.UserState);

  var companyOptions = ['<option value="" disabled selected>Select Company</option>'];
  companies.forEach(company => {
    companyOptions.push(`<option value="${company.CompanyId}">${company.CompanyName}</option>`);
  });

  const editCompany = $('#edit-user-company');
  editCompany.html(companyOptions.join(''));
  editCompany.val(data.CompanyId);

  $('#edit-user-self-company').html(data.Company);
  $('#user-list').hide();
  $('#edit-user-form').fadeIn();
}

function onUserUpdated(result) {
  $('#edit-user-form').hide();
  $('#user-list').fadeIn();
  loadUsers();
}

function loadUsers() {
  api(
    'GetCompanies',
    {},
    result => {
      const companies = result.Data;
      api('GetUsers', {}, result => onUserListLoaded(result, companies), apiError);
    },
    apiError
  );
}

function onUserListLoaded(result, companies) {
  const users = result.Data;
  users.sort((a, b) => {
    var byState = a.UserState - b.UserState;
    return byState !== 0 ? byState : a.UserId.localeCompare(b.UserId);
  });
  const companyMap = {};
  companies.forEach(company => (companyMap[company.CompanyId] = company.CompanyName));

  let o = [];
  o.push('<table border=1>');

  o.push(`
          <thead>
              <th class="data-cell header-cell" style="width: 15%">Username</th>
              <th class="data-cell header-cell" style="width: 20%">Full Name</th>
              <th class="data-cell header-cell" style="width: 30%">Email</th>
              <th class="data-cell header-cell" style="width: 20%">Company</th>
              <th class="data-cell header-cell" style="width: 15%">State</th>
          </thead>
      `);

  users.forEach(user => {
    o.push(`
              <tr class="edit-user-link" data-userid="${user.UserId.toLowerCase()}">
                  <td class=data-cell>${user.UserId.toLowerCase()}</td>
                  <td class=data-cell>${user.DisplayName}</td>
                  <td class=data-cell>${user.Email}</td>
                  <td class=data-cell>${companyMap[user.CompanyId] ||
                    'Unassigned (' + user.Company + ')'}</td>
                  <td class=data-cell>${userStates[user.UserState]}</td>
              </tr>
          `);
  });
  o.push('</table>');
  $('#system-users')
    .html(o.join(''))
    .children()
    .DataTable();
}
