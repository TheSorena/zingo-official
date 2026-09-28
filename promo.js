/* تیزر زینگو — موتور افترافکتی: کات پانچی، پارالاکس، ذرات، صدای شاد */
(function(){
"use strict";
var ad=document.getElementById('ad'),stage=document.getElementById('stage'),
segs=[].slice.call(document.querySelectorAll('#segs i')),
capHook=document.getElementById('capHook'),capTitle=document.getElementById('capTitle'),
capSub=document.getElementById('capSub'),capBadges=document.getElementById('capBadges'),
caption=document.getElementById('caption'),screenImg=document.getElementById('screenImg'),
screenBox=screenImg.parentElement,phone=document.getElementById('phone'),
taps=document.getElementById('taps'),flash=document.getElementById('flash'),
endcard=document.getElementById('endcard'),soundBtn=document.getElementById('soundBtn'),
wipe=document.getElementById('wipe'),fx=document.getElementById('fx'),
audioPop=document.getElementById('audioPop'),apSub=document.getElementById('apSub'),
apItems=[].slice.call(audioPop.querySelectorAll('li'));

var SEGS=[
 {d:4200,img:'/assets/screen1.jpg',pan:'pan-a',hook:'هنوز دنبال فیلم خوب می‌گردی؟',title:[['زینگو',1],['اینجاست!',0]],sub:'برنامه فیلم و سریال اندروید',taps:[{x:16,y:11}]},
 {d:4200,img:'/assets/screen1.jpg',pan:'pan-b',hook:'آرشیو همیشه به‌روز',title:[['صدها',0],['فیلم',0],['و',0],['سریال',1]],sub:'سینمایی • سریال • ادامه تماشا',taps:[{x:66,y:56}]},
 {d:4200,img:'/assets/screen2.jpg',pan:'pan-a',hook:'با زیرنویس فارسی',title:[['پخش',0],['آنلاین',1],['روان',0]],sub:'کیفیت دلخواهت رو انتخاب کن',badges:['480','720','x264'],taps:[{x:56,y:37}]},
 {d:4600,img:'/assets/screen2.jpg',pan:'pan-b',hook:'صدا و زیرنویس به زبون خودت',title:[['انگلیسی؟',0],['فارسی؟',0],['ژاپنی؟',1]],sub:'ترک صوتی رو با یه لمس عوض کن',badges:['EN','FA','JA'],audioDemo:true,taps:[]},
 {d:4000,img:'/assets/screen2.jpg',pan:'pan-b',hook:'بدون کپی لینک',title:[['دانلود',1],['پرسرعت',0]],sub:'ارسال مستقیم به دانلودمنیجر',badges:['ADM','1DM','⬇'],taps:[{x:50,y:60}]}
];
var TOTAL=SEGS.reduce(function(a,s){return a+s.d;},0);
var runId=0,t0=0,segToken=0;

/* ---------- صدا ---------- */
var AC=null,master=null,soundOn=false,bgmTimer=null,bstep=0;
function ensureAudio(){if(AC)return true;try{var C=window.AudioContext||window.webkitAudioContext;AC=new C();master=AC.createGain();master.gain.value=.8;master.connect(AC.destination);return true;}catch(e){return false;}}
function sfxOK(){return soundOn&&AC&&AC.state==='running';}
function tone(f,t,dur,type,vol,slide){var o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05);}
function noise(t,dur,ftype,ffreq,vol){var len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type=ftype;f.frequency.value=ffreq;var g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t);}
function kick(t){tone(150,t,.14,'sine',.5,42);}
function boom(){if(!sfxOK())return;var t=AC.currentTime;tone(95,t,.6,'sine',.55,28);noise(t,.25,'lowpass',500,.3);}
function snap(){if(!sfxOK())return;var t=AC.currentTime;noise(t,.07,'bandpass',2200,.35);tone(1700,t,.06,'square',.1);}
function whoosh(){if(!sfxOK())return;var t=AC.currentTime,dur=.55,len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=1;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(3800,t+dur);var g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t);}
function riser(dur){if(!sfxOK())return;dur=dur||1.1;var t=AC.currentTime,len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*(i/len);var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(6000,t+dur);var g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32,t+dur);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.05);s.connect(f);f.connect(g);g.connect(master);s.start(t);}
function pop(){if(!sfxOK())return;var t=AC.currentTime;tone(880,t,.12,'triangle',.25);tone(1320,t,.08,'sine',.1);}
function jingle(){if(!sfxOK())return;var t=AC.currentTime,n=[523.25,659.25,783.99,1046.5];n.forEach(function(f,i){tone(f,t+i*.11,.5,'triangle',.22);});}
var MEL=[659.25,783.99,880,783.99,659.25,587.33,523.25,587.33],BASS=[130.8,110,87.3,98];
function bgmTick(){if(!sfxOK())return;var t=AC.currentTime+.05,k=MEL[bstep%8];tone(k,t,.32,'triangle',.09);tone(k*2,t,.2,'sine',.03);if(bstep%2===0)kick(t);else noise(t,.05,'highpass',7000,.06);if(bstep%4===0)tone(BASS[(bstep/4|0)%4],t,1.6,'sine',.12);bstep++;}
function bgmStart(){if(bgmTimer)clearInterval(bgmTimer);bgmTimer=setInterval(bgmTick,250);}
soundBtn.addEventListener('click',function(){
 if(!ensureAudio())return;
 if(AC.state==='suspended')AC.resume();
 soundOn=!soundOn;master.gain.value=soundOn?.8:0;
 soundBtn.textContent=soundOn?'🔊':'🔇 با صدا ببین';soundBtn.classList.toggle('sound-off',!soundOn);
 if(soundOn&&!bgmTimer)bgmStart();
});

