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


