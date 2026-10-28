/* Menu "⋯": timer, alarm and clock live here instead of the header. Handlers are bound by id elsewhere. */
(function(){
  var dd=document.getElementById('extrasDropdown'),btn=document.getElementById('extrasBtn'),al=document.getElementById('alarmBtn');
  if(!dd||!btn)return;
  function set(o){dd.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');}
  btn.addEventListener('click',function(e){e.stopPropagation();set(!dd.classList.contains('open'));});
  document.addEventListener('click',function(e){if(!dd.contains(e.target))set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
  if(al&&window.MutationObserver){ /* ringing alarm makes the "⋯" button pulse */
    new MutationObserver(function(){btn.classList.toggle('ringing',al.classList.contains('ringing'));}).observe(al,{attributes:true,attributeFilter:['class']});
  }
  /* aria-label for icon buttons from the localized tooltip */
  function lab(){document.querySelectorAll('.icon-btn[data-tooltip],.lang-btn[data-tooltip],.donate-btn[data-tooltip]').forEach(function(el){var t=el.getAttribute('data-tooltip');if(t&&el.getAttribute('aria-label')!==t)el.setAttribute('aria-label',t);});}
  lab();
  if(window.MutationObserver)new MutationObserver(lab).observe(document.querySelector('header'),{attributes:true,subtree:true,attributeFilter:['data-tooltip']});
})();
