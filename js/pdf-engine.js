const PdfEngine=(()=>{
 let current=null;function cancel(){current?.cancel();}
 async function run(operation,bytes,password=''){
  if(current)throw new Error('Дождитесь завершения предыдущей PDF-операции');const data=new Uint8Array(bytes).slice();
  return new Promise((resolve,reject)=>{
   const worker=new Worker('js/qpdf-worker.js?v=pdfpro4');let settled=false;
   const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timer);worker.terminate();current=null;error?reject(error):resolve(value);};
   const timer=setTimeout(()=>finish(new Error('Операция превысила 120 секунд. Попробуйте меньший файл.')),120000);
   current={cancel:()=>finish(new DOMException('Cancelled','AbortError'))};
   worker.onerror=()=>finish(new Error('Не удалось загрузить PDF-движок. Проверьте локальные файлы и откройте сайт через HTTP.'));
   worker.onmessage=e=>e.data.ok?finish(null,new Uint8Array(e.data.bytes)):finish(new Error(e.data.message));
   worker.postMessage({operation,bytes:data.buffer,password},[data.buffer]);
  });
 }
 return {run,cancel};
})();
