import {PRODUCTS} from '../config/products-config';
import {objectOfObjectsToArrayOfObjects} from '../utils/commonUtils';
import GlobalState from '../GlobalState';
import {loadActiveProjectData, redirectToProjectHome} from './page-project-home';
import loadProjectsPage from './page-projects';

export default function loadProductsPage() {
  objectOfObjectsToArrayOfObjects(PRODUCTS).forEach(product => {
    if (product.Active) {
      const productCard = createProductCard(product);
      document.getElementById('product-list').appendChild(productCard);
    }
  });

  // Handle close button for demo preview
  $('#close-demos-button').on('click', () => {
    $('#demo').html('');
    $('#close-demos-button').hide();
    $('#demo-container').fadeOut();
  });
  $('#demo-container').on('click', () => {
    $('#demo').html('');
    $('#demo-container').fadeOut();
    $('#close-demos-button').hide();
  });
}

function createProductCard(product) {
  const productCard = document.createElement('div');
  productCard.className = 'product-card';

  // Product card header
  const addprojectButton = createAddProjectButton(product);

  const productName = document.createElement('h4');
  productName.className = 'product-card__name';
  productName.innerHTML = product.Name;

  const productTagLine = document.createElement('h6');
  productTagLine.className = 'product-card__tagline';
  productTagLine.innerHTML = product.TagLine;

  productCard.appendChild(addprojectButton);
  productCard.appendChild(productName);
  productCard.appendChild(productTagLine);

  // Metrics / Numbers
  const numbersContainer = document.createElement('div');
  numbersContainer.className = 'number-tiles-container';

  product.Numbers.forEach(numberData => {
    numbersContainer.appendChild(createNumberTile(numberData));
  });
  productCard.appendChild(numbersContainer);

  // Details
  productCard.appendChild(createProductDetails(product));

  return productCard;
}

function createAddProjectButton(product) {
  const addprojectButton = document.createElement('button');
  addprojectButton.className = 'action-button round-button add-project-button';
  addprojectButton.id = `add-project-button-${product.Id}`;
  addprojectButton.type = 'button';
  addprojectButton.innerHTML = '+';

  addprojectButton.addEventListener('click', () => {
    GlobalState.addProject(product.Id, projectData => {
      GlobalState.activateProject(projectData.ProjectId, () => {
        loadActiveProjectData();
        loadProjectsPage();
        redirectToProjectHome();
      });
    });
  });

  return addprojectButton;
}

function createNumberTile(numberData) {
  const numberTile = document.createElement('div');
  numberTile.className = 'number-tile';
  numberTile.innerHTML = `<h3 class='number-tile__number'>${numberData.Metric}</h3>
                             <h6 class='number-tile__label'>${numberData.Label}</h6>
                             <span class='number-tile__sub'>${numberData.Sub ?? ''}</span>`;

  return numberTile;
}

function createProductDetails(product) {
  const productDetailsWrapper = document.createElement('div');
  productDetailsWrapper.className = 'product-details-wrapper';

  const expandCollapseDetailsButton = document.createElement('button');
  expandCollapseDetailsButton.className = 'expand-collapse-details-button';
  expandCollapseDetailsButton.id = `expand-collapse-details-button-${product.Id}`;
  expandCollapseDetailsButton.type = 'button';
  expandCollapseDetailsButton.innerHTML = 'Show Details';

  productDetailsWrapper.appendChild(expandCollapseDetailsButton);

  const expandCollapseBlock = document.createElement('div');
  expandCollapseBlock.className = 'expand-collapse-block hidden';
  expandCollapseBlock.id = `expand-collapse-block-${product.Id}`;

  productDetailsWrapper.appendChild(expandCollapseBlock);

  expandCollapseDetailsButton.addEventListener('click', () =>
    expandCollapseProductDetails(product.Id)
  );

  const container = document.createElement('div');
  container.className = 'product-details-container';

  if (product.Demos) {
    const demosHeader = document.createElement('h5');
    demosHeader.className = 'product-details__header';
    demosHeader.innerHTML = 'Demos';

    const demoButtonsContainer = document.createElement('div');
    demoButtonsContainer.className = 'demo-buttons-container';

    product.Demos.forEach((demo, index) => {
      const demoButton = createDemoButton(demo, index, product.Id);
      demoButtonsContainer.appendChild(demoButton);
    });
    container.appendChild(demosHeader);
    container.appendChild(demoButtonsContainer);
  }

  const descriptionHeader = document.createElement('h5');
  descriptionHeader.className = 'product-details__header';
  descriptionHeader.innerHTML = 'Description';

  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'product-details__description-container';
  descriptionContainer.id = `more_${product.Id}`;

  const leftBlock = document.createElement('div');
  leftBlock.className = 'product-details__description-left-block';
  leftBlock.innerHTML = `<img class='product-details__description-thumbnail' src='${product.Icons.Thumbnail}'>`;

  const rightBlock = document.createElement('div');
  rightBlock.className = 'product-details__description-right-block';
  rightBlock.innerHTML = `<div class='product-details__description-text'>${product.Description}</div>`;

  descriptionContainer.appendChild(leftBlock);
  descriptionContainer.appendChild(rightBlock);

  container.appendChild(descriptionHeader);
  container.appendChild(descriptionContainer);

  expandCollapseBlock.appendChild(container);

  return productDetailsWrapper;
}

function createDemoButton(demo, index, productId) {
  const demoButton = document.createElement('button');
  demoButton.className = 'action-button demo-button';
  demoButton.id = `demo-button-${productId}-${index}`;
  demoButton.innerHTML = demo.Label;
  demoButton.onclick = e => {
    e.preventDefault();
    const iframe = `<iframe class='demo-preview-iframe' src='${demo.Url}'></iframe>`;
    $('#demo').html(iframe);
    $('#demo-container').fadeIn();
    $('#close-demos-button').show();
  };

  return demoButton;
}

function expandCollapseProductDetails(productId) {
  const expandCollapseBlock = $(`#expand-collapse-block-${productId}`);
  if (expandCollapseBlock.hasClass('hidden')) {
    document.getElementById(`expand-collapse-details-button-${productId}`).innerHTML =
      'Hide Details';
    expandCollapseBlock.slideDown();
  } else {
    document.getElementById(`expand-collapse-details-button-${productId}`).innerHTML =
      'Show Details';
    expandCollapseBlock.slideUp();
  }
  expandCollapseBlock.toggleClass('hidden');
}
