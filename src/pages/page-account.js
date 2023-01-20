import GlobalState from '../GlobalState';
import {api, apiError} from '../utils/api-request';
import {sacleUpPage, showAdminMenu, showPrivateMenu} from '../utils/commonUtils';
import {updateUserDisplayName} from './page-projects';

export default function loadAccountPage() {
  $('#edit-link').on('click', openEditAccount);
  $('#edit-cancel-button').on('click', cancelEditAccount);
  $('#edit-save-button').on('click', saveEditAccount);

  loadAccountData();
}

function openEditAccount() {
  $('#account-summary').hide();
  $('#edit-form').fadeIn();
  $('#edit-link').fadeOut();
}

function cancelEditAccount() {
  $('#account-summary').fadeIn();
  $('#edit-form').hide();
  $('#edit-link').fadeIn();
}

function saveEditAccount() {
  const parameters = {
    Email: $('#edit-email').val(),
    Name: $('#edit-name').val(),
    Url: $('#survey-url').val(), // TODO: do we still need survey url?
  };

  api('UpdateProfile', parameters, editAccountSuccess, apiError);
}

function loadAccountData() {
  const data = GlobalState.user;

  showPrivateMenu();
  showAdminMenu(data);
  sacleUpPage();

  $('#account-user-display-name').text(data.UserDisplayName);
  $('#account-user-email').text(data.Email);
  $('#account-company-name').text(GlobalState.user.AssignedCompany);

  $('#edit-name').val(data.UserDisplayName);
  $('#edit-email').val(data.Email);

  $('#survey-url').val(data.Url);

  // Show/hide logic
  $('.cavani_tm_home').hide();
  $('#logged-in').fadeIn();

  $('#edit-form').hide();

  $('#account-summary').fadeIn();
  $('#edit-link').fadeIn();
}

function editAccountSuccess(o) {
  const data = o.Data;
  GlobalState.setUserData(data);
  loadAccountData();
  updateUserDisplayName();
}
