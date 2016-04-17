'use strict';

function $(el) {
  return document.querySelector(el);
}

function TreeComponent(container) {
  this._root = $(container);
  this._backgroundColor = {
    untarget: '#FFF',
    target: '#2196F3'
  };
  /**
    * 文件夹对象
    *   name: 文件名 String
    *   open: 是否打开 Boolean
    *   children: 子目录 Array
    */
  this._directories = {
    name: 'root',
    open: true,
    children: [{
      name: '目录',
      open: true,
      children: [{
        name: '图片',
        open: false,
        children: [{
          name: 'JPG',
          open: false,
          children: []
        }, {
          name: 'PNG',
          open: false,
          children: []
        }, {
          name: 'GIF',
          open: false,
          children: []
        }]
      }, {
        name: 'PDF',
        open: true,
        children: [{
          name: 'JPG',
          open: false,
          children: []
        }, {
          name: 'PNG',
          open: false,
          children: []
        }]
      }, {
        name: 'DOC',
        open: false,
        children: []
      }, {
        name: 'TXT',
        open: false,
        children: []
      }]
    }]
  };
  this._targetNode = {
    before: null,
    current: null
  };
}

TreeComponent.prototype = {
  constructor: TreeComponent,

  traverse: function traverse(callback, beginNode, method) {
    beginNode = beginNode || this._root;
    method = method || 'preOrder';

    function preOrder(node) {
      if (node === null) return;

      callback.call(this, node);

      Array.prototype.forEach.call(node.children, function (e) {
        preOrder(e);
      });
    }

    function postOrder(node) {
      if (node === null) return;

      Array.prototype.forEach.call(node.children, function (e) {
        postOrder(node);
      });

      callback.call(this, node);
    }

    if (method === 'preOrder') {
      preOrder(beginNode);
    } else {
      postOrder(beginNode);
    }
  },

  init: function init() {
    this.render();
    this.listen();
  },

  /**
    * 绑定监听事件
    *   click, keyup等
    */
  listen: function listen() {
    // click event
    this._root.addEventListener('click', function (e) {
      e = e || window.event;
      var el = e.target || e.srcElement;

      // 点中title的扩展图标时，应该选择他们父节点的父节点
      // if (el.tagName.toLowerCase() === 'i')
      if (/fa-chevron/.test(el.className)) el = el.parentElement;

      // 点中title的增加或删除图标
      else if (/fa-/.test(el.className)) {
          switch (el.className.trim()) {
            case 'fa fa-plus':
              this.add(el.parentElement.parentElement);
              break;
            case 'fa fa-remove':
              this.remove(el.parentElement.parentElement);
              break;
            case 'fa fa-check':
              var dirName = el.parentElement.querySelector('.dir-name').value;
              if (dirName === null || !dirName.trim()) return;
              this.add(el.parentElement, dirName.trim());
              break;
          }
          return;
        }

        // 如果么有点中title时，就不扩展节点
        else if (!el.classList.contains('title')) {
            return;
          }

      // 被选中
      this.target(el);

      switch (el.parentElement.className) {
        case 'open':
          this.close(el);
          break;
        case 'close':
          this.open(el);
          break;
      }
    }.bind(this));

    // keyup event
    this._root.addEventListener('keyup', function (e) {
      e = e || window.event;
      var el = e.target || e.srcElement;
      switch (el.className) {
        case 'dir-name':
          if (e.keyCode !== 13) return;
          this.add(el.parentElement, el.value.trim());
          break;
      }
    }.bind(this));
  },

  /**
    * @TODO 更新文件夹节点this._directories
    */
  update: function update() {},

  /**
    * 将文件夹对象渲染成DOM节点
    *   this._directories
    */
  render: function render() {
    /**
      * @param
      *   parent parentNode, an object of a dir
      *   status dir open(true)/close(false)
      */
    function renderParent(parent, status) {

      // 只有根目录
      if (parent.children.length === 0) {
        return '<div class="' + (parent.open ? 'open' : 'close') + '">\n                  <div class="title clearfix">\n                    <i class="fa fa-chevron-circle-' + (parent.open ? 'down' : 'right') + '"></i>' + parent.name + '\n                    <i class="fa fa-remove" aria-hidden="true"></i>\n                    <i class="fa fa-plus" aria-hidden="true"></i>\n                  </div>\n                </div>';
      }

      // 有子目录, 不显示 root
      if (parent.name === 'root') return parent.children.map(function (e) {
        return renderParent(e, true);
      }).join('');

      return '<div class="' + (parent.open ? 'open' : 'close') + '">\n                <div class="title clearfix">\n                  <i class="fa fa-chevron-circle-' + (parent.open ? 'down' : 'right') + '"></i>' + parent.name + '\n                  <i class="fa fa-remove" aria-hidden="true"></i>\n                  <i class="fa fa-plus" aria-hidden="true"></i>\n                </div>\n               ' + parent.children.map(function (e) {
        return renderParent(e, parent.open);
      }).join('') + '\n              </div>';
    }

    this._root.innerHTML = renderParent(this._directories);
  },

  /**
    * @param:
    *   el  title node
    * @function:
    *   only open first children layer
    */
  open: function open(el) {
    Array.prototype.forEach.call(el.parentElement.children, function (e) {
      e.style.display = 'block';
    });

    el.firstElementChild.className = "fa fa-chevron-circle-down"; // i tag
    el.parentElement.className = 'open';
  },

  // open All directories
  openAll: function openAll(el) {
    this.traverse(function (e) {
      if (e.tagName.toLowerCase() === 'i') {
        e.className = "fa fa-chevron-circle-down";
        return;
      }

      e.className = 'open';
    }, el);
  },

  /**
    * @param:
    *   el title node
    */
  close: function close(el) {
    Array.prototype.forEach.call(el.parentElement.children, function (e) {
      e.style.display = 'none';
    });

    el.style.display = 'block';
    el.firstElementChild.className = "fa fa-chevron-circle-right"; // i tag
    el.parentElement.className = 'close';
  },

  // close All directories
  closeAll: function closeAll(el) {
    this.traverse(function (e) {
      if (e.tagName.toLowerCase() === 'i') {
        e.className = "fa fa-chevron-circle-right";
        return;
      }
      e.className = 'close';
    }, el);
  },

  // 节点被选中, 然后记录上一个节点与当前节点
  target: function target(node) {
    // 第一次使用
    if (this._targetNode.before === null) {
      this._targetNode.before = node;
      this._targetNode.current = node;
      node.style.backgroundColor = this._backgroundColor.target;
      return;
    }

    // 以后使用, 切换当前节点为之前节点，选中节点为当前节点, 然后区分(如颜色)
    this._targetNode.before = this._targetNode.current;
    this._targetNode.current = node;
    this._targetNode.before.style.backgroundColor = this._backgroundColor.untarget;
    this._targetNode.current.style.backgroundColor = this._backgroundColor.target;
  },

  /**
    * 添加文件夹
    *   parentNode 容纳新文件夹的父节点信息
    *   directoryName 文件名
    *     当directoryName为undefined时, parentNode为open节点
    *     当directoryName为非空时，parentNode为title节点
    */
  add: function add(parentNode, directoryName) {
    // 没有文件名, 说明是添加按钮
    if (!directoryName) {
      // 添加的时候当然要打开文件夹咯
      this.open(parentNode.querySelector('.title'));
      var _ = document.createElement('div');
      _.className = 'close';
      _.innerHTML = '\n          <div class="title clearfix">\n            <i class="fa fa-chevron-circle-right"></i>\n            <input class="dir-name" type="text" placeholder="请输入文件名"/>\n            <i class="fa fa-remove" aria-hidden="true"></i>\n            <i class="fa fa-check" aria-hidden="true"></i>\n          </div>';
      parentNode.appendChild(_);
    }
    // 有文件名，说明是输入
    else {
        parentNode.innerHTML = '\n            <i class="fa fa-chevron-circle-right"></i>' + directoryName + '\n            <i class="fa fa-remove" aria-hidden="true"></i>\n            <i class="fa fa-plus" aria-hidden="true"></i>';
      }
  },

  /**
    * 删除节点信息
    * @param
    *   node 为 文件夹节点, 即open/close 节点
    */
  remove: function remove(node) {
    // remove all
    node.parentElement.removeChild(node);
  }
};

