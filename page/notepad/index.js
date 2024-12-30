function _setData(key, data) {
  data = JSON.stringify({ data });
  localStorage.setItem('hello_' + key, encodeURIComponent(data));
}
function _getData(key) {
  const d = localStorage.getItem('hello_' + key);
  return d && JSON.parse(decodeURIComponent(d)).data;
}
let notepadDark = _getData('notepadDark') || false,
  notepadSize = _getData('notepadSize') || 18,
  notepadLine = _getData('notepadLine') || false;

const textareas = document.querySelector('textarea'),
  line = document.querySelector('.line'),
  dark = document.querySelector('.dark'),
  magnify = document.querySelector('.magnify'),
  shrink = document.querySelector('.shrink'),
  clear = document.querySelector('.clear');

textareas.value = _getData('notepad') || '';
if (textareas.value === '') {
  textareas.focus();
}
textareas.addEventListener('input', () => {
  _setData('notepad', textareas.value);
});
if (notepadDark) {
  dark.checked = true;
  document.documentElement.classList.add('dark');
}
dark.addEventListener('change', () => {
  notepadDark = !!dark.checked;
  if (notepadDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  _setData('notepadDark', notepadDark);
});
if (!notepadLine) {
  textareas.classList.add('line');
} else {
  line.checked = true;
}
line.addEventListener('change', () => {
  notepadLine = !!line.checked;
  if (notepadLine) {
    textareas.classList.remove('line');
  } else {
    textareas.classList.add('line');
  }
  _setData('notepadLine', notepadLine);
});
magnify.addEventListener('click', () => {
  notepadSize++;
  notepadSize = Math.min(notepadSize, 40);
  textareas.style.fontSize = notepadSize + 'px';
  _setData('notepadSize', notepadSize);
});
textareas.style.fontSize = notepadSize + 'px';
shrink.addEventListener('click', () => {
  notepadSize--;
  notepadSize = Math.max(notepadSize, 10);
  textareas.style.fontSize = notepadSize + 'px';
  _setData('notepadSize', notepadSize);
});
clear.addEventListener('click', () => {
  textareas.value = '';
  _setData('notepad', '');
  textareas.focus();
});
