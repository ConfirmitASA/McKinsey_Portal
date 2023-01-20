import {api, apiError} from './utils/api-request';
import {simulateClick} from './utils/commonUtils';
import {PRODUCTS} from './config/products-config';

class GlobalState {
  constructor() {
    this.activeProject = null;
    this.projects = [];
    this.user = null;
  }

  clearState() {
    this.activeProject = null;
    this.projects = [];
    this.user = null;
  }

  setUserData(userData) {
    this.user = userData;
    if (userData?.AssignedCompany === '') {
      this.user.AssignedCompany = `${userData.Company}(unassigned)`;
    }
  }

  saveConfig(functionSuccess = () => {}) {
    const configStringified = JSON.stringify(this.getActiveProjectConfig());
    this.activeProject.Config = configStringified;
    //this.activeProject.Timelines = updateTimeline();

    const parameters = {
      Id: this.activeProject.ProjectId,
      DisplayName: this.activeProject.DisplayName,
      Config: this.activeProject.Config,
      //Timelines: this.activeProject.Timelines,
    };

    api('UpdateProject', parameters, functionSuccess, apiError);
  }

  addProject(productId, addProjectSuccess = () => {}) {
    const dates = {};
    const parameters = {
      ProductId: productId,
    };

    const addProjectSuccessWrapper = data => {
      const project = data.Data;
      project.Config = null;
      project.ProjectId = project.ProjectId.toString();
      this.projects.unshift(project);

      addProjectSuccess(project);
    };

    api('AddProject', parameters, addProjectSuccessWrapper, apiError);
  }

  activateProject(projectId, setActiveProjectSuccess = () => {}) {
    const projectToActivate = this.projects.find(project => project.ProjectId === projectId);
    if (!projectToActivate) return;
    this.activeProject = projectToActivate;

    setActiveProjectSuccess();
  }

  updateProject() {
    $('.cavani_tm_active_project').fadeOut();

    const updateProjectSuccess = () => {
      $('.cavani_tm_active_project').fadeIn();
      simulateClick('#menuitem-active-project-info');
    };

    this.saveConfig(updateProjectSuccess);
  }

  getProjects(getProjectsSuccess = () => {}) {
    const getProjectsSuccessWrapper = data => {
      this.projects = data.Data.reverse(); // reverse to have newest projects first
      if (this.projects.length === 1) {
        this.activateProject(this.projects[0].ProjectId);
      }
      getProjectsSuccess();
    };

    api('GetProjects', {}, getProjectsSuccessWrapper, apiError);
  }

  getActiveProjectConfig() {
    const configForProjectType = PRODUCTS[this.activeProject.ProductId].Config;
    const configForActiveProject = {};

    for (const tabId in configForProjectType) {
      const tab = configForProjectType[tabId];

      for (const key in tab.Contents) {
        const tabContents = tab.Contents[key];
        switch (tabContents.Type) {
          case 'Open':
            let str = $(`#${key}`).val();
            let escapeStr = str
              .replace(/"/g, '&quot;')
              .replace(/\n/g, '')
              .replace(/\t/g, '');
            configForActiveProject[key] = escapeStr;
            break;

          case 'Dropdown':
            configForActiveProject[key] = $(`#${key}`).val();
            break;

          case 'Multi':
            // eslint-disable-next-line no-case-declarations
            const codes = [];
            $(`#config-${key}`)
              .find(':checked')
              // eslint-disable-next-line func-names
              .each(function() {
                codes.push($(this).attr('id'));
              });
            configForActiveProject[key] = codes;
            break;
          default:
            break;
        }
      }
    }
    configForActiveProject.clientName = this.user.AssignedCompany;
    return configForActiveProject;
  }
}

export default new GlobalState();
