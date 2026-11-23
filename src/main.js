import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
const $=id=>document.getElementById(id),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cv=$('c'),ov=$('ov');
const touch=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;
if(touch)document.body.classList.add('touch');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:false});R.setPixelRatio(1);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x14120a,.17);scene.background=new THREE.Color(0x14120a);
const cam=new THREE.PerspectiveCamera(65,1,.1,60);
function rs(){const a=innerWidth/innerHeight,h=240;R.setSize(Math.round(h*a),h,false);cam.aspect=a;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
function tex(r,g,b,v,ln,rep){const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');
for(let i=0;i<32;i++)for(let j=0;j<32;j++){const k=(Math.random()-.5)*v;x.fillStyle=`rgb(${r+k|0},${g+k|0},${b+k|0})`;x.fillRect(i,j,1,1)}
if(ln){x.fillStyle='rgba(0,0,0,.28)';x.fillRect(0,0,32,1);x.fillRect(0,0,1,32)}
const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(rep,rep);return t}
const LM=(r,g,b,v,ln)=>new THREE.MeshLambertMaterial({map:tex(r,g,b,v,ln,1)});
const C=5,N=30,S=C*N,H=3.2,B=[],lights=[];
const mFloor=new THREE.MeshLambertMaterial({map:tex(105,92,55,34,0,S/2)});
const mWall=LM(125,112,70,22,1),mCeil=new THREE.MeshLambertMaterial({map:tex(115,110,92,16,1,S/2.5)});
const wood=LM(78,50,30,24),metal=LM(85,90,95,14),crate=LM(105,82,48,30,1),cloths=[LM(90,42,48,28),LM(45,70,58,28),LM(60,58,90,28)],pillow=LM(150,145,130,16);
const gTv=new THREE.MeshBasicMaterial({color:0x1a3a5c}),gVend=new THREE.MeshBasicMaterial({color:0x6a90a8}),gLamp=new THREE.MeshBasicMaterial({color:0x9a7430});
const fl=new THREE.Mesh(new THREE.PlaneGeometry(S,S).rotateX(-Math.PI/2),mFloor);fl.position.set(S/2,0,S/2);scene.add(fl);
const ce=new THREE.Mesh(new THREE.PlaneGeometry(S,S).rotateX(Math.PI/2),mCeil);ce.position.set(S/2,H,S/2);scene.add(ce);
const bk=new Map();
function gb(m,w,h,d,x,y,z){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);if(!bk.has(m))bk.set(m,[]);bk.get(m).push(g)}
function wall(x,z,w,d){gb(mWall,w,H,d,x,H/2,z);B.push([x-w/2,x+w/2,z-d/2,z+d/2])}
wall(S/2,-.5,S+2,1);wall(S/2,S+.5,S+2,1);wall(-.5,S/2,1,S+2);wall(S+.5,S/2,1,S+2);
let sd=7;const rnd=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
// ---- muebles y estructuras
function prop(type,cx,cz){const rot=rnd()<.5,cm=cloths[rnd()*3|0];
 const p=(m,w,h,d,lx,y,lz)=>rot?gb(m,d,h,w,cx+lz,y,cz-lx):gb(m,w,h,d,cx+lx,y,cz+lz);
 const col=(w,d,lx=0,lz=0)=>{const a=rot?d:w,b=rot?w:d,x=cx+(rot?lz:lx),z=cz+(rot?-lx:lz);B.push([x-a/2,x+a/2,z-b/2,z+b/2])};
 switch(type){
 case 0:p(wood,1.5,.07,.9,0,.75,0);for(const a of[-1,1])for(const b of[-1,1])p(wood,.08,.75,.08,a*.65,.375,b*.38);col(1.5,.9);break;
 case 1:p(wood,.5,.07,.5,0,.45,0);p(wood,.5,.55,.06,0,.75,.22);for(const a of[-1,1])for(const b of[-1,1])p(wood,.05,.45,.05,a*.22,.22,b*.22);col(.5,.5);break;
 case 2:p(cm,2,.45,.9,0,.225,0);p(cm,2,.55,.22,0,.7,.34);for(const a of[-1,1])p(cm,.2,.3,.9,a*.9,.55,0);col(2,.9);break;
 case 3:p(wood,1.2,2.3,.55,0,1.15,0);col(1.2,.55);break;
 case 4:p(crate,.9,.9,.9,0,.45,0);p(crate,.7,.7,.7,.1,1.25,.05);col(.9,.9);break;
 case 5:p(wood,1.2,.5,.5,0,.25,0);p(metal,.9,.6,.4,0,.8,0);p(gTv,.78,.48,.02,0,.8,-.21);col(1.2,.5);break;
 case 6:p(wood,2,.4,1.4,0,.2,0);p(cm,1.9,.2,1.3,0,.5,0);p(pillow,.6,.15,.4,-.7,.65,0);col(2,1.4);break;
 case 7:p(metal,1,2,.8,0,1,0);p(gVend,.8,1.4,.02,0,1.2,-.41);col(1,.8);break;
 case 8:p(metal,.05,1.6,.05,0,.8,0);p(gLamp,.4,.3,.4,0,1.6,0);p(metal,.3,.04,.3,0,.02,0);col(.3,.3);break;
 case 9:p(wood,1.6,1.9,.35,0,.95,0);col(1.6,.35);break;
 case 10:p(wood,1.4,.06,.7,0,.74,0);p(wood,.4,.7,.6,.45,.35,0);p(wood,.06,.7,.6,-.65,.35,0);col(1.4,.7);break;
 default:for(const a of[-1,1]){p(wood,.15,2.4,.3,a*.55,1.2,0);col(.15,.3,a*.55,0)}p(wood,1.25,.15,.3,0,2.35,0)}}
