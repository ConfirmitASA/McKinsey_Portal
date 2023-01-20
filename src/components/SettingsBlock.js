import GlobalState from '../GlobalState';
import {replaceCompanyName} from '../utils/textUtils';
import {backgroundMap} from '../config/mapping-config';
import Notify from '../external/scripts/notify';

export const FormType = {
  Open: 'Open',
  Dropdown: 'Dropdown',
  Multi: 'Multi',
};

export default class SettingsBlock {
  constructor(id, settings) {
    this.id = id;
    this.header = settings.Label;
    this.description = settings.Description;
    this.type = settings.Type;
    this.defaultValue = settings.DefaultValue ?? '';
    this.selectedValue = settings.SelectedValue ?? this.defaultValue;
    this.setValues(settings.Options);
    this.hasPreview = settings.HasPreview ?? false;
  }

  createSettingsBlock() {
    const wrapper = document.createElement('div');
    wrapper.className = 'settings-block-wrapper';
    wrapper.id = `settings-${this.id}`;

    const header = document.createElement('span');
    header.className = 'settings-block-header';
    header.innerHTML = replaceCompanyName(this.header);

    const container = document.createElement('div');
    container.className = 'settings-block';

    const description = document.createElement('div');
    description.className = 'settings-block__description';
    description.innerHTML = replaceCompanyName(this.description);

    wrapper.insertAdjacentElement('beforeend', header);
    wrapper.insertAdjacentElement('beforeend', container);
    container.insertAdjacentElement('beforeend', description);
    container.insertAdjacentElement('beforeend', this.createFormElement());

    return wrapper;
  }

  createFormElement() {
    let formElement;
    switch (this.type) {
      case FormType.Open:
        formElement = this.createFormElement_Open();
        break;
      case FormType.Dropdown:
        formElement = this.createFormElement_Dropdown();
        break;
      case FormType.Multi:
        formElement = this.createFormElement_Multi();
        break;
      default:
        formElement = document.createElement('div');
        formElement.className = 'form-element';
    }

    if (this.hasPreview) {
      formElement.insertAdjacentElement('beforeend', this.createFormElement_Preview());
    }
    return formElement;
  }

  createFormElement_Open() {
    const container = document.createElement('div');
    container.className = 'form-element';

    const editor = document.createElement('textarea');
    editor.id = `${this.id}`;
    editor.className = 'editor';
    var newValue = this.selectedValue.replace(/&quot;/g, '"');

    editor.value = newValue;

    container.insertAdjacentElement('beforeend', editor);

    return container;
  }