new TreeComponent('.side-bar').init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhc2stMjUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTLENBQVQsQ0FBWSxFQUFaLEVBQWdCO0FBQ2QsU0FBTyxTQUFTLGFBQVQsQ0FBdUIsRUFBdkIsQ0FBUCxDQURjO0NBQWhCOztBQUlBLFNBQVMsYUFBVCxDQUF3QixTQUF4QixFQUFtQztBQUNqQyxPQUFLLEtBQUwsR0FBYSxFQUFFLFNBQUYsQ0FBYixDQURpQztBQUVqQyxPQUFLLGdCQUFMLEdBQXdCO0FBQ3RCLGNBQVUsTUFBVjtBQUNBLFlBQVEsU0FBUjtHQUZGOzs7Ozs7O0FBRmlDLE1BWWpDLENBQUssWUFBTCxHQUFvQjtBQUNsQixVQUFNLE1BQU47QUFDQSxVQUFNLElBQU47QUFDQSxjQUFVLENBQ1I7QUFDRSxZQUFNLElBQU47QUFDQSxZQUFNLElBQU47QUFDQSxnQkFBVSxDQUNSO0FBQ0UsY0FBTSxJQUFOO0FBQ0EsY0FBTSxLQUFOO0FBQ0Esa0JBQVUsQ0FDUjtBQUNFLGdCQUFNLEtBQU47QUFDQSxnQkFBTSxLQUFOO0FBQ0Esb0JBQVUsRUFBVjtTQUpNLEVBTVI7QUFDRSxnQkFBTSxLQUFOO0FBQ0EsZ0JBQU0sS0FBTjtBQUNBLG9CQUFVLEVBQVY7U0FUTSxFQVdSO0FBQ0UsZ0JBQU0sS0FBTjtBQUNBLGdCQUFNLEtBQU47QUFDQSxvQkFBVSxFQUFWO1NBZE0sQ0FBVjtPQUpNLEVBc0JSO0FBQ0UsY0FBTSxLQUFOO0FBQ0EsY0FBTSxJQUFOO0FBQ0Esa0JBQVUsQ0FDUjtBQUNFLGdCQUFNLEtBQU47QUFDQSxnQkFBTSxLQUFOO0FBQ0Esb0JBQVUsRUFBVjtTQUpNLEVBTVI7QUFDRSxnQkFBTSxLQUFOO0FBQ0EsZ0JBQU0sS0FBTjtBQUNBLG9CQUFVLEVBQVY7U0FUTSxDQUFWO09BekJNLEVBc0NSO0FBQ0UsY0FBTSxLQUFOO0FBQ0EsY0FBTSxLQUFOO0FBQ0Esa0JBQVUsRUFBVjtPQXpDTSxFQTJDUjtBQUNFLGNBQU0sS0FBTjtBQUNBLGNBQU0sS0FBTjtBQUNBLGtCQUFVLEVBQVY7T0E5Q00sQ0FBVjtLQUpNLENBQVY7R0FIRixDQVppQztBQXVFakMsT0FBSyxXQUFMLEdBQW1CO0FBQ2pCLFlBQVEsSUFBUjtBQUNBLGFBQVMsSUFBVDtHQUZGLENBdkVpQztDQUFuQzs7QUE2RUEsY0FBYyxTQUFkLEdBQTBCO0FBQ3hCLGVBQWEsYUFBYjs7QUFFQSxZQUFVLGtCQUFVLFFBQVYsRUFBb0IsU0FBcEIsRUFBK0IsTUFBL0IsRUFBdUM7QUFDL0MsZ0JBQVksYUFBYSxLQUFLLEtBQUwsQ0FEc0I7QUFFL0MsYUFBUyxVQUFVLFVBQVYsQ0FGc0M7O0FBSS9DLGFBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QjtBQUN0QixVQUFJLFNBQVMsSUFBVCxFQUFlLE9BQW5COztBQUVBLGVBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsSUFBcEIsRUFIc0I7O0FBS3RCLFlBQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixJQUF4QixDQUE2QixLQUFLLFFBQUwsRUFBZSxVQUFVLENBQVYsRUFBYTtBQUN2RCxpQkFBUyxDQUFULEVBRHVEO09BQWIsQ0FBNUMsQ0FMc0I7S0FBeEI7O0FBVUEsYUFBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCO0FBQ3ZCLFVBQUksU0FBUyxJQUFULEVBQWUsT0FBbkI7O0FBRUEsWUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLElBQXhCLENBQTZCLEtBQUssUUFBTCxFQUFlLFVBQVUsQ0FBVixFQUFhO0FBQ3ZELGtCQUFVLElBQVYsRUFEdUQ7T0FBYixDQUE1QyxDQUh1Qjs7QUFPdkIsZUFBUyxJQUFULENBQWMsSUFBZCxFQUFvQixJQUFwQixFQVB1QjtLQUF6Qjs7QUFVQSxRQUFJLFdBQVcsVUFBWCxFQUF1QjtBQUN6QixlQUFTLFNBQVQsRUFEeUI7S0FBM0IsTUFFTztBQUNMLGdCQUFVLFNBQVYsRUFESztLQUZQO0dBeEJROztBQStCVixRQUFNLGdCQUFZO0FBQ2hCLFNBQUssTUFBTCxHQURnQjtBQUVoQixTQUFLLE1BQUwsR0FGZ0I7R0FBWjs7Ozs7O0FBU04sVUFBUSxrQkFBWTs7QUFFbEIsU0FBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBNEIsT0FBNUIsRUFBcUMsVUFBVSxDQUFWLEVBQWE7QUFDaEQsVUFBSSxLQUFLLE9BQU8sS0FBUCxDQUR1QztBQUVoRCxVQUFJLEtBQUssRUFBRSxNQUFGLElBQVksRUFBRSxVQUFGOzs7O0FBRjJCLFVBTTVDLGFBQWEsSUFBYixDQUFrQixHQUFHLFNBQUgsQ0FBdEIsRUFDRSxLQUFLLEdBQUcsYUFBSDs7O0FBRFAsV0FJSyxJQUFJLE1BQU0sSUFBTixDQUFXLEdBQUcsU0FBSCxDQUFmLEVBQThCO0FBQ2pDLGtCQUFRLEdBQUcsU0FBSCxDQUFhLElBQWIsRUFBUjtBQUNFLGlCQUFLLFlBQUw7QUFDRSxtQkFBSyxHQUFMLENBQVMsR0FBRyxhQUFILENBQWlCLGFBQWpCLENBQVQsQ0FERjtBQUVFLG9CQUZGO0FBREYsaUJBSU8sY0FBTDtBQUNFLG1CQUFLLE1BQUwsQ0FBWSxHQUFHLGFBQUgsQ0FBaUIsYUFBakIsQ0FBWixDQURGO0FBRUUsb0JBRkY7QUFKRixpQkFPTyxhQUFMO0FBQ0Usa0JBQUksVUFBVSxHQUFHLGFBQUgsQ0FBaUIsYUFBakIsQ0FBK0IsV0FBL0IsRUFBNEMsS0FBNUMsQ0FEaEI7QUFFRSxrQkFBSSxZQUFZLElBQVosSUFBb0IsQ0FBRSxRQUFRLElBQVIsRUFBRixFQUFrQixPQUExQztBQUNBLG1CQUFLLEdBQUwsQ0FBUyxHQUFHLGFBQUgsRUFBa0IsUUFBUSxJQUFSLEVBQTNCLEVBSEY7QUFJRSxvQkFKRjtBQVBGLFdBRGlDO0FBY2pDLGlCQWRpQzs7OztBQUE5QixhQWtCQSxJQUFJLENBQUUsR0FBRyxTQUFILENBQWEsUUFBYixDQUFzQixPQUF0QixDQUFGLEVBQWtDO0FBQ3pDLG1CQUR5QztXQUF0Qzs7O0FBNUIyQyxVQW1DaEQsQ0FBSyxNQUFMLENBQVksRUFBWixFQW5DZ0Q7O0FBcUNoRCxjQUFRLEdBQUcsYUFBSCxDQUFpQixTQUFqQjtBQUNOLGFBQUssTUFBTDtBQUNFLGVBQUssS0FBTCxDQUFXLEVBQVgsRUFERjtBQUVFLGdCQUZGO0FBREYsYUFJTyxPQUFMO0FBQ0UsZUFBSyxJQUFMLENBQVUsRUFBVixFQURGO0FBRUUsZ0JBRkY7QUFKRixPQXJDZ0Q7S0FBYixDQTZDbkMsSUE3Q21DLENBNkM5QixJQTdDOEIsQ0FBckM7OztBQUZrQixRQWtEbEIsQ0FBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBNEIsT0FBNUIsRUFBcUMsVUFBVSxDQUFWLEVBQWE7QUFDaEQsVUFBSSxLQUFLLE9BQU8sS0FBUCxDQUR1QztBQUVoRCxVQUFJLEtBQUssRUFBRSxNQUFGLElBQVksRUFBRSxVQUFGLENBRjJCO0FBR2hELGNBQVEsR0FBRyxTQUFIO0FBQ04sYUFBSyxVQUFMO0FBQ0UsY0FBSSxFQUFFLE9BQUYsS0FBYyxFQUFkLEVBQWtCLE9BQXRCO0FBQ0EsZUFBSyxHQUFMLENBQVMsR0FBRyxhQUFILEVBQWtCLEdBQUcsS0FBSCxDQUFTLElBQVQsRUFBM0IsRUFGRjtBQUdFLGdCQUhGO0FBREYsT0FIZ0Q7S0FBYixDQVNuQyxJQVRtQyxDQVM5QixJQVQ4QixDQUFyQyxFQWxEa0I7R0FBWjs7Ozs7QUFpRVIsVUFBUSxrQkFBWSxFQUFaOzs7Ozs7QUFRUixVQUFRLGtCQUFZOzs7Ozs7QUFNbEIsYUFBUyxZQUFULENBQXNCLE1BQXRCLEVBQThCLE1BQTlCLEVBQXNDOzs7QUFHcEMsVUFBSSxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsS0FBMkIsQ0FBM0IsRUFBOEI7QUFDaEMsaUNBQXNCLE9BQU8sSUFBUCxHQUFjLE1BQWQsR0FBdUIsT0FBdkIsaUhBRXVCLE9BQU8sSUFBUCxHQUFjLE1BQWQsR0FBdUIsT0FBdkIsZUFBdUMsT0FBTyxJQUFQLCtMQUZwRixDQURnQztPQUFsQzs7O0FBSG9DLFVBY2hDLE9BQU8sSUFBUCxLQUFnQixNQUFoQixFQUF3QixPQUFRLE9BQU8sUUFBUCxDQUFnQixHQUFoQixDQUFvQixVQUFVLENBQVYsRUFBYTtBQUNsRSxlQUFPLGFBQWEsQ0FBYixFQUFnQixJQUFoQixDQUFQLENBRGtFO09BQWIsQ0FBcEIsQ0FFaEMsSUFGZ0MsQ0FFM0IsRUFGMkIsQ0FBUixDQUE1Qjs7QUFJQSwrQkFBc0IsT0FBTyxJQUFQLEdBQWMsTUFBZCxHQUF1QixPQUF2Qiw2R0FFdUIsT0FBTyxJQUFQLEdBQWMsTUFBZCxHQUF1QixPQUF2QixlQUF1QyxPQUFPLElBQVAscUxBS3pFLE9BQU8sUUFBUCxDQUFnQixHQUFoQixDQUFvQixVQUFVLENBQVYsRUFBYTtBQUMvQixlQUFPLGFBQWEsQ0FBYixFQUFnQixPQUFPLElBQVAsQ0FBdkIsQ0FEK0I7T0FBYixDQUFwQixDQUVHLElBRkgsQ0FFUSxFQUZSLDRCQVBYLENBbEJvQztLQUF0Qzs7QUFnQ0EsU0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixhQUFhLEtBQUssWUFBTCxDQUFwQyxDQXRDa0I7R0FBWjs7Ozs7Ozs7QUErQ1IsUUFBTSxjQUFVLEVBQVYsRUFBYztBQUNsQixVQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsQ0FBNkIsR0FBRyxhQUFILENBQWlCLFFBQWpCLEVBQTJCLFVBQVUsQ0FBVixFQUFhO0FBQ25FLFFBQUUsS0FBRixDQUFRLE9BQVIsR0FBa0IsT0FBbEIsQ0FEbUU7S0FBYixDQUF4RCxDQURrQjs7QUFLbEIsT0FBRyxpQkFBSCxDQUFxQixTQUFyQixHQUFpQywyQkFBakM7QUFMa0IsTUFNbEIsQ0FBRyxhQUFILENBQWlCLFNBQWpCLEdBQTZCLE1BQTdCLENBTmtCO0dBQWQ7OztBQVVOLFdBQVMsaUJBQVUsRUFBVixFQUFjO0FBQ3JCLFNBQUssUUFBTCxDQUFjLFVBQVUsQ0FBVixFQUFhO0FBQ3pCLFVBQUksRUFBRSxPQUFGLENBQVUsV0FBVixPQUE0QixHQUE1QixFQUFpQztBQUNuQyxVQUFFLFNBQUYsR0FBYywyQkFBZCxDQURtQztBQUVuQyxlQUZtQztPQUFyQzs7QUFLQSxRQUFFLFNBQUYsR0FBYyxNQUFkLENBTnlCO0tBQWIsRUFPWCxFQVBILEVBRHFCO0dBQWQ7Ozs7OztBQWVULFNBQU8sZUFBVSxFQUFWLEVBQWM7QUFDbkIsVUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLElBQXhCLENBQTZCLEdBQUcsYUFBSCxDQUFpQixRQUFqQixFQUEyQixVQUFVLENBQVYsRUFBYTtBQUNuRSxRQUFFLEtBQUYsQ0FBUSxPQUFSLEdBQWtCLE1BQWxCLENBRG1FO0tBQWIsQ0FBeEQsQ0FEbUI7O0FBS25CLE9BQUcsS0FBSCxDQUFTLE9BQVQsR0FBbUIsT0FBbkIsQ0FMbUI7QUFNbkIsT0FBRyxpQkFBSCxDQUFxQixTQUFyQixHQUFpQyw0QkFBakM7QUFObUIsTUFPbkIsQ0FBRyxhQUFILENBQWlCLFNBQWpCLEdBQTZCLE9BQTdCLENBUG1CO0dBQWQ7OztBQVdQLFlBQVUsa0JBQVUsRUFBVixFQUFjO0FBQ3RCLFNBQUssUUFBTCxDQUFjLFVBQVUsQ0FBVixFQUFhO0FBQ3pCLFVBQUksRUFBRSxPQUFGLENBQVUsV0FBVixPQUE0QixHQUE1QixFQUFpQztBQUNuQyxVQUFFLFNBQUYsR0FBYyw0QkFBZCxDQURtQztBQUVuQyxlQUZtQztPQUFyQztBQUlBLFFBQUUsU0FBRixHQUFjLE9BQWQsQ0FMeUI7S0FBYixFQU1YLEVBTkgsRUFEc0I7R0FBZDs7O0FBV1YsVUFBUSxnQkFBVSxJQUFWLEVBQWdCOztBQUV0QixRQUFJLEtBQUssV0FBTCxDQUFpQixNQUFqQixLQUE0QixJQUE1QixFQUFrQztBQUNwQyxXQUFLLFdBQUwsQ0FBaUIsTUFBakIsR0FBMEIsSUFBMUIsQ0FEb0M7QUFFcEMsV0FBSyxXQUFMLENBQWlCLE9BQWpCLEdBQTJCLElBQTNCLENBRm9DO0FBR3BDLFdBQUssS0FBTCxDQUFXLGVBQVgsR0FBNkIsS0FBSyxnQkFBTCxDQUFzQixNQUF0QixDQUhPO0FBSXBDLGFBSm9DO0tBQXRDOzs7QUFGc0IsUUFVdEIsQ0FBSyxXQUFMLENBQWlCLE1BQWpCLEdBQTBCLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQVZKO0FBV3RCLFNBQUssV0FBTCxDQUFpQixPQUFqQixHQUEyQixJQUEzQixDQVhzQjtBQVl0QixTQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBd0IsS0FBeEIsQ0FBOEIsZUFBOUIsR0FBZ0QsS0FBSyxnQkFBTCxDQUFzQixRQUF0QixDQVoxQjtBQWF0QixTQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsS0FBekIsQ0FBK0IsZUFBL0IsR0FBaUQsS0FBSyxnQkFBTCxDQUFzQixNQUF0QixDQWIzQjtHQUFoQjs7Ozs7Ozs7O0FBdUJSLE9BQUssYUFBVSxVQUFWLEVBQXNCLGFBQXRCLEVBQXFDOztBQUV4QyxRQUFJLENBQUUsYUFBRixFQUFpQjs7QUFFbkIsV0FBSyxJQUFMLENBQVUsV0FBVyxhQUFYLENBQXlCLFFBQXpCLENBQVYsRUFGbUI7QUFHbkIsVUFBSSxJQUFJLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFKLENBSGU7QUFJbkIsUUFBRSxTQUFGLEdBQWMsT0FBZCxDQUptQjtBQUtuQixRQUFFLFNBQUYseVRBTG1CO0FBWW5CLGlCQUFXLFdBQVgsQ0FBdUIsQ0FBdkIsRUFabUI7OztBQUFyQixTQWVLO0FBQ0gsbUJBQVcsU0FBWCxnRUFDa0QsMElBRGxELENBREc7T0FmTDtHQUZHOzs7Ozs7O0FBOEJMLFVBQVEsZ0JBQVUsSUFBVixFQUFnQjs7QUFFdEIsU0FBSyxhQUFMLENBQ0ssV0FETCxDQUNpQixJQURqQixFQUZzQjtHQUFoQjtDQXZRVjs7QUE4UUEsSUFBSSxhQUFKLENBQWtCLFdBQWxCLEVBQStCLElBQS9CIiwiZmlsZSI6InRhc2stMjUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiAkIChlbCkge1xuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG59XG5cbmZ1bmN0aW9uIFRyZWVDb21wb25lbnQgKGNvbnRhaW5lcikge1xuICB0aGlzLl9yb290ID0gJChjb250YWluZXIpO1xuICB0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSB7XG4gICAgdW50YXJnZXQ6ICcjRkZGJyxcbiAgICB0YXJnZXQ6ICcjMjE5NkYzJyxcbiAgfTtcbiAgLyoqXG4gICAgKiDmlofku7blpLnlr7nosaFcbiAgICAqICAgbmFtZTog5paH5Lu25ZCNIFN0cmluZ1xuICAgICogICBvcGVuOiDmmK/lkKbmiZPlvIAgQm9vbGVhblxuICAgICogICBjaGlsZHJlbjog5a2Q55uu5b2VIEFycmF5XG4gICAgKi9cbiAgdGhpcy5fZGlyZWN0b3JpZXMgPSB7XG4gICAgbmFtZTogJ3Jvb3QnLFxuICAgIG9wZW46IHRydWUsXG4gICAgY2hpbGRyZW46IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ+ebruW9lScsXG4gICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ+WbvueJhycsXG4gICAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnSlBHJyxcbiAgICAgICAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnUE5HJyxcbiAgICAgICAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnR0lGJyxcbiAgICAgICAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1BERicsXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdKUEcnLFxuICAgICAgICAgICAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdQTkcnLFxuICAgICAgICAgICAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnRE9DJyxcbiAgICAgICAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1RYVCcsXG4gICAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuICB0aGlzLl90YXJnZXROb2RlID0ge1xuICAgIGJlZm9yZTogbnVsbCxcbiAgICBjdXJyZW50OiBudWxsLFxuICB9O1xufVxuXG5UcmVlQ29tcG9uZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFRyZWVDb21wb25lbnQsXG5cbiAgdHJhdmVyc2U6IGZ1bmN0aW9uIChjYWxsYmFjaywgYmVnaW5Ob2RlLCBtZXRob2QpIHtcbiAgICBiZWdpbk5vZGUgPSBiZWdpbk5vZGUgfHwgdGhpcy5fcm9vdDtcbiAgICBtZXRob2QgPSBtZXRob2QgfHwgJ3ByZU9yZGVyJztcblxuICAgIGZ1bmN0aW9uIHByZU9yZGVyKG5vZGUpIHtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSByZXR1cm4gO1xuXG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIG5vZGUpO1xuXG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKG5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHByZU9yZGVyKGUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9zdE9yZGVyKG5vZGUpIHtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSByZXR1cm4gO1xuXG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKG5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHBvc3RPcmRlcihub2RlKTtcbiAgICAgIH0pO1xuXG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIG5vZGUpO1xuICAgIH1cblxuICAgIGlmIChtZXRob2QgPT09ICdwcmVPcmRlcicpIHtcbiAgICAgIHByZU9yZGVyKGJlZ2luTm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3RPcmRlcihiZWdpbk5vZGUpO1xuICAgIH1cbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLmxpc3RlbigpO1xuICB9LFxuXG4gIC8qKlxuICAgICog57uR5a6a55uR5ZCs5LqL5Lu2XG4gICAgKiAgIGNsaWNrLCBrZXl1cOetiVxuICAgICovXG4gIGxpc3RlbjogZnVuY3Rpb24gKCkge1xuICAgIC8vIGNsaWNrIGV2ZW50XG4gICAgdGhpcy5fcm9vdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICB2YXIgZWwgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XG5cbiAgICAgIC8vIOeCueS4rXRpdGxl55qE5omp5bGV5Zu+5qCH5pe277yM5bqU6K+l6YCJ5oup5LuW5Lus54i26IqC54K555qE54i26IqC54K5XG4gICAgICAvLyBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaScpXG4gICAgICBpZiAoL2ZhLWNoZXZyb24vLnRlc3QoZWwuY2xhc3NOYW1lKSlcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAvLyDngrnkuK10aXRsZeeahOWinuWKoOaIluWIoOmZpOWbvuagh1xuICAgICAgZWxzZSBpZiAoL2ZhLS8udGVzdChlbC5jbGFzc05hbWUpKSB7XG4gICAgICAgIHN3aXRjaCAoZWwuY2xhc3NOYW1lLnRyaW0oKSkge1xuICAgICAgICAgIGNhc2UgJ2ZhIGZhLXBsdXMnOlxuICAgICAgICAgICAgdGhpcy5hZGQoZWwucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2ZhIGZhLXJlbW92ZSc6XG4gICAgICAgICAgICB0aGlzLnJlbW92ZShlbC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZmEgZmEtY2hlY2snOlxuICAgICAgICAgICAgdmFyIGRpck5hbWUgPSBlbC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaXItbmFtZScpLnZhbHVlO1xuICAgICAgICAgICAgaWYgKGRpck5hbWUgPT09IG51bGwgfHwgISBkaXJOYW1lLnRyaW0oKSkgcmV0dXJuIDtcbiAgICAgICAgICAgIHRoaXMuYWRkKGVsLnBhcmVudEVsZW1lbnQsIGRpck5hbWUudHJpbSgpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiA7XG4gICAgICB9XG5cbiAgICAgIC8vIOWmguaenOS5iOacieeCueS4rXRpdGxl5pe277yM5bCx5LiN5omp5bGV6IqC54K5XG4gICAgICBlbHNlIGlmICghIGVsLmNsYXNzTGlzdC5jb250YWlucygndGl0bGUnKSkge1xuICAgICAgICByZXR1cm4gO1xuICAgICAgfVxuXG5cblxuICAgICAgLy8g6KKr6YCJ5LitXG4gICAgICB0aGlzLnRhcmdldChlbCk7XG5cbiAgICAgIHN3aXRjaCAoZWwucGFyZW50RWxlbWVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgY2FzZSAnb3Blbic6XG4gICAgICAgICAgdGhpcy5jbG9zZShlbCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nsb3NlJzpcbiAgICAgICAgICB0aGlzLm9wZW4oZWwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBrZXl1cCBldmVudFxuICAgIHRoaXMuX3Jvb3QuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgICAgdmFyIGVsID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuICAgICAgc3dpdGNoIChlbC5jbGFzc05hbWUpIHtcbiAgICAgICAgY2FzZSAnZGlyLW5hbWUnOlxuICAgICAgICAgIGlmIChlLmtleUNvZGUgIT09IDEzKSByZXR1cm4gO1xuICAgICAgICAgIHRoaXMuYWRkKGVsLnBhcmVudEVsZW1lbnQsIGVsLnZhbHVlLnRyaW0oKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICAvKipcbiAgICAqIEBUT0RPIOabtOaWsOaWh+S7tuWkueiKgueCuXRoaXMuX2RpcmVjdG9yaWVzXG4gICAgKi9cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuICAvKipcbiAgICAqIOWwhuaWh+S7tuWkueWvueixoea4suafk+aIkERPTeiKgueCuVxuICAgICogICB0aGlzLl9kaXJlY3Rvcmllc1xuICAgICovXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAgKiBAcGFyYW1cbiAgICAgICogICBwYXJlbnQgcGFyZW50Tm9kZSwgYW4gb2JqZWN0IG9mIGEgZGlyXG4gICAgICAqICAgc3RhdHVzIGRpciBvcGVuKHRydWUpL2Nsb3NlKGZhbHNlKVxuICAgICAgKi9cbiAgICBmdW5jdGlvbiByZW5kZXJQYXJlbnQocGFyZW50LCBzdGF0dXMpIHtcblxuICAgICAgLy8g5Y+q5pyJ5qC555uu5b2VXG4gICAgICBpZiAocGFyZW50LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCIke3BhcmVudC5vcGVuID8gJ29wZW4nIDogJ2Nsb3NlJ31cIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZSBjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tY2lyY2xlLSR7cGFyZW50Lm9wZW4gPyAnZG93bicgOiAncmlnaHQnfVwiPjwvaT4ke3BhcmVudC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXJlbW92ZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAgIH1cblxuICAgICAgLy8g5pyJ5a2Q55uu5b2VLCDkuI3mmL7npLogcm9vdFxuICAgICAgaWYgKHBhcmVudC5uYW1lID09PSAncm9vdCcpIHJldHVybiAgcGFyZW50LmNoaWxkcmVuLm1hcChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgcmV0dXJuIHJlbmRlclBhcmVudChlLCB0cnVlKTtcbiAgICAgICB9KS5qb2luKCcnKTtcblxuICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiJHtwYXJlbnQub3BlbiA/ICdvcGVuJyA6ICdjbG9zZSd9XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlIGNsZWFyZml4XCI+XG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tY2lyY2xlLSR7cGFyZW50Lm9wZW4gPyAnZG93bicgOiAncmlnaHQnfVwiPjwvaT4ke3BhcmVudC5uYW1lfVxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1yZW1vdmVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBsdXNcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAke1xuICAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlclBhcmVudChlLCBwYXJlbnQub3Blbik7XG4gICAgICAgICAgICAgICAgIH0pLmpvaW4oJycpXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgfVxuXG4gICAgdGhpcy5fcm9vdC5pbm5lckhUTUwgPSByZW5kZXJQYXJlbnQodGhpcy5fZGlyZWN0b3JpZXMpO1xuICB9LFxuXG4gIC8qKlxuICAgICogQHBhcmFtOlxuICAgICogICBlbCAgdGl0bGUgbm9kZVxuICAgICogQGZ1bmN0aW9uOlxuICAgICogICBvbmx5IG9wZW4gZmlyc3QgY2hpbGRyZW4gbGF5ZXJcbiAgICAqL1xuICBvcGVuOiBmdW5jdGlvbiAoZWwpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGVsLnBhcmVudEVsZW1lbnQuY2hpbGRyZW4sIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH0pO1xuXG4gICAgZWwuZmlyc3RFbGVtZW50Q2hpbGQuY2xhc3NOYW1lID0gXCJmYSBmYS1jaGV2cm9uLWNpcmNsZS1kb3duXCI7IC8vIGkgdGFnXG4gICAgZWwucGFyZW50RWxlbWVudC5jbGFzc05hbWUgPSAnb3Blbic7XG4gIH0sXG5cbiAgLy8gb3BlbiBBbGwgZGlyZWN0b3JpZXNcbiAgb3BlbkFsbDogZnVuY3Rpb24gKGVsKSB7XG4gICAgdGhpcy50cmF2ZXJzZShmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaScpIHtcbiAgICAgICAgZS5jbGFzc05hbWUgPSBcImZhIGZhLWNoZXZyb24tY2lyY2xlLWRvd25cIjtcbiAgICAgICAgcmV0dXJuIDtcbiAgICAgIH1cblxuICAgICAgZS5jbGFzc05hbWUgPSAnb3Blbic7XG4gICAgfSwgZWwpO1xuICB9LFxuXG4gIC8qKlxuICAgICogQHBhcmFtOlxuICAgICogICBlbCB0aXRsZSBub2RlXG4gICAgKi9cbiAgY2xvc2U6IGZ1bmN0aW9uIChlbCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZWwucGFyZW50RWxlbWVudC5jaGlsZHJlbiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9KTtcblxuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGVsLmZpcnN0RWxlbWVudENoaWxkLmNsYXNzTmFtZSA9IFwiZmEgZmEtY2hldnJvbi1jaXJjbGUtcmlnaHRcIjsgLy8gaSB0YWdcbiAgICBlbC5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSA9ICdjbG9zZSc7XG4gIH0sXG5cbiAgLy8gY2xvc2UgQWxsIGRpcmVjdG9yaWVzXG4gIGNsb3NlQWxsOiBmdW5jdGlvbiAoZWwpIHtcbiAgICB0aGlzLnRyYXZlcnNlKGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpJykge1xuICAgICAgICBlLmNsYXNzTmFtZSA9IFwiZmEgZmEtY2hldnJvbi1jaXJjbGUtcmlnaHRcIjtcbiAgICAgICAgcmV0dXJuIDtcbiAgICAgIH1cbiAgICAgIGUuY2xhc3NOYW1lID0gJ2Nsb3NlJztcbiAgICB9LCBlbCk7XG4gIH0sXG5cbiAgLy8g6IqC54K56KKr6YCJ5LitLCDnhLblkI7orrDlvZXkuIrkuIDkuKroioLngrnkuI7lvZPliY3oioLngrlcbiAgdGFyZ2V0OiBmdW5jdGlvbiAobm9kZSkge1xuICAgIC8vIOesrOS4gOasoeS9v+eUqFxuICAgIGlmICh0aGlzLl90YXJnZXROb2RlLmJlZm9yZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGFyZ2V0Tm9kZS5iZWZvcmUgPSBub2RlO1xuICAgICAgdGhpcy5fdGFyZ2V0Tm9kZS5jdXJyZW50ID0gbm9kZTtcbiAgICAgIG5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5fYmFja2dyb3VuZENvbG9yLnRhcmdldDtcbiAgICAgIHJldHVybiA7XG4gICAgfVxuXG4gICAgLy8g5Lul5ZCO5L2/55SoLCDliIfmjaLlvZPliY3oioLngrnkuLrkuYvliY3oioLngrnvvIzpgInkuK3oioLngrnkuLrlvZPliY3oioLngrksIOeEtuWQjuWMuuWIhijlpoLpopzoibIpXG4gICAgdGhpcy5fdGFyZ2V0Tm9kZS5iZWZvcmUgPSB0aGlzLl90YXJnZXROb2RlLmN1cnJlbnQ7XG4gICAgdGhpcy5fdGFyZ2V0Tm9kZS5jdXJyZW50ID0gbm9kZTtcbiAgICB0aGlzLl90YXJnZXROb2RlLmJlZm9yZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLl9iYWNrZ3JvdW5kQ29sb3IudW50YXJnZXQ7XG4gICAgdGhpcy5fdGFyZ2V0Tm9kZS5jdXJyZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuX2JhY2tncm91bmRDb2xvci50YXJnZXQ7XG4gIH0sXG5cbiAgLyoqXG4gICAgKiDmt7vliqDmlofku7blpLlcbiAgICAqICAgcGFyZW50Tm9kZSDlrrnnurPmlrDmlofku7blpLnnmoTniLboioLngrnkv6Hmga9cbiAgICAqICAgZGlyZWN0b3J5TmFtZSDmlofku7blkI1cbiAgICAqICAgICDlvZNkaXJlY3RvcnlOYW1l5Li6dW5kZWZpbmVk5pe2LCBwYXJlbnROb2Rl5Li6b3BlbuiKgueCuVxuICAgICogICAgIOW9k2RpcmVjdG9yeU5hbWXkuLrpnZ7nqbrml7bvvIxwYXJlbnROb2Rl5Li6dGl0bGXoioLngrlcbiAgICAqL1xuICBhZGQ6IGZ1bmN0aW9uIChwYXJlbnROb2RlLCBkaXJlY3RvcnlOYW1lKSB7XG4gICAgLy8g5rKh5pyJ5paH5Lu25ZCNLCDor7TmmI7mmK/mt7vliqDmjInpkq5cbiAgICBpZiAoISBkaXJlY3RvcnlOYW1lKSB7XG4gICAgICAvLyDmt7vliqDnmoTml7blgJnlvZPnhLbopoHmiZPlvIDmlofku7blpLnlkq9cbiAgICAgIHRoaXMub3BlbihwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKTtcbiAgICAgIHZhciBfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBfLmNsYXNzTmFtZSA9ICdjbG9zZSc7XG4gICAgICBfLmlubmVySFRNTCA9ICAgYFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZSBjbGVhcmZpeFwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLWNpcmNsZS1yaWdodFwiPjwvaT5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImRpci1uYW1lXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpeaWh+S7tuWQjVwiLz5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcmVtb3ZlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jaGVja1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChfKTtcbiAgICB9XG4gICAgLy8g5pyJ5paH5Lu25ZCN77yM6K+05piO5piv6L6T5YWlXG4gICAgZWxzZSB7XG4gICAgICBwYXJlbnROb2RlLmlubmVySFRNTCA9ICAgYFxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLWNpcmNsZS1yaWdodFwiPjwvaT4ke2RpcmVjdG9yeU5hbWV9XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXJlbW92ZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5gO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICAqIOWIoOmZpOiKgueCueS/oeaBr1xuICAgICogQHBhcmFtXG4gICAgKiAgIG5vZGUg5Li6IOaWh+S7tuWkueiKgueCuSwg5Y2zb3Blbi9jbG9zZSDoioLngrlcbiAgICAqL1xuICByZW1vdmU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgLy8gcmVtb3ZlIGFsbFxuICAgIG5vZGUucGFyZW50RWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2hpbGQobm9kZSk7XG4gIH0sXG59O1xuXG5uZXcgVHJlZUNvbXBvbmVudCgnLnNpZGUtYmFyJykuaW5pdCgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
