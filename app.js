// تغییر تم روشن/تیره + شمارنده دانلود — بدون هیچ ردیابی خارجی
(function(){
  // تم
  var btn=document.getElementById('themeBtn');
  function setTheme(t){
    document.documentElement.dataset.theme=t;
    try{localStorage.setItem('zingo-theme',t);}catch(e){}
    var m=document.querySelector('meta[name="theme-color"]');
    if(m)m.setAttribute('content',t==='dark'?'#0B0806':'#FFF9F3');
  }
  if(btn){btn.addEventListener('click',function(){
    setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  });}
  // شمارنده دانلود (localStorage)
  var KEY='zingo-dl-count';
  var dl=document.getElementById('dlBtn');
  try{
    var n=parseInt(localStorage.getItem(KEY)||'0',10);
    if(n>0 && dl){var s=document.createElement('p');s.className='muted small';s.textContent='تعداد دانلود شما از این مرورگر: '+n;dl.closest('.cta-row').after(s);}
    if(dl){dl.addEventListener('click',function(){try{localStorage.setItem(KEY,String((parseInt(localStorage.getItem(KEY)||'0',10)||0)+1));}catch(e){}});}
  }catch(e){}
  if(location.hash==='#faq'){var d=document.querySelector('details');if(d)d.open=true;}
})();
