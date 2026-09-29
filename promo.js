/* Zingo 3D ad — timeline, 3D parallax, coverflow, particles, sound */
(function(){
"use strict";
var ad=document.getElementById('ad'),world=document.getElementById('world'),viewport=document.getElementById('viewport'),
segs=[].slice.call(document.querySelectorAll('#segs i')),
shots=[].slice.call(document.querySelectorAll('.shot')),
phone=document.getElementById('phone'),screenImg=document.getElementById('screenImg'),
screenBox=screenImg.parentElement,taps=document.getElementById('taps'),flash=document.getElementById('flash'),
soundBtn=document.getElementById('soundBtn'),fx=document.getElementById('fx'),
cfBox=document.getElementById('coverflow'),cfCards=[].slice.call(cfBox.querySelectorAll('.cf-card')),
ctaBtn=document.getElementById('ctaBtn'),
apSub=document.getElementById('apSub'),apItems=[].slice.call(document.querySelectorAll('#audioPop li'));
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var DUR=[4200,4300,5600,4700,4100,1e9],TOTAL=DUR[0]+DUR[1]+DUR[2]+DUR[3]+DUR[4];
var runId=0,t0=0,segToken=0;

/* ---------- depth layers ---------- */
Array.prototype.forEach.call(document.querySelectorAll('.layer'),function(l){
  l.style.setProperty('--z',(l.getAttribute('data-depth')||0)+'px');
});

/* ---------- mouse 3D parallax ---------- */
var mx=0,my=0,tmx=0,tmy=0;
if(!RM){
  ad.addEventListener('pointermove',function(e){
    var r=ad.getBoundingClientRect();
    tmx=(e.clientX-r.left)/r.width-.5; tmy=(e.clientY-r.top)/r.height-.5;
  });
  (function tilt(){
    mx+=(tmx-mx)*.06; my+=(tmy-my)*.06;
    var t=Date.now(),sx=Math.sin(t/4200)*.07,sy=Math.cos(t/5300)*.05; /* idle camera sway */
    world.style.transform='rotateY('+((mx+sx)*-9)+'deg) rotateX('+((my+sy)*7)+'deg)';
    if(phone)phone.style.transform='rotateY('+(-12+(mx+sx)*16)+'deg) rotateX('+(4+(my+sy)*12)+'deg)';
    requestAnimationFrame(tilt);
  })();
}

/* ---------- particles with depth ---------- */
var ctx=fx.getContext('2d'),P=[],W=0,H=0,playing=false;
function sizeFx(){W=fx.width=ad.clientWidth;H=fx.height=ad.clientHeight;}
window.addEventListener('resize',sizeFx);sizeFx();
function ember(){var z=.3+Math.random()*.7;P.push({x:Math.random()*W,y:H+12,vx:(Math.random()-.5)*.5*z,vy:(-.5-Math.random()*1.1)*z,l:.8,d:.004,r:(1+Math.random()*2.6)*z,c:Math.random()<.65?'255,120,40':'150,120,255',z:z});}
function burst(x,y){for(var i=0;i<70;i++){var a=Math.random()*Math.PI*2,s=2+Math.random()*7;P.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3,l:1,d:.009+Math.random()*.012,r:1.5+Math.random()*3,c:['255,120,40','255,190,80','150,120,255'][i%3],z:1,g:.18});}}
var lastE=0;
function loop(ts){
  ctx.clearRect(0,0,W,H);P=P.filter(function(p){return p.l>0;});
  for(var k=0;k<P.length;k++){var p=P[k];p.x+=p.vx;p.y+=p.vy;if(p.g)p.vy+=p.g;p.l-=p.d;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fillStyle='rgba('+p.c+','+Math.max(p.l,0)*(p.z||1)+')';ctx.fill();}
  if(playing&&!RM&&ts-lastE>200){ember();lastE=ts;}
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- sound (upbeat ad engine, muted until enabled) ---------- */
var AC=null,master=null,soundOn=false,bgmTimer=null,bstep=0;
function ensureAudio(){if(AC)return true;try{var C=window.AudioContext||window.webkitAudioContext;AC=new C();master=AC.createGain();master.gain.value=.8;master.connect(AC.destination);return true;}catch(e){return false;}}
function sfxOK(){return soundOn&&AC&&AC.state==='running';}
function tone(f,t,dur,type,vol,slide){var o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05);}
function noiseB(t,dur,ftype,ffreq,vol){var len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type=ftype;f.frequency.value=ffreq;var g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t);}
function kick(t){tone(150,t,.14,'sine',.5,42);}
function snap(){if(!sfxOK())return;var t=AC.currentTime;noiseB(t,.07,'bandpass',2200,.35);tone(1700,t,.06,'square',.1);}
function whoosh(){if(!sfxOK())return;var t=AC.currentTime,dur=.55,len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=1;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(3800,t+dur);var g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t);}
function pop(){if(!sfxOK())return;var t=AC.currentTime;tone(880,t,.12,'triangle',.25);tone(1320,t,.08,'sine',.1);}
function boom(){if(!sfxOK())return;var t=AC.currentTime;tone(95,t,.6,'sine',.55,28);noiseB(t,.25,'lowpass',500,.3);}
function riser(dur){if(!sfxOK())return;dur=dur||1.1;var t=AC.currentTime,len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*(i/len);var s=AC.createBufferSource();s.buffer=b;var f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(6000,t+dur);var g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+dur);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.05);s.connect(f);f.connect(g);g.connect(master);s.start(t);}
function sparkle(){if(!sfxOK())return;var t=AC.currentTime;[1318.5,1568,2093].forEach(function(f,i){tone(f,t+i*.09,.4,'sine',.1);});}
function jingle(){if(!sfxOK())return;var t=AC.currentTime;[523.25,659.25,783.99,1046.5].forEach(function(f,i){tone(f,t+i*.11,.5,'triangle',.22);});}
var MEL=[659.25,783.99,880,783.99,659.25,587.33,523.25,587.33],BASS=[130.8,110,87.3,98];
var CHORDS=[[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66],[146.83,220,293.66]];
function bgmTick(){if(!sfxOK())return;var t=AC.currentTime+.05,k=MEL[bstep%8];tone(k,t,.32,'triangle',.09);tone(k*2,t,.2,'sine',.03);if(bstep%2===0)kick(t);else noiseB(t,.05,'highpass',7000,.06);if(bstep%4===0)tone(BASS[(bstep/4|0)%4],t,1.6,'sine',.12);
 if(bstep%16===0){var ch=CHORDS[(bstep/16|0)%4];for(var ci=0;ci<3;ci++)tone(ch[ci],t,1.9,'sawtooth',.028);}bstep++;}
