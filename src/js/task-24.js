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

  // 根据选择的遍历方法遍历
  traverse: function (process, method, beginNode) {
    method = method || 'preOrder';
    beginNode = beginNode || this._root;

    // 前序遍历
    function preOrder(node) {
      if (node === null) return ;

      process.call(this, node);

      // 这是二叉树与多叉树的区别: 多个子节点
      Array.prototype.forEach.call(node.children, function (e) {
        preOrder(e);
      });
    }

    function inOrder(node) {
      if (node === null) return ;

      // 这是二叉树与多叉树的区别: 多个子节点
      Array.prototype.forEach.call(node.children, function (e) {
        postOrder(e);
      });

      process.call(this, node);
    }

    // 后序遍历
    function postOrder(node) {
      if (node === null) return ;

      // 这是二叉树与多叉树的区别: 多个子节点
      Array.prototype.forEach.call(node.children, function (e) {
        postOrder(e);
      });

      process.call(this, node);
    }

    switch(method) {
      case 'preOrder':
        // preOrder(this._root);
        preOrder(beginNode);
        break;
      case 'inOrder':
        // inOrder(this._root);
        inOrder(beginNode);
        break;
      case 'postOrder':
        // postOrder(this._root);
        postOrder(beginNode);
        break;
    }
  },

  add: function (addedNode, startNode) {
    this.clear(); // reset all style

    startNode = startNode || this._root; // startNode will not be null

    startNode.appendChild(addedNode);
  },

  contains: function (node, startNode) {
    startNode = startNode || this._root;
    var found = false;

    this.traverse(function (enode) {
      if (enode === node) {
        found = true;
      }
    });

    return found;
  },

  clear: function () {
    this.traverse(function (node) {
      node.style.backgroundColor = "#FFF";
    });
  },

  remove: function (startNode) {
    // 只能用后序遍历删除节点
    this.traverse(function (node) {
      node.parentNode.removeChild(node); // parentNode and parentElement
    }, 'postOrder', startNode);
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
  },

  search: function (method, callback) {
    this.traverse(callback, method);
  },
};

// 实际操作
function Tree() {
    var oo = new BTree(".container");
    var targetNode;

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

    function getSearchText() {
      return $("#search-text").value.trim();
    }

    function getNewNodeText() {
      return $("#add-text").value.trim();
    }

    function setState() {
      var delBtn = $(".btn.delete");
      var addNodeInput = $("#add-text");
      var addBtn = $(".btn.add");

      this.enable = function () {
        delBtn.disabled = "";
        addNodeInput.disabled = "";
        addBtn.disabled = "";
      };

      this.disable = function () {
        delBtn.disabled = "disabled";
        addNodeInput.disabled = "disabled";
        addBtn.disabled = "disabled";
      };

      return this;
    }

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
      },
      search: function () {
        var searchText = getSearchText();
        if (! searchText) return ;

        var found = false;
        oo.clear();

        oo.search(getMethod(), function (node) {
          if (node.childNodes[0].textContent.trim() === searchText) {
            node.style.backgroundColor = 'rgb(241, 100, 100)';
            found = true;
            // node.style.border = "none";
            // node.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, 0.50)";
            // node.style.color = "#FFF";
          }
        });

        if (! found) alert(`表中不存在: ${searchText}`);
      },
      // 选择节点: 只有选择父节点中的节点才能删除和添加
      target: function (el) {

        if (oo.contains(el)) {
          oo.clear();
          targetNode = el;
          el.style.backgroundColor = '#F00';
          new setState().enable();
        } else if (el.id != 'add-text'){
          new setState().disable();
          oo.clear();
        }
      },
      delete: function () {
        if (targetNode) {
          oo.remove(targetNode); // // 禁用删除和增加按钮
          new setState().disable();
        }

      },
      add: function () {
        if (targetNode) {
          new setState().disable(); // 禁用删除和增加按钮
          var _newNode = document.createElement('div');
          _newNode.className = "node new";
          _newNode.innerText = getNewNodeText();
          _newNode.style.backgroundColor = "#0F0";
          oo.add(_newNode, targetNode);
        }
      },
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
    case 'btn search':
      treeObj.search();
      break;
    case 'btn delete':
      treeObj.delete();
      break;
    case 'btn add':
      treeObj.add();
      break;
    default:
      treeObj.target(el);
      break;
  }
});
