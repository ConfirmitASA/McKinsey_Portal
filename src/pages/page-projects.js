import GlobalState from '../GlobalState';
import {api, apiError} from '../utils/api-request';
import {PRODUCTS} from '../config/products-config';
import Notify from '../external/scripts/notify';
// eslint-disable-next-line import/no-cycle
import {loadActiveProjectData, redirectToProjectHome} from './page-project-home';
import {simulateClick} from '../utils/commonUtils';
import mcKinseyLogo from '../assets/images/mckinsey-logo.png';
import profilePhoto from '../assets/images/profile-photo.jpg';
import spinner from '../assets/images/spinner.gif';

export default function loadProjectsPage() {
  clearProjectsPage();
  const records = GlobalState.projects;

  if (records.length === 0) {
    renderWelcomeSection();
  } else {
    renderProjectList(records);
  }

  $('.action-button.round-button.new-project-button').on('click', () => {
    simulateClick('#menuitem-add-project');
  });

  const yourProjectsContainer = $('#your-projects');
  yourProjectsContainer.fadeIn();
}

export function redirectToProjects() {
  simulateClick('#menuitem-projects');
  $('#cavani_tm_projects').fadeIn();
}

export function updateActiveProjectDisplayName() {
  $(`#project-tile-${GlobalState.activeProject.ProjectId} .project-display-name`).html(
    GlobalState.activeProject.DisplayName
  );
}

export function updateUserDisplayName() {
  $('.dynamic-field.user-display-name').text(GlobalState.user.UserDisplayName);
  $('.dynamic-field.user-display-name--first-name').text(
    GlobalState.user.UserDisplayName.split(' ')[0]
  );
}

function clearProjectsPage() {
  $('#your-projects').html('');
  $('#project-list-welcome-msg').html('');
  $('#project-page-title').html('');
  $('#project-list-title').css('display', 'unset');
}

function loadReportingData() {
  const parameters = {
    Id: GlobalState.activeProject.ProjectId,
  };
  api('GetReportingData', parameters, getReportingDataSuccess, apiError);
}

function getReportingDataSuccess(o) {
  var result = o.Data;
  var rep_data = JSON.parse(result.Data);
  GlobalState.activeProject.ReportingData = rep_data;

  //console.log(GlobalState.activeProject.ReportingData);
}

function createProjectTile(project) {
  const projectTileWrapper = document.createElement('div');
  projectTileWrapper.classList.add('project-tile-wrapper');
  projectTileWrapper.classList.toggle(
    'active-project-tile-wrapper',
    GlobalState.activeProject != null && project.ProjectId === GlobalState.activeProject.ProjectId
  );
  projectTileWrapper.id = `project-tile-wrapper-${project.ProjectId}`;

  const projectTile = document.createElement('div');
  projectTile.classList.add('project-tile', 'project');
  projectTile.classList.toggle(
    'active-project-tile',
    GlobalState.activeProject != null && project.ProjectId === GlobalState.activeProject.ProjectId
  );
  projectTile.id = `project-tile-${project.ProjectId}`;

  const projectCreatedDate = document.createElement('div');
  projectCreatedDate.classList.add('project-created-date');
  projectCreatedDate.style.float = 'right';
  // eslint-disable-next-line prefer-destructuring
  projectCreatedDate.innerText = new Date(new Date(project.CreatedDate).getTime())
    .toISOString()
    .split('T')[0];

  const projectImage = document.createElement('div');
  projectImage.classList.add('project-image');
  projectImage.style.backgroundImage = `url(${PRODUCTS[project.ProductId].Icons.Main})`;

  const projectDisplayName = document.createElement('div');
  projectDisplayName.classList.add('project-display-name');
  projectDisplayName.innerText = project.DisplayName;

  const divider = document.createElement('div');
  divider.className = 'tile__divider';

  const projectType = document.createElement('div');
  projectType.classList.add('project-type');
  projectType.innerText = PRODUCTS[project.ProductId].Name;

  projectTile.appendChild(projectCreatedDate);
  projectTile.appendChild(projectImage);
  projectTile.appendChild(projectDisplayName);
  projectTile.appendChild(divider);
  projectTile.appendChild(projectType);
  // markup to delete the project
  const deleteIcon = document.createElement('div');
  deleteIcon.classList.add('delete-icon');
  deleteIcon.innerHTML = `<i class='fa-solid fa-trash-can' id='${project.ProjectId}' style='font-family: "Font Awesome 6 Free" !important;'></i>`;
  projectTile.appendChild(deleteIcon);
  deleteIcon.addEventListener('click', e => {
    e.stopPropagation();
    const parameters = {
      Id: e.target.id,
      Action: 'delete',
    };
    function DeleteProject_Success(o) {
      var data = o.Data;
      GlobalState.getProjects(loadProjectsPage);
      new Notify('Success', `Project &quot;${data.DisplayName}&quot; was deleted.`, 'success', {
        autoClose: true,
      });
    }
    api('UpdateProject', parameters, DeleteProject_Success, apiError);
    deleteIcon.innerHTML = `<img src="${spinner}"></img>`;
    $('.active-project-bullet').addClass('hidden');
  });

  projectTile.addEventListener('click', () => {
    GlobalState.activateProject(project.ProjectId, () => {
      console.log(project.ProjectId);
      loadActiveProjectData();
      redirectToProjectHome();
      loadReportingData();
    });
  });

  projectTileWrapper.appendChild(projectTile);

  return projectTileWrapper;
}