function bgmStart(){if(bgmTimer)clearInterval(bgmTimer);bgmTimer=setInterval(bgmTick,250);}
soundBtn.addEventListener('click',function(){
  if(!ensureAudio())return;
  if(AC.state==='suspended')AC.resume();
  soundOn=!soundOn;master.gain.value=soundOn?.8:0;
  soundBtn.textContent=soundOn?'🔊':'🔇 با صدا ببین';soundBtn.classList.toggle('sound-off',!soundOn);
  if(soundOn&&!bgmTimer)bgmStart();
});

/* ---------- coverflow ---------- */
var cfPos=0,cfTarget=0,cfAuto=true,dragX=null;
function cfRender(){
  cfCards.forEach(function(c,i){
    var off=i-cfPos,a=Math.abs(off);
    c.style.transform='translateX('+(off*150)+'px) translateZ('+(-a*170)+'px) rotateY('+(-off*48)+'deg) scale('+(i===Math.round(cfPos)?1.12:1)+')';
    c.style.filter=a>.6?'brightness(.55)':'brightness(1)';
    c.style.opacity=a>1.6?.25:(1-a*.22);
    c.style.zIndex=100-Math.round(a*10);
  });
}
cfRender();
setInterval(function(){if(cfAuto&&shots[2].classList.contains('on')){cfTarget=(cfTarget+1)%cfCards.length;}},2300);
(function cfTick(){cfPos+=(cfTarget-cfPos)*.08;cfRender();requestAnimationFrame(cfTick);})();
cfBox.addEventListener('pointerdown',function(e){dragX=e.clientX;cfAuto=false;cfBox.setPointerCapture(e.pointerId);});
cfBox.addEventListener('pointermove',function(e){if(dragX===null)return;var dx=(e.clientX-dragX)/120;if(Math.abs(dx)>.5){cfTarget=Math.max(0,Math.min(cfCards.length-1,Math.round(cfTarget-dx)));dragX=e.clientX;}});
['pointerup','pointercancel','pointerleave'].forEach(function(ev){cfBox.addEventListener(ev,function(){dragX=null;});});

