// SYNTHWAVE ASTEROIDS - Part 3: Main Loop & Welcome
(function(){
'use strict';
var g=G,wx=g.wx;
var welcT=0;
function drawWelcome(){
var W=g.gW(),H=g.gH();
wx.clearRect(0,0,W,H);
// Grid floor
wx.save();
wx.strokeStyle='rgba(255,110,199,0.3)';wx.lineWidth=1;
var gridY=H*0.6,gridH=H*0.4,rows=12,cols=20;
for(var i=0;i<=rows;i++){
var y=gridY+gridH*i/rows;var squeeze=i/rows;
wx.globalAlpha=0.15+squeeze*0.4;
wx.beginPath();wx.moveTo(0,y);wx.lineTo(W,y);wx.stroke();}
for(var i=0;i<=cols;i++){
var x=W*i/cols;wx.globalAlpha=0.2;
wx.beginPath();wx.moveTo(W/2,gridY);wx.lineTo(x,H);wx.stroke();}
wx.restore();
// Sun
var sunY=H*0.45,sunR=80;
var grad=wx.createRadialGradient(W/2,sunY,0,W/2,sunY,sunR);
grad.addColorStop(0,'#ff6ec7');grad.addColorStop(0.5,'#f0f');grad.addColorStop(1,'rgba(255,0,255,0)');
wx.fillStyle=grad;wx.beginPath();wx.arc(W/2,sunY,sunR,0,Math.PI*2);wx.fill();
// Horizontal lines through sun
wx.save();wx.globalCompositeOperation='destination-out';
for(var i=0;i<6;i++){var ly=sunY+10+i*12;wx.fillStyle='rgba(0,0,0,'+(0.3+i*0.1)+')';wx.fillRect(W/2-sunR,ly,sunR*2,4);}
wx.restore();
// Floating particles
for(var i=0;i<15;i++){
var px=(Math.sin(welcT*0.01+i*2.1)*0.3+0.5)*W;
var py=(Math.cos(welcT*0.008+i*1.7)*0.2+0.3)*H;
wx.fillStyle=i%2===0?'#0ff':'#f0f';wx.globalAlpha=0.3+Math.sin(welcT*0.05+i)*0.3;
wx.beginPath();wx.arc(px,py,2+Math.sin(welcT*0.03+i)*1.5,0,Math.PI*2);wx.fill();}
wx.globalAlpha=1;
welcT++;
}
function loop(){
if(g.st()===g.STATE.WELCOME){drawWelcome();}
else if(g.st()===g.STATE.PLAYING){_GR.update();_GR.draw();}
else if(g.st()===g.STATE.PAUSED){_GR.draw();}
else if(g.st()===g.STATE.GAMEOVER){_GR.draw();
// Fade overlay
var cx2=g.cx,W=g.gW(),H=g.gH();
cx2.fillStyle='rgba(10,0,20,0.4)';cx2.fillRect(0,0,W,H);}
requestAnimationFrame(loop);
}
loop();
})();
