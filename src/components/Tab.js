import SettingsBlock from './SettingsBlock';

export default class Tab {
  /**
   *
   */
  constructor(id) {
    this.id = id;
  }

  getContentElementId() {
    return `tab-${this.id}-contents`;
  }

  createTabButton(label, subheader, icon) {
    const tabHtml = `
			<table>
				<tr>
					<td>
						<i class="${icon} icon" style="margin: 8px 12px 0 0;">
						</i>
					</td>
					<td style="position:relative; top: -6px">
						<h6 style="font-size: 1vmax; font-weight: 400; color: inherit;">${label}</h6>
						<div style="font-size: 1.5vmin; font-weight: 400; color: inherit;">${subheader}</div>
					</td>
				</tr>
			</table>
			`;

    const tabElement = document.createElement('div');
    tabElement.className = 'tile tab';
    tabElement.id = this.id;
    tabElement.innerHTML = tabHtml;

    const self = this;
    tabElement.addEventListener('click', () => {
      self.activateTab();
    });

    return tabElement;
  }

  createTabContent(description, settingsBlocks, bottomElement) {
    const tabContentContainer = document.createElement('div');
    tabContentContainer.className = 'tab-contents';
    tabContentContainer.id = this.getContentElementId();

    if (description) {
      tabContentContainer.innerHTML = `<div class="tab-content__description">${description}</div>`;
    }

    for (const [key, value] of Object.entries(settingsBlocks)) {
      const settingsBlock = new SettingsBlock(key, value).createSettingsBlock();
      tabContentContainer.insertAdjacentElement('beforeend', settingsBlock);
    }

    if (bottomElement) {
      tabContentContainer.insertAdjacentHTML('beforeend', bottomElement);
    }

    return tabContentContainer;
  }

  activateTab() {
    $('.tab').removeClass('active-tab');
    $(`#${this.id}`).addClass('active-tab');

    const tabContents = $('.tab-contents');
    tabContents.removeClass('active-tab-contents'); // hide all tab contents
    tabContents.css('display', 'none');

    const contentId = this.getContentElementId();

    $(`#${contentId}`).addClass('active-tab-contents'); // this will unhide the active tab contents

    $('.active-tab-contents').fadeIn();
  }
}