function updateProjectCount() {
  $('#project-count').text(`(${GlobalState.projects.length})`);
}

function setActiveProject(projectId) {
  if (projectId) {
    GlobalState.activateProject(projectId);
  }
  if (GlobalState.activeProject !== null) {
    GlobalState.activateProject(GlobalState.activeProject);
  }
}

function renderProjectList(records) {
  const welcomeMessage = $('#project-list-welcome-msg');
  if (records.length === 1) {
    welcomeMessage.html(
      `Let's get that first project rolling, <span class='dynamic-field user-display-name user-display-name--first-name'>${
        GlobalState.user.UserDisplayName.split(' ')[0]
      }</span>!`
    );
  } else {
    welcomeMessage.html(`Select an existing research project, or add a new.`);
  }
  const projectTilesContainer = document.createElement('div');
  projectTilesContainer.classList.add('project-tiles-container');

  records.forEach(record => {
    const projecttile = createProjectTile(record);
    projectTilesContainer.appendChild(projecttile);
  });

  //$('.page-title').text(GlobalState.activateProject.DisplayName);

  updateProjectCount();
  setActiveProject();

  const yourProjectsContainer = $('#your-projects');
  yourProjectsContainer.append(projectTilesContainer);
}

function renderWelcomeSection() {
  const welcomeText = `Welcome, <span class='dynamic-field user-display-name'>${GlobalState.user.UserDisplayName}</span>`;
  $('#project-page-title').html(welcomeText);

  $('#project-list-title').css('display', 'none');

  $('#project-list-welcome-msg').html(`
  First of all, thank you for signing up!
  <P style="margin-top: 20px">
  While this portal allows you do to all your own employee research, it doesn't mean you have to. Your McKinsey team is just a click away, and always happy to assist:

  <ul style="margin-top: 20px; line-height: 24px; background-color: white; border: 0; color: black; padding: 20px 40px;">
    <li>If you want someone to talk you through how to use the portal.
    <li>If you're feeling scared about deploying your first research project, and would like a second pair of eyes.
    <li>If you need McKinsey to be in the driver's seat for a bit.
    <li>If you need help interpreting the results of your research.
    <li>If you just want to chat.
  </ul>
  <p style="
    margin-top: 20px;
  ">Sincerely,</p>
  <div style="display: flex">
    <div style="
      background-image: url(${profilePhoto});
      background-repeat: no-repeat;
      background-size: contain;
      height: 80px;
      width: 80px;
      border-radius: 50%;
      margin: 10px 20px 0 0;
    ">
    </div>
    <div style="padding-top: 20px">
      <div class=signature>Adam Clover</div>
      <img style="width: 85px;" class="partner-logo" src="${mcKinseyLogo}">
    </div>
  </div>

  <div class="signature" style="position: absolute; top: 110px; right: 60px;width: 140px;line-height: 24px; text-align: right;">↑<br><br><span class='dynamic-field user-display-name user-display-name--first-name'>${
    GlobalState.user.UserDisplayName.split(' ')[0]
  }</span> - add your first project here</div>

  `);
}
