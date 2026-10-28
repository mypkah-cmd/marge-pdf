/* Landing CTAs link to index.html#<toolId>: open that tool on load. */
(function(){
  function go(){
    var id=(location.hash||'').slice(1); if(!id)return;
    try{
      if(typeof TOOLS==='undefined')return;
      var i=TOOLS.findIndex(function(t){return t.id===id;}); if(i<0)return;
      var cards=document.querySelectorAll('#toolsGrid .tool-card'); if(cards[i])cards[i].click();
    }catch(_){}
  }
  window.addEventListener('load',function(){setTimeout(go,300);});
  window.addEventListener('hashchange',go);
})();
