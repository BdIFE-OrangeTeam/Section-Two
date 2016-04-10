;(function () {
  "use strict";

  var data = [10, 3, 7, 12, 11, 30];
  var re = /[\n|,|，|、| | |\t]/;

  var search = function (reExp) {
    var dataIndex = data.filter(function (value) {
      return reExp.test(value);
    });

    document.getElementById("show-area").innerHTML = data.map(function (v1) {
      if (dataIndex.includes(v1)) {
        return `<span style="color: #FFF;">${v1}</span>`;
      }
      return `<span>${v1}</span>`;
    }).join("");
  };

  // 更新数据
  var update = function (className) {
    if (! className) return;
    var value;

    switch(className) {
      case 'left-in':
        value = document.getElementById('user-input').value.trim();
        if (! value) return ;
        value.split(re).forEach(function (v) {data.unshift(v);});
        render();
        break;

      case 'right-in':
        value = document.getElementById('user-input').value.trim();
        if (! value) return ;
        Array.prototype.forEach.call(value.split(re), function (v) {data.push(v);});
        render();
        break;

      case 'left-out':
        if (data.length === 0) {alert("已经没有值可以出了！"); return ;}
        data.shift();
        render();
        break;

      case 'right-out':
        if (data.length === 0) {alert("已经没有值可以出了！"); return ;}
        data.pop();
        render();
        break;

      case 'search':
        var _ = document.getElementById("search-input").value.trim();
        if (! _ ) return ;
        search(new RegExp(_));
        // render();
        break;
    }
  };

  // 渲染数据
  var render = function () {
    document.getElementById("show-area").innerHTML = data.map(function (v1) {
      return `<span>${v1}</span>`;
    }).join("");
  };

  // 事件代理
  var delegate = function () {
    Array.prototype.forEach.call(document.getElementsByTagName("button"), function (item) {
      item.onclick = function (e) {
          e = e || window.event;
          var el = e.srcElement || e.target;
          update(el.className);
          // render();
      };
    });
  };

  function init () {
    render();
    delegate();
  }

  init();
})();
