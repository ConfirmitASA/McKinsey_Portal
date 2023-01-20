export function objectOfObjectsToArrayOfObjects(objOfObjs) {
  const result = [];

  if (Object.keys(objOfObjs).length === 0) return result;

  Object.keys(objOfObjs).forEach(key => {
    const obj = objOfObjs[key];
    obj.Id = key;
    result.push(obj);
  });

  return result;
}

export function simulateClick(x) {
  const item = $(x);
  item.trigger('mouseover');
  item.trigger('click');
}

export function showPrivateMenu() {
  $('.cavani_tm_mobile_menu .private-menu-bullet').css('display', 'block');
  $('.menu .private-menu-bullet').css('display', 'unset');
  $('.hide-after-login-bullet').css('display', 'none');
}

export function showAdminMenu(user) {
  if (user.Roles && user.Roles.indexOf('admin') != -1) {
    $('.menu .admin-menu-bullet').css('display', 'unset');
  } else {
    $('.admin-menu-bullet').addClass('hidden');
  }
}

export function hidePrivateMenu() {
  $('.private-menu-bullet, .hide-after-login-bullet').removeAttr('style');

  //$('.private-menu-bullet').css('display', 'none');
  //$('').css('display', 'unset');
}

export function sacleUpPage() {
  const r = $('#ripple');
  r.css('background-image', `url(${r.attr('data-img-url')})`);

  $('.author_image').velocity({width: '10%'}, {duration: 500, delay: 0});
  $('canvas').css('display', 'none');
  $('.main_content').velocity({width: '90%'}, {duration: 500, delay: 0});
}

export function scaleDownPage() {
  $('canvas').css('display', 'unset');
  $('.author_image').velocity({width: '40%'}, {duration: 500, delay: 0});
  $('.main_content').velocity({width: '60%'}, {duration: 500, delay: 0});
}
