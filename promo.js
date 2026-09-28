/* تیزر زینگو — تایم‌لاین صحنه‌ها + موتور صدای WebAudio + پارتیکل */
(function(){
"use strict";
var stage=document.getElementById('stage'),veil=document.getElementById('veil'),
playBtn=document.getElementById('playBtn'),muteBtn=document.getElementById('muteBtn'),
skipBtn=document.getElementById('skipBtn'),replayBtn=document.getElementById('replayBtn'),
bar=document.getElementById('bar'),fx=document.getElementById('fx'),
scenes=['sc1','sc2','sc3','sc4','sc5'].map(function(id){return document.getElementById(id);});
var DUR=[4300,4300,4100,3500,1e9],TOTAL=DUR[0]+DUR[1]+DUR[2]+DUR[3];
var runId=0,t0=0,raf=0;

/* ---------- موتور صدا ---------- */
var AC=null,master=null,muted=false,bgmTimer=null;
function audio(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;AC=new C();master=AC.createGain();master.gain.value=.9;master.connect(AC.destination);}if(AC.state==='suspended')AC.resume();return AC;}
function now(){return AC.currentTime;}
function env(g,t,a,peak,d){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);}
function tone(f,t,dur,type,vol,slideTo){var o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);env(g,t,.01,vol||.3,dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.1);}
function pop(f){var t=now();tone(f||660,t,.18,'triangle',.35);tone((f||660)*2,t,.1,'sine',.12);}
function thump(){var t=now();tone(120,t,.35,'sine',.5,40);}
function chime(notes,step,dur){var t=now();notes.forEach(function(n,i){tone(n,t+i*(step||.12),dur||.5,'triangle',.22);tone(n*2,t+i*(step||.12),(dur||.5)*.6,'sine',.07);});}
function whoosh(dur){dur=dur||.8;var t=now(),len=Math.floor(AC.sampleRate*dur),buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;var s=AC.createBufferSource();s.buffer=buf;var f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(4000,t+dur*.7);f.frequency.exponentialRampToValueAtTime(600,t+dur);var g=AC.createGain();env(g,t,.08,.4,dur);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+dur+.05);}
/* موزیک پس‌زمینه: پد + بیس + ملودی */
var CH=[[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7],[146.8,220,293.7]],bstep=0;
function pad(freqs,t,dur){freqs.forEach(function(f){[-4,4].forEach(function(det){var o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=f;o.detune.value=det;fl.type='lowpass';fl.frequency.value=900;env(g,t,dur*.3,.05,dur);o.connect(fl);fl.connect(g);g.connect(master);o.start(t);o.stop(t+dur+dur*.3);});});}
function bass(f,t,dur){tone(f/2,t,dur,'sine',.16);}
var MELODY=[440,523.25,587.33,659.25,587.33,523.25,440,392];
function bgmTick(){if(muted||!AC)return;var t=now()+.05,ch=CH[bstep%CH.length];pad(ch,t,2.1);bass(ch[0],t,2.0);var m=MELODY[bstep%MELODY.length];tone(m,t+.15,1.2,'triangle',.06);bstep++;}
function bgmStart(){bgmStop();bstep=0;bgmTick();bgmTimer=setInterval(bgmTick,2000);}
function bgmStop(){if(bgmTimer){clearInterval(bgmTimer);bgmTimer=null;}}
function finale(){var t=now();thump();whoosh(1.2);chime([523.25,659.25,783.99,1046.5],.13,.8);setTimeout(function(){if(!muted)chime([783.99,1046.5,1318.5],.15,1);},700);}

/* ---------- پارتیکل (canvas) ---------- */
var ctx=fx.getContext('2d'),P=[],W=0,H=0;
function sizeFx(){W=fx.width=stage.clientWidth;H=fx.height=stage.clientHeight;}
window.addEventListener('resize',sizeFx);sizeFx();
function burst(x,y,n,spread,up){for(var i=0;i<(n||60);i++){var a=Math.random()*Math.PI*2,s=(spread||6)*(0.4+Math.random());P.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(up||2),l:1,d:.008+Math.random()*.015,r:1.5+Math.random()*3.5,c:Math.random()<.7?'255,140,50':'255,200,90'});}}
function ember(){P.push({x:Math.random()*W,y:H+10,vx:(Math.random()-.5)*.6,vy:-.6-Math.random(),l:.8,d:.004,r:1+Math.random()*2,c:'255,130,40'});}
var lastEmber=0;
function loop(ts){ctx.clearRect(0,0,W,H);P=P.filter(function(p){return p.l>0;});P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.l-=p.d;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fillStyle='rgba('+p.c+','+Math.max(p.l,0)+')';ctx.fill();});if(stage.classList.contains('playing')&&ts-lastEmber>180){ember();lastEmber=ts;}requestAnimationFrame(loop);}
requestAnimationFrame(loop);
function centerBurst(){burst(W/2,H*.42,90,8,3);setTimeout(function(){burst(W*.3,H*.5,40,6,2);burst(W*.7,H*.5,40,6,2);},250);}

/* ---------- تایم‌لاین ---------- */
function wait(ms,id){return new Promise(function(res){var t=Date.now(),step=function(){if(id!==runId)return res(false);if(Date.now()-t>=ms)return res(true);setTimeout(step,30);};step();});}
function show(i){scenes.forEach(function(s,k){s.classList.toggle('on',k===i);});}
function prog(){var el=(Date.now()-t0)/TOTAL;bar.style.width=Math.min(el*100,100)+'%';if(el<1.2&&stage.classList.contains('playing'))raf=requestAnimationFrame(prog);}
function counters(){document.querySelectorAll('.count').forEach(function(el){var to=parseFloat(el.dataset.to),dec=parseInt(el.dataset.dec||'0',10),s=Date.now();(function tick(){var p=Math.min((Date.now()-s)/1200,1),v=to*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec).replace('.',',');if(p<1&&runId)setTimeout(tick,30);})();});}
async function run(id){
  show(0);whoosh(1);setTimeout(centerBurst,500);setTimeout(function(){pop(520);},900);setTimeout(function(){pop(660);},1500);setTimeout(function(){chime([523.25,659.25],.14,.5);},2300);
  if(!await wait(DUR[0],id))return;
  show(1);whoosh(.7);[3400,4000,4600].forEach(function(d,i){setTimeout(function(){if(id===runId)pop(600+i*120);},d-DUR[0]);});
  if(!await wait(DUR[1],id))return;
  show(2);whoosh(.7);[1000,1200,1400].forEach(function(d,i){setTimeout(function(){if(id===runId)pop(700+i*100);},d);});setTimeout(function(){if(id===runId)thump();},1800);
  if(!await wait(DUR[2],id))return;
  show(3);chime([392,523.25,659.25],.12,.5);counters();
  if(!await wait(DUR[3],id))return;
  show(4);finale();centerBurst();
}
function start(){audio();bgmStart();runId++;var id=runId;veil.classList.add('hide');stage.classList.add('playing');t0=Date.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(prog);run(id);}
playBtn.addEventListener('click',start);
replayBtn.addEventListener('click',start);
skipBtn.addEventListener('click',function(){if(!stage.classList.contains('playing')){start();}runId++;var id=runId;show(4);finale();centerBurst();bar.style.width='100%';});
muteBtn.addEventListener('click',function(){muted=!muted;if(master)master.gain.value=muted?0:.9;muteBtn.textContent=muted?'🔇':'🔊';});
})();
