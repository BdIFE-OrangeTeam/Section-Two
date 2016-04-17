function $ (el) {
  return document.querySelector(el);
}

function TreeComponent (container) {
  this._root = $(container);
  this._backgroundColor = {
    untarget: '#FFF',
    target: '#2196F3',
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
    children: [
      {
        name: '目录',
        open: true,
        children: [
          {
            name: '图片',
            open: false,
            children: [
              {
                name: 'JPG',
                open: false,
                children: [],
              },
              {
                name: 'PNG',
                open: false,
                children: [],
              },
              {
                name: 'GIF',
                open: false,
                children: [],
              },
            ],
          },
          {
            name: 'PDF',
            open: true,
            children: [
              {
                name: 'JPG',
                open: false,
                children: [],
              },
              {
                name: 'PNG',
                open: false,
                children: [],
              },
            ],
          },
          {
            name: 'DOC',
            open: false,
            children: [],
          },
          {
            name: 'TXT',
            open: false,
            children: [],
          },
        ],
      },
    ],
  };
  this._targetNode = {
    before: null,
    current: null,
  };
}

TreeComponent.prototype = {
  constructor: TreeComponent,

  traverse: function (callback, beginNode, method) {
    beginNode = beginNode || this._root;
    method = method || 'preOrder';

    function preOrder(node) {
      if (node === null) return ;

      callback.call(this, node);

      Array.prototype.forEach.call(node.children, function (e) {
        preOrder(e);
      });
    }

    function postOrder(node) {
      if (node === null) return ;

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

  init: function () {
    this.render();
    this.listen();
  },

  /**
    * 绑定监听事件
    *   click, keyup等
    */
  listen: function () {
    // click event
    this._root.addEventListener('click', function (e) {
      e = e || window.event;
      var el = e.target || e.srcElement;

      // 点中title的扩展图标时，应该选择他们父节点的父节点
      // if (el.tagName.toLowerCase() === 'i')
      if (/fa-chevron/.test(el.className))
        el = el.parentElement;

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
            if (dirName === null || ! dirName.trim()) return ;
            this.add(el.parentElement, dirName.trim());
            break;
        }
        return ;
      }

      // 如果么有点中title时，就不扩展节点
      else if (! el.classList.contains('title')) {
        return ;
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
          if (e.keyCode !== 13) return ;
          this.add(el.parentElement, el.value.trim());
          break;
      }
    }.bind(this));
  },

  /**
    * @TODO 更新文件夹节点this._directories
    */
  update: function () {

  },

  /**
    * 将文件夹对象渲染成DOM节点
    *   this._directories
    */
  render: function () {
    /**
      * @param
      *   parent parentNode, an object of a dir
      *   status dir open(true)/close(false)
      */
    function renderParent(parent, status) {

      // 只有根目录
      if (parent.children.length === 0) {
        return `<div class="${parent.open ? 'open' : 'close'}">
                  <div class="title clearfix">
                    <i class="fa fa-chevron-circle-${parent.open ? 'down' : 'right'}"></i>${parent.name}
                    <i class="fa fa-remove" aria-hidden="true"></i>
                    <i class="fa fa-plus" aria-hidden="true"></i>
                  </div>
                </div>`;
      }

      // 有子目录, 不显示 root
      if (parent.name === 'root') return  parent.children.map(function (e) {
         return renderParent(e, true);
       }).join('');

      return `<div class="${parent.open ? 'open' : 'close'}">
                <div class="title clearfix">
                  <i class="fa fa-chevron-circle-${parent.open ? 'down' : 'right'}"></i>${parent.name}
                  <i class="fa fa-remove" aria-hidden="true"></i>
                  <i class="fa fa-plus" aria-hidden="true"></i>
                </div>
               ${
                 parent.children.map(function (e) {
                   return renderParent(e, parent.open);
                 }).join('')
               }
              </div>`;
    }

    this._root.innerHTML = renderParent(this._directories);
  },

  /**
    * @param:
    *   el  title node
    * @function:
    *   only open first children layer
    */
  open: function (el) {
    Array.prototype.forEach.call(el.parentElement.children, function (e) {
      e.style.display = 'block';
    });

    el.firstElementChild.className = "fa fa-chevron-circle-down"; // i tag
    el.parentElement.className = 'open';
  },

  // open All directories
  openAll: function (el) {
    this.traverse(function (e) {
      if (e.tagName.toLowerCase() === 'i') {
        e.className = "fa fa-chevron-circle-down";
        return ;
      }

      e.className = 'open';
    }, el);
  },

  /**
    * @param:
    *   el title node
    */
  close: function (el) {
    Array.prototype.forEach.call(el.parentElement.children, function (e) {
      e.style.display = 'none';
    });

    el.style.display = 'block';
    el.firstElementChild.className = "fa fa-chevron-circle-right"; // i tag
    el.parentElement.className = 'close';
  },

  // close All directories
  closeAll: function (el) {
    this.traverse(function (e) {
      if (e.tagName.toLowerCase() === 'i') {
        e.className = "fa fa-chevron-circle-right";
        return ;
      }
      e.className = 'close';
    }, el);
  },

  // 节点被选中, 然后记录上一个节点与当前节点
  target: function (node) {
    // 第一次使用
    if (this._targetNode.before === null) {
      this._targetNode.before = node;
      this._targetNode.current = node;
      node.style.backgroundColor = this._backgroundColor.target;
      return ;
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
  add: function (parentNode, directoryName) {
    // 没有文件名, 说明是添加按钮
    if (! directoryName) {
      // 添加的时候当然要打开文件夹咯
      this.open(parentNode.querySelector('.title'));
      var _ = document.createElement('div');
      _.className = 'close';
      _.innerHTML =   `
          <div class="title clearfix">
            <i class="fa fa-chevron-circle-right"></i>
            <input class="dir-name" type="text" placeholder="请输入文件名"/>
            <i class="fa fa-remove" aria-hidden="true"></i>
            <i class="fa fa-check" aria-hidden="true"></i>
          </div>`;
      parentNode.appendChild(_);
    }
    // 有文件名，说明是输入
    else {
      parentNode.innerHTML =   `
            <i class="fa fa-chevron-circle-right"></i>${directoryName}
            <i class="fa fa-remove" aria-hidden="true"></i>
            <i class="fa fa-plus" aria-hidden="true"></i>`;
    }
  },

  /**
    * 删除节点信息
    * @param
    *   node 为 文件夹节点, 即open/close 节点
    */
  remove: function (node) {
    // remove all
    node.parentElement
        .removeChild(node);
  },
};

new TreeComponent('.side-bar').init();
