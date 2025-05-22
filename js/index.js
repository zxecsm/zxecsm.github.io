const box = document.querySelector('#box');
const darkData = ['随系统', '已开启', '已关闭'];
const linkModeData = { row: '横向排列', col: '纵向排列' };
const inputSpeed = 100; // 输入速度（毫秒）
let skipInput = false;
let HASH = queryURLParams(myOpen()).HASH;
let enter = null;
let darkStatus = _getData('dark'),
  linkMode = _getData('linkMode'),
  inputEffect = _getData('inputEffect');
let isEnd = false;
switchDarkStatus();
// 简单HASH路由效果
if (HASH == 'setting') {
  renderHome(settingData, 0, !inputEffect);
} else {
  renderHome(data, 1, !inputEffect);
}
// 渲染主页
async function renderHome(data, hasEndWord, immediate) {
  skipInput = false;
  isEnd = false;
  box.innerHTML = '';
  const fra = createFragment();
  enter = createEnter();
  if (!immediate) {
    box.appendChild(enter);
  }
  for (let i = 0; i < data.length; i++) {
    const { cmd, res } = data[i];
    if (immediate) {
      fra.appendChild(createTitle());
    } else {
      const ntb = isNeedToBottom();
      addToBox(createTitle());
      if (ntb) {
        backToTheBottom();
      }
    }
    const item = await renderItem(cmd, res, immediate);
    if (immediate) {
      fra.appendChild(item);
    }
  }
  if (immediate) {
    fra.appendChild(createTitle());
  } else {
    const ntb = isNeedToBottom();
    addToBox(createTitle());
    if (ntb) {
      backToTheBottom();
    }
  }
  if (hasEndWord) {
    const endW = await renderCmd(endWord, immediate);
    if (immediate) {
      fra.appendChild(endW);
    }
  }
  if (immediate) {
    fra.appendChild(enter);
    box.appendChild(fra);
  }
  enter.classList.add('active');
  isEnd = true;
  skipInput = false;
}
// 渲染命令结果
async function renderItem(cmd, res, immediate) {
  const fra = createFragment();
  const cmds = await renderCmd(cmd, immediate),
    ress = await renderRes(res, immediate);
  if (immediate) {
    fra.appendChild(cmds);
    fra.appendChild(ress);
    return fra;
  }
  return Promise.resolve();
}
// 渲染命令
async function renderCmd(cmd, immediate) {
  let fra = createFragment();
  for (let i = 0; i < cmd.length; i++) {
    if (immediate) {
      fra.appendChild(createCmd(cmd[i]));
    } else {
      await spaceTime(
        () => {
          playSound('/img/key.mp3');
          const ntb = isNeedToBottom();
          addToBox(createCmd(cmd[i]));
          if (ntb) {
            backToTheBottom();
          }
        },
        skipInput ? 0 : inputSpeed
      );
    }
  }
  if (immediate) {
    return fra;
  } else {
    return Promise.resolve();
  }
}
// 渲染结果
function renderRes(res, immediate) {
  const fra = createRes(res);
  if (immediate) {
    return fra;
  }
  return spaceTime(
    () => {
      playSound('/img/enter.mp3');
      const ntb = isNeedToBottom();
      addToBox(fra);
      if (ntb) {
        backToTheBottom();
      }
    },
    skipInput ? 0 : inputSpeed
  );
}
// 添加到界面
function addToBox(el) {
  box.insertBefore(el, enter);
}
// 创建命令
function createCmd(str) {
  const oSpan = createEl('span');
  oSpan.className = 'cmd';
  oSpan.innerText = str;
  return oSpan;
}
// 创建标头
function createTitle() {
  const oSpan = createEl('span');
  oSpan.className = 'title';
  oSpan.innerText = title;
  return oSpan;
}
// 创建输入符
function createEnter() {
  const oSpan = createEl('span');
  oSpan.className = 'enter';
  return oSpan;
}
// 创建执行结果
function createRes(res) {
  const resBox = createEl('div');
  resBox.className = 'res_box';
  for (let i = 0; i < res.length; i++) {
    const { name, link, type } = res[i];
    let oDiv = null;
    if (type === 'link') {
      // 可跳转的
      oDiv = createLink(res[i], (oDiv, oSpan) => {
        if (linkMode == 'row') {
          oDiv.classList.add('link');
        }
        oSpan.classList.add('link');
        oSpan.dataset.link = link;
      });
    } else if (type === 'date') {
      // 日期
      oDiv = createDefault(type, getTime(), (oDiv) => {
        oDiv.classList.add('dateinfo');
      });
    } else if (type === 'dark') {
      // 黑暗模式
      oDiv = createLink({ ...res[i], name: darkData[darkStatus] }, (oDiv) => {
        if (linkMode == 'row') {
          oDiv.classList.add('link');
        }
        oDiv.innerText = name;
      });
    } else if (type === 'setting') {
      // 设置
      oDiv = createLink(res[i], (oDiv) => {
        if (linkMode == 'row') {
          oDiv.classList.add('link');
        }
      });
    } else if (type === 'back') {
      oDiv = createLink(res[i]);
    } else if (type === 'linkMode') {
      oDiv = createLink({ ...res[i], name: linkModeData[linkMode] }, (oDiv) => {
        if (linkMode == 'row') {
          oDiv.classList.add('link');
        }
        oDiv.innerText = name;
      });
    } else if (type == 'keySound') {
      let h = _getData('keySound');
      oDiv = createLink(
        { ...res[i], name: h ? '已开启' : '已关闭' },
        (oDiv) => {
          if (linkMode == 'row') {
            oDiv.classList.add('link');
          }
          oDiv.innerText = name;
        }
      );
    } else if (type == 'inputEffect') {
      oDiv = createLink(
        { ...res[i], name: inputEffect ? '已开启' : '已关闭' },
        (oDiv) => {
          if (linkMode == 'row') {
            oDiv.classList.add('link');
          }
          oDiv.innerText = name;
        }
      );
    } else if (type === 'text') {
      oDiv = createDefault('default', name);
    }
    if (oDiv) {
      resBox.appendChild(oDiv);
    }
  }
  return resBox;
}
// 创建默认
function createDefault(type, name, cb) {
  const oDiv = createEl('div');
  oDiv.className = 'res';
  oDiv.dataset.type = type;
  oDiv.innerText = name;
  cb && cb(oDiv);
  return oDiv;
}
// 创建链接
function createLink(obj, cb) {
  const { name, type, logo, link } = obj;
  const oDiv = createEl('div');
  oDiv.className = 'res';
  oDiv.dataset.type = type;
  oDiv.title = link || '';
  if (logo || (!logo && link)) {
    const logoEl = createEl('div');
    logoEl.className = 'logo';
    oDiv.appendChild(logoEl);
    let url = '';
    if (logo) {
      url = logo;
    } else {
      if (link) {
        url = getFavicon(link);
      }
    }
    loadImg(url)
      .then(() => {
        logoEl.style.backgroundImage = `url(${url})`;
      })
      .catch(() => {
        logoEl.style.backgroundImage = `url('../img/default-icon.png')`;
      });
  }
  const oSpan = createEl('span');
  oSpan.className = 'cursor';
  oSpan.innerText = name;
  cb && cb(oDiv, oSpan);
  oDiv.appendChild(oSpan);
  return oDiv;
}
// 输入音效
function switchKeySound() {
  let h = !_getData('keySound');
  _setData('keySound', h);
}
// 切换黑暗模式
function switchDarkStatus() {
  if (darkStatus == 1) {
    document.documentElement.classList.add('dark');
  } else if (darkStatus == 2) {
    document.documentElement.classList.remove('dark');
  } else {
    darkStatus = 0;
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  _setData('dark', darkStatus);
}
// 监听黑暗模式的变化
try {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      if (darkStatus !== 0) return;
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
} catch (error) {}
// 处理点击
box.addEventListener('click', hdClick);
function hdClick(e) {
  const t = getTriggerTarget(e, { target: this, selector: '#box .res span' });
  skipInput = true;
  if (t) {
    const type = t.parentNode.dataset.type;
    if (type == 'link') {
      const link = t.dataset.link;
      if (!link) return;
      myOpen(link, '_blank');
    } else if (type == 'dark') {
      darkStatus++;
      switchDarkStatus();
      renderHome(settingData, 0, 1);
    } else if (type == 'setting') {
      if (isEnd) {
        myOpen('/#setting');
        renderHome(settingData, 0, !inputEffect);
      }
    } else if (type == 'back') {
      if (isEnd) {
        myOpen('/#');
        renderHome(data, 1, !inputEffect);
      }
    } else if (type == 'linkMode') {
      linkMode = linkMode == 'row' ? 'col' : 'row';
      _setData('linkMode', linkMode);
      renderHome(settingData, 0, 1);
    } else if (type == 'keySound') {
      switchKeySound();
      renderHome(settingData, 0, 1);
    } else if (type == 'inputEffect') {
      inputEffect = !inputEffect;
      _setData('inputEffect', inputEffect);
      renderHome(settingData, 0, 1);
    }
  }
}
// 回到底部
function backToTheBottom() {
  box.scrollTop = box.scrollHeight;
}
// 底部判断
function isNeedToBottom() {
  const ch = box.clientHeight,
    st = box.scrollTop,
    sh = box.scrollHeight;
  return ch + st > sh - 50;
}
// 实时更新时间
setInterval(() => {
  const deteInfo = box.querySelector('.dateinfo');
  if (!deteInfo) return;
  deteInfo.innerText = getTime();
}, 1000);
// 控制输入间隔时间
function spaceTime(cb, space) {
  return new Promise((resolve) => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      resolve(cb && cb());
    }, space);
  });
}
// 浏览器切换tag时，更换图标
document.addEventListener('visibilitychange', function () {
  const icon = document.querySelector("link[rel*='icon']");
  // 页面变为不可见时触发
  if (document.visibilityState == 'hidden') {
    icon.href = '/img/icon.svg';
  }
  // 页面变为可见时触发
  if (document.visibilityState == 'visible') {
    icon.href = '/img/icon1.svg';
  }
});
// 获取时间字符串
function getTime() {
  return formatDate({
    template: '{0}-{1}-{2} {3}:{4}:{5} 星期{6}',
  });
}
