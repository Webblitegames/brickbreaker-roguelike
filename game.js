const c=document.querySelector('#game'),x=c.getContext('2d');
let W,H,dpr,paddle,ball,bricks=[],enemies=[],shots=[],hp=5,level=1,seed,state='menu',mapNodes=[],currentNode=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hash(s){let h=2166136261;for(const ch of s)h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0}
function rngFactory(s){let a=hash(s);return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';x.setTransform(dpr,0,0,dpr,0,0);if(paddle)paddle.y=H-80}
addEventListener('resize',resize);resize();
function newRun(s){seed=s||Math.random().toString(36).slice(2,10).toUpperCase();level=1;hp=5;document.querySelector('#seed').textContent='Seed '+seed;generateMap();state='map'}
function generateMap(){const r=rngFactory(seed+':map');mapNodes=[];const layers=7;let id=0;for(let row=0;row<layers;row++){const count=row===0?1:3+Math.floor(r()*3);for(let col=0;col<count;col++){const spread=W*.78,xp=W/2+(count===1?0:(col-(count-1)/2)*(spread/(count-1)))+(r()-.5)*18;mapNodes.push({id:id++,row,col,x:xp,y:H-90-row*((H-190)/(layers-1)),next:[],done:false})}}
 for(let row=0;row<layers-1;row++){const a=mapNodes.filter(n=>n.row===row),b=mapNodes.filter(n=>n.row===row+1);for(const n of a){const sorted=[...b].sort((u,v)=>Math.abs(u.x-n.x)-Math.abs(v.x-n.x));const k=Math.min(sorted.length,2+(r()<.35?1:0));n.next=sorted.slice(0,k).map(q=>q.id)}}currentNode=mapNodes[0];}
function enterNode(n){currentNode=n;level=n.row+1;state='play';makeLevel()}
function availableNodes(){return currentNode?currentNode.next.map(id=>mapNodes.find(n=>n.id===id)):[]}
function makeLevel(){const r=rngFactory(seed+':'+level);bricks=[];enemies=[];shots=[];paddle={x:W/2,y:H-80,w:Math.min(110,W*.25),h:16};ball={x:W/2,y:H-115,vx:(r()-.5)*160,vy:-330,rad:7};
 const cols=Math.max(7,Math.floor(W/48)),rows=7,gap=4,bw=(W-24-gap*(cols-1))/cols,bh=24,top=120;
 const pattern=Math.floor(r()*5);
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){let keep=true;
  if(pattern===0)keep=(row+col)%3!==0;if(pattern===1)keep=Math.abs(col-(cols-1)/2)>row*.35;if(pattern===2)keep=(col%3!==1||row%2===0);if(pattern===3)keep=r()>.2;if(pattern===4)keep=(row<2||col<2||col>cols-3||r()>.45);
  if(keep)bricks.push({x:12+col*(bw+gap),y:top+row*(bh+gap),w:bw,h:bh,hp:1+Math.floor(level/4)});
 }
 const n=2+Math.floor(level/2);for(let i=0;i<n;i++)enemies.push({x:35+r()*(W-70),y:70+r()*35,hp:2+level,cd:70+Math.floor(r()*100)});
 document.querySelector('#level').textContent='Level '+level;drawHP()}
