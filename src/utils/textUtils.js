export function replaceCompanyName(s) {
  const result = s.replace('$company$', $('#account-company-name').text());

  return result;
}

export function replacePreviewText(s, pattern, value) {
  const isDynamicTextTheFirstWord = s.indexOf(`[${pattern}]`) === 0;
  const result = s.replace(
    `[${pattern}]`,
    `<span class='dynamic-text ${
      isDynamicTextTheFirstWord ? 'dynamic-text--first-word' : ''
    }' data-controlled-by='${pattern}'>${
      isDynamicTextTheFirstWord ? capitalizeFirstWord(value) : value
    }</span>`
  );

  return result;
}

export function capitalizeFirstWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
