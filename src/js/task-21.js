;(function () {
  "use strict";

  var $ = function (tag) { return document.querySelector(tag);};

  var delegate = function () {
    addEventListener("keyup", function (e) {
      e = e || window.event;
      var el = e.target || e.srcElement;
      switch (el.className) {
        case 'tag-input-re':
          Tag.onkeyup(e.keyCode);
          break;
      }
    });

    addEventListener("mouseover", function (e) {
      e = e || window.event;
      var el = e.target || e.srcElement;
      switch(el.className) {
        case 'tag-item':
          Tag.onmouseover(el);
          break;
      }
    });

    addEventListener("mouseout", function (e) {
      e = e || window.event;
      var el = e.target || e.srcElement;
      switch (el.className) {
        case 'tag-item':
          Tag.onmouseout(el);
          break;
      }
    });

    addEventListener("click", function (e) {
      e = e || window.event;
      var el = e.target || e.srcElement;
      switch (el.className) {
        case 'tag-item':
          Tag.onclick(el);
          break;

        case 'hobby-submit':
          Hobby.onclick();
          break;
      }
    });
  };

  var Tag = {
    el: {
      input: $("#tag-input"),
      display: $("#tag-display"),
    },
    className: 'tag-item',
    data: [], // new Set(), // 还是用 Set ? 但是 set 没有 map 而且 set 无法从前面插入
    init: function (data) {
      this.data = this.data.concat(data);
      this.render();
    },
    getInput: function () {
      var _ = this.el.input.value.trim();
      this.el.input.value = "";
      return _.replace(/[,| |\n]/, "");
    },
    onkeyup: function (keyCode) {
      if (! [32, 13, 188].includes(keyCode))
        return ;

      var tagItem = this.getInput();
      if (! tagItem) return ;

      if (! this.data.includes(tagItem)) {
        if (this.data.length == 10)
          this.data.pop();
        this.data.unshift(tagItem);
      }
      this.render();
    },
    onmouseover: function (el) {
      el.innerText = '删除' + el.innerText;
    },
    onmouseout: function (el) {
      el.innerText = el.innerText.replace("删除", "");
    },
    onclick: function (el) {
      var index = this.data.indexOf(el.innerText.replace(/删除/g, ""));
      if (index != -1) this.data.splice(index, 1);

      el.parentNode.removeChild(el);
      // this.render();
    },
    render: function () {
      this.el.display.innerHTML = this.data.map(
        function (value) {
          return `<span class="${this.className}">${value}</span>`;
        }.bind(this)
      ).join("");
    },
  };

  var Hobby = {
    el: {
      input: $("#hobby-input"),
      display: $('#hobby-display'),
    },
    className: 'hobby-item',
    data: [],
    init: function (data) {
      this.data = this.data.concat(data);
      this.render();
    },
    getInput: function () {
      var re = /[\n|,|，|、| | |\t]/;
      var _ = this.el.input.value.trim();
      this.el.input.value = "";
      return _.split(re);
    },
    onclick: function () {
      var _data = this.getInput();
      if (_data.length === 0) return ;

      _data.forEach(v => {
        if (! v.trim()) return;
        if (this.data.length === 10) this.data.pop();
        this.data.unshift(v);
      });

      this.render();
    },
    render: function () {
      this.el.display.innerHTML = this.data.map(
        function (value) {
          return `<span class="${this.className}">${value}</span>`;
        }.bind(this)
      ).join("");
    },
  };

  function init () {
    Tag.init(['HTML5', 'JavaScript', 'CSS']);
    Hobby.init(['游泳', '瑜伽', '摄影']);
    delegate();
  }

  init();
})();
