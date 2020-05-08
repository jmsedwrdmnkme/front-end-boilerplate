//
// Lazyload imagery
//
window.onload = function() {
  var lazyLoadInstance = new LazyLoad({
    elements_selector: 'img:not(.loaded)'
  });
}
