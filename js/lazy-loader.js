
/* Deferred classic scripts retain the original shared lexical scope. */
const LazyAssets = (() => {
 const urls = {"pdfLib": "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js", "pdfjs": "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "xlsx": "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js", "jspdf": "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "autotable": "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js", "mammoth": "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js", "zip": "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", "qr": "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"};
 const promises = new Map();
 const ready = new Set();
 const checks = {
  pdfLib:()=>!!window.PDFLib, pdfjs:()=>!!window.pdfjsLib,
  xlsx:()=>!!window.XLSX, jspdf:()=>!!window.jspdf?.jsPDF,
  autotable:()=>!!window.jspdf?.jsPDF?.API?.autoTable,
  mammoth:()=>!!window.mammoth, zip:()=>!!window.JSZip, qr:()=>!!window.QRCode
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
  if(key==='pdfjs')pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
 }
 function module(name){return script('module:'+name,'js/'+name+'.js'+(['page-text','draw-editor','text-editor'].includes(name)?'?v=textfix2':''));}
 const deps={
  merge:['pdfLib'],split:['pdfLib'],extract:['pdfLib'],compress:['pdfLib'],rotate:['pdfLib'],
  watermark:['pdfLib'],pagenum:['pdfLib'],img2pdf:['pdfLib'],protect:['pdfLib'],metadata:['pdfLib'],
  pdf2jpg:['pdfjs','zip'],pdf2word:['pdfjs'],pdf2excel:['pdfjs','xlsx'],
  excel2pdf:['xlsx','autotable'],word2pdf:['mammoth','jspdf']
 };
 async function forTool(id){
  if(!deps[id])throw new Error('Unknown tool: '+id);
  await Promise.all(deps[id].map(library));await module('pdf-tools');
 }
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
 return {library,module,forTool,qr};
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
