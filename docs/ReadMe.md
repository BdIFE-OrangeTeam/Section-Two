# 学习资料

### 任务十三：零基础JavaScript编码（一）
* [JavaScript入门篇](http://www.imooc.com/view/36)
* [MDN JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

```
1. addEventListener 和 attachEvent 的区别: http://www.itxueyuan.org/view/5225.html
    * addEventListener: el.addEventListener(type, listener, userCapture);
    * attachEvent: el.attachEvent(type, listener);

2:  addEventListener 和 onclick 的区别: http://jasinyip.com/WebFE/dom0vsdom2.html
```

### 任务十六：零基础JavaScript编码（四）
* [事件冒泡机制]()
* [事件代理和委托](http://blog.csdn.net/majian_1987/article/details/8591385)

### 任务十七: 零基础JavaScript编码（五）
* [多行模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Text_formatting)
    * 变量嵌入: ${variable}
    * 表达式计算: ${2 * variable - variable}
* [数组操作](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections)
    * forEach(callback)
    * map(callback)
    * filter(callback)
    * every(callback)
    * some(callback)
    * reduce(callback) / reduceRight(callback)

* [Map]()
    * 键值对
    * 初始化: var aMap = new Map();
    * (与 Object类似, 下面是Map的)
    * .size (优势)
    * .set(key, value)
    * .get(key)
    * .has(key)
    * .delete(key)

* [Set]()
    * 集合, 元素唯一
    * .add(value)
    * .has(value)
    * .delete(value)
    * .size

* [Object]()
    * 使用对象初始化器(或叫对象字面量): {}
    * 使用构造函数: 事实上就是一个函数
    * 使用 [Object.create](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/create) 方法
    * 通过 this 引用对象

```
// DOM, NodeList,
// nodeLists = document.getElementsByTagName()
Array.prototype.forEach.call(nodeLists, function (item) {
    console.log(item);
});
```

### 任务二十二：JavaScript和树（一）
* [原型编程与面向对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript)
* 阮一峰
  * [Javascript 面向对象编程（一）：封装](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html)
  * [Javascript面向对象编程（二）：构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)
  * [Javascript面向对象编程（三）：非构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance_continued.html)
* [数据结构和算法 二叉树](https://segmentfault.com/a/1190000000740261)
* [Data Structures With JavaScript: Tree](http://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393)
* [Computer science in JavaScript: Binary search tree](https://www.nczonline.net/blog/2009/06/09/computer-science-in-javascript-binary-search-tree-part-1/)
* [练习Javascript](http://ife.baidu.com/task/detail?taskId=22)