const occ=new Array(N*N).fill(false);
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const x=(i+.5)*C,z=(j+.5)*C;
 if(Math.hypot(x-S/2,z-S/2)>9){const r=rnd();
  if(r<.12){wall(x,z,1.2,1.2);occ[i*N+j]=1}
  else if(r<.26){const o=rnd()*1.5-.75;rnd()<.5?wall(x+o,z,4,.4):wall(x,z+o,.4,4);occ[i*N+j]=1}
  else if(r<.62)prop(rnd()*12|0,x+(rnd()-.5)*1.2,z+(rnd()-.5)*1.2)}
 if((i+j)%2==0&&rnd()>.55){const m=new THREE.Mesh(new THREE.BoxGeometry(1.6,.05,.6),new THREE.MeshBasicMaterial({color:0xfff5c0}));m.position.set(x,H-.03,z);scene.add(m);lights.push([m,rnd()*50,rnd()<.35])}}
for(const[m,gs]of bk)scene.add(new THREE.Mesh(mergeGeometries(gs),m));
const amb=new THREE.AmbientLight(0x332c18,.8);scene.add(amb);
const spot=new THREE.SpotLight(0xfff0c0,3.2,32,.4,.5,1);scene.add(spot,spot.target);
const beam=new THREE.Mesh(new THREE.ConeGeometry(2.4,9,14,1,true).rotateX(-Math.PI/2).translate(0,0,4.5),
 new THREE.MeshBasicMaterial({color:0xffeebb,transparent:true,opacity:.08,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));scene.add(beam);
// ---- furry: cabeza redonda, orejitas, cuerpo capsula
const fox=new THREE.Group(),blk=new THREE.MeshLambertMaterial({color:0x121216,flatShading:true}),eyeM=new THREE.MeshBasicMaterial({color:0xd8ffb0});
const add=(g,m,x,y,z,p=fox)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o};
add(new THREE.CapsuleGeometry(.3,.5,3,8),blk,0,.55,0);
add(new THREE.SphereGeometry(.34,9,7),blk,0,1.38,0);
for(const s of[-1,1]){add(new THREE.ConeGeometry(.1,.24,5),blk,s*.2,1.69,0).rotation.z=-s*.25;add(new THREE.SphereGeometry(.04,5,4),eyeM,s*.12,1.42,-.33)}
add(new THREE.SphereGeometry(.05,5,4),new THREE.MeshLambertMaterial({color:0x2c2c36}),0,1.33,-.37);
add(new THREE.CylinderGeometry(.05,.05,.3,6).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:0xfff0c0}),.2,.7,-.3);
fox.scale.setScalar(.8);scene.add(fox);
// ---- input
const P=new THREE.Vector3(S/2,0,S/2),K={};let yaw=0,pitch=0,ph=0,lastS=0,on=false,jx=0,jy=0,runB=false,lightOn=true;
const toggleLight=()=>{lightOn=!lightOn;spot.visible=beam.visible=lightOn;click(lightOn)};
addEventListener('keydown',e=>{K[e.code]=1;if(e.code=='KeyF'&&!e.repeat)toggleLight()});addEventListener('keyup',e=>K[e.code]=0);
addEventListener('mousemove',e=>{if(!on||touch)return;yaw-=e.movementX*.0025;pitch=cl(pitch-e.movementY*.0025,-.6,.7)});
ov.onclick=()=>{if(!touch&&cv.requestPointerLock)cv.requestPointerLock();audio();A&&A.x.resume();on=true;ov.style.display='none'};
document.addEventListener('pointerlockchange',()=>{if(!touch&&!document.pointerLockElement){on=false;ov.style.display='flex'}});
document.addEventListener('visibilitychange',()=>{if(A)document.hidden?A.x.suspend():A.x.resume()});
(()=>{const z=$('zl'),st=$('stick'),kn=$('knob');let id=null,ox,oy;
z.addEventListener('pointerdown',e=>{if(id!==null)return;id=e.pointerId;z.setPointerCapture(id);ox=e.clientX;oy=e.clientY;st.style.cssText=`display:block;left:${ox-60}px;top:${oy-60}px`});
z.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;let dx=e.clientX-ox,dy=e.clientY-oy;const d=Math.hypot(dx,dy);if(d>60){dx*=60/d;dy*=60/d}jx=dx/60;jy=dy/60;kn.style.transform=`translate(${dx}px,${dy}px)`});
const end=e=>{if(e.pointerId!==id)return;id=null;jx=jy=0;st.style.display='none';kn.style.transform=''};z.addEventListener('pointerup',end);z.addEventListener('pointercancel',end);
const r=$('zr');let rid=null,lx,ly;
r.addEventListener('pointerdown',e=>{if(rid!==null)return;rid=e.pointerId;r.setPointerCapture(rid);lx=e.clientX;ly=e.clientY});
r.addEventListener('pointermove',e=>{if(e.pointerId!==rid)return;yaw-=(e.clientX-lx)*.006;pitch=cl(pitch-(e.clientY-ly)*.006,-.6,.7);lx=e.clientX;ly=e.clientY});
const re=e=>{if(e.pointerId===rid)rid=null};r.addEventListener('pointerup',re);r.addEventListener('pointercancel',re);
const b=$('bRun'),up=()=>runB=false;b.addEventListener('pointerdown',()=>runB=true);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up);
$('bLight').addEventListener('pointerdown',toggleLight)})();
// ---- audio: solo pasos y click de linterna (sin musica)
let A;
function audio(){if(A)return;const x=new(window.AudioContext||window.webkitAudioContext)(),m=x.createGain();m.gain.value=.9;m.connect(x.destination);
const L=x.sampleRate*2.5|0,ir=x.createBuffer(2,L,x.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}
const rv=x.createConvolver();rv.buffer=ir;const rg=x.createGain();rg.gain.value=.55;rv.connect(rg);rg.connect(m);A={x,m,rv}}
function nz(t,dur,type,fq,vol,rev){const x=A.x,n=x.sampleRate*dur|0,b=x.createBuffer(1,n,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
const s=x.createBufferSource();s.buffer=b;const f=x.createBiquadFilter();f.type=type;f.frequency.value=fq;const g=x.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(A.m);const r=x.createGain();r.gain.value=rev;g.connect(r);r.connect(A.rv);s.start(t)}
function step(run){if(!A)return;const x=A.x,t=x.currentTime;nz(t,.12,'lowpass',260+Math.random()*200,run?.6:.45,.8);
const o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(115,t);o.frequency.exponentialRampToValueAtTime(45,t+.08);g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(g);g.connect(A.m);o.start(t);o.stop(t+.12)}
function click(on){if(!A)return;const x=A.x,t=x.currentTime;for(const[dt,fq]of[[0,on?2300:1600],[.045,on?1500:2100]]){nz(t+dt,.02,'highpass',1800,.5,.25);
const o=x.createOscillator(),g=x.createGain();o.type='square';o.frequency.value=fq;g.gain.setValueAtTime(.1,t+dt);g.gain.exponentialRampToValueAtTime(.001,t+dt+.025);o.connect(g);g.connect(A.m);o.start(t+dt);o.stop(t+dt+.03)}}
// ---- loop
const PAL=[new THREE.Color(0x14120a),new THREE.Color(0x061413),new THREE.Color(0x140b10)],tc=new THREE.Color(),clk=new THREE.Clock(),dv=new THREE.Vector3(),cp3={x:0,z:0};
function resolve(p,rad){for(const b of B){const qx=cl(p.x,b[0],b[1]),qz=cl(p.z,b[2],b[3]),dx=p.x-qx,dz=p.z-qz,d=Math.hypot(dx,dz);if(d<rad&&d>0){p.x+=dx/d*(rad-d);p.z+=dz/d*(rad-d)}}}
function loop(){requestAnimationFrame(loop);const dt=Math.min(clk.getDelta(),.05),t=clk.elapsedTime;
if(K.ArrowLeft)yaw+=dt*2;if(K.ArrowRight)yaw-=dt*2;if(K.ArrowUp)pitch=Math.min(.7,pitch+dt);if(K.ArrowDown)pitch=Math.max(-.6,pitch-dt);
const f={x:-Math.sin(yaw),z:-Math.cos(yaw)},r={x:Math.cos(yaw),z:-Math.sin(yaw)};
const run=K.ShiftLeft||runB;let mx=(K.KeyW?1:0)-(K.KeyS?1:0)-jy,mz=(K.KeyD?1:0)-(K.KeyA?1:0)+jx;const mh=Math.hypot(mx,mz),len=Math.min(1,mh),mv=on&&len>.08;
if(mv){const sp=(run?5.5:3)*dt*len/mh;P.x+=(f.x*mx+r.x*mz)*sp;P.z+=(f.z*mx+r.z*mz)*sp;ph+=(run?9:6)*dt*len;
 const n=Math.floor(ph/Math.PI);if(n!==lastS){lastS=n;step(run)}}
resolve(P,.4);
fox.position.set(P.x,mv?Math.abs(Math.sin(ph))*.02:0,P.z);fox.rotation.y=yaw;
cp3.x=P.x+r.x*.6-f.x*1.9;cp3.z=P.z+r.z*.6-f.z*1.9;resolve(cp3,.3);
cam.position.set(cp3.x,1.5-pitch*1.0,cp3.z);
cam.lookAt(P.x+r.x*.3+f.x*8,1.05+Math.tan(pitch)*8,P.z+r.z*.3+f.z*8);
const cp=Math.cos(pitch);dv.set(f.x*cp,Math.sin(pitch),f.z*cp);
spot.position.set(P.x+r.x*.16+f.x*.3,.56,P.z+r.z*.16+f.z*.3);spot.target.position.copy(spot.position).addScaledVector(dv,10);
beam.position.copy(spot.position);beam.lookAt(spot.target.position);
lights.forEach(([m,p,bad])=>{let k=.5;if(bad)k=Math.sin(t*30+p)>.3?.5:.06;else if(Math.sin(t*.7+p)>.985)k=.15;m.material.color.setRGB(k,k*.96,k*.75)});
const w=(Math.sin(P.x*.05)+Math.sin(P.z*.04)+2)/4;w<.5?tc.copy(PAL[0]).lerp(PAL[1],w*2):tc.copy(PAL[1]).lerp(PAL[2],w*2-1);
scene.fog.color.copy(tc);scene.background.copy(tc);amb.color.copy(tc).multiplyScalar(1.5).addScalar(.04);
R.render(scene,cam)}
loop();