function drawHP(){document.querySelector('#hp').textContent='Core '+('♥'.repeat(Math.max(0,hp)))}
function pointer(e){const rect=c.getBoundingClientRect(),px=(e.touches?e.touches[0].clientX:e.clientX)-rect.left,py=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;if(state==='menu'){newRun();return}if(state==='map'){let opts=currentNode.row===0&&level===1?[currentNode]:availableNodes();let hit=opts.find(n=>Math.hypot(n.x-px,n.y-py)<30);if(hit)enterNode(hit);return}if(state==='play')paddle.x=clamp(px,paddle.w/2,W-paddle.w/2)}
c.addEventListener('pointerdown',pointer);c.addEventListener('pointermove',pointer);c.addEventListener('touchstart',pointer,{passive:false});c.addEventListener('touchmove',e=>{e.preventDefault();pointer(e)},{passive:false});
function circleRect(b,o){return b.x+b.rad>o.x&&b.x-b.rad<o.x+o.w&&b.y+b.rad>o.y&&b.y-b.rad<o.y+o.h}
function update(dt){if(state!=='play')return;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(ball.x<ball.rad||ball.x>W-ball.rad){ball.vx*=-1;ball.x=clamp(ball.x,ball.rad,W-ball.rad)}if(ball.y<55){ball.vy=Math.abs(ball.vy)}
 if(circleRect(ball,{x:paddle.x-paddle.w/2,y:paddle.y,w:paddle.w,h:paddle.h})&&ball.vy>0){ball.vy=-Math.abs(ball.vy);ball.vx+=(ball.x-paddle.x)*5}
 for(let i=bricks.length-1;i>=0;i--){let b=bricks[i];if(circleRect(ball,b)){ball.vy*=-1;if(--b.hp<=0)bricks.splice(i,1);break}}
 for(let i=enemies.length-1;i>=0;i--){let e=enemies[i],dx=ball.x-e.x,dy=ball.y-e.y;if(dx*dx+dy*dy<400){ball.vy=Math.abs(ball.vy);if(--e.hp<=0)enemies.splice(i,1)}if(--e.cd<=0){shots.push({x:e.x,y:e.y+12,vy:180+level*8});e.cd=100+Math.random()*80}}
 for(let i=shots.length-1;i>=0;i--){let s=shots[i];s.y+=s.vy*dt;if(s.y>paddle.y&&s.y<paddle.y+paddle.h&&Math.abs(s.x-paddle.x)<paddle.w/2){shots.splice(i,1);continue}if(s.y>H-25){shots.splice(i,1);hp--;drawHP();if(hp<=0)newRun(seed)}}
 if(ball.y>H+15){ball.x=paddle.x;ball.y=paddle.y-30;ball.vy=-330}
 if(enemies.length===0){currentNode.done=true;if(currentNode.row>=6){state='menu'}else state='map'}}
function draw(){x.clearRect(0,0,W,H);let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#17233b');g.addColorStop(1,'#0c1018');x.fillStyle=g;x.fillRect(0,0,W,H);
 if(state==='menu'){x.fillStyle='white';x.textAlign='center';x.font='bold 32px system-ui';x.fillText('BRICKBREAKER',W/2,H*.35);x.font='bold 20px system-ui';x.fillStyle='#3f75ff';x.fillRect(W/2-90,H*.52-28,180,56);x.fillStyle='white';x.fillText('START GAME',W/2,H*.52+7);return}
 if(state==='map'){drawMap();return}
 x.fillStyle='#3f75ff';for(const b of bricks){x.fillRect(b.x,b.y,b.w,b.h);x.strokeStyle='#8fb0ff';x.strokeRect(b.x+.5,b.y+.5,b.w-1,b.h-1)}
 for(const e of enemies){x.fillStyle='#e54b5d';x.beginPath();x.arc(e.x,e.y,14,0,7);x.fill();x.fillStyle='white';x.font='11px system-ui';x.textAlign='center';x.fillText(e.hp,e.x,e.y+4)}
 x.fillStyle='#ffd166';x.beginPath();x.arc(ball.x,ball.y,ball.rad,0,7);x.fill();x.fillStyle='#e9eefc';x.fillRect(paddle.x-paddle.w/2,paddle.y,paddle.w,paddle.h);
 x.fillStyle='#ff5964';for(const s of shots)x.fillRect(s.x-3,s.y-8,6,16);x.fillStyle='rgba(255,70,80,.25)';x.fillRect(0,H-24,W,24);x.fillStyle='#ff6470';x.font='11px system-ui';x.textAlign='center';x.fillText('HIT ZONE',W/2,H-8)}
function drawMap(){x.textAlign='center';x.fillStyle='white';x.font='bold 22px system-ui';x.fillText('CHOOSE YOUR PATH',W/2,55);x.font='12px system-ui';x.fillStyle='#9ba8c7';x.fillText('Seed '+seed,W/2,76);const opts=new Set((currentNode.row===0&&level===1?[currentNode]:availableNodes()).map(n=>n.id));x.lineWidth=4;for(const n of mapNodes){for(const id of n.next){const q=mapNodes.find(v=>v.id===id);x.strokeStyle='#39445e';x.beginPath();x.moveTo(n.x,n.y);x.lineTo(q.x,q.y);x.stroke()}}for(const n of mapNodes){x.beginPath();x.arc(n.x,n.y,opts.has(n.id)?18:13,0,Math.PI*2);x.fillStyle=n.done?'#5f687c':opts.has(n.id)?'#ffd166':'#39445e';x.fill();if(opts.has(n.id)){x.strokeStyle='white';x.lineWidth=2;x.stroke()}}if(currentNode&&currentNode.row>0){x.fillStyle='#e9eefc';x.font='12px system-ui';x.fillText('You are here',currentNode.x,currentNode.y+35)}}
let last=performance.now();function loop(t){let dt=Math.min(.025,(t-last)/1000);last=t;update(dt);draw();requestAnimationFrame(loop)}seed=new URLSearchParams(location.search).get('seed')||null;requestAnimationFrame(loop);