  createFormElement_Dropdown() {
    const container = document.createElement('div');
    container.className = 'form-element';

    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'form-element__dropdown-container';

    const dropdown = document.createElement('select');
    dropdown.id = `${this.id}`;

    this.values.forEach(value => {
      const option = document.createElement('option');
      option.id = value.code;
      option.value = value.code;
      option.innerHTML = value.label;

      if (value.code === this.selectedValue) {
        option.setAttribute('selected', 'selected');
      }

      dropdown.insertAdjacentElement('beforeend', option);
    });

    const customInput = document.createElement('div');
    customInput.style.display = 'none';
    customInput.id = `custom-text_${this.id}_menu`;
    customInput.className = 'custom-wording_menu';
    //customInput.innerHTML = `<input class="custom-text_input edit-input" type='text' id='custom-text_${this.id}'>`;

    const customTextfield = document.createElement('input');
    customTextfield.id = `custom-text_${this.id}`;
    customTextfield.setAttribute('type', 'text');
    customTextfield.setAttribute('autocomplete', 'off');
    customTextfield.setAttribute('class', 'custom-text_input edit-input');

    const customSubmit = document.createElement('button');
    customSubmit.className = 'custom-text_submit';
    customSubmit.classList.add('action-button');
    customSubmit.id = `custom-submit_${this.id}`;
    customSubmit.innerHTML = 'Save';
    customSubmit.onclick = function() {
      const newText = $(`#custom-text_${dropdown.id}`).val();
      if (newText.length > 1 && newText.length < 21) {
        $(`#custom-wording_${dropdown.id}`).val(newText);
        GlobalState.saveConfig();
      } else {
        new Notify(
          'Failure',
          'The wording option should be between 2 and 20 character in length',
          'error',
          {
            autoClose: true,
          }
        );
      }
    };
    customInput.insertAdjacentElement('beforeend', customTextfield);
    customInput.insertAdjacentElement('beforeend', customSubmit);

    dropdown.addEventListener('change', () => {
      var options = document.getElementById(this.id).options;
      var dropdownId = options[options.selectedIndex].id;
      if (dropdownId.substr(0, dropdownId.indexOf('_')) != 'custom-wording') {
        GlobalState.saveConfig();
        $(`#custom-text_${this.id}_menu`).slideUp('slow');
      } else {
        $(`#custom-text_${this.id}_menu`).slideDown('slow');
      }
    });
    container.insertAdjacentElement('beforeend', dropdownContainer);
    dropdownContainer.insertAdjacentElement('beforeend', dropdown);
    if (dropdown.id != 'Palette') {
      const customOption = document.createElement('option');
      customOption.id = `custom-wording_${this.id}`;
      customOption.value = `custom-wording_${this.id}`;
      customOption.innerHTML = 'Custom...';
      dropdown.insertAdjacentElement('beforeend', customOption);
      dropdownContainer.insertAdjacentElement('beforeend', customInput);

      //checking if there was custom input from the database
      var valArr = [];
      this.values.forEach(value => {
        valArr.push(value.code);
      });

      if (
        !dropdown.querySelector('[selected=selected]') &&
        !valArr.includes(this.selectedValue) &&
        (this.selectedValue || this.selectedValue === 0)
      ) {
        dropdown.options['custom-wording_' + dropdown.id].setAttribute('value', this.selectedValue);
        dropdown.options['custom-wording_' + dropdown.id].setAttribute('selected', 'selected');
        customTextfield.setAttribute('value', this.selectedValue);
        customInput.style.display = 'inherit';
      }
    }
    return container;
  }

  createFormElement_Multi() {
    const fieldset = document.createElement('fieldset');
    fieldset.id = `config-${this.id}`; // TODO: why 'config' in id?

    this.values.forEach(value => {
      const optionContainer = document.createElement('div');
      optionContainer.className = 'form-element__multi-option-container';

      const input = document.createElement('input');
      input.setAttribute('type', 'checkbox');
      input.id = value.code;
      input.setAttribute('name', value.code);
      input.value = value.code;
      if (this.selectedValue.includes(value.code)) {
        input.setAttribute('checked', 'checked');
      }
      input.addEventListener('change', () => GlobalState.saveConfig());

      const label = document.createElement('label');
      label.setAttribute('for', value.code);
      label.innerHTML = replaceCompanyName(value.label);

      optionContainer.insertAdjacentElement('beforeend', input);
      optionContainer.insertAdjacentElement('beforeend', label);
      fieldset.insertAdjacentElement('beforeend', optionContainer);

      if (this.id == 'Demos') {
        var HTMLList = '<p>Options:</p><ul>';

        for (const [key, arr] of Object.entries(backgroundMap[value.code].Answers)) {
          HTMLList += `<li>${arr[0]}</li>`;
        }
        HTMLList +=
          '</ul><br><div>Need to customize the demographic response options?</div><div class="help-link">Request Project Assistance</div>';

        const list = document.createElement('div');
        list.className = 'demo-checklist__options';
        list.style.display = 'none';
        list.id = value.code + '_optionList';
        list.innerHTML = HTMLList;

        optionContainer.append(list);
        optionContainer.id = value.code + 'option_container';

        label.className = 'demo-checklist_label';
      }
    });

    return fieldset;
  }

  createFormElement_Preview() {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'form-element__preview-container';
    previewContainer.id = `preview-${this.id}`;

    return previewContainer;
  }

  setValues(optionsObject) {
    this.values = [];
    if (!optionsObject) {
      return;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(optionsObject)) {
      this.values.push({
        code: key,
        label: value.Label,
      });
    }
  }
}
