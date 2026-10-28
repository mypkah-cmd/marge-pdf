/* Points the privacy/terms links at the visitor's language. */
(function(){
  var L={ru:['Политика конфиденциальности','Условия использования'],en:['Privacy Policy','Terms of Use'],lv:['Privātuma politika','Lietošanas noteikumi'],de:['Datenschutzerklärung','Nutzungsbedingungen']};
  function set(){
    var l=(document.documentElement.lang||'en').slice(0,2); if(!L[l])l='en';
    document.querySelectorAll('[data-legal]').forEach(function(a){
      var k=a.getAttribute('data-legal'); a.href=l+'/'+k+'.html';
      var s=a.querySelector('.legal-label')||a; s.textContent=L[l][k==='privacy'?0:1];
    });
  }
  set(); window.addEventListener('load',set);
  if(window.MutationObserver)new MutationObserver(set).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
