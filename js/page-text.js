// Direct text input styles travel with the module, independent of cached CSS.
(() => {if(document.getElementById('pageTextStyleV2'))return;const style=document.createElement('style');style.id='pageTextStyleV2';style.textContent=`.page-direct-text:empty::before{content:attr(data-placeholder);color:#737373;opacity:.75;pointer-events:none}.page-direct-text{user-select:text!important;-webkit-user-select:text!important}.page-direct-text:focus{outline:1px dashed #6554e8!important}`;document.head.append(style);})();

// Direct page typing. A transparent editable span shares the canvas baseline.
window.PageText = (() => {
 let active=null;
 function finish(cancel=false){if(active)active(cancel);}
 function start({canvas,parent,x,y,font,color,value='',select=false,commit,cancel}){
  finish();
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  const r=canvas.getBoundingClientRect(),p=parent.getBoundingClientRect();
  const sx=r.width/canvas.width,sy=r.height/canvas.height;
  const el=document.createElement('span');el.className='page-direct-text';
  el.contentEditable='true';el.spellcheck=false;el.setAttribute('role','textbox');
  el.setAttribute('aria-label',document.documentElement.lang==='ru'?'Текст на странице PDF':'Text on PDF page');
  el.style.cssText='position:absolute;display:inline-block;z-index:100;min-width:80px;min-height:1em;background:transparent;border:0;padding:0;margin:0;white-space:pre;line-height:normal;outline:1px dashed #6554e8;cursor:text;user-select:text;';
  el.dataset.placeholder=document.documentElement.lang==='ru'?'Введите текст':'Type here';
  el.style.font=font;el.style.color=color;el.style.caretColor=color;
  el.style.transform=`scale(${sx},${sy})`;el.style.transformOrigin='top left';
  el.style.left=(r.left-p.left+parent.scrollLeft-parent.clientLeft+x*sx)+'px';
  el.style.top='0px';el.textContent=value;
  // A zero-height inline marker measures the browser's actual text baseline.
  const marker=document.createElement('i');marker.style.cssText='display:inline-block;width:0;height:0;padding:0;margin:0;vertical-align:baseline;';
  el.append(marker);parent.append(el);
  const baseline=(marker.getBoundingClientRect().top-el.getBoundingClientRect().top)/sy;
  marker.remove();el.style.top=(r.top-p.top+parent.scrollTop-parent.clientTop+(y-baseline)*sy)+'px';
  let done=false,composing=false;
  function end(abort=false){
   if(done)return;done=true;active=null;
   const text=el.textContent.replace(/[\r\n]+/g,' ');el.remove();
   if(abort)cancel?.();else commit(text);
  }
  active=end;
  el.addEventListener('blur',()=>end());
  ['pointerdown','mousedown','touchstart','keyup'].forEach(name=>el.addEventListener(name,e=>e.stopPropagation()));
  el.addEventListener('compositionstart',()=>composing=true);
  el.addEventListener('compositionend',()=>composing=false);
  el.addEventListener('keydown',e=>{
   e.stopPropagation();if(composing||e.isComposing)return;
   if(e.key==='Enter'){e.preventDefault();end();}
   if(e.key==='Escape'){e.preventDefault();end(true);}
  });
  el.addEventListener('paste',e=>{
   e.preventDefault();const text=e.clipboardData.getData('text/plain').replace(/[\r\n]+/g,' ');
   const selection=window.getSelection();if(!selection.rangeCount)return;
   const range=selection.getRangeAt(0);range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range);
  });
  el.focus({preventScroll:true});const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(el);if(!select)range.collapse(false);selection.removeAllRanges();selection.addRange(range);
  setTimeout(()=>{if(!done)el.focus({preventScroll:true});},0);
  return el;
 }
 window.addEventListener('resize',()=>finish());
 window.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey)finish();},{capture:true,passive:true});
 return {start,finish};
})();
