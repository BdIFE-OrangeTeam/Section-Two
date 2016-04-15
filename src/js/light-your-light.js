function $(el) {
  return document.querySelector(el) || document.getElementsByClassName(el.trim.substr(1))[0];
}

function checkWechat() {
  var ua = navigatior.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
    return true;
  } else {
    return false;
  }
}

function getWechat() {
  return $('.wechat').value.trim();
}

function Route(page) {
  var ALL_PAGES = ['.page-one', '.page-two', '.page-three'];
  page = page || '.page-one';
  // reset ALL;
  ALL_PAGES.forEach(function (el) {
    $(el).classList.remove("page-current");
  });

  $(page).classList.add("page-current");
}

var CCup = {
  submit: function () {
    if (! getWechat()) {
      alert("请输入微信号");
      return ;
    }
    jQuery.ajax({
      url: '/activity/coffee/',
      type: 'POST',
      data: { wechat: getWechat(), isWechat: checkWechat() },
      dataType: 'json',
      success: function (data) {
          if (parseInt(data.errcode) !== 0)
             alert(data.errmsg);
          else
             Route(".page-two");
      },
      error: function () {
        alert('网络错误');
      }
    });
    // Route(".page-two");
  },
  light: function ($el) {
    $el = $el.className === 'canvas-light' ? $('.light') : $el;

    $(".canvas-light").style.backgroundPosition = "-8.6rem 0";
    if ($el.innerText === '点击灯泡') {
      $el.innerText = "恭喜你获得C Cup特权";
      setTimeout( function () {
        Route('.page-three');
      }, 2000);
    }
    else if ($el.innerText === '恭喜你获得C Cup特权') {
      $el.innerText = "恭喜你获得C Cup特权";
      setTimeout( function () {
        Route('.page-three');
      }, 2000);
    }
  }
};

addEventListener('load', function () {
  $('.wechat').focus();
  alert(jquery);
});

// ios
addEventListener('touchend', function (e) {
  e = e || window.event;
  var el = e.srcElement || e.target;
  switch(el.className) {
    case 'canvas-light':
      CCup.light(el);
      break;
  }
});

addEventListener('click', function (e) {
  e = e || window.event;
  var el = e.srcElement || e.target;
  switch(el.className) {
    case 'submit':
      CCup.submit();
      break;
    case 'light':
      CCup.light(el);
      break;
    case 'canvas-light':
      CCup.light(el);
      break;
  }
});
