import Notify from '../external/scripts/notify';

export const URL = {
  Api: 'https://survey.us.confirmit.com/wix/p402032693067.aspx', //p551294294042 - test API, p402032693067 - real API
};

export function api(fn, parameters, functionSuccess, functionError) {
  const formData = {
    fn,
    params: JSON.stringify(parameters),
  };

  $.ajax({
    url: URL.Api,
    type: 'POST',
    data: formData,

    xhrFields: {withCredentials: true},
    // eslint-disable-next-line no-unused-vars
    success(data, textStatus, jqXHR) {
      const o = JSON.parse(data);

      if (o.Status === 'OK') functionSuccess(o);
      else functionError(o); // error handled in API
    },
    error(jqXHR, textStatus, errorThrown) {
      new Notify('Error', errorThrown, 'error', {autoClose: true});
    },
  });
}

export function apiError(o) {
  new Notify('Error', o.Description, 'error', {autoClose: true});
}
