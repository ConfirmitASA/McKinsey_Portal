import '../external/scripts/jquery.qrcode.min';

import 'trumbowyg';
import trumbowygIcons from '../assets/images/icons.svg';

import Tab from '../components/Tab';
import GlobalState from '../GlobalState';
import {objectOfObjectsToArrayOfObjects, simulateClick} from '../utils/commonUtils';
import {PRODUCTS} from '../config/products-config';
import {capitalizeFirstWord, replacePreviewText} from '../utils/textUtils';
import {backgroundMap} from '../config/mapping-config';

/* Images for theme preview */
import mckinseyThemePreviewDesktop from '../assets/images/preview-theme-ohi-mckinsey.png';
import mckinseyThemePreviewMobile from '../assets/images/preview-theme-ohi-mckinsey-mobile.png';
import neutralThemePreviewDesktop from '../assets/images/preview-theme-ohi-neutral.png';
import neutralThemePreviewMobile from '../assets/images/preview-theme-ohi-neutral-mobile.png';
import mintyThemePreviewDesktop from '../assets/images/preview-theme-ohi-minty.png';
import mintyThemePreviewMobile from '../assets/images/preview-theme-ohi-minty-mobile.png';

export default function loadProjectConfigPage() {
  clearPageFormElement();
  renderTabs();
  changeCompanyInDropdown();
  /* if it is a newly added project save default config */
  if (!GlobalState.activeProject.Config) {
    GlobalState.saveConfig();
  }
  $('#active-project h2').text(GlobalState.activeProject.DisplayName);
  addEditor();
  enableDemoHoverMenu();
}

export function redirectToProjectConfigPage() {
  simulateClick('#menuitem-active-project');
}

function changeCompanyInDropdown() {
  if ($('#CompanyWording').length === 0) {
    return;
  }

  const companyDropdown = $("#CompanyWording>option[id='$company$']")[0];
  companyDropdown.value = GlobalState.user.AssignedCompany;
  companyDropdown.innerText = GlobalState.user.AssignedCompany;
  updateWording('CompanyWording');
}

const THEME_PREVIEW_IMAGES = {
  mckinsey: {
    desktop: mckinseyThemePreviewDesktop,
    mobile: mckinseyThemePreviewMobile,
  },
  neutral: {
    desktop: neutralThemePreviewDesktop,
    mobile: neutralThemePreviewMobile,
  },
  minty: {
    desktop: mintyThemePreviewDesktop,
    mobile: mintyThemePreviewMobile,
  },
};

const getPageFormElement = () => document.querySelector('#active-project-form');

function clearPageFormElement() {
  getPageFormElement().innerHTML = '';
}

function renderTabs() {
  const tabButtonsContainer = document.createElement('div');
  tabButtonsContainer.className = 'tab-buttons-container';

  const tabContentContainer = document.createElement('div');
  tabContentContainer.className = 'tab-content-container';

  const configForProjectType = PRODUCTS[GlobalState.activeProject.ProductId].Config;
  const activeProjectSettings = JSON.parse(GlobalState.activeProject.Config);

  objectOfObjectsToArrayOfObjects(configForProjectType).forEach(tabParameters => {
    const tab = new Tab(tabParameters.Id);

    const tabButton = tab.createTabButton(
      tabParameters.Label,
      tabParameters.Sub,
      tabParameters.Icon
    );
    tabButtonsContainer.insertAdjacentElement('beforeend', tabButton);

    const tabContentsWithSelectedValues = tabParameters.Contents;
    Object.keys(tabParameters.Contents).forEach(block => {
      const value =
        activeProjectSettings && activeProjectSettings[block] ? activeProjectSettings[block] : null;
      tabContentsWithSelectedValues[block].SelectedValue = value;
      // substitute dynamic company name value with '$company$' code
      if (
        block === 'CompanyWording' &&
        !Object.keys(tabParameters.Contents[block].Options).includes(value) &&
        value == GlobalState.user.AssignedCompany
      ) {
        tabContentsWithSelectedValues[block].SelectedValue = '$company$';
      }
    });

    tabContentContainer.insertAdjacentElement(
      'beforeend',
      tab.createTabContent(
        tabParameters.Description,
        tabContentsWithSelectedValues,
        tabParameters.BottomElement
      )
    );
  });

  getPageFormElement().insertAdjacentElement('beforeend', tabButtonsContainer);
  getPageFormElement().insertAdjacentElement('beforeend', tabContentContainer);

  addSettingsPreviews();

  $('.tab')
    .first()
    .trigger('click');
}

function addSettingsPreviews() {
  const paletteSelector = document.querySelector(`#Palette`);
  if (paletteSelector) {
    previewPalette();
    paletteSelector.addEventListener('change', previewPalette);
  }
  if (PRODUCTS[GlobalState.activeProject.ProductId].Config.Wording) {
    addWordingPreview();
  }
  if (PRODUCTS[GlobalState.activeProject.ProductId].Config.PreviewSurvey) {
    previewFinalSurvey();
    $('#PreviewSurvey').on('click', previewFinalSurvey);
  }
}

