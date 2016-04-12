function $ (el) {
  return document.querySelector(el);
}

function BTree(el) {
  this._isRunning = false;
  this._root = document.querySelector(el);
  this._index = 0;
  this._steps = [];
  this._it = undefined;
}

BTree.prototype = {
  constructor: BTree,

  traverse: function (process, method) {
    method = method || 'preOrder';

    function preOrder(node) {
      if (node === null) return ;

      process.call(this, node);

      if (node.firstElementChild)
        preOrder(node.firstElementChild);

      if (node.lastElementChild)
        preOrder(node.lastElementChild);
    }

    function inOrder(node) {
      if (node === null) return ;

      if (node.firstElementChild)
        inOrder(node.firstElementChild);

      process.call(this, node);

      if (node.lastElementChild)
        inOrder(node.lastElementChild);
    }

    function postOrder(node) {
      if (node === null) return ;

      if (node.firstElementChild)
        postOrder(node.firstElementChild);

      if (node.lastElementChild)
        postOrder(node.lastElementChild);

      process.call(this, node);
    }

    switch(method) {
      case 'preOrder':
        preOrder(this._root);
        break;
      case 'inOrder':
        inOrder(this._root);
        break;
      case 'postOrder':
        postOrder(this._root);
        break;
    }
  },

  clear: function () {
    this.traverse(function (node) {
      node.style.backgroundColor = "#FFF";
    });
  },

  toArray: function (method) {
    var _ = [];
    this.traverse(function (node) {
      _.push(node);
    }, method);
    return _;
  },

  init: function (method) {
    this._steps = this.toArray(method);
  },

  run: function (method, speed, callback) {
    if (this._isRunning) return ;

    this._isRunning = true;

    var self = this;
    this._it = setInterval(cycle(), speed || 1000);

    // 闭包
    // cycle 函数只被执行一次
    function cycle() {
      var index = 0;
      var _ = self.toArray(method);
      // var _ = self._steps;

      return function () {
        if (index === _.length) {
          clearInterval(self._it);
          self._it = undefined;
          self._isRunning = false;
          callback();
        }

        if (index !== 0)
          _[index-1].style.backgroundColor = '#FFF';

        if (index != _.length)
        _[index].style.backgroundColor = '#000';

        index += 1;
      };
    }
  },

  stop: function () {
    this.clear();
    this._index = 0; // reset index

    if (this._it) {
      this._isRunning = false;
      clearInterval(this._it);
      this._it = undefined;
    }
  },

  next: function (method, callback) {
    this._steps = this.toArray(method);
    if (this._index !== 0)
      this._steps[this._index-1].style.backgroundColor = "#FFF";

    if (this._index !== this._steps.length) {
      this._steps[this._index++].style.backgroundColor = "#000";
    } else {
      this._index = 0; // reset index
      callback();
    }
  }
};


function reset() {
  if ($(".btn.stop")) {
    $(".btn.stop").innerText = '运行';
    $(".btn.stop").className = 'btn run';
    $(".btn.debug").innerText = '单步调试';
  }
}

function getMethod() {
  var _options = $('#method').children;
  return Array.prototype.filter.call(_options, function (e) {
    if (e.selected) return e.value;
  })[0].value;
}

function Tree() {
    var oo = new BTree(".container");

    return {
      run: function (el) {
        $(".btn.debug").disabled = "disabled";
        el.innerText = "停止";
        el.className = "btn stop";
        oo.run(getMethod(), 1000, function () {
          $(".btn.debug").disabled = "";
          el.innerText = "运行";
        });
      },
      stop: function (el) {
        $(".btn.debug").disabled = "";
        el.innerText = "运行";
        el.className = "btn run";
        $(".btn.debug").innerText = "单步调试";
        oo.stop();
      },
      debug: function (el) {
        if ($(".btn.run")) {
          el.innerText = '下一步';
          $(".btn.run").innerText = "停止";
          $(".btn.run").className = "btn stop";
        }
        oo.next(getMethod(), function () {
          el.innerText = '单步调试';
        });
      }
    };
}

var treeObj = Tree();

addEventListener("click", function (e) {
  e = e || window.event;
  var el = e.srcElement || e.target;

  switch(el.className) {
    case 'btn run':
      treeObj.run(el);
      break;
    case 'btn stop':
      treeObj.stop(el);
      break;
    case 'btn debug':
      treeObj.debug(el);
      break;
    case 'methods':
      treeObj.stop($(".btn.stop") || $(".btn.run"));
      // reset();
      break;
  }
});
