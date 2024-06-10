~(function () {
  function handle(e) {
    let randomc = randomColor();
    if (!_getData('clickHeart')) {
      let box = document.createElement('div');
      box.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        z-index: 999;
        pointer-events: none;
        `;
      document.body.appendChild(box);

      box.style.left = e.clientX - 20 / 2 + 'px';
      box.style.top = e.clientY - 20 / 2 + 'px';
      box.style.backgroundColor = randomc;
      box.clientHeight;
      box.style.transition = '.8s ease-in-out';
      box.style.opacity = 0;
      box.style.transform = 'scale(2)';
      _setTimeout(() => {
        box.remove();
      }, 2000);
      return;
    }
    // 心形状
    let box1 = document.createElement('div');
    let box2 = document.createElement('div');
    let box3 = document.createElement('div');
    box1.style.cssText = `
          position: fixed;
          width: 16px;
          height: 16px;
          z-index: 999;
          pointer-events: none;
          transform: rotate(-45deg);
          `;
    box2.style.cssText = `
          position: absolute;
          top: -8px;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          `;
    box3.style.cssText = `
          position: absolute;
          left: 8px;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          `;
    box1.appendChild(box2);
    box1.appendChild(box3);
    document.body.appendChild(box1);
    box1.style.left = e.clientX - 16 / 2 + 'px';
    box1.style.top = e.clientY - 16 / 2 + 'px';
    box1.style.backgroundColor = randomc;
    box2.style.backgroundColor = randomc;
    box3.style.backgroundColor = randomc;
    box1.clientHeight;
    box1.style.transition = '2s ease-in-out';
    box1.style.opacity = 0;
    box1.style.transform = 'rotate(-55deg) translateY(-600%) scale(1.5)';
    _setTimeout(() => {
      box1.remove();
    }, 2000);
  }
  let _handle = debounce(handle, 100, true);
  document.addEventListener('mouseup', _handle);
  document.addEventListener('touchend', function (e) {
    let ev = e.changedTouches[0];
    _handle(ev);
  });
})();
