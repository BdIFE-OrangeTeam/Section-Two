/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {
  width: 0.98,
  height: 1,
  maxValue: 500,
  colors: {
    'worst': '#000',
    'bad': 'purple',
    'middle': '#F00',
    'good': '#00F',
    'verywell': '#0F0'
  },
  data: {}
};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
  // 没有选择城市
  if (pageState.nowSelectCity == -1) return;
  var city = chartData.data[pageState.nowSelectCity];
  var aqiChartWrap = document.getElementById('aqi-chart-wrap');
  var _ = '';
  for (var index in city[pageState.nowGraTime].data) {
    _ += `<div class="chart-col" title="Date:
    ${city[pageState.nowGraTime].data[index].dateStart}
    ${(city[pageState.nowGraTime].data[index].dateEnd ? '-' + city[pageState.nowGraTime].data[index].dateEnd : "")}, AQI: 
    ${city[pageState.nowGraTime].data[index].value}" style=" 
    width: ${city[pageState.nowGraTime].eachWidth * 100}%; 
    height: ${city[pageState.nowGraTime].data[index].height * 100}%; 
    left:calc(${city[pageState.nowGraTime].eachWidth * city[pageState.nowGraTime].data[index].pk * 100}% + 1%); 
    background-color: ${city[pageState.nowGraTime].data[index].backgroundColor}"></div>`;
  }

  aqiChartWrap.innerHTML = _;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  var graTimes = document.getElementsByName("gra-time");
  // 确定是否选项发生了变化
  for (var index=0; index<graTimes.length; ++index) {
    if (graTimes[index].checked) {
      if (graTimes[index].value != pageState.nowGraTime) {
        pageState.nowGraTime = graTimes[index].value;
        break;
      } else {
        return ;
      }
    }
  }
  // 设置对应数据


  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化
  var cityOptions = document.getElementById("city-select")
                            .getElementsByTagName("option");
  for (var index=0; index<cityOptions.length; ++index) {
    if (cityOptions[index].selected) {
      if (cityOptions[index].value != pageState.nowSelectCity) {
        pageState.nowSelectCity = cityOptions[index].value;
        break;
      } else {
        return ;
      }
    }
  }

  // 设置对应数据

  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio = document.getElementById("form-gra-time");
  radio.onclick = graTimeChange;
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById('city-select');
  var _ = '<option selected="selected" value="-1">选择</option>';
  for (var key in aqiSourceData) {
    _ += '<option>' + key + '</option>';
  }
  citySelect.innerHTML = _;

  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.onclick = citySelectChange;
}

/**
  * 根据污染情况去北京颜色值
  */

function getColor(aqiValue) {
  if (aqiValue < 100) {
    return chartData.colors.verywell;
  } else if (aqiValue < 200) {
    return chartData.colors.good;
  } else if (aqiValue < 300) {
    return chartData.colors.middle;
  } else if (aqiValue< 400) {
    return chartData.colors.bad;
  } else {
    return chartData.colors.worst;
  }
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  for (var index in aqiSourceData) {
    // each city
    var eachCity = aqiSourceData[index];

    // day
    var day = (function () {
      var _ = {data:{}},
          _length = 0,
          _lastDate; // 最后一天
      for (var key in eachCity) {
          _lastDate = key; // 记录最后一天

          _.data[key] = {
            pk: _length,
            dateStart: key,
            dataEnd: key,
            value: eachCity[key],
            backgroundColor: getColor(eachCity[key]),
            height: eachCity[key] / chartData.maxValue,
            // coordinate: [],
          };
          ++ _length;
      }
      // last day
      // _.data[_dateStart].dateEnd = _lastDate;
      // _.data[_dateStart].value = _tmpValue / cicleDay;
      // _.data[_dateStart].height = _.data[_dateStart].value / chartData.maxValue;

      _.length = _length;
      _.eachWidth = chartData.width / _.length;
      return _;
    })();

    // week
    var week = (function () {
      var _ = {data:{}},
          _length = 0,
          _index = 0, // 所有天数
          _tmpValue = 0,
          _dateStart,
          cicleDay = 0, // 周期的天数
          _lastDate; // 最后一天

      for (var key in eachCity) {
          _lastDate = key; // 记录最后一天
          _tmpValue += eachCity[key];
          ++cicleDay;

          // 一周开始
          if (_index === 0 || new Date(key).getDay() === 1) {
            _dateStart = key;
            _.data[_dateStart] = {
              pk: _length,
              dateStart: key,
              dateEnd: key,
            };
            ++ _length;
          }
          // 一周结束
          else if (new Date(key).getDay() === 0) {
            _.data[_dateStart].dateEnd = key;
            _.data[_dateStart].value = _tmpValue / cicleDay;
            _.data[_dateStart].backgroundColor = getColor(_.data[_dateStart].value);
            _.data[_dateStart].height = _.data[_dateStart].value / chartData.maxValue;
            _tmpValue = 0; // reset _tmpValue
            cicleDay = 0;
          }

          ++_index;
      }
      // last day
      if (new Date(_lastDate).getDay() !== 0) {
        _.data[_dateStart].dateEnd = _lastDate;
        _.data[_dateStart].value = _tmpValue / cicleDay;
        _.data[_dateStart].backgroundColor = getColor(_.data[_dateStart].value);
        _.data[_dateStart].height = _.data[_dateStart].value / chartData.maxValue;
      }

      _.length = _length;
      _.eachWidth = chartData.width / _.length;
      return _;
    })();

    // month
    var month = (function () {
      var _ = {data:{}},
          _length = 0,
          _index = 0, // 所有天数
          _tmpValue = 0,
          _dateStart,
          cicleDay = 0, // 周期的天数
          _currentDate, // 当前日期
          _nextDate, // 第二天日期
          _lastDate; // 最后一天


      for (var key in eachCity) {
          _lastDate = key; // 记录最后一天
          _tmpValue += eachCity[key];
          ++cicleDay;

          // 计算出今天、明天的日期
          _currentDate = new Date(key);
          _nextDate = new Date(key);
          _nextDate.setDate(_nextDate.getDate() + 1);

          // 月初
          if (_index === 0 || _currentDate.getDate() === 1) {
            _dateStart = key;
            _.data[_dateStart] = {
              pk: _length,
              dateStart: key,
              dateEnd: key,
            };
            ++ _length;
          }
          // 月末
          else if (_nextDate.getDate() === 1) {
            _.data[_dateStart].dateEnd = key;
            _.data[_dateStart].value = _tmpValue / cicleDay;
            _.data[_dateStart].backgroundColor = getColor(_.data[_dateStart].value);
            _.data[_dateStart].height = _.data[_dateStart].value / chartData.maxValue;
            _tmpValue = 0; // reset _tmpValue
            cicleDay = 0;
          }

          ++_index;
      }
      // last day
      if (_nextDate.getDate() !== 1) {
        _.data[_dateStart].dateEnd = _lastDate;
        _.data[_dateStart].value = _tmpValue / cicleDay;
        _.data[_dateStart].backgroundColor = getColor(_.data[_dateStart].value);
        _.data[_dateStart].height = _.data[_dateStart].value / chartData.maxValue;
      }

      _.length = _length;
      _.eachWidth = chartData.width / _.length;
      return _;
    })();

    // All
    chartData.data[index] = {day: day, week: week, month: month};
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

init();