/* ---------- language demo ---------- */
var LANGS=[{t:'Where are you going?'},{t:'من که هیچ جا نمیرم'},{t:'どこにも行かない'}];
function runLang(id,tk){var k=0;(function step(){if(id!==runId||tk!==segToken)return;
  apItems.forEach(function(li,j){li.classList.toggle('active',j===(k%3));});
  apSub.textContent=LANGS[k%3].t;apSub.classList.remove('flip');void apSub.offsetWidth;apSub.classList.add('flip');
  pop();k++;setTimeout(step,1350);})();}

/* ---------- tap ripple + counters ---------- */
function tap(x,y){var el=document.createElement('div');el.className='tap';el.style.left=x+'%';el.style.top=y+'%';taps.appendChild(el);flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go');setTimeout(function(){el.remove();},2200);pop();}
function counters(){Array.prototype.forEach.call(document.querySelectorAll('.count'),function(el){
  var to=parseFloat(el.dataset.to),dec=parseInt(el.dataset.dec||'0',10),s=Date.now();
  (function tick(){var p=Math.min((Date.now()-s)/1300,1),v=to*(1-Math.pow(1-p,3));
    el.textContent=(dec?v.toFixed(dec).replace('.',','):Math.round(v))+'';if(p<1&&runId)setTimeout(tick,30);})();});}

/* ---------- magnetic CTA ---------- */
ctaBtn.addEventListener('pointermove',function(e){
  if(RM)return;var r=ctaBtn.getBoundingClientRect();
  var dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;
  ctaBtn.style.transform='translate('+(dx*16)+'px,'+(dy*12)+'px) rotateY('+(dx*10)+'deg) rotateX('+(-dy*8)+'deg)';
});
ctaBtn.addEventListener('pointerleave',function(){ctaBtn.style.transform='';});

/* ---------- timeline ---------- */
function wait(ms,id){return new Promise(function(res){var s=Date.now();(function step(){if(id!==runId)return res(false);if(Date.now()-s>=ms)return res(true);setTimeout(step,40);})();});}
function show(i){shots.forEach(function(s,k){s.classList.toggle('on',k===i);});
  viewport.classList.remove('cut');void viewport.offsetWidth;viewport.classList.add('cut');}
var _acc=[0];DUR.forEach(function(d,i){_acc[i+1]=_acc[i]+d;});
function prog2(){var el=(Date.now()-t0);segs.forEach(function(bar,i){var f=i<segs.length?Math.max(0,Math.min((el-_acc[i])/DUR[i],1)):0;bar.style.width=(f*100)+'%';});if(runId)requestAnimationFrame(prog2);}
async function run(id){
  playing=true;t0=Date.now();prog2();
  for(var i=0;i<shots.length;i++){
    show(i);whoosh();
    if(i===1){setTimeout(function(){if(id===runId)tap(50,38);},1200);setTimeout(function(){if(id===runId)tap(64,60);},2600);}
    if(i===2){cfAuto=true;}
    if(i===3){runLang(id,++segToken);}
    if(i===4){counters();setTimeout(function(){if(id===runId)riser(1.2);},Math.max(0,DUR[4]-1350));}
    if(i===5){boom();jingle();var r=ad.getBoundingClientRect();burst(r.width/2,r.height*.35);sparkle();
      (function rain(tk){setTimeout(function(){if(id!==runId||tk!==segToken)return;var rr=ad.getBoundingClientRect();burst(rr.width*(.25+Math.random()*.5),rr.height*.3);rain(tk);},2200);})(++segToken);}
    setTimeout(function(){if(id===runId)snap();},350);
    if(i<shots.length-1){if(!await wait(DUR[i],id))return;}
  }
}
runId++;run(runId);
document.getElementById('replayBtn').addEventListener('click',function(){runId++;run(runId);});
document.getElementById('replayBtn2').addEventListener('click',function(){runId++;run(runId);});
})();
