import {api, apiError} from '../utils/api-request';
import {simulateClick} from '../utils/commonUtils';
import Notify from '../external/scripts/notify';
import GlobalState from '../GlobalState';
import loadAccountPage from './page-account';
import loadProjectsPage, {redirectToProjects} from './page-projects';
import loadProductsPage from './page-products';
import loadHelpPage from './page-help';
import loadProjectHomePage from './page-project-home';
import './page-users';
import './page-companies';

export default function loadHomePage() {
  $('#signup-link').on('click', openSignupForm);
  $('#signup-button').on('click', signUpNewUser);
  $('#signup-cancel-button').on('click', closeSignupForm);

  $('#login-userid').on('keypress', e => {
    if (e.key === 'Enter') {
      onEnterKeyPressesUsername();
    }
  });
  $('#login-button').on('click', logIn);
  $('#login-pw').on('keypress', e => {
    if (e.key === 'Enter') {
      logIn();
    }
  });

  $('#logout-button').on('click', logOut);
  $("[href='#logout']").on('click', () => {
    setTimeout(() => {
      logOut();
    }, 1000);
  });
}

export function redirectToHomePage() {
  simulateClick('#menuitem-home');
}

export function clearSignupForm() {
  $('#signup-userid').val('');
  $('#signup-pw').val('');
  $('#signup-email').val('');
  $('#signup-name').val('');
  $('#signup-company').val('');
  $('#signup-error-message').text('');
}

function openSignupForm() {
  $('#home-intro').hide();
  $('#login-form').hide();
  $('#signup-form').fadeIn();
}

function closeSignupForm() {
  clearSignupForm();

  $('#signup-form').hide();
  $('#home-intro').fadeIn();
  $('#login-form').fadeIn();
}

function signUpNewUser() {
  const parameters = {
    Id: $('#signup-userid').val(),
    Password: $('#signup-pw').val(),
    Email: $('#signup-email').val(),
    Name: $('#signup-name').val(),
    Company: $('#signup-company').val(),
  };

  api('Register', parameters, signupSuccess, apiError);
}

function signupSuccess() {
  new Notify(
    'Success',
    'You have successfully registered for access to the portal &mdash; you will be notified when your access has been approved',
    'success',
    {
      autoClose: true,
    }
  );
  clearSignupForm();
  logOut();
}

export function clearLoginForm() {
  $('#login-userid').val('');
  $('#login-pw').val('');
  $('#login-error-message').text('');
}

function logIn() {
  const parameters = {
    Id: $('#login-userid').val(),
    Password: $('#login-pw').val(),
  };

  api('Login', parameters, loginSuccess, apiError);
}

export function loginSuccess(o) {
  GlobalState.setUserData(o.Data);

  clearLoginForm();

  GlobalState.getProjects(loadProjectsPage);
  loadProjectHomePage(); // Initialize the project home page to subscribe event handlers even if there is no active project
  loadAccountPage();
  loadProductsPage();
  loadHelpPage();

  redirectToProjects();
}

function logOut() {
  api('Logout', {}, onLoggedOut, apiError);
}

function onEnterKeyPressesUsername() {
  const passwordInput = $('#login-pw');
  if (passwordInput.val() === '') {
    $('#login-pw').trigger('focus');
  } else {
    logIn();
  }
}

function onLoggedOut() {
  location.reload();
}
