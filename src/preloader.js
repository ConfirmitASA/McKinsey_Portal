function loadApp() {
  return import('./index')
    .then(() => {
      window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('preloaded');
        setTimeout(() => {
          preloader.remove();
        }, 2000);
      });
    })
    .catch(() => 'An error occurred while loading the component');
}

loadApp();
