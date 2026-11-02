
/* Deferred classic scripts retain the original shared lexical scope. */
const LazyAssets = (() => {
 const urls = {"pdfLib": "vendor/pdfLib.js", "pdfjs": "vendor/pdfjs.js", "xlsx": "vendor/xlsx.js", "jspdf": "vendor/jspdf.js", "autotable": "vendor/autotable.js", "mammoth": "vendor/mammoth.js", "zip": "vendor/zip.js", "qr": "vendor/qr.js", "fontkit": "vendor/fontkit.js"};
 const promises = new Map();
 const ready = new Set();
 const checks = {
  pdfLib:()=>!!window.PDFLib, pdfjs:()=>!!window.pdfjsLib,
  xlsx:()=>!!window.XLSX, jspdf:()=>!!window.jspdf?.jsPDF,
  autotable:()=>!!window.jspdf?.jsPDF?.API?.autoTable,
  mammoth:()=>!!window.mammoth, zip:()=>!!window.JSZip, qr:()=>!!window.QRCode,fontkit:()=>!!window.fontkit
 };
 function script(key,url,check){
  if(ready.has(key) || check?.())return Promise.resolve();
  if(promises.has(key))return promises.get(key);
  const promise=new Promise((resolve,reject)=>{
   const node=document.createElement('script');node.src=url;node.async=true;
   const timer=setTimeout(()=>fail(new Error('Script load timed out: '+key)),30000);
   function fail(error){clearTimeout(timer);node.remove();promises.delete(key);reject(error);}
   node.onerror=()=>fail(new Error('Unable to load '+key+'. Check your connection and retry.'));
   node.onload=()=>{
    clearTimeout(timer);
    if(check && !check()){fail(new Error('Library did not initialize: '+key));return;}
    ready.add(key);resolve();
   };
   document.head.append(node);
  });
  promises.set(key,promise);return promise;
 }
 async function library(key){
  if(key==='autotable')await library('jspdf');
  if(!urls[key])throw new Error('Unknown library: '+key);
  await script('lib:'+key,urls[key],checks[key]);
  if(key==='pdfjs')pdfjsLib.GlobalWorkerOptions.workerSrc='vendor/worker.js';
 }
 function module(name){return script('module:'+name,'js/'+name+'.js?v=pdfpro4');}
 const deps={
  merge:['pdfLib'],split:['pdfLib'],extract:['pdfLib'],compress:['pdfLib'],rotate:['pdfLib'],
  watermark:['pdfLib','fontkit'],pagenum:['pdfLib'],img2pdf:['pdfLib'],protect:['pdfLib'],metadata:['pdfLib'],
  pdf2jpg:['pdfjs','zip'],pdf2word:['pdfjs'],pdf2excel:['pdfjs','xlsx'],
  excel2pdf:['xlsx','autotable'],word2pdf:['mammoth','autotable']
 };
 async function forTool(id){
  if(!deps[id])throw new Error('Unknown tool: '+id);
  await Promise.all(deps[id].map(library));await module('pdf-tools');
 }
 let fontPromise;
 async function fontBytes(){return fontPromise ||= fetch('vendor/NotoSans-Regular.ttf').then(r=>{if(!r.ok)throw new Error('Font unavailable');return r.arrayBuffer();}).then(b=>new Uint8Array(b)).catch(e=>{fontPromise=null;throw e;});}
 async function pdfFont(doc){await library('fontkit');doc.registerFontkit(window.fontkit);return doc.embedFont(await fontBytes(),{subset:true});}
 async function jsFont(doc){const bytes=await fontBytes();let s='';for(let n=0;n<bytes.length;n+=8192)s+=String.fromCharCode(...bytes.subarray(n,n+8192));doc.addFileToVFS('NotoSans.ttf',btoa(s));doc.addFont('NotoSans.ttf','NotoSans','normal');doc.setFont('NotoSans');}
 let qrPromise=null;
 async function qr(){
  if(document.getElementById('qrContainer').childElementCount)return;
  if(qrPromise)return qrPromise;
  qrPromise=(async()=>{
   await library('qr');
   if(!document.getElementById('qrContainer').childElementCount)new QRCode(document.getElementById('qrContainer'),{
    text:'https://www.paypal.com/paypalme/'+CONFIG.PAYPAL,width:200,height:200,correctLevel:QRCode.CorrectLevel.H
   });
  })().catch(error=>{qrPromise=null;throw error;});
  return qrPromise;
 }
 return {library,module,forTool,qr,pdfFont,jsFont};
})();
// Capture entry points before modules replace these stubs with original functions.
(() => {
 let pending=false;
 const routes={
  openEditor:['draw-editor',['pdfLib','pdfjs']],
  openRemovePages:['remove-pages',['pdfLib']],
  openSignature:['signature-stamp',['pdfLib','pdfjs']],
  openStamp:['signature-stamp',['pdfLib','pdfjs']],
  openTextEditor:['text-editor',['pdfLib','pdfjs']]
 };
 function status(message,retry){
  let box=document.getElementById('lazyStatus');
  if(!box){box=document.createElement('div');box.id='lazyStatus';box.className='v2-notice';box.setAttribute('role','status');document.querySelector('.hero').after(box);}
  box.replaceChildren();const label=document.createElement('span');label.textContent=message;box.append(label);
  if(retry){const b=document.createElement('button');b.type='button';b.textContent=' Retry / Повторить';b.onclick=retry;box.append(b);}
 }
 for(const [name,[file,deps]] of Object.entries(routes)){
  const stub=async function(...args){
   if(pending || (typeof ProductUX!=='undefined' && ProductUX.busy()))return;
   pending=true;status('Loading tool / Загрузка инструмента…');
   try{
    await Promise.all(deps.map(LazyAssets.library));
    if(file==='draw-editor'||file==='text-editor')await LazyAssets.module('page-text');
    await LazyAssets.module(file);
    const actual=window[name];if(actual===stub)throw new Error('Tool did not initialize: '+name);
    document.getElementById('lazyStatus')?.remove();return actual(...args);
   }catch(error){status(error.message,()=>stub(...args));}
   finally{pending=false;}
  };
  window[name]=stub;
 }
})();
