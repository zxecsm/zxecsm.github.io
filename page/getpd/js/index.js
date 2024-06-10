function _setData(key, data) {
  data = JSON.stringify({ data });
  localStorage.setItem('hello_' + key, encodeURIComponent(data));
}
function _getData(key) {
  let d = localStorage.getItem('hello_' + key);
  return d && JSON.parse(decodeURIComponent(d)).data;
}
const _msg = (function () {
  let msgArr = [];
  let zIndex = 999;
  class Msg {
    constructor(opt, callback) {
      this.message = opt.message;
      this.type = opt.type || 'info';
      this.callback = callback;
      this.duration = opt.duration || 4500;
      this.timer = null;
      this.init();
    }
    init() {
      this.el = document.createElement('div');
      let t = '';
      switch (this.type) {
        case 'info':
          t = `color: #0c5460;background-color: #d1ecf1;border-color: #bee5eb;`;
          break;
        case 'success':
          t = `background-color: #d1e7dd;color: #146c43;border-color: #c3e6cb;`;
          break;
        case 'danger':
          t = `color: #721c24;background-color: #f8d7da;border-color: #f5c6cb;`;
          break;
        case 'warning':
          t = `color: #856404;background-color: #fff3cd;border-color: #ffeeba;`;
        default:
          break;
      }
      this.el.style.cssText = `
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          max-width: 500px;
          opacity: 0;
          padding: 14px;
          border-radius: 5px;
          line-height: 20px;
          font-size: 16px;
          border: solid 1px;
          word-break: break-all;
          z-index: ${zIndex};
          ${t}`;
      this.el.innerText = this.message;
      this.show();
      this.bind();
    }
    bind() {
      this._hdEnter = this.hdEnter.bind(this);
      this._hdLeave = this.hdLeave.bind(this);
      this._hdClick = this.hdClick.bind(this);
      this.el.addEventListener('mouseenter', this._hdEnter);
      this.el.addEventListener('mouseleave', this._hdLeave);
      this.el.addEventListener('click', this._hdClick);
    }
    unbind() {
      this.el.removeEventListener('mouseenter', this._hdEnter);
      this.el.removeEventListener('mouseleave', this._hdLeave);
      this.el.removeEventListener('click', this._hdClick);
    }
    hdClick() {
      this.callback && this.callback('click');
      this.close();
    }
    hdEnter() {
      this.el.isCheck = true;
      this.el.style.zIndex = zIndex + 1;
      this.el.style.opacity = 1;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
    hdLeave() {
      this.el.style.zIndex = zIndex;
      this.el.style.opacity = 0.9;
      this.el.isCheck = false;
      this.hide();
    }
    show() {
      let top = 0;
      msgArr.forEach((item) => {
        top += item.offsetHeight + 20;
      });
      document.body.appendChild(this.el);
      msgArr.push(this.el);
      this.el.style.top = top + 'px';
      this.el.clientHeight;
      this.el.style.transition = '0.5s ease-out';
      this.el.style.marginTop = '20px';
      this.el.style.opacity = 0.9;
      this.hide();
    }
    hide() {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = null;
        this.close();
      }, this.duration);
    }
    close() {
      this.unbind();
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      let idx = msgArr.findIndex((item) => item === this.el);
      msgArr.splice(idx, 1);
      let h = this.el.offsetHeight + 20;
      this.el.style.transition = '.5s ease-out';
      this.el.style.marginTop = `-${h}px`;
      this.el.style.opacity = 0;
      let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        this.el.remove();
        this.callback && this.callback('close');
      }, 500);
      msgArr.forEach((item, i) => {
        if (item.isCheck || i < idx) return;
        let t = parseInt(item.style.top);
        item.style.transition = '0.5s ease-out';
        item.style.top = t - h + 'px';
      });
    }
  }
  return function (opt, callback) {
    new Msg(opt, callback);
  };
})();
~(function () {
  const oWrap = document.querySelector('.wrap'),
    oCheckBox = oWrap.querySelector('.check_box'),
    oChecks = [...oCheckBox.querySelectorAll('input')],
    oInputBox = oWrap.querySelector('.input_box'),
    oPdLength = oInputBox.querySelector('.pd_length'),
    oInp = oInputBox.querySelector('input'),
    oEye = oInputBox.querySelector('.eye'),
    oClear = oInputBox.querySelector('.clear'),
    oShowPd = oWrap.querySelector('.show_pd span'),
    oEnterLength = document.querySelector('.enter_length');

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    document.documentElement.classList.add('dark');
  }

  let pLen = _getData('pdlength') || 6,
    idxArr = _getData('idxarr') || [0, 1, 2, 3];
  oChecks.forEach((item, idx) => {
    if (!idxArr.includes(idx)) {
      item.checked = false;
    }
  });
  oPdLength.value = pLen;
  oPdLength.onchange = function () {
    pLen = this.value;
    _setData('pdlength', pLen);
    hdInput();
  };
  oCheckBox.onclick = function () {
    idxArr = oChecks.reduce((pre, item, i) => {
      if (item.checked == true) {
        pre.push(i);
      }
      return pre;
    }, []);
    if (idxArr.length === 0) {
      idxArr = [0];
      oChecks[0].checked = true;
    }
    _setData('idxarr', idxArr);
    hdInput();
  };
  function downEye(e) {
    e.preventDefault();
    oInp.setAttribute('type', 'text');
  }
  function upEye(e) {
    e.preventDefault();
    oInp.setAttribute('type', 'password');
  }
  oEye.onmousedown = oEye.ontouchstart = downEye;
  document.onmouseup = oEye.ontouchend = upEye;
  oClear.onclick = function () {
    oInp.value = '';
    hdInput();
  };
  function hdInput() {
    let pd = oInp.value.trim();
    if (pd === '') {
      oEye.style.display =
        oEnterLength.style.display =
        oClear.style.display =
          'none';
      oShowPd.innerText = '';
      return;
    }
    oEnterLength.innerText = pd.length;
    oEye.style.display =
      oEnterLength.style.display =
      oClear.style.display =
        'block';
    oShowPd.innerText = getPass(pd, pLen);
  }
  oInp.oninput = hdInput;
  const pdData = [
    'qwertyuiopasdfghjklzxcvbnm',
    '0123456789',
    '@#$%^&*',
    'QWERTYUIOPASDFGHJKLZXCVBNM',
  ];
  function getPass(key, plength) {
    let data = pdData.filter((item, idx) => idxArr.includes(idx));
    if (data.length === 0) {
      oChecks[0].checked = true;
      data = [pdData[0]];
    }
    plength = (32 - plength) / 2;
    let str = md5(key).slice(plength, -plength),
      total = data.join('').split(''),
      res = '',
      count = key.length % data.length;
    for (let i = 0; i < str.length; i++) {
      let uCode = str.charCodeAt(i);
      if (i > str.length - 1 - data.length) {
        count >= data.length ? (count = 0) : null;
        let arr = data[count];
        count++;
        res += arr[(uCode + i) % arr.length];
      } else {
        total.reverse();
        res += total[(uCode + i) % total.length];
      }
    }
    return res;
  }
  oShowPd.onclick = function () {
    let pd = oShowPd.innerText.trim();
    oInp.value = '';
    hdInput();
    if (pd !== '') {
      copyText(pd);
    }
  };
  async function copyText(content) {
    content = content.trim();
    try {
      if (!navigator.clipboard) {
        throw new Error();
      }
      await navigator.clipboard.writeText(content);
      _msg({ message: '复制成功', type: 'success' });
    } catch (err) {
      if (typeof document.execCommand !== 'function') {
        _msg({ message: '复制失败', type: 'danger' });
        return;
      }
      window.getSelection().removeAllRanges();
      let div = document.createElement('div'),
        range = document.createRange();
      div.innerText = content;
      div.setAttribute(
        'style',
        'position: fixed;height: 1px;fontSize: 1px;overflow: hidden;'
      );
      document.body.appendChild(div);
      range.selectNode(div);
      window.getSelection().addRange(range);
      document.execCommand('copy');
      div.remove();
      _msg({ message: '复制成功', type: 'success' });
    }
  }
})();
