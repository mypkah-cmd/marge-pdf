/* Isolated, one-job QPDF runtime. No files or passwords leave the browser. */
importScripts('../vendor/qpdf/qpdf.js');
self.onmessage=async event=>{
 const {operation,bytes,password}=event.data;let log=[];
 try{
  const q=await Module({locateFile:()=>new URL('../vendor/qpdf/qpdf.wasm',self.location.href).href,noInitialRun:true,noExitRuntime:true,print:()=>{},printErr:line=>{if(log.length<12)log.push(String(line));}});
  q.FS.writeFile('/input.pdf',new Uint8Array(bytes));let args;
  if(operation==='encrypt'){
   if(typeof password!=='string'||!password.length)throw new Error('Password required');
   const owner=Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
   args=['/input.pdf','--encrypt',password,owner,'256','--','/output.pdf'];
  }else if(operation==='decrypt')args=['--password='+String(password||''),'--decrypt','/input.pdf','/output.pdf'];
  else if(operation==='optimize')args=['/input.pdf','--object-streams=generate','--stream-data=compress','--recompress-flate','--compression-level=9','/output.pdf'];
  else throw new Error('Unknown PDF engine operation');
  let code;try{code=q.callMain(args);}catch(error){if(error.name==='ExitStatus')code=error.status;else throw error;}
  if(code!==0&&code!==3)throw new Error(log.join('\n')||'PDF processing failed');
  const result=q.FS.readFile('/output.pdf').slice();if(result.length<8)throw new Error('Empty PDF result');
  q.FS.unlink('/input.pdf');q.FS.unlink('/output.pdf');self.postMessage({ok:true,bytes:result.buffer},[result.buffer]);
 }catch(error){let message=String(error.message||error);if(password)message=message.split(password).join('[password]');self.postMessage({ok:false,message:/password/i.test(message)?'Неверный пароль или защищённый документ. Проверьте пароль исходного PDF.':message});}
};
