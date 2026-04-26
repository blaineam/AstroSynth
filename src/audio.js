var AudioEngine=(function(){
var ctx=null,masterGain=null,musicGain=null,sfxGain=null;
var musicPlaying=false,initialized=false,loopId=null;
function init(){
if(initialized)return;
try{
ctx=new(window.AudioContext||window.webkitAudioContext)();
masterGain=ctx.createGain();masterGain.gain.value=0.6;masterGain.connect(ctx.destination);
musicGain=ctx.createGain();musicGain.gain.value=0.18;musicGain.connect(masterGain);
sfxGain=ctx.createGain();sfxGain.gain.value=0.45;sfxGain.connect(masterGain);
initialized=true;
}catch(e){console.warn('Web Audio not supported');}
}
function resume(){if(ctx&&ctx.state==='suspended')ctx.resume();}
function tone(freq,dur,type,vol,dest,t0){
if(!ctx)return;var t=t0||ctx.currentTime;
var o=ctx.createOscillator(),g=ctx.createGain();
o.type=type||'sine';o.frequency.setValueAtTime(freq,t);
g.gain.setValueAtTime(vol||0.3,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
o.connect(g);g.connect(dest||sfxGain);o.start(t);o.stop(t+dur);
}
function nz(dur,vol,dest,t0){
if(!ctx)return;var t=t0||ctx.currentTime;
var bs=Math.floor(ctx.sampleRate*dur),buf=ctx.createBuffer(1,bs,ctx.sampleRate),d=buf.getChannelData(0);
for(var i=0;i<bs;i++)d[i]=Math.random()*2-1;
var s=ctx.createBufferSource();s.buffer=buf;
var g=ctx.createGain();g.gain.setValueAtTime(vol||0.2,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
s.connect(g);g.connect(dest||sfxGain);s.start(t);
}
function sfxShoot(){if(!ctx)return;resume();tone(880,0.08,'square',0.2);tone(440,0.06,'sawtooth',0.15,sfxGain,ctx.currentTime+0.02);}
function sfxSpread(){if(!ctx)return;resume();tone(660,0.1,'square',0.15);tone(990,0.08,'square',0.12,sfxGain,ctx.currentTime+0.02);tone(550,0.08,'square',0.12,sfxGain,ctx.currentTime+0.04);}
function sfxPlasma(){if(!ctx)return;resume();var t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(200,t);o.frequency.exponentialRampToValueAtTime(1200,t+0.15);g.gain.setValueAtTime(0.2,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.connect(g);g.connect(sfxGain);o.start(t);o.stop(t+0.2);}
function sfxLaser(){if(!ctx)return;resume();var t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(1200,t);o.frequency.exponentialRampToValueAtTime(100,t+0.3);g.gain.setValueAtTime(0.25,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.connect(g);g.connect(sfxGain);o.start(t);o.stop(t+0.3);}
function sfxExplosion(){if(!ctx)return;resume();nz(0.4,0.35);tone(80,0.3,'sine',0.3);tone(50,0.4,'sine',0.2,sfxGain,ctx.currentTime+0.05);}
function sfxExplosionSmall(){if(!ctx)return;resume();nz(0.15,0.2);tone(150,0.12,'sine',0.2);}
function sfxPickup(){if(!ctx)return;resume();tone(523,0.08,'square',0.2);tone(659,0.08,'square',0.2,sfxGain,ctx.currentTime+0.08);tone(784,0.12,'square',0.25,sfxGain,ctx.currentTime+0.16);}
function sfxDeath(){if(!ctx)return;resume();nz(0.6,0.4);tone(300,0.2,'sawtooth',0.3);tone(150,0.4,'sawtooth',0.25,sfxGain,ctx.currentTime+0.1);tone(75,0.5,'sine',0.3,sfxGain,ctx.currentTime+0.2);}
function sfxThrust(){if(!ctx)return;resume();nz(0.05,0.08);}
function sfxWave(){if(!ctx)return;resume();var t=ctx.currentTime;tone(261,0.15,'square',0.2,sfxGain,t);tone(329,0.15,'square',0.2,sfxGain,t+0.15);tone(392,0.15,'square',0.2,sfxGain,t+0.3);tone(523,0.25,'square',0.25,sfxGain,t+0.45);}
function sfxGameOver(){if(!ctx)return;resume();var t=ctx.currentTime;tone(392,0.3,'square',0.25,sfxGain,t);tone(329,0.3,'square',0.25,sfxGain,t+0.3);tone(261,0.3,'square',0.25,sfxGain,t+0.6);tone(196,0.5,'square',0.3,sfxGain,t+0.9);}
// === MUSIC: Upbeat synthwave ===
var barCount=0;
function startMusic(){
if(!ctx||musicPlaying)return;resume();musicPlaying=true;barCount=0;scheduleLoop();}
function stopMusic(){musicPlaying=false;if(loopId){clearTimeout(loopId);loopId=null;}}
function kick(t){
if(!ctx)return;
var o=ctx.createOscillator(),g=ctx.createGain();
o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(30,t+0.12);
g.gain.setValueAtTime(0.45,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
o.connect(g);g.connect(musicGain);o.start(t);o.stop(t+0.2);
}
function hihat(t,open){
if(!ctx)return;
var bs=Math.floor(ctx.sampleRate*(open?0.12:0.04)),buf=ctx.createBuffer(1,bs,ctx.sampleRate),d=buf.getChannelData(0);
for(var i=0;i<bs;i++)d[i]=Math.random()*2-1;
var s=ctx.createBufferSource();s.buffer=buf;
var g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='highpass';f.frequency.value=7000;
g.gain.setValueAtTime(open?0.12:0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+(open?0.12:0.04));
s.connect(f);f.connect(g);g.connect(musicGain);s.start(t);
}
function snare(t){
if(!ctx)return;
var bs=Math.floor(ctx.sampleRate*0.1),buf=ctx.createBuffer(1,bs,ctx.sampleRate),d=buf.getChannelData(0);
for(var i=0;i<bs;i++)d[i]=Math.random()*2-1;
var s=ctx.createBufferSource();s.buffer=buf;
var gn=ctx.createGain(),f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=3000;f.Q.value=0.8;
gn.gain.setValueAtTime(0.18,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.12);
s.connect(f);f.connect(gn);gn.connect(musicGain);s.start(t);
var o=ctx.createOscillator(),g2=ctx.createGain();
o.frequency.setValueAtTime(200,t);o.frequency.exponentialRampToValueAtTime(80,t+0.05);
g2.gain.setValueAtTime(0.15,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.08);
o.connect(g2);g2.connect(musicGain);o.start(t);o.stop(t+0.1);
}
function scheduleLoop(){
if(!musicPlaying||!ctx)return;
var t=ctx.currentTime+0.05;
var bpm=128,beat=60/bpm,bars=4,totalBeats=bars*4;
// Chord progression: C major -> G major -> Am -> F major (I V vi IV - the happy pop progression!)
var chords=[
{bass:130.81,notes:[261.6,329.6,392]},   // C
{bass:98,notes:[246.9,293.7,392]},         // G
{bass:110,notes:[261.6,329.6,440]},        // Am
{bass:87.3,notes:[261.6,349.2,440]}        // F
];
// === Kick + Snare + HiHat pattern ===
for(var b=0;b<totalBeats;b++){
var bt=t+b*beat;
if(b%4===0||b%4===2)kick(bt);           // kick on 1 and 3
if(b%4===2)snare(bt);                     // snare on 3 (backbeat)
hihat(bt,b%2===1);                        // hihats on every beat, open on offbeats
if(b%2===1)hihat(bt+beat*0.5,false);     // extra hihat for 8th note feel
}
// === Punchy bass with slides ===
for(var i=0;i<4;i++){
var ch=chords[i],bStart=t+i*4*beat;
// Octave bass pattern: root, root, octave up, root (8th notes within each bar)
var bassPattern=[0,0,1,0, 0,0,1,0.5];
for(var bn=0;bn<8;bn++){
var o=ctx.createOscillator(),g=ctx.createGain();
var freq=ch.bass*(bassPattern[bn]===1?2:bassPattern[bn]===0.5?1.5:1);
o.type='sawtooth';
var nt=bStart+bn*beat*0.5;
o.frequency.setValueAtTime(freq,nt);
var fg=ctx.createBiquadFilter();fg.type='lowpass';fg.frequency.setValueAtTime(600,nt);
fg.frequency.linearRampToValueAtTime(300,nt+beat*0.4);
g.gain.setValueAtTime(0.3,nt);g.gain.setValueAtTime(0.28,nt+beat*0.35);
g.gain.exponentialRampToValueAtTime(0.001,nt+beat*0.48);
o.connect(fg);fg.connect(g);g.connect(musicGain);o.start(nt);o.stop(nt+beat*0.5);
}
}
// === Bright arpeggio (triangle + square mix) ===
var arpIdx=0;
for(var i=0;i<4;i++){
var ch=chords[i],aN=ch.notes;
// Arpeggio goes up and down through chord tones + octave
var arpSeq=[aN[0],aN[1],aN[2],aN[2]*2,aN[2],aN[1],aN[0],aN[0]/2];
for(var j=0;j<8;j++){
var at=t+i*4*beat+j*beat*0.5;
var o2=ctx.createOscillator(),g2=ctx.createGain();
o2.type=(barCount%2===0)?'triangle':'square';
o2.frequency.setValueAtTime(arpSeq[j],at);
var delay=ctx.createDelay(1);delay.delayTime.value=beat*0.375;
var dg=ctx.createGain();dg.gain.value=0.06;
g2.gain.setValueAtTime(0.1,at);g2.gain.exponentialRampToValueAtTime(0.001,at+beat*0.45);
o2.connect(g2);g2.connect(musicGain);
o2.connect(delay);delay.connect(dg);dg.connect(musicGain);
o2.start(at);o2.stop(at+beat*0.5);
}
}
// === Warm synth pad with shimmer ===
for(var i=0;i<4;i++){
var ch=chords[i],pStart=t+i*4*beat;
for(var p=0;p<ch.notes.length;p++){
var o3=ctx.createOscillator(),o3b=ctx.createOscillator(),g3=ctx.createGain();
o3.type='sine';o3b.type='sine';
o3.frequency.setValueAtTime(ch.notes[p],pStart);
o3b.frequency.setValueAtTime(ch.notes[p]*1.003,pStart); // slight detune for warmth
g3.gain.setValueAtTime(0.001,pStart);
g3.gain.linearRampToValueAtTime(0.05,pStart+beat*0.5);
g3.gain.setValueAtTime(0.05,pStart+beat*3.5);
g3.gain.exponentialRampToValueAtTime(0.001,pStart+beat*4);
o3.connect(g3);o3b.connect(g3);g3.connect(musicGain);
o3.start(pStart);o3.stop(pStart+beat*4);
o3b.start(pStart);o3b.stop(pStart+beat*4);
}
}
// === Melody hook (every other loop) ===
if(barCount%2===0){
var melody=[392,440,523.3,440,392,329.6,349.2,392, 440,523.3,659.3,523.3,440,392,349.2,329.6];
for(var m=0;m<16;m++){
var mt=t+m*beat;
var o4=ctx.createOscillator(),g4=ctx.createGain();
o4.type='square';
o4.frequency.setValueAtTime(melody[m],mt);
var f4=ctx.createBiquadFilter();f4.type='lowpass';f4.frequency.value=2000;
g4.gain.setValueAtTime(0.001,mt);
g4.gain.linearRampToValueAtTime(0.07,mt+beat*0.05);
g4.gain.setValueAtTime(0.07,mt+beat*0.7);
g4.gain.exponentialRampToValueAtTime(0.001,mt+beat*0.95);
o4.connect(f4);f4.connect(g4);g4.connect(musicGain);
o4.start(mt);o4.stop(mt+beat);
}
}
barCount++;
var loopDur=totalBeats*beat*1000;
loopId=setTimeout(function(){scheduleLoop();},loopDur-100);
}
return{
init:init,resume:resume,startMusic:startMusic,stopMusic:stopMusic,
sfxShoot:sfxShoot,sfxSpread:sfxSpread,sfxPlasma:sfxPlasma,sfxLaser:sfxLaser,
sfxExplosion:sfxExplosion,sfxExplosionSmall:sfxExplosionSmall,
sfxPickup:sfxPickup,sfxDeath:sfxDeath,sfxThrust:sfxThrust,
sfxWave:sfxWave,sfxGameOver:sfxGameOver
};
})();
