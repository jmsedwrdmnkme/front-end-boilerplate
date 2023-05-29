// import '../../node_modules/bootstrap/js/dist/alert.js';
// import '../../node_modules/bootstrap/js/dist/button.js';
// import '../../node_modules/bootstrap/js/dist/carousel.js';
import '../../node_modules/bootstrap/js/dist/collapse.js';
// import '../../node_modules/bootstrap/js/dist/dropdown.js';
// import '../../node_modules/bootstrap/js/dist/modal.js';
// import '../../node_modules/bootstrap/js/dist/offcanvas.js';
// import '../../node_modules/bootstrap/js/dist/popover.js';
// import '../../node_modules/bootstrap/js/dist/scrollspy.js';
// import '../../node_modules/bootstrap/js/dist/tab.js';
// import '../../node_modules/bootstrap/js/dist/toast.js';
// import '../../node_modules/bootstrap/js/dist/tooltip.js';
// import '../../node_modules/@popperjs/core/dist/esm/popper.js'; // Required for SOME above modules

// Update current year in site footer
document.addEventListener('DOMContentLoaded', function(event) { 
  document.querySelector('.year').innerHTML = (new Date().getFullYear());
});

let favIcon = document.createElement('link');
favIcon.rel = "shortcut icon";
favIcon.href = "data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 384 512\'%3E%3Cpath d=\'M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z\'/%3E%3C/svg%3E";
favIcon.type = "image/svg+xml";
document.head.appendChild(favIcon);

let styleSheet = document.createElement('link');
styleSheet.rel = 'stylesheet';
styleSheet.href = '/css/main.css';
document.head.appendChild(styleSheet);
