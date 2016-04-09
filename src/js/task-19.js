var sn;

;(function () {
  "use strict";

  var queue = [];
  var snapshots = []; // 快照，保存所有交换的两个数据(事实上已经排好序，只是为了演示)
  var it;
  var DEBUG = false;

  var randomDigit = function (min, max) {
    return parseInt(Math.random() * (max - min) + min);
  };

  var generateRandomArray = function (min, max, size) {
    if (it) clearInterval(it);
    size = size || 1;
    queue = []; // reset
    for (var i=0; i<size; ++i) queue.push(randomDigit(min, max));
    // snapshots = [queue];
    // render();
  };

  var testData = function () {
    generateRandomArray(1, 100, 40);
    snapshots.push(queue);
  };

  // 更新数据
  var update = function (className) {
    if (! className) return;
    var value;

    switch(className) {
      case 'left-in':
        value = document.getElementById('user-input').value.trim();
        if (! value) return ;
        queue.unshift(value);
        snapshots = [queue];
        render();
        break;

      case 'right-in':
        value = document.getElementById('user-input').value.trim();
        if (! value) return ;
        queue.push(value);
        snapshots = [queue];
        render();
        break;

      case 'left-out':
        if (queue.length === 0) {alert("已经没有值可以出了！"); return ;}
        queue.shift();
        render();
        break;

      case 'right-out':
        if (queue.length === 0) {alert("已经没有值可以出了！"); return ;}
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
  var render = function () {
    // document.getElementById("show-area").innerHTML = queue.map(function (value) {
    //   return `<span class="queue-col queue-col-${value}"></span>`;
    // }).join("");
    var _ = snapshots.shift() || [];
    // console.log(_);
    if (_.length === 0) {clearInterval(it); return ;}
    document.getElementById("show-area").innerHTML = _.map(function (value) {
      return `<span class="queue-col queue-col-${value}" title="${value}"></span>`;
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

  // 排序算法
  var sort = function (arrayData, callback) {
    callback = callback || function (a, b) {
      return a - b;
    };

    var swap = function (array, i, j) {
      var t = array[i];
      array[i] = array[j];
      array[j] = t;
    };

    for (var i=0; i<arrayData.length-1; ++i) {
      for (var j=0; j<arrayData.length-i-1; ++j) {
        if (callback(arrayData[j], arrayData[j+1]) > 0) {
          swap(arrayData, j, j+1);
        }
        // // 渲染
        snapshots.push(arrayData.slice());
        // setTimeout(render, 100);
        // @TODO render all
      }


      // sn = snapshots;
      // console.log(snapshots);
    }
  };

  var debug = function () {
    if (it) {
      clearInterval(it);
    } else if (! DEBUG) {
      DEBUG = true;
      sort(queue);
    }

    render();
  };

  function init () {
    testData();
    render();
    delegate();
  }

  init();
})();
