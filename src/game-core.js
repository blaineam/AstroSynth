// SYNTHWAVE ASTEROIDS - Part 1: Setup & State
var G=(function(){
'use strict';
var canvas=document.getElementById('gameCanvas'),cx=canvas.getContext('2d'),W,H;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
window.addEventListener('resize',resize);resize();
var wc=document.getElementById('welcomeCanvas'),wx=wc.getContext('2d');
function resizeW(){wc.width=window.innerWidth;wc.height=window.innerHeight;}
window.addEventListener('resize',resizeW);resizeW();
var STATE={WELCOME:0,PLAYING:1,PAUSED:2,GAMEOVER:3},state=STATE.WELCOME;
var score=0,level=1,lives=3,ship=null;
var asteroids=[],aliens=[],bullets=[],particles=[],pickups=[];
var keys={},isMobile=false,weaponType=0;
var WN=['PULSE','SPREAD','PLASMA','BEAM'],WC=['#0ff','#0f0','#f0f','#ff0'];
var invulnT=0,fireT=0,alienT=300;
var stars=[];for(var i=0;i<120;i++)stars.push({x:Math.random()*2000,y:Math.random()*2000,s:0.5+Math.random()*2,b:Math.random()});
function mkShip(){return{x:W/2,y:H/2,vx:0,vy:0,a:-Math.PI/2,thr:false,r:14,dead:false,rt:0};}
function mkV(r){var v=[],n=8+(Math.random()*5|0);for(var i=0;i<n;i++){var a=Math.PI*2*i/n;v.push({x:Math.cos(a)*r*(0.7+Math.random()*0.3),y:Math.sin(a)*r*(0.7+Math.random()*0.3)});}return v;}
function spawnA(x,y,sz){var r=sz===3?40+Math.random()*15:sz===2?22+Math.random()*8:12+Math.random()*4;var a=Math.random()*Math.PI*2,sp=(4-sz)*0.6+Math.random()*0.8;asteroids.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:r,sz:sz,vt:mkV(r),rot:0,rs:(Math.random()-0.5)*0.02});}
function spawnEdge(sz){var s=Math.random()*4|0,x=s===0?-50:s===1?W+50:Math.random()*W,y=s===2?-50:s===3?H+50:Math.random()*H;spawnA(x,y,sz);}
function mkBlob(){var v=[];for(var i=0;i<12;i++)v.push({b:15,o:Math.random()*5,s:1+Math.random()*2,p:Math.random()*Math.PI*2});return v;}
function spawnAl(){var sx=Math.random()<0.5?-30:W+30;aliens.push({x:sx,y:50+Math.random()*(H-100),vx:sx<0?1.2:-1.2,r:16,hp:2,st:60+Math.random()*120,ph:Math.random()*Math.PI*2,bv:mkBlob()});}
function spawnPU(x,y){pickups.push({x:x,y:y,tp:1+(Math.random()*3|0),r:12,t:0,life:600});}
function boom(x,y,col,n,sp){for(var i=0;i<(n||12);i++){var a=Math.random()*Math.PI*2,s=(sp||3)*Math.random();particles.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:30+Math.random()*30,ml:60,r:1+Math.random()*2,col:col||'#0ff'});}}
function wrap(o){if(o.x<-50)o.x=W+49;if(o.x>W+50)o.x=-49;if(o.y<-50)o.y=H+49;if(o.y>H+50)o.y=-49;}
function dst(a,b){var dx=a.x-b.x,dy=a.y-b.y;return Math.sqrt(dx*dx+dy*dy);}
function hit(a,b){return dst(a,b)<a.r+b.r;}
function fireBul(){if(!ship||ship.dead)return;var s=ship,a=s.a,c=Math.cos(a),sn=Math.sin(a);
if(weaponType===0){bullets.push({x:s.x+c*18,y:s.y+sn*18,vx:c*7+s.vx*.3,vy:sn*7+s.vy*.3,life:55,r:3,tp:0,dmg:1});AudioEngine.sfxShoot();}
else if(weaponType===1){for(var i=-2;i<=2;i++){var sa=a+i*.15;bullets.push({x:s.x+Math.cos(sa)*18,y:s.y+Math.sin(sa)*18,vx:Math.cos(sa)*6.5+s.vx*.2,vy:Math.sin(sa)*6.5+s.vy*.2,life:35,r:2.5,tp:1,dmg:1});}AudioEngine.sfxSpread();}
else if(weaponType===2){bullets.push({x:s.x+c*18,y:s.y+sn*18,vx:c*4.5+s.vx*.2,vy:sn*4.5+s.vy*.2,life:80,r:8,tp:2,dmg:3});AudioEngine.sfxPlasma();}
else{for(var b=0;b<5;b++)bullets.push({x:s.x+c*(18+b*12),y:s.y+sn*(18+b*12),vx:c*12,vy:sn*12,life:18,r:2,tp:3,dmg:1});AudioEngine.sfxLaser();}}
var HSK='synthwave_asteroids_hs';
function getHS(){try{var d=JSON.parse(localStorage.getItem(HSK));if(Array.isArray(d))return d.slice(0,10);}catch(e){}return[];}
function saveHS(nm,sc){var h=getHS();h.push({name:nm,score:sc});h.sort(function(a,b){return b.score-a.score;});h=h.slice(0,10);try{localStorage.setItem(HSK,JSON.stringify(h));}catch(e){}}
function isHS(sc){var h=getHS();return h.length<10||sc>h[h.length-1].score;}
function renderHS(){var l=document.getElementById('highscore-list'),h=getHS();l.innerHTML='';for(var i=0;i<h.length;i++){var li=document.createElement('li');li.innerHTML='<span style="color:#ff6ec7">'+(i+1)+'.</span> <span style="color:#ff0">'+h[i].name+'</span> <span style="color:#0ff">'+h[i].score+'</span>';l.appendChild(li);}}
function updHUD(){document.getElementById('score').textContent=score;document.getElementById('level').textContent=level;var s='';for(var i=0;i<lives;i++)s+='\u25B2';document.getElementById('lives').textContent=s;document.getElementById('weapon-name').textContent=WN[weaponType];document.getElementById('weapon-name').style.color=WC[weaponType];}
function showScr(id){['welcome-screen','pause-screen','gameover-screen','hud','mobile-controls'].forEach(function(s){var el=document.getElementById(s);if(!el)return;if(s===id||(id==='hud'&&(s==='hud'||(s==='mobile-controls'&&isMobile)))){el.classList.add('active');el.classList.remove('hidden');}else if(s==='hud'||s==='mobile-controls'){el.classList.add('hidden');el.classList.remove('active');}else el.classList.remove('active');});}
function startLv(lv){level=lv;asteroids=[];aliens=[];for(var i=0;i<3+lv;i++)spawnEdge(3);AudioEngine.sfxWave();}
function chkClear(){if(asteroids.length===0&&aliens.length===0){level++;startLv(level);}}
function startGame(){AudioEngine.init();AudioEngine.resume();AudioEngine.startMusic();score=0;level=1;lives=3;weaponType=0;ship=mkShip();asteroids=[];aliens=[];bullets=[];particles=[];pickups=[];invulnT=120;updHUD();startLv(1);showScr('hud');state=STATE.PLAYING;}
function endGame(){state=STATE.GAMEOVER;AudioEngine.sfxGameOver();AudioEngine.stopMusic();document.getElementById('final-score').textContent=score;var e=document.getElementById('highscore-entry');if(isHS(score)){e.classList.remove('hidden');document.getElementById('initial-1').value='';document.getElementById('initial-2').value='';document.getElementById('initial-3').value='';setTimeout(function(){document.getElementById('initial-1').focus();},100);}else e.classList.add('hidden');renderHS();showScr('gameover-screen');}
function loseLife(){if(!ship||ship.dead)return;AudioEngine.sfxDeath();boom(ship.x,ship.y,'#ff6ec7',25,4);boom(ship.x,ship.y,'#0ff',15,2);ship.dead=true;ship.rt=150;lives--;updHUD();if(lives<=0)setTimeout(endGame,1500);}
function addScore(pts){score+=pts;updHUD();}
function respawn(){ship.x=W/2;ship.y=H/2;ship.vx=0;ship.vy=0;ship.a=-Math.PI/2;ship.dead=false;invulnT=120;}
isMobile='ontouchstart' in window||navigator.maxTouchPoints>0;
var ms={left:false,right:false,thrust:false,fire:false};
document.querySelectorAll('.mobile-btn').forEach(function(b){var ac=b.getAttribute('data-action');b.addEventListener('touchstart',function(e){e.preventDefault();ms[ac]=true;},{passive:false});b.addEventListener('touchend',function(e){e.preventDefault();ms[ac]=false;},{passive:false});b.addEventListener('touchcancel',function(){ms[ac]=false;});});
function pollGP(){var gs=navigator.getGamepads?navigator.getGamepads():[];for(var i=0;i<gs.length;i++){var g=gs[i];if(!g)continue;var lx=g.axes[0]||0,ly=g.axes[1]||0;keys._gl=lx<-0.3||(g.buttons[14]&&g.buttons[14].pressed);keys._gr=lx>0.3||(g.buttons[15]&&g.buttons[15].pressed);keys._gu=ly<-0.3||(g.buttons[12]&&g.buttons[12].pressed);keys._gf=g.buttons[0]&&g.buttons[0].pressed;break;}}
window.addEventListener('keydown',function(e){keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code)>=0)e.preventDefault();if(state===STATE.WELCOME&&(e.code==='Space'||e.code==='Enter'))startGame();else if(state===STATE.PLAYING&&e.code==='Escape'){state=STATE.PAUSED;showScr('pause-screen');}else if(state===STATE.PAUSED&&(e.code==='Escape'||e.code==='Space')){state=STATE.PLAYING;showScr('hud');}else if(state===STATE.GAMEOVER&&e.code==='Enter')startGame();});
window.addEventListener('keyup',function(e){keys[e.code]=false;});
document.getElementById('start-btn').onclick=startGame;
document.getElementById('resume-btn').onclick=function(){state=STATE.PLAYING;showScr('hud');};
document.getElementById('restart-btn').onclick=startGame;
document.getElementById('submit-score-btn').onclick=function(){var n=(document.getElementById('initial-1').value+document.getElementById('initial-2').value+document.getElementById('initial-3').value).toUpperCase();while(n.length<3)n+='_';saveHS(n,score);renderHS();document.getElementById('highscore-entry').classList.add('hidden');};
['initial-1','initial-2','initial-3'].forEach(function(id,i){var el=document.getElementById(id);el.addEventListener('input',function(){el.value=el.value.toUpperCase().replace(/[^A-Z]/g,'');if(el.value.length===1&&i<2)document.getElementById('initial-'+(i+2)).focus();});});
return{STATE:STATE,st:function(){return state;},setSt:function(v){state=v;},cx:cx,wx:wx,gW:function(){return W;},gH:function(){return H;},ship:function(){return ship;},ast:function(){return asteroids;},al:function(){return aliens;},bul:function(){return bullets;},par:function(){return particles;},pu:function(){return pickups;},keys:keys,ms:ms,pollGP:pollGP,wt:function(){return weaponType;},setW:function(v){weaponType=v;},invT:function(){return invulnT;},setInv:function(v){invulnT=v;},fireT:function(){return fireT;},setFT:function(v){fireT=v;},alT:function(){return alienT;},setAlT:function(v){alienT=v;},stars:stars,WN:WN,WC:WC,fireBul:fireBul,boom:boom,wrap:wrap,hit:hit,spawnA:spawnA,spawnAl:spawnAl,spawnPU:spawnPU,chkClear:chkClear,loseLife:loseLife,respawn:respawn,addScore:addScore,updHUD:updHUD,showScr:showScr,startGame:startGame,endGame:endGame};
})();
