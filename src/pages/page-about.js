import mcKinseyMainImage from '../assets/images/the-top-technology-trends-of-2022_1296421142_thumb_1536x1536-v3.jpg';
import mcKinseyLogo from '../assets/images/mckinsey-logo.png';
import forstaMainImage from '../assets/images/forsta-main-image.jpeg';
import forstaLogo from '../assets/images/forsta-logo.png';

const Partners = {
  mck: {
    MainImgUrl: mcKinseyMainImage,
    LogoUrl: mcKinseyLogo,
  },

  forsta: {
    MainImgUrl: forstaMainImage,
    LogoUrl: forstaLogo,
  },
};

let currentPartnerData;

export default function loadAboutPage() {
  currentPartnerData = getCurrentPartnerData();
  setPartnerImages();
}

function getCurrentPartnerData() {
  const params = new URLSearchParams(window.location.search);
  let partnerId = params.get('partner');
  if (partnerId === '' || partnerId === null) partnerId = 'mck'; // default
  const partnerData = Partners[partnerId];

  return partnerData;
}

function setPartnerImages() {
  const ripple = $('#ripple');
  ripple.attr('data-img-url', currentPartnerData.MainImgUrl);
  ripple.css('background-image', `url(${currentPartnerData.MainImgUrl})`);

  $('.partner-logo').attr('src', currentPartnerData.LogoUrl);
}
