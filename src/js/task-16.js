/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
// var aqiData = {};
var aqiList = [
  // '<tr><td>北京</td><td>90</td><td><button class="del-btn">删除</button></td></tr>',
];

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var aqiCityLabel = document.getElementById("aqi-city-input"),
      aqiValueLabel = document.getElementById("aqi-value-input"),
      aqiCityError = document.getElementById("aqi-city-error"),
      aqiValueError = document.getElementById("aqi-value-error"),
      aqiCityName = aqiCityLabel.value.trim(),
      aqiValue = aqiValueLabel.value.trim();

  // 城市名称条件判断
  if (! aqiCityName) {
    aqiCityError.innerHTML = "不能为空";
    aqiCityError.style.display = "inline-block";
    return ;
  }
  // 城市名称条件判断
  if (! /^[\u4e00-\u9fa5a-zA-Z]+$/.test(aqiCityName)) {
    aqiCityError.innerHTML = "必须为中英文字符";
    aqiCityError.style.display = "inline-block";
    return ;
  }
  // 隐藏城市名称错误提示
  aqiCityError.style.display = "none";

  // 污染值条件判断
  if (! aqiValue) {
    aqiValueError.innerHTML = "不能为空";
    aqiValueError.style.display = "inline-block";
    return ;
  }

  // 污染值条件判断
  if (! /^\d+$/.test(aqiValue)) {
    aqiValueError.innerHTML = "必须为整数";
    aqiValueError.style.display = "inline-block";
    return ;
  }
  // 隐藏污染错误提示
  aqiValueError.style.display = "none";

  // 重置输入
  aqiCityLabel.value = "";
  aqiValueLabel.value = "";

  // aqiData[aqiCityName] = aqiValue;
  // 渲染数组
  aqiList.push('<tr><td>'+aqiCityName+'</td><td>'+aqiValue+'</td><td><button class="del-btn">删除</button></td></tr>');
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var aqiTableLabel = document.getElementById("aqi-table");

  if (aqiList.length > 0) {
    aqiTableLabel.innerHTML = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>' + aqiList.join("");

    var delBtns = document.getElementsByClassName("del-btn");
    for (var index=0; index < delBtns.length; ++index) {
      delBtns[index].onclick = delBtnHandle;
    }
  } else {
      aqiTableLabel.innerHTML = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
  }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  var delRow = event.target.parentElement.parentElement.outerHTML;
  aqiList.map(function (item, index) {
    if (item == delRow) {
      aqiList.splice(index, 1);
    }
  });
  renderAqiList();
}

function init() {
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById("add-btn").onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
}

init();
