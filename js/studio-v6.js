(()=>{'use strict';
const ready=()=>{for(const [prefix,contentId] of [['editor','editorContent'],['textEditor','textEditorContent']]){
const content=document.getElementById(contentId);if(!content)return;
const tools=content.querySelector('.studio-tools'),props=content.querySelector('.studio-properties'),footer=content.querySelector('.studio-footer');if(!tools||!props||!footer||content.querySelector('.studio-right-dock'))continue;
const dock=document.createElement('aside');dock.className='studio-right-dock';dock.setAttribute('aria-label','Editor tools and properties');
const head=document.createElement('div');head.className='studio-dock-controls';const title=document.createElement('span');title.textContent='Tools / Инструменты';const toggle=document.createElement('button');toggle.type='button';toggle.textContent='▦';toggle.title='Grid / list / compact';toggle.setAttribute('aria-label','Change tool layout');head.append(title,toggle);
const grip=document.createElement('div');grip.className='studio-dock-resizer';grip.setAttribute('role','separator');grip.setAttribute('aria-label','Resize tools panel');grip.setAttribute('aria-orientation','vertical');grip.tabIndex=0;
dock.append(head,tools,props,footer,grip);content.append(dock);
const exp=document.getElementById('teExportOptions');if(prefix==='textEditor'&&exp){props.append(exp);}
const key='marge-studio-dock-width';let w=Number(localStorage.getItem(key));if(Number.isFinite(w)&&w>=230&&w<=650)content.style.setProperty('--dock-width',w+'px');
const modeKey='marge-studio-dock-mode';const modes=['','compact','list'];let mode=modes.indexOf(localStorage.getItem(modeKey)||'');if(mode<0)mode=0;dock.classList.toggle('compact',mode===1);dock.classList.toggle('list',mode===2);toggle.addEventListener('click',()=>{mode=(mode+1)%3;dock.classList.toggle('compact',mode===1);dock.classList.toggle('list',mode===2);localStorage.setItem(modeKey,modes[mode]);});
function setWidth(v){const max=Math.min(650,Math.max(230,content.getBoundingClientRect().width-240));const width=Math.max(230,Math.min(max,Math.round(v)));content.style.setProperty('--dock-width',width+'px');localStorage.setItem(key,String(width));}
let startX=0,startWidth=0;grip.addEventListener('pointerdown',e=>{if(e.button!==0)return;startX=e.clientX;startWidth=dock.getBoundingClientRect().width;grip.setPointerCapture(e.pointerId);e.preventDefault();});grip.addEventListener('pointermove',e=>{if(!grip.hasPointerCapture(e.pointerId))return;setWidth(startWidth+startX-e.clientX);});grip.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){setWidth(dock.getBoundingClientRect().width+(e.key==='ArrowLeft'?20:-20));e.preventDefault();}});
for(const b of dock.querySelectorAll('button')){b.style.touchAction='manipulation';}
}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();})();