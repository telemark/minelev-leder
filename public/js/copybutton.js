function init () {
  var radios = document.querySelectorAll('.copy-button')
  Array.prototype.forEach.call(radios, function(el) {
    addListener(el, 'click', copyToClipboard)
  })
}

function copyToClipboard(e) {
  var str = ''
  e.preventDefault()
  const wrapper = e.target.previousSibling.previousSibling
  str = wrapper.innerHTML
  e.target.disabled = true
  function listener(event) {
    event.clipboardData.setData("text/html", str);
    event.clipboardData.setData("text/plain", str);
    event.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}

function addListener (element, type, func) {
  element.removeEventListener(type, func)
  element.addEventListener(type, func)
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)