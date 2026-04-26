// SYNTHWAVE ASTEROIDS - Part 2: Update & Draw
(function(){
'use strict';
var g=G,cx=g.cx,wx=g.wx;
function update(){
if(g.st()!==g.STATE.PLAYING)return;g.pollGP();
var k=g.keys,m=g.ms,ship=g.ship(),ast=g.ast(),al=g.al(),bul=g.bul(),par=g.par(),pu=g.pu();
var W=g.gW(),H=g.gH();
var tl=k.ArrowLeft||k.KeyA||m.left||k._gl,tr=k.ArrowRight||k.KeyD||m.right||k._gr;
var tu=k.ArrowUp||k.KeyW||m.thrust||k._gu,tf=k.Space||m.fire||k._gf;
if(ship&&!ship.dead){
if(tl)ship.a-=0.065;if(tr)ship.a+=0.065;
if(tu){ship.vx+=Math.cos(ship.a)*0.14;ship.vy+=Math.sin(ship.a)*0.14;ship.thr=true;if(Math.random()<0.3)AudioEngine.sfxThrust();}else ship.thr=false;
ship.vx*=0.99;ship.vy*=0.99;ship.x+=ship.vx;ship.y+=ship.vy;g.wrap(ship);
var ft=g.fireT();if(tf&&ft<=0){g.fireBul();ft=g.wt()===1?12:g.wt()===3?6:g.wt()===2?20:10;}if(ft>0)ft--;g.setFT(ft);
var iv=g.invT();if(iv>0){iv--;g.setInv(iv);}
}else if(ship&&ship.dead){ship.rt--;if(ship.rt<=0)g.respawn();}
// Bullets
for(var i=bul.length-1;i>=0;i--){var b=bul[i];b.x+=b.vx;b.y+=b.vy;b.life--;if(b.life<=0)bul.splice(i,1);}
// Asteroids
for(var i=0;i<ast.length;i++){var a=ast[i];a.x+=a.vx;a.y+=a.vy;a.rot+=a.rs;g.wrap(a);}
// Aliens
var at=g.alT()-1;if(at<=0&&al.length<2){g.spawnAl();at=400+Math.random()*300;}g.setAlT(at);
for(var i=al.length-1;i>=0;i--){var e=al[i];e.x+=e.vx;e.y+=Math.sin(e.ph)*0.5;e.ph+=0.03;
e.st--;if(e.st<=0&&ship&&!ship.dead){var ang=Math.atan2(ship.y-e.y,ship.x-e.x);bul.push({x:e.x,y:e.y,vx:Math.cos(ang)*3.5,vy:Math.sin(ang)*3.5,life:90,r:4,tp:9,dmg:1});e.st=80+Math.random()*80;}
if(e.x<-60||e.x>g.gW()+60)al.splice(i,1);}
// Particles
for(var i=par.length-1;i>=0;i--){var p=par[i];p.x+=p.vx;p.y+=p.vy;p.vx*=0.97;p.vy*=0.97;p.life--;if(p.life<=0)par.splice(i,1);}
// Pickups
for(var i=pu.length-1;i>=0;i--){pu[i].t++;pu[i].life--;if(pu[i].life<=0)pu.splice(i,1);}
// Bullet-Asteroid
for(var i=bul.length-1;i>=0;i--){if(bul[i].tp===9)continue;for(var j=ast.length-1;j>=0;j--){if(g.hit(bul[i],ast[j])){var aa=ast[j];g.boom(aa.x,aa.y,'#0ff',8,2);AudioEngine.sfxExplosionSmall();
var pts=aa.sz===3?10:aa.sz===2?25:50;g.addScore(pts);
if(aa.sz>1){g.spawnA(aa.x,aa.y,aa.sz-1);g.spawnA(aa.x,aa.y,aa.sz-1);}
if(aa.sz===3&&Math.random()<0.2)g.spawnPU(aa.x,aa.y);
ast.splice(j,1);bul.splice(i,1);break;}}}
// Bullet-Alien
for(var i=bul.length-1;i>=0;i--){if(!bul[i]||bul[i].tp===9)continue;for(var j=al.length-1;j>=0;j--){if(g.hit(bul[i],al[j])){al[j].hp-=bul[i].dmg;
if(al[j].hp<=0){g.boom(al[j].x,al[j].y,'#f0f',15,3);AudioEngine.sfxExplosion();g.addScore(100);g.spawnPU(al[j].x,al[j].y);al.splice(j,1);}else g.boom(al[j].x,al[j].y,'#f0f',5,1);
bul.splice(i,1);break;}}}
// Ship collisions
if(ship&&!ship.dead&&g.invT()<=0){
for(var i=0;i<ast.length;i++){if(g.hit(ship,ast[i])){g.loseLife();break;}}
if(ship&&!ship.dead)for(var i=0;i<al.length;i++){if(g.hit(ship,al[i])){g.loseLife();break;}}
if(ship&&!ship.dead)for(var i=bul.length-1;i>=0;i--){if(bul[i].tp===9&&g.hit(ship,bul[i])){bul.splice(i,1);g.loseLife();break;}}}
// Ship-Pickup
if(ship&&!ship.dead){for(var i=pu.length-1;i>=0;i--){if(g.hit(ship,pu[i])){g.setW(pu[i].tp);g.updHUD();AudioEngine.sfxPickup();g.boom(pu[i].x,pu[i].y,g.WC[pu[i].tp],10,2);pu.splice(i,1);}}}
g.chkClear();
}
// === DRAW FUNCTIONS ===
function drawStars(){
var W=g.gW(),H=g.gH(),ship=g.ship(),stars=g.stars;
for(var i=0;i<stars.length;i++){var s=stars[i];var sx=((s.x-((ship?ship.x:W/2)*0.05*s.s))%W+W)%W;var sy=((s.y-((ship?ship.y:H/2)*0.05*s.s))%H+H)%H;
cx.globalAlpha=0.3+s.b*0.5;cx.fillStyle='#fff';cx.fillRect(sx,sy,s.s,s.s);}cx.globalAlpha=1;}
function drawShip(){
var ship=g.ship();if(!ship||ship.dead)return;
cx.save();cx.translate(ship.x,ship.y);cx.rotate(ship.a);
if(g.invT()>0&&(g.invT()/4|0)%2===0)cx.globalAlpha=0.4;
cx.shadowColor='#0ff';cx.shadowBlur=15;cx.strokeStyle='#0ff';cx.lineWidth=2;
cx.beginPath();cx.moveTo(18,0);cx.lineTo(-12,-10);cx.lineTo(-6,0);cx.lineTo(-12,10);cx.closePath();cx.stroke();
if(ship.thr){cx.shadowBlur=0;cx.strokeStyle=Math.random()>0.5?'#f0f':'#ff6ec7';cx.lineWidth=2;
cx.beginPath();cx.moveTo(-8,-5);cx.lineTo(-18-Math.random()*10,0);cx.lineTo(-8,5);cx.stroke();}
cx.shadowBlur=0;cx.restore();}
function drawAst(){
var ast=g.ast();for(var i=0;i<ast.length;i++){var a=ast[i];
cx.save();cx.translate(a.x,a.y);cx.rotate(a.rot);
cx.shadowColor='#f0f';cx.shadowBlur=8;cx.strokeStyle='#f0f';cx.lineWidth=1.5;
cx.beginPath();for(var j=0;j<a.vt.length;j++){if(j===0)cx.moveTo(a.vt[j].x,a.vt[j].y);else cx.lineTo(a.vt[j].x,a.vt[j].y);}cx.closePath();cx.stroke();cx.shadowBlur=0;cx.restore();}}
function drawAliens(){
var al=g.al(),t=Date.now()*0.003;for(var i=0;i<al.length;i++){var e=al[i];
cx.save();cx.translate(e.x,e.y);cx.shadowColor='#0f0';cx.shadowBlur=12;cx.strokeStyle='#0f0';cx.lineWidth=2;
cx.beginPath();for(var j=0;j<e.bv.length;j++){var bv=e.bv[j],r=bv.b+Math.sin(t*bv.s+bv.p)*bv.o,an=Math.PI*2*j/e.bv.length;
if(j===0)cx.moveTo(Math.cos(an)*r,Math.sin(an)*r);else cx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}cx.closePath();cx.stroke();
cx.shadowBlur=0;cx.fillStyle='#0f0';cx.beginPath();cx.arc(0,-2,3,0,Math.PI*2);cx.fill();cx.restore();}}
function drawBullets(){
var bul=g.bul();for(var i=0;i<bul.length;i++){var b=bul[i];cx.save();
if(b.tp===0){cx.shadowColor='#0ff';cx.shadowBlur=10;cx.fillStyle='#0ff';cx.beginPath();cx.arc(b.x,b.y,b.r,0,Math.PI*2);cx.fill();}
else if(b.tp===1){cx.shadowColor='#0f0';cx.shadowBlur=8;cx.fillStyle='#0f0';cx.beginPath();cx.arc(b.x,b.y,b.r,0,Math.PI*2);cx.fill();}
else if(b.tp===2){cx.shadowColor='#f0f';cx.shadowBlur=20;cx.fillStyle='rgba(255,0,255,0.6)';cx.beginPath();cx.arc(b.x,b.y,b.r,0,Math.PI*2);cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(b.x,b.y,b.r*0.4,0,Math.PI*2);cx.fill();}
else if(b.tp===3){cx.shadowColor='#ff0';cx.shadowBlur=6;cx.strokeStyle='#ff0';cx.lineWidth=2;cx.beginPath();cx.moveTo(b.x-b.vx*0.5,b.y-b.vy*0.5);cx.lineTo(b.x,b.y);cx.stroke();}
else if(b.tp===9){cx.shadowColor='#f00';cx.shadowBlur=8;cx.fillStyle='#f44';cx.beginPath();cx.arc(b.x,b.y,b.r,0,Math.PI*2);cx.fill();}
cx.shadowBlur=0;cx.restore();}}
function drawParticles(){
var par=g.par();for(var i=0;i<par.length;i++){var p=par[i];cx.save();cx.globalAlpha=p.life/p.ml;
cx.shadowColor=p.col;cx.shadowBlur=5;cx.fillStyle=p.col;cx.beginPath();cx.arc(p.x,p.y,p.r*(p.life/p.ml),0,Math.PI*2);cx.fill();cx.shadowBlur=0;cx.restore();}}
function drawPickups(){
var pu=g.pu();for(var i=0;i<pu.length;i++){var p=pu[i],c=g.WC[p.tp],pulse=1+Math.sin(p.t*0.1)*0.2;
cx.save();cx.translate(p.x,p.y);cx.shadowColor=c;cx.shadowBlur=15;cx.strokeStyle=c;cx.lineWidth=2;
cx.beginPath();for(var j=0;j<6;j++){var a=Math.PI*2*j/6+p.t*0.02,r=p.r*pulse;if(j===0)cx.moveTo(Math.cos(a)*r,Math.sin(a)*r);else cx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}cx.closePath();cx.stroke();
cx.shadowBlur=0;cx.fillStyle=c;cx.font='bold 10px monospace';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(g.WN[p.tp][0],0,0);cx.restore();}}
function draw(){
var W=g.gW(),H=g.gH();cx.clearRect(0,0,W,H);
cx.fillStyle='#0a0014';cx.fillRect(0,0,W,H);
drawStars();drawAst();drawAliens();drawBullets();drawPickups();drawParticles();drawShip();}
window._GR={update:update,draw:draw,drawStars:drawStars};
})();
