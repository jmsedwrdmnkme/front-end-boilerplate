// Update current year in site footer
document.addEventListener('DOMContentLoaded', function(event) { 
  document.querySelector('.year').innerHTML = (new Date().getFullYear());
});
