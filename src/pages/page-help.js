import helptTile1Image from '../assets/images/help-tile-1.jpg';
import helptTile2Image from '../assets/images/help-tile-2.jpg';
import helptTile3Image from '../assets/images/help-tile-3.jpg';
import helptTile4Image from '../assets/images/help-tile-4.jpg';
/**
 * List of Tiles
 * @const {Array.<{ImageUrl: string, Subject: string, Text: string}>} Help
 */
const HELP = [
  {
    ImageUrl: helptTile1Image,
    Subject: 'Submit a Ticket',
    Text:
      'Something unexpected has happened in the Employee Listening Hub, and I would like to submit a support ticket.',
  },

  {
    ImageUrl: helptTile2Image,
    Subject: 'Schedule Training',
    Text:
      'I have questions about the Employee Listening Hub, and would like to schedule a training session.',
  },

  {
    ImageUrl: helptTile3Image,
    Subject: 'Request Project Assistance',
    Text: "I'd like McKinsey to review my project before I deploy it to the organization.",
  },

  {
    ImageUrl: helptTile4Image,
    Subject: 'Help Me Fix My Business',
    Text:
      "My scores are not where they need to be, and I'd like McKinsey to help me resolve the underlying issues in my business.",
  },
];

/**
 * Create Help tile element.
 * @param {string} id - unique identifier which will be included in DOM element id
 * @param {{ImageUrl: string, Subject: string, Text: string}} options - an object with 3 properties: ImageUrl, Subject and Text
 * @param {any} onClick - a function that will be called whenever the tile is being clicked on
 * @returns {Element} - the new tile with specified image, title and text
 */
function createHelpTile(id, options, onClick) {
  const wrapper = document.createElement('div');
  wrapper.className = 'project-tile-wrapper';

  const tileElement = document.createElement('div');
  tileElement.className = 'project-tile tile-help';
  tileElement.id = `help-tile-${id}`;
  tileElement.addEventListener('click', onClick);

  const image = document.createElement('div');
  image.className = 'project-image tile__image';
  image.style.backgroundImage = `url(${options.ImageUrl})`;

  const title = document.createElement('div');
  title.className = 'project-display-name tile__title';
  title.innerText = options.Subject;

  const text = document.createElement('div');
  text.className = 'project-type tile__text';
  text.innerText = options.Text;

  const divider = document.createElement('div');
  divider.className = 'tile__divider';

  wrapper.insertAdjacentElement('beforeend', tileElement);
  tileElement.insertAdjacentElement('beforeend', image);
  tileElement.insertAdjacentElement('beforeend', title);
  tileElement.insertAdjacentElement('beforeend', divider);
  tileElement.insertAdjacentElement('beforeend', text);

  return wrapper;
}

/**
 * Render tiles specified in {@link HELP}
 * @function LoadHelp
 */
export default function loadHelpPage() {
  const records = HELP;
  const tilesContainer = document.createElement('div');
  tilesContainer.className = 'tiles-container';

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    const tile = createHelpTile(i.toString(), record, () => {
      console.log('Help tile on click placeholder');
      alert('To be implemented');
    });
    tilesContainer.insertAdjacentElement('beforeend', tile);
  }

  const container = $('#help-tiles');
  container.html('');
  container.append(tilesContainer);
  container.fadeIn();
}
