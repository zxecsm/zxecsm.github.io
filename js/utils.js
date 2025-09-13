// 设置本地数据
function _setData(key, data) {
  data = JSON.stringify({ data });
  localStorage.setItem('hello_' + key, encodeURIComponent(data));
}
// 读取本地数据
function _getData(key) {
  let d = localStorage.getItem('hello_' + key);
  if (d === null) {
    return defaultLocalData[key];
  }
  return JSON.parse(decodeURIComponent(d)).data;
}
// 获取触发目标
function getTriggerTarget(e, opt, stopPropagation) {
  const { target = document, selector } = opt;
  let oTarget = e.target;
  const triggers = [...document.querySelectorAll(selector)];
  if (triggers.length === 0) return null;
  if (stopPropagation) {
    return triggers.find((item) => item === oTarget) || null;
  }
  while (oTarget && !triggers.find((item) => item === oTarget)) {
    if (oTarget === target) {
      oTarget = null;
    } else {
      oTarget = oTarget.parentNode;
    }
  }
  return oTarget;
}
// 打开链接
function myOpen(url, _blank) {
  if (!_blank && !url) return window.location.href;
  let a = document.createElement('a');
  a.href = url;
  _blank && (a.target = '_blank');
  document.body.appendChild(a);
  a.click();
  a.remove();
}
// 格式化时间
function formatDate(opt = {}) {
  let { template = '{0}-{1}-{2} {3}:{4}:{5}', timestamp = Date.now() } = opt;
  let date = new Date(+timestamp);
  let year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    week = date.getDay(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
  let weekArr = ['日', '一', '二', '三', '四', '五', '六'],
    timeArr = [year, month, day, hour, minute, second, week];
  return template.replace(/\{(\d+)\}/g, function () {
    let key = arguments[1];
    if (key == 6) return weekArr[timeArr[key]];
    let val = timeArr[key] + '';
    if (val == 'undefined') return '';
    return val.length < 2 ? '0' + val : val;
  });
}
// 随机数
function randomNum(x, y) {
  return Math.floor(Math.random() * (y - x + 1) + x);
}
// 随机颜色
function randomColor() {
  return `rgb(${randomNum(0, 255)},${randomNum(0, 255)},${randomNum(0, 255)})`;
}
// 定时器
function _setTimeout(callback, time) {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
    callback();
  }, time);
  return timer;
}
// 防抖
function debounce(callback, wait, immedia) {
  let timer = null,
    res = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    } else {
      if (immedia) res = callback.call(this, ...args);
    }
    timer = setTimeout(() => {
      timer = null;
      if (!immedia) res = callback.call(this, ...args);
    }, wait);
    return res;
  };
}
// 解析url
function queryURLParams(url) {
  let obj = {};
  url.replace(/([^?=&#]+)=([^?=&#]+)/g, (...[, $1, $2]) => (obj[$1] = $2));
  url.replace(/#([^?=&#]+)/g, (...[, $1]) => (obj['HASH'] = $1));
  return obj;
}
// 创建元素
function createEl(type) {
  return document.createElement(type);
}
// 创建虚拟节点
function createFragment() {
  return document.createDocumentFragment();
}
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const oImg = document.createElement('img');
    oImg.src = url;
    oImg.onload = function () {
      unBind();
      resolve(this);
    };
    oImg.onerror = function () {
      unBind();
      reject(this);
    };
    function unBind() {
      oImg.onload = null;
      oImg.onerror = null;
    }
  });
}
