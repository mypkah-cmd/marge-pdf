// Custom donation: open the existing recipient link without a fixed amount.
(() => {
 const copy = {
  ru:['Своя сумма','Укажите сумму на странице PayPal'],
  en:['Custom amount','Enter your amount on the PayPal page'],
  lv:['Cita summa','Norādiet summu PayPal lapā'],
  de:['Eigener Betrag','Betrag auf der PayPal-Seite eingeben']
 };
 const link=document.getElementById('donateCustomLink');
 link.href='https://www.paypal.com/paypalme/'+CONFIG.PAYPAL;
 function update(){
  const labels=copy[document.documentElement.lang] || copy.en;
  document.getElementById('donateCustomTitle').textContent=labels[0];
  document.getElementById('donateCustomDesc').textContent=labels[1];
 }
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 update();
})();

