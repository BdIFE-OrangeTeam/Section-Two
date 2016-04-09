'use strict';

;(function () {
  "use strict";

  var data = [10, 3, 7, 12, 11, 30];

  // 更新数据
  var update = function update(className) {
    if (!className) return;

    switch (className) {
      case 'left-in':
        var value = document.getElementById('user-input').value.trim();
        if (!value) return;
        data.unshift(value);
        break;

      case 'right-in':
        var value = document.getElementById('user-input').value.trim();
        if (!value) return;
        data.push(value);
        break;

      case 'left-out':
        if (data.length === 0) {
          alert("已经没有值可以出了！");return;
        }
        data.shift();
        break;

      case 'right-out':
        if (data.length === 0) {
          alert("已经没有值可以出了！");return;
        }
        data.pop();
        break;
    }
  };

  // 渲染数据
  var render = function render() {
    document.getElementById("show-area").innerHTML = data.map(function (v1) {
      return '<span>' + v1 + '</span>';
    }).join("");
  };

  // 事件代理
  var delegate = function delegate() {
    Array.prototype.forEach.call(document.getElementsByTagName("button"), function (item) {
      item.onclick = function (e) {
        e = e || window.event;
        var el = e.srcElement || e.target;
        update(el.className);
        render();
      };
    });
  };

  function init() {
    render();
    delegate();
  }

  init();
})();