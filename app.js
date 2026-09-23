// شمارنده دانلود (localStorage) + بهبود UX — بدون هیچ ردیابی خارجی
(function(){
  var KEY='zingo-dl-count';
  var btn=document.getElementById('dlBtn');
  try{
    var n=parseInt(localStorage.getItem(KEY)||'0',10);
    if(n>0 && btn){ var s=document.createElement('p'); s.className='muted'; s.textContent='تعداد دانلود شما از این مرورگر: '+n; btn.after(s); }
    if(btn){ btn.addEventListener('click',function(){ try{ localStorage.setItem(KEY,String((parseInt(localStorage.getItem(KEY)||'0',10)||0)+1)); }catch(e){} }); }
  }catch(e){}
  // باز کردن details FAQ با hash
  if(location.hash==='#faq'){ var d=document.querySelector('details'); if(d) d.open=true; }
})();