function addEditor() {
  $.trumbowyg.svgPath = trumbowygIcons;
  let editorConfig = {
    btns: [
      ['h1', 'h2', 'h3', 'h4'],
      ['strong', 'em', 'del'],
      ['superscript', 'subscript'],
      ['link'],
      ['insertImage'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
      ['unorderedList', 'orderedList'],
      ['horizontalRule'],
      ['viewHTML'],
    ],
    autogrow: true,
    removeformatPasted: true,
    tagsToRemove: ['script', 'emded', 'iframe', 'textarea', 'option', 'input', 'select'],
  };

  $('.editor').trumbowyg(editorConfig);
  $('.editor')
    .trumbowyg()
    .on('tbwchange', function() {
      GlobalState.saveConfig();
    });
}

function previewPalette() {
  const {value} = document.querySelector(`#Palette`);
  const colors =
    PRODUCTS[GlobalState.activeProject.ProductId].Config.Layout.Contents.Palette.Options[value]
      .Data;

  // Clear existing preview
  const previewContainer = document.querySelector(`#preview-Palette`);
  previewContainer.innerHTML = '';

  const paletteContainer = document.createElement('div');
  paletteContainer.className = 'palette-container';

  for (let i = 0; i < colors.length; i += 1) {
    const color = document.createElement('div');
    color.className = 'palette__color';
    color.style.backgroundColor = colors[i];
    paletteContainer.insertAdjacentElement('beforeend', color);
  }

  previewContainer.insertAdjacentElement('beforeend', paletteContainer);

  const previewImagesContainer = document.createElement('div');
  previewImagesContainer.className = 'preview-images-container';

  const previewImageDesktopWrapper = document.createElement('div');
  previewImageDesktopWrapper.className = 'preview-image-desktop-wrapper';
  const previewImageDesktop = document.createElement('img');
  previewImageDesktop.src = THEME_PREVIEW_IMAGES[value].desktop;
  previewImageDesktop.className = 'preview-image preview-image-desktop image-enlargable';
  previewImageDesktop.setAttribute('alt', 'Theme preview on desktop');
  previewImageDesktopWrapper.insertAdjacentElement('beforeend', previewImageDesktop);

  const previewImageMobileWrapper = document.createElement('div');
  previewImageMobileWrapper.className = 'preview-image-mobile-wrapper';
  const previewImageMobile = document.createElement('img');
  previewImageMobile.src = THEME_PREVIEW_IMAGES[value].mobile;
  previewImageMobile.className = 'preview-image preview-image-mobile image-enlargable';
  previewImageMobile.setAttribute('alt', 'Theme preview on mobile');
  previewImageMobileWrapper.insertAdjacentElement('beforeend', previewImageMobile);

  previewImagesContainer.insertAdjacentElement('beforeend', previewImageDesktopWrapper);
  previewImagesContainer.insertAdjacentElement('beforeend', previewImageMobileWrapper);

  previewContainer.insertAdjacentElement('beforeend', previewImagesContainer);

  // eslint-disable-next-line func-names
  $('.image-enlargable').on('click', function() {
    const enlargedImage = document.createElement('div');
    const url = $(this).attr('src');
    enlargedImage.style.backgroundImage = `url('${url}')`;
    enlargedImage.className = 'enlarged-image';
    enlargedImage.setAttribute('alt', 'Theme preview enlarged');
    enlargedImage.onclick = () => {
      enlargedImage.remove();
    };
    document.body.appendChild(enlargedImage);
  });

  //change logo preview background
  /*if (document.querySelector(`#Palette`).value == 'mckinsey') {
    document.querySelector('.logo-preview_container').style.backgroundColor = '#051c2c';
  } else if (document.querySelector(`#Palette`).value == 'neutral') {
    document.querySelector('.logo-preview_container').style.backgroundColor = '#ffffff';
  }*/
}

function addWordingPreview() {
  const options = PRODUCTS[GlobalState.activeProject.ProductId].Config.Wording.Contents;
  const wordingBlocks = objectOfObjectsToArrayOfObjects(
    PRODUCTS[GlobalState.activeProject.ProductId].Config.Wording.Contents
  ).map(wordingConfig => wordingConfig.Id);

  wordingBlocks.forEach(blockId => {
    if (!options[blockId].HasPreview) return;

    const statements = options[blockId].PreviewData;

    const statementsList = document.createElement('ul');
    statementsList.className = 'statements-list';

    statements.forEach(statement => {
      const dynamicTexts = statement.match(/(?<=\[)(.*?)(?=\])/gm);
      let newStatement = statement;
      dynamicTexts.forEach(dynamicText => {
        const selector = document.querySelector(`#${dynamicText}`);
        if (!selector) return;
        const {value} = selector;
        newStatement = replacePreviewText(newStatement, dynamicText, value);
      });

      const statementItem = document.createElement('li');
      statementItem.className = 'statements-list__item';
      statementItem.innerHTML = newStatement;
      statementsList.insertAdjacentElement('beforeend', statementItem);
    });

    $(`#preview-${blockId}`).append(statementsList);
    updateWording(blockId);
    updateArticles();

    document.querySelector(`#custom-submit_${blockId}`).addEventListener('click', () => {
      updateWording(blockId);
      updateArticles();
    });

    document.querySelector(`#${blockId}`).addEventListener('change', () => {
      var options = document.querySelector(`#${blockId}`).options;
      var dropdownId = options[options.selectedIndex].id;
      if (dropdownId.substr(0, dropdownId.indexOf('_')) != 'custom-wording') {
        updateWording(blockId);
      }
    });

    document.querySelector(`#${blockId}`).addEventListener('change', () => {
      var options = document.querySelector(`#${blockId}`).options;
      var dropdownId = options[options.selectedIndex].id;
      if (dropdownId.substr(0, dropdownId.indexOf('_')) != 'custom-wording') {
        updateArticles();
      }
    });
  });
}

function updateArticles() {
  const select = document.getElementById('CompanyWording');

  const dynamicArticles = $('.dynamic-article');

  dynamicArticles.each((i, element) => {
    if (select.options[select.options.length - 2].value === select.value) {
      element.innerHTML = '';
    } else {
      element.innerHTML = element.getAttribute('default-word');
    }
  });
}

function updateWording(blockId) {
  const {value} = document.querySelector(`#${blockId}`);
  const dynamicTexts = $(`.dynamic-text[data-controlled-by='${blockId}']`);

  dynamicTexts.each((i, elem) => {
    const dynamicText = $(elem);
    dynamicText.css('display', 'none');

    if (dynamicText.hasClass('dynamic-text--first-word')) {
      dynamicText.text(capitalizeFirstWord(value));
    } else {
      dynamicText.text(value);
    }

    dynamicText.fadeIn();
  });
}

function previewFinalSurvey() {
  // save current settings
  GlobalState.saveConfig();

  const surveyUrl = `${PRODUCTS[GlobalState.activeProject.ProductId].SurveyUrl}?preview=true&pid=${
    GlobalState.activeProject.ProjectId
  }`;

  // Clear existing preview
  const previewContainer = document.querySelector(`#preview-FinalSurvey`);
  previewContainer.innerHTML = '';

  const previewInNewWindowContainer = document.createElement('div');
  previewInNewWindowContainer.className = 'preview-in-new-window-container';

  const openInNewWindowIcon = document.createElement('i');
  openInNewWindowIcon.className = 'icon fa-solid fa-up-right-from-square';

  const previewInNewWindowButton = document.createElement('a');
  previewInNewWindowButton.className = 'button-preview-in-new-window';
  previewInNewWindowButton.href = surveyUrl;
  previewInNewWindowButton.target = '_blank';
  previewInNewWindowButton.innerHTML = 'Preview in new window →';

  previewInNewWindowContainer.insertAdjacentElement('beforeend', openInNewWindowIcon);
  previewInNewWindowContainer.insertAdjacentElement('beforeend', previewInNewWindowButton);

  previewContainer.insertAdjacentElement('beforeend', previewInNewWindowContainer);

  const previwOnMobileContainer = document.createElement('div');
  previwOnMobileContainer.className = 'preview-on-mobile-container';

  const qrCode = document.createElement('div');
  qrCode.className = 'qr-code';
  qrCode.id = 'qrcode-preview-survey';

  const previewOnMobileLabel = document.createElement('div');
  previewOnMobileLabel.className = 'preview-on-mobile-label';
  previewOnMobileLabel.innerHTML = 'Preview on mobile';

  previwOnMobileContainer.insertAdjacentElement('beforeend', qrCode);
  previwOnMobileContainer.insertAdjacentElement('beforeend', previewOnMobileLabel);

  previewContainer.insertAdjacentElement('beforeend', previwOnMobileContainer);

  // Update QR code placeholder
  $('#qrcode-preview-survey').qrcode({
    render: 'table',
    width: 120,
    height: 120,
    text: surveyUrl,
  });
}

function enableDemoHoverMenu() {
  for (const key in backgroundMap) {
    $('label[for=' + key + ']').hover(
      function() {
        window.optionsAppearTimeout = setTimeout(function() {
          $('#' + key + '_optionList').fadeIn('slow');
        }, 500);
      },
      function() {
        clearTimeout(window.optionsAppearTimeout);
      }
    );

    $('#' + key + 'option_container').mouseleave(function() {
      $('#' + key + '_optionList').fadeOut('slow');
    });

    $('#' + key + '_optionList').click(function() {
      $('#' + key + '_optionList').fadeOut('slow');
    });

    $('#' + key + '_optionList').mouseleave(function() {
      $('#' + key + '_optionList').fadeOut('slow');
    });
  }

  $('div.help-link').click(function() {
    simulateClick('#help-tile-2');
  });
}
