'use strict';

function $(el) {
  return document.querySelector(el) || document.getElementsByClassName(el.trim.substr(1))[0];
}

function checkWechat() {
  var ua = navigatior.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
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
  submit: function submit() {
    if (!getWechat()) {
      alert("请输入微信号");
      return;
    }
    jQuery.ajax({
      url: '/activity/coffee/',
      type: 'POST',
      data: { wechat: getWechat(), isWechat: checkWechat() },
      dataType: 'json',
      success: function success(data) {
        if (parseInt(data.errcode) !== 0) alert(data.errmsg);else Route(".page-two");
      },
      error: function error() {
        alert('网络错误');
      }
    });
    // Route(".page-two");
  },
  light: function light($el) {
    $el = $el.className === 'canvas-light' ? $('.light') : $el;

    $(".canvas-light").style.backgroundPosition = "-8.6rem 0";
    if ($el.innerText === '点击灯泡') {
      $el.innerText = "恭喜你获得C Cup特权";
      setTimeout(function () {
        Route('.page-three');
      }, 2000);
    } else if ($el.innerText === '恭喜你获得C Cup特权') {
      $el.innerText = "恭喜你获得C Cup特权";
      setTimeout(function () {
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
  switch (el.className) {
    case 'canvas-light':
      CCup.light(el);
      break;
  }
});

addEventListener('click', function (e) {
  e = e || window.event;
  var el = e.srcElement || e.target;
  switch (el.className) {
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
//# sourceMappingURL=data:application/json;base64,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LEtBQUssRUFBRSxVQUFGLElBQWdCLEVBQUUsTUFBRixDQUZlO0FBR3hDLFVBQU8sR0FBRyxTQUFIO0FBQ0wsU0FBSyxjQUFMO0FBQ0UsV0FBSyxLQUFMLENBQVcsRUFBWCxFQURGO0FBRUUsWUFGRjtBQURGLEdBSHdDO0NBQWIsQ0FBN0I7O0FBVUEsaUJBQWlCLE9BQWpCLEVBQTBCLFVBQVUsQ0FBVixFQUFhO0FBQ3JDLE1BQUksS0FBSyxPQUFPLEtBQVAsQ0FENEI7QUFFckMsTUFBSSxLQUFLLEVBQUUsVUFBRixJQUFnQixFQUFFLE1BQUYsQ0FGWTtBQUdyQyxVQUFPLEdBQUcsU0FBSDtBQUNMLFNBQUssUUFBTDtBQUNFLFdBQUssTUFBTCxHQURGO0FBRUUsWUFGRjtBQURGLFNBSU8sT0FBTDtBQUNFLFdBQUssS0FBTCxDQUFXLEVBQVgsRUFERjtBQUVFLFlBRkY7QUFKRixTQU9PLGNBQUw7QUFDRSxXQUFLLEtBQUwsQ0FBVyxFQUFYLEVBREY7QUFFRSxZQUZGO0FBUEYsR0FIcUM7Q0FBYixDQUExQiIsImZpbGUiOiJsaWdodC15b3VyLWxpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gJChlbCkge1xuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShlbC50cmltLnN1YnN0cigxKSlbMF07XG59XG5cbmZ1bmN0aW9uIGNoZWNrV2VjaGF0KCkge1xuICB2YXIgdWEgPSBuYXZpZ2F0aW9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuICBpZih1YS5tYXRjaCgvTWljcm9NZXNzZW5nZXIvaSk9PVwibWljcm9tZXNzZW5nZXJcIikge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRXZWNoYXQoKSB7XG4gIHJldHVybiAkKCcud2VjaGF0JykudmFsdWUudHJpbSgpO1xufVxuXG5mdW5jdGlvbiBSb3V0ZShwYWdlKSB7XG4gIHZhciBBTExfUEFHRVMgPSBbJy5wYWdlLW9uZScsICcucGFnZS10d28nLCAnLnBhZ2UtdGhyZWUnXTtcbiAgcGFnZSA9IHBhZ2UgfHwgJy5wYWdlLW9uZSc7XG4gIC8vIHJlc2V0IEFMTDtcbiAgQUxMX1BBR0VTLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgJChlbCkuY2xhc3NMaXN0LnJlbW92ZShcInBhZ2UtY3VycmVudFwiKTtcbiAgfSk7XG5cbiAgJChwYWdlKS5jbGFzc0xpc3QuYWRkKFwicGFnZS1jdXJyZW50XCIpO1xufVxuXG52YXIgQ0N1cCA9IHtcbiAgc3VibWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEgZ2V0V2VjaGF0KCkpIHtcbiAgICAgIGFsZXJ0KFwi6K+36L6T5YWl5b6u5L+h5Y+3XCIpO1xuICAgICAgcmV0dXJuIDtcbiAgICB9XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgdXJsOiAnL2FjdGl2aXR5L2NvZmZlZS8nLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgZGF0YTogeyB3ZWNoYXQ6IGdldFdlY2hhdCgpLCBpc1dlY2hhdDogY2hlY2tXZWNoYXQoKSB9LFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgaWYgKHBhcnNlSW50KGRhdGEuZXJyY29kZSkgIT09IDApXG4gICAgICAgICAgICAgYWxlcnQoZGF0YS5lcnJtc2cpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICBSb3V0ZShcIi5wYWdlLXR3b1wiKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBhbGVydCgn572R57uc6ZSZ6K+vJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gUm91dGUoXCIucGFnZS10d29cIik7XG4gIH0sXG4gIGxpZ2h0OiBmdW5jdGlvbiAoJGVsKSB7XG4gICAgJGVsID0gJGVsLmNsYXNzTmFtZSA9PT0gJ2NhbnZhcy1saWdodCcgPyAkKCcubGlnaHQnKSA6ICRlbDtcblxuICAgICQoXCIuY2FudmFzLWxpZ2h0XCIpLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiLTguNnJlbSAwXCI7XG4gICAgaWYgKCRlbC5pbm5lclRleHQgPT09ICfngrnlh7vnga/ms6EnKSB7XG4gICAgICAkZWwuaW5uZXJUZXh0ID0gXCLmga3llpzkvaDojrflvpdDIEN1cOeJueadg1wiO1xuICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgICBSb3V0ZSgnLnBhZ2UtdGhyZWUnKTtcbiAgICAgIH0sIDIwMDApO1xuICAgIH1cbiAgICBlbHNlIGlmICgkZWwuaW5uZXJUZXh0ID09PSAn5oGt5Zac5L2g6I635b6XQyBDdXDnibnmnYMnKSB7XG4gICAgICAkZWwuaW5uZXJUZXh0ID0gXCLmga3llpzkvaDojrflvpdDIEN1cOeJueadg1wiO1xuICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgICBSb3V0ZSgnLnBhZ2UtdGhyZWUnKTtcbiAgICAgIH0sIDIwMDApO1xuICAgIH1cbiAgfVxufTtcblxuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgJCgnLndlY2hhdCcpLmZvY3VzKCk7XG4gIGFsZXJ0KGpxdWVyeSk7XG59KTtcblxuLy8gaW9zXG5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uIChlKSB7XG4gIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgdmFyIGVsID0gZS5zcmNFbGVtZW50IHx8IGUudGFyZ2V0O1xuICBzd2l0Y2goZWwuY2xhc3NOYW1lKSB7XG4gICAgY2FzZSAnY2FudmFzLWxpZ2h0JzpcbiAgICAgIENDdXAubGlnaHQoZWwpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgdmFyIGVsID0gZS5zcmNFbGVtZW50IHx8IGUudGFyZ2V0O1xuICBzd2l0Y2goZWwuY2xhc3NOYW1lKSB7XG4gICAgY2FzZSAnc3VibWl0JzpcbiAgICAgIENDdXAuc3VibWl0KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdsaWdodCc6XG4gICAgICBDQ3VwLmxpZ2h0KGVsKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NhbnZhcy1saWdodCc6XG4gICAgICBDQ3VwLmxpZ2h0KGVsKTtcbiAgICAgIGJyZWFrO1xuICB9XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
