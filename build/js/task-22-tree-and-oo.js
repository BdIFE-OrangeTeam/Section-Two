'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// 深度拷贝
function deepCopy(parent, child) {
  child = child || {};
  for (var i in parent) {
    if (_typeof(parent[i]) === 'object') {
      c[i] = parent[i].constructor === Array ? [] : {};
      deepCopy(parent[i], child[i]);
    } else {
      child[i] = parent[i];
    }
  }

  return child;
}

function Queue() {
  this.data = [];
}

Queue.prototype.enqueue = function (data) {
  this.data.unshift(data);
};

Queue.prototype.dequeue = function () {
  return this.data.pop();
};

//
function Node(data) {
  this.data = data;
  this.parent = null;
  this.children = [];
}

function Tree(data) {
  var node = new Node(data);
  this._root = node;
}

function findIndex(arr, data) {
  var index;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].data === data) {
      index = i;
    }
  }

  return index;
}

// 1 of 5. Depth First Search
Tree.prototype.traverseDF = function (callback) {
  // this is a recurse and mediately-invoking function
  (function recurse(currentNode) {
    // step 2
    for (var i = 0, length = currentNode.children; i < length; ++i) {
      // step 3
      recurse(currentNode.children[i]);
    }

    // step 4
    callback(currentNode);

    // step 1
  })(this._root);
};

// 2 of 5. Breadth First Search
Tree.prototype.traverseBF = function (callback) {
  var queue = new Queue();

  queue.enqueue(this._root);

  currentTree = queue.dequeue();

  while (currentTree) {
    for (var i = 0, length = currentTree.children; i < length; ++i) {
      queue.enqueue(currentTree.children[i]);
    }

    callback(currentTree);
    currentTree = queue.dequeue();
  }
};

// 3 of 5. Contain Data
Tree.prototype.contains = function (callback, traversal) {
  traversal.call(this, callback);
};

// 4 of 5. Add Data
Tree.prototype.add = function (data, toData, traversal) {
  var child = new Node(data),
      parent = null,
      callback = function callback(node) {
    if (node.data == toData) parent = node;
  };

  this.contains(callback, traversal);

  if (parent) {
    parent.children.push(child);
    child.parent = parent;
  } else {
    throw new Error('Cannot add node to non-existent parent.');
  }
};

// 5 of 5. Remove Data
Tree.prototype.remove = function (data, fromData, traversal) {
  var tree = this,
      parent = null,
      childToRemove = null,
      index;

  var callback = function callback(node) {
    if (node.data === fromData) parent = node;
  };

  this.contains(callback, traversal);

  if (parent) {
    index = findIndex(parent.children, data);

    if (index === undefined) {
      throw new Error('Node to remove does not exist.');
    } else {
      childToRemove = parent.children.splice(index, 1);
    }
  } else {
    throw new Error('Parent does not exist.');
  }
};

// 二叉树
var BNode = function BNode(data) {
  this.data = data;
  this.left = null;
  this.right = null;
};

var BTree = function BTree() {
  this._root = null;
};

BTree.prototype = {
  // restore constructor
  constructor: BTree,

  traverse: function traverse(process) {

    function preOrder(node) {
      if (node) {
        process.call(this, node);

        if (node.left !== null) {
          preOrder(node.left);
        }

        if (node.right !== null) {
          preOrder(node.right);
        }
      }
    }

    // help function
    // 中序
    function inOrder(node) {
      if (node) {
        // traverse the left subtree
        if (node.left !== null) {
          inOrder(node.left);
        }

        // call the process method on this node
        process.call(this, node);

        // traverse the right subtree
        if (node.right !== null) {
          inOrder(node.right);
        }
      }
    }

    // 后序
    function postOrder(node) {
      if (node) {
        if (node.left !== null) {
          postOrder(node.left);
        }

        if (node.right !== null) {
          postOrder(node.right);
        }

        process.call(this, node);
      }
    }

    // start with the root
    postOrder(this._root);
  },

  traverseDOM: function traverseDOM(process) {

    // 前序
    function preOrder(node) {
      if (node === null) return;

      process.call(this, node);

      if (node.firstElementChild) {
        preOrder(node.firstElementChild);
      }

      if (node.lastElementChild) {
        preOrder(node.lastElementChild);
      }
    }

    // 中序
    function inOrder(node) {
      if (node === null) return;

      if (node.firstElementChild) inOrder(node.firstElementChild);

      process.call(this, node);

      if (node.lastElementChild) inOrder(node.lastElementChild);
    }

    // 后序
    function postOrder(node) {
      if (node === null) return;

      if (node.firstElementChild) postOrder(node.firstElementChild);

      if (node.lastElementChild) postOrder(node.lastElementChild);

      process.call(this, node);
    }

    // 前序遍历节点
    preOrder(this._root);
  },

  add: function add(data) {
    var node = new BNode(data),
        // create a new node, place data in
    current; // used to traverse the structure

    // special case: no items in the tree yet.
    if (this._root === null) {
      this._root = node;
    } else {
      current = this._root;

      while (true) {
        // if the new value is less than this node's, go left
        if (data < current.data) {

          // if there's no left, then the new node belongs there
          if (this.left === null) {
            this.left = node;
            break;
          } else {
            current = this.left;
          }

          // if the new value is greater than this node's, go right
        } else if (data > current.data) {

            // if there's no right, then the new node belongs there
            if (this.right === null) {
              this.right = node;
              break;
            } else {
              current = this.right;
            }

            // if the new value is equal to the current node, just ignore
          } else {
              break;
            }
      }
    }
  },

  contains: function contains(data) {
    var found = false,
        current = this._root;

    // make sure there's a node to search
    while (!found && current) {
      // if the data value is less than the current node's, go left
      if (data < this.data) current = this.left;

      // if the data value is greater than the current node's, go right
      else if (data > this.data) current = this.right;

        // datas value are equal, found it
        else found = True;
    }

    // only proceed if the node was found
    return found;
  },

  // @TODO
  remove: function remove(data) {
    this.traverse(function (node) {
      if (node.data === data) {
        // remove data
      }
    });
  },

  // @TODO
  // destroy: function () {
  //   this.traverse(function (node) {
  //       delete node;
  //   });
  // },

  size: function size() {
    var length = 0;
    this.reverse(function (node) {
      length++;
    });

    return length;
  },

  toArray: function toArray() {
    var result = [];

    this.traverse(function (node) {
      result.push(node.value);
    });

    return result;
  },

  toString: function toString() {
    return this.toArray().toString();
  }
};