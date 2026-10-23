
(() => {
 const labels={"ru": [["QR-код на PDF", "Добавить QR-код на выбранные страницы."], ["Копия без пароля", "Копия без пароля через изображения страниц."], ["Счётчик страниц/слов", "Страницы и слова извлекаемого текста, без OCR."]], "en": [["QR code on PDF", "Place a QR code on selected pages."], ["Unlock PDF", "Password-free image-based copy."], ["Page / word count", "Count pages and extracted words, without OCR."]], "lv": [["QR kods PDF failā", "Pievienot QR kodu atlasītām lappusēm."], ["Kopija bez paroles", "Kopija bez paroles no lappušu attēliem."], ["Lappušu / vārdu skaits", "Lappuses un teksta vārdi bez OCR."]], "de": [["QR-Code auf PDF", "QR-Code auf ausgewählten Seiten einfügen."], ["Kopie ohne Passwort", "Passwortfreie Kopie aus Seitenbildern."], ["Seiten / Wörter zählen", "Seiten und extrahierte Wörter, ohne OCR."]]};
 const ids=['qrpdf','unlockcopy','pdfcount'];
 for(const [lang,rows] of Object.entries(labels))rows.forEach((row,i)=>{
  translations[lang]['tool.'+ids[i]+'.name']=row[0];translations[lang]['tool.'+ids[i]+'.desc']=row[1];
 });
 ids.forEach((id,i)=>TOOLS.push({id,icon:['▦','🔓','🔢'][i]}));
 const previous=window.openTool;
 window.openTool=async function(tool){
  if(!ids.includes(tool.id))return previous.apply(this,arguments);
  if(ProductUX.busy())return;
  try{await LazyAssets.module('extra-tools');ExtraTools.open(tool.id);}
  catch(error){alert(error.message);}
 };
 renderTools();
})();