/* ---------- ذرات: اخگر محیطی + کانفتی پایان ---------- */
var ctx=fx.getContext('2d'),P=[],W=0,H=0,playing=false;
function sizeFx(){W=fx.width=ad.clientWidth;H=fx.height=ad.clientHeight;}
window.addEventListener('resize',sizeFx);sizeFx();
function ember(){P.push({k:'e',x:Math.random()*W,y:H+12,vx:(Math.random()-.5)*.5,vy:-.5-Math.random()*1.1,l:.7,d:.004,r:1+Math.random()*2.4,c:'230,110,20'});}
function confetti(x,y){var cols=['255,90,25','255,170,40','255,210,110','120,200,80','90,150,255'];for(var i=0;i<110;i++){var a=Math.random()*Math.PI*2,s=3+Math.random()*8;P.push({k:'c',x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-5,l:1,d:.008+Math.random()*.01,w:4+Math.random()*6,h:3+Math.random()*4,r:Math.random()*Math.PI,vr:(Math.random()-.5)*.3,c:cols[i%cols.length]});}}
var lastE=0;
function loop(ts){ctx.clearRect(0,0,W,H);P=P.filter(function(p){return p.l>0;});
 P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.k==='c'){p.vy+=.22;p.r+=p.vr;}else p.vy-=.002;p.l-=p.d;
  ctx.save();ctx.globalAlpha=Math.max(p.l,0);
  if(p.k==='c'){ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle='rgb('+p.c+')';ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
  else{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fillStyle='rgba('+p.c+','+Math.max(p.l,0)*.6+')';ctx.fill();}
  ctx.restore();});
 if(playing&&ts-lastE>220){ember();lastE=ts;}
 requestAnimationFrame(loop);}
requestAnimationFrame(loop);

/* ---------- پارالاکس گوشی ---------- */
ad.addEventListener('pointermove',function(e){var r=ad.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;phone.style.setProperty('--ry',(dx*10)+'deg');phone.style.setProperty('--rx',(-dy*8)+'deg');});

