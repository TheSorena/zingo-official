/* تیزر تبلیغاتی زینگو — پخش خودکار، کات‌های ریتمیک، صدای شاد */
(function(){
"use strict";
var segs=[].slice.call(document.querySelectorAll('#segs i')),
capHook=document.getElementById('capHook'),capTitle=document.getElementById('capTitle'),
capSub=document.getElementById('capSub'),capBadges=document.getElementById('capBadges'),
caption=document.getElementById('caption'),screenImg=document.getElementById('screenImg'),
screenBox=screenImg.parentElement,taps=document.getElementById('taps'),
flash=document.getElementById('flash'),endcard=document.getElementById('endcard'),
soundBtn=document.getElementById('soundBtn');

var SEGS=[
 {d:4200,img:'/assets/screen1.jpg',pan:'pan-a',hook:'هنوز دنبال فیلم خوب می‌گردی؟',title:'<span class="hl">زینگو</span> اینجاست!',sub:'برنامه فیلم و سریال اندروید',taps:[{x:16,y:11}]},
 {d:4200,img:'/assets/screen1.jpg',pan:'pan-b',hook:'آرشیو همیشه به‌روز',title:'صدها فیلم و سریال',sub:'سینمایی • سریال • ادامه تماشا',taps:[{x:66,y:56}]},
 {d:4200,img:'/assets/screen2.jpg',pan:'pan-a',hook:'با زیرنویس فارسی',title:'پخش آنلاین روان',sub:'کیفیت دلخواهت رو انتخاب کن',badges:['480','720','x264'],taps:[{x:56,y:37}]},
 {d:4000,img:'/assets/screen2.jpg',pan:'pan-b',hook:'بدون کپی لینک',title:'دانلود پرسرعت',sub:'ارسال مستقیم به دانلودمنیجر',badges:['ADM','1DM','⬇'],taps:[{x:50,y:72}]}
];
var TOTAL=SEGS.reduce(function(a,s){return a+s.d;},0);
var runId=0,t0=0;

/* ---------- صدا (فقط بعد از لمس دکمه صدا) ---------- */
var AC=null,master=null,soundOn=false,bgmTimer=null,bstep=0;
function ensureAudio(){if(AC)return true;try{var C=window.AudioContext||window.webkitAudioContext;AC=new C();master=AC.createGain();master.gain.value=.8;master.connect(AC.destination);return true;}catch(e){return false;}}
function tone(f,t,dur,type,vol,slide){var o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05);}
function noise(t,dur,ftype,ffreq,vol){var len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type=ftype;f.frequency.value=ffreq;var g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t);}
function kick(t){tone(150,t,.14,'sine',.5,42);}
function snap(){if(!sfxOK())return;var t=AC.currentTime;noise(t,.07,'bandpass',2200,.35);tone(1700,t,.06,'square',.1);}
function whoosh(){if(!sfxOK())return;var t=AC.currentTime,dur=.6,len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=1;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(3500,t+dur);var g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t);}
function pop(){if(!sfxOK())return;var t=AC.currentTime;tone(880,t,.12,'triangle',.25);tone(1320,t,.08,'sine',.1);}
function jingle(){if(!sfxOK())return;var t=AC.currentTime,n=[523.25,659.25,783.99,1046.5];n.forEach(function(f,i){tone(f,t+i*.11,.5,'triangle',.22);});}
function sfxOK(){return soundOn&&AC&&AC.state==='running';}
var MEL=[659.25,783.99,880,783.99,659.25,587.33,523.25,587.33],BASS=[130.8,110,87.3,98];
function bgmTick(){if(!sfxOK())return;var t=AC.currentTime+.05,k=MEL[bstep%8];tone(k,t,.32,'triangle',.09);tone(k*2,t,.2,'sine',.03);if(bstep%2===0)kick(t);else noise(t,.05,'highpass',7000,.06);if(bstep%4===0)tone(BASS[(bstep/4|0)%4],t,1.6,'sine',.12);bstep++;}
function bgmStart(){bgmStop();bgmTimer=setInterval(bgmTick,250);}
function bgmStop(){if(bgmTimer){clearInterval(bgmTimer);bgmTimer=null;}}
soundBtn.addEventListener('click',function(){
 if(!ensureAudio())return;
 if(AC.state==='suspended')AC.resume();
 soundOn=!soundOn;master.gain.value=soundOn?.8:0;
 soundBtn.textContent=soundOn?'🔊':'🔇 با صدا ببین';soundBtn.classList.toggle('sound-off',!soundOn);
 if(soundOn&&!bgmTimer)bgmStart();
});

/* ---------- تایم‌لاین ---------- */
function wait(ms,id){return new Promise(function(res){var s=Date.now();(function step(){if(id!==runId)return res(false);if(Date.now()-s>=ms)return res(true);setTimeout(step,40);})();});}
function setCaption(s){capHook.textContent=s.hook;capTitle.innerHTML=s.title;capSub.textContent=s.sub||'';capBadges.innerHTML=(s.badges||[]).map(function(b){return '<b>'+b+'</b>';}).join('');caption.classList.remove('swap');void caption.offsetWidth;caption.classList.add('swap');}
function setScreen(src,pan){if(screenImg.getAttribute('src')!==src){screenImg.src=src;screenBox.classList.remove('xfade');void screenBox.offsetWidth;screenBox.classList.add('xfade');}screenBox.classList.remove('pan-a','pan-b');void screenBox.offsetWidth;screenBox.classList.add(pan);}
function tap(x,y){var el=document.createElement('div');el.className='tap';el.style.left=x+'%';el.style.top=y+'%';taps.appendChild(el);flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go');setTimeout(function(){el.remove();},2200);pop();}
function progLoop(){var el=(Date.now()-t0)/TOTAL,acc=0;segs.forEach(function(bar,i){var d=i<SEGS.length?SEGS[i].d:0,f=Math.max(0,Math.min((el*TOTAL-acc)/d,1));bar.style.width=(f*100)+'%';acc+=d;});if(runId) requestAnimationFrame(progLoop);}
async function run(id){
 endcard.classList.remove('on');t0=Date.now();progLoop();
 for(var i=0;i<SEGS.length;i++){var s=SEGS[i];setCaption(s);setScreen(s.img,s.pan);whoosh();
  (s.taps||[]).forEach(function(tp,k){setTimeout(function(){if(id===runId)tap(tp.x,tp.y);},900+k*1100);});
  setTimeout(function(){if(id===runId)snap();},300);
  if(!await wait(s.d,id))return;}
 endcard.classList.add('on');jingle();
}
/* پیش‌لود اسکرین دوم */
new Image().src='/assets/screen2.jpg';
runId++;run(runId);
document.getElementById('replayBtn').addEventListener('click',function(){runId++;run(runId);});
document.getElementById('replayBtn2').addEventListener('click',function(){runId++;run(runId);});
})();
