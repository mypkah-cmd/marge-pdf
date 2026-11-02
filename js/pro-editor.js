/* Content removal export: a fresh PDF contains only the rendered page pixels. */
const SafeTextExport=(()=>{
 let cancelled=false,busy=false;
 const ru=()=>document.documentElement.lang==='ru';
 function setup(){
  let panel=document.getElementById('teExportOptions');
  if(!panel){panel=document.createElement('div');panel.id='teExportOptions';panel.className='options';panel.innerHTML='<label id="teExportLabel"></label><select id="teExportMode"><option value="safe"></option><option value="overlay"></option></select><label>DPI</label><select id="teExportDpi"><option value="216">216</option><option value="144">144</option><option value="288">288</option></select><button type="button" class="ux-button" id="teExportCancel"></button>';document.getElementById('teSaveBtn').before(panel);document.getElementById('teExportCancel').onclick=()=>{cancelled=true;};}
  document.getElementById('teExportLabel').textContent=ru()?'Как сохранять удаление и замену':'How to export removal and replacement';
  const mode=document.getElementById('teExportMode');mode.options[0].text=ru()?'Удалить старое содержимое: новый PDF из изображений':'Remove old content: a fresh image-based PDF';mode.options[1].text=ru()?'Только наложения: старый текст может остаться':'Overlays only: old text may remain';
  document.getElementById('teExportCancel').textContent=ru()?'Отменить экспорт':'Cancel export';
  const warning=document.getElementById('teVisualWarning');if(warning)warning.textContent=ru()?'Кликните по тексту, измените его или выделите область для стирания. В безопасном режиме при стирании все страницы становятся изображениями: исходный текст, формы, ссылки и скрытые объекты не переносятся. Для скана выделяйте область вручную.':'Click text to replace it, or select a region to erase. Safe removal makes all pages image-based: original text, forms, links and hidden objects are not copied. For scans, select the region manually.';
 }
 function check(){if(cancelled)throw new DOMException('Cancelled','AbortError');}
 async function run(){
  if(busy)return;if(!tePdfDoc){showStatus(textEditorStatus,t('text.needPDF'),'err');return;}
  PageText.finish();busy=true;cancelled=false;const button=document.getElementById('teSaveBtn');button.disabled=true;
  try{
   const masks=teItems.some(it=>it.kind==='whiteout'||it.kind==='redact');
   const safe=masks&&document.getElementById('teExportMode')?.value!=='overlay';
   const doc=safe?await PDFLib.PDFDocument.create():await PDFLib.PDFDocument.load(tePdfBytes.slice());
   if(safe){
    const scale=Number(document.getElementById('teExportDpi')?.value||216)/72;
    for(let n=0;n<teTotalPages;n++){
     check();showStatus(textEditorStatus,(ru()?'Безопасный экспорт страницы ':'Exporting safe page ')+(n+1)+' / '+teTotalPages,'info');await new Promise(r=>setTimeout(r,0));
     const source=await tePdfDoc.getPage(n+1),view=source.getViewport({scale}),base=source.getViewport({scale:1});
     if(view.width*view.height>24000000)throw new Error(ru()?'Слишком большая страница. Уменьшите DPI.':'Page too large. Reduce DPI.');
     const c=document.createElement('canvas');c.width=Math.ceil(view.width);c.height=Math.ceil(view.height);const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);await source.render({canvasContext:ctx,viewport:view}).promise;check();
     for(const item of teItems.filter(it=>it.page===n)){
      const factor=scale/teBaseScale;
      if(item.kind==='whiteout'||item.kind==='redact'){ctx.fillStyle=item.kind==='redact'?'#000':'#fff';ctx.fillRect(Math.floor(item.x*factor),Math.floor(item.y*factor),Math.ceil(item.w*factor)+1,Math.ceil(item.h*factor)+1);}
      else{const families={Helvetica:'Arial, sans-serif',TimesRoman:'"Times New Roman", serif',Courier:'"Courier New", monospace'};ctx.font=(item.italic?'italic ':'')+(item.bold?'bold ':'')+(item.size*scale)+'px '+(families[item.font]||'sans-serif');ctx.fillStyle=item.color||'#111';ctx.textBaseline='alphabetic';String(item.text).split('\n').forEach((line,i)=>ctx.fillText(line,item.x*factor,item.y*factor+i*item.size*scale*1.25));}
     }
     const image=await doc.embedPng(c.toDataURL('image/png'));doc.addPage([base.width,base.height]).drawImage(image,{x:0,y:0,width:base.width,height:base.height});c.width=c.height=0;source.cleanup();
    }
   }else{
    const fonts={};
    async function fontFor(item){
     if(/[^\u0000-\u00ff]/.test(item.text))return fonts.unicode ||= await LazyAssets.pdfFont(doc);
     const families={Helvetica:['Helvetica','HelveticaBold','HelveticaOblique','HelveticaBoldOblique'],TimesRoman:['TimesRoman','TimesRomanBold','TimesRomanItalic','TimesRomanBoldItalic'],Courier:['Courier','CourierBold','CourierOblique','CourierBoldOblique']};
     const names=families[item.font]||families.Helvetica;const name=names[(item.bold?1:0)+(item.italic?2:0)];return fonts[name] ||= await doc.embedFont(PDFLib.StandardFonts[name]);
    }
    for(const item of teItems){check();const page=doc.getPage(item.page),h=page.getHeight(),scale=teBaseScale;
     if(item.kind==='whiteout'||item.kind==='redact')page.drawRectangle({x:item.x/scale,y:h-(item.y+item.h)/scale,width:item.w/scale,height:item.h/scale,color:item.kind==='redact'?PDFLib.rgb(0,0,0):PDFLib.rgb(1,1,1)});
     else{const color=(item.color||'#111111').replace('#','');page.drawText(item.text,{font:await fontFor(item),x:item.x/scale,y:h-item.y/scale,size:item.size,color:PDFLib.rgb(parseInt(color.slice(0,2),16)/255,parseInt(color.slice(2,4),16)/255,parseInt(color.slice(4,6),16)/255)});}
    }
   }
   check();const bytes=await doc.save();check();downloadBlob(new Blob([bytes],{type:'application/pdf'}),safe?'text-replaced-safe.pdf':'text-edited.pdf');showStatus(textEditorStatus,safe?(ru()?'Готово. Новый PDF содержит изображения страниц; исходного текстового слоя в нём нет.':'Done. The new PDF contains page images without the original text layer.'):t('common.done'),'ok');
  }catch(error){showStatus(textEditorStatus,error.name==='AbortError'?(ru()?'Экспорт отменён':'Export cancelled'):t('common.error')+error.message,error.name==='AbortError'?'info':'err');}
  finally{busy=false;button.disabled=false;}
 }
 return {setup,run,cancel:()=>{cancelled=true;},busy:()=>busy};
})();
