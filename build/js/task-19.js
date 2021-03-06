"use strict";

var sn;

;(function () {
  "use strict";

  var queue = [];
  var snapshots = []; // 快照，保存所有交换的两个数据(事实上已经排好序，只是为了演示)
  var it;
  var DEBUG = false;

  var randomDigit = function randomDigit(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  };

  var generateRandomArray = function generateRandomArray(min, max, size) {
    if (it) clearInterval(it);
    size = size || 1;
    queue = []; // reset
    for (var i = 0; i < size; ++i) {
      queue.push(randomDigit(min, max));
    } // reset debug mode
    DEBUG = false;
  };

  var testData = function testData() {
    generateRandomArray(1, 100, 40);
    snapshots.push(queue);
  };

  // 获取输入数据
  var getInput = function getInput() {
    var _ = document.getElementById('user-input').value.trim();

    // 正则验证是否是 10 - 100 之间的数字 (两位数即可)
    if (!/^\d{2}$/.test(_)) {
      alert("非法数据");
      return null;
    }

    return _;
  };

  // 更新数据
  var update = function update(className) {
    if (!className) return;
    var value;

    switch (className) {
      case 'left-in':
        value = getInput();
        if (!value) return;
        queue.unshift(value);
        snapshots = [queue];
        render();
        break;

      case 'right-in':
        value = getInput();
        if (!value) return;
        queue.push(value);
        snapshots = [queue];
        render();
        break;

      case 'left-out':
        if (queue.length === 0) {
          alert("已经没有值可以出了！");return;
        }
        queue.shift();
        snapshots = [queue];
        render();
        break;

      case 'right-out':
        if (queue.length === 0) {
          alert("已经没有值可以出了！");return;
        }
        queue.pop();
        snapshots = [queue];
        render();
        break;

      case 'generate-random':
        generateRandomArray(1, 100, 40);
        snapshots = [queue];
        render();
        break;

      case 'sort':
        sort(queue);
        it = setInterval(render, 10);
        break;

      case 'debug':
        debug();
        break;
    }
  };

  // 渲染数据
  var render = function render() {
    var _ = snapshots.shift() || [];
    // console.log(_);
    if (_.length === 0) {
      clearInterval(it);return;
    }
    document.getElementById("show-area").innerHTML = _.map(function (value) {
      return "<span class=\"queue-col queue-col-" + value + "\" title=\"" + value + "\"></span>";
    }).join("");
  };

  // 事件代理
  var delegate = function delegate() {
    Array.prototype.forEach.call(document.getElementsByTagName("button"), function (item) {
      item.onclick = function (e) {
        e = e || window.event;
        var el = e.srcElement || e.target;
        update(el.className);
        // render();
      };
    });
  };

  // 排序算法
  var sort = function sort(arrayData, callback) {
    callback = callback || function (a, b) {
      return a - b;
    };

    var swap = function swap(array, i, j) {
      var t = array[i];
      array[i] = array[j];
      array[j] = t;
    };

    for (var i = 0; i < arrayData.length - 1; ++i) {
      for (var j = 0; j < arrayData.length - i - 1; ++j) {
        if (callback(arrayData[j], arrayData[j + 1]) > 0) {
          swap(arrayData, j, j + 1);
        }
        // @TODO render all
        snapshots.push(arrayData.slice());
      }
    }
  };

  var debug = function debug() {
    if (it) {
      clearInterval(it);
    } else if (!DEBUG) {
      DEBUG = true;
      sort(queue);
    }

    if (snapshots.length === 0) {
      alert("调试结束");
      return;
    }

    var el = event.target || event.srcElement;
    // el.innerText = "下一步";

    render();
  };

  function init() {
    testData();
    render();
    delegate();
  }

  init();
})();