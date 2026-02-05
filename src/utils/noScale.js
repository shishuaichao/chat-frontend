


// 阻止Ctrl+滚轮缩放
document.addEventListener('wheel', function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// 阻止双指触摸缩放
document.addEventListener('touchmove', function (e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// 阻止双击事件的默认行为（针对个别顽固浏览器）
document.addEventListener('dblclick', function (e) {
  e.preventDefault(); // 取消双击的默认放大行为
}, { passive: false });