/* ---------- تایم‌لاین ---------- */
function wait(ms,id){return new Promise(function(res){var s=Date.now();(function step(){if(id!==runId)return res(false);if(Date.now()-s>=ms)return res(true);setTimeout(step,40);})();});}
function setCaption(s){capHook.textContent=s.hook;
 capTitle.innerHTML=s.title.map(function(w,i){return '<span class="w" style="--i:'+i+(w[1]?';color:#FF4D1C':'')+'">'+w[0]+'</span>';}).join(' ');
 capSub.textContent=s.sub||'';
 capBadges.innerHTML=(s.badges||[]).map(function(b,i){return '<b style="--i:'+i+'">'+b+'</b>';}).join('');
 caption.classList.remove('swap');void caption.offsetWidth;caption.classList.add('swap');}
function setScreen(src,pan){if(screenImg.getAttribute('src')!==src){screenImg.src=src;screenBox.classList.remove('swapimg');void screenBox.offsetWidth;screenBox.classList.add('swapimg');}screenBox.classList.remove('pan-a','pan-b');void screenBox.offsetWidth;screenBox.classList.add(pan);}
function cutFX(){wipe.classList.remove('go');void wipe.offsetWidth;wipe.classList.add('go');
 stage.classList.remove('punch');void stage.offsetWidth;stage.classList.add('punch');
 phone.classList.remove('cut');void phone.offsetWidth;phone.classList.add('cut');}
function tap(x,y){var el=document.createElement('div');el.className='tap';el.style.left=x+'%';el.style.top=y+'%';taps.appendChild(el);flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go');setTimeout(function(){el.remove();},2300);pop();}
var LANGS=[{sub:'Where are you going?',y:79},{sub:'من که هیچ جا نمیرم',y:87},{sub:'どこにも行かない',y:94}];
function hideAudio(){audioPop.classList.remove('show');apItems.forEach(function(li){li.classList.remove('active');});}
function runAudioDemo(id,tk){audioPop.classList.add('show');var k=0;(function step(){if(id!==runId||tk!==segToken)return;var L=LANGS[k%3];apItems.forEach(function(li,j){li.classList.toggle('active',j===(k%3));});apSub.textContent=L.sub;apSub.classList.remove('flip');void apSub.offsetWidth;apSub.classList.add('flip');tap(50,L.y);k++;setTimeout(step,1300);})();}
function progLoop(){var el=(Date.now()-t0)/TOTAL,acc=0;segs.forEach(function(bar,i){var d=i<SEGS.length?SEGS[i].d:0,f=Math.max(0,Math.min((el*TOTAL-acc)/d,1));bar.style.width=(f*100)+'%';acc+=d;});if(runId)requestAnimationFrame(progLoop);}
async function run(id){
 endcard.classList.remove('on');hideAudio();playing=true;t0=Date.now();progLoop();
 for(var i=0;i<SEGS.length;i++){var s=SEGS[i];setCaption(s);setScreen(s.img,s.pan);cutFX();whoosh();
  if(i===SEGS.length-1)setTimeout(function(){if(id===runId)riser(1.2);},s.d-1400);
  if(s.audioDemo){runAudioDemo(id,++segToken);}else{hideAudio();}
  (s.taps||[]).forEach(function(tp,k){setTimeout(function(){if(id===runId)tap(tp.x,tp.y);},900+k*1100);});
  setTimeout(function(){if(id===runId)snap();},300);
  if(!await wait(s.d,id))return;}
 hideAudio();playing=false;endcard.classList.add('on');segs.forEach(function(b){b.style.width='100%';});
 boom();jingle();confetti(W/2,H*.35);setTimeout(function(){confetti(W*.3,H*.4);confetti(W*.7,H*.4);},350);
}
new Image().src='/assets/screen2.jpg';
runId++;run(runId);
document.getElementById('replayBtn').addEventListener('click',function(){runId++;run(runId);});
document.getElementById('replayBtn2').addEventListener('click',function(){runId++;run(runId);});
})();
