import * as THREE from 'three';
const $=id=>document.getElementById(id),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cv=$('c'),ov=$('ov');
const touch=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;
if(touch)document.body.classList.add('touch');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:false});R.setPixelRatio(1);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x3a3318,.08);scene.background=new THREE.Color(0x3a3318);
const cam=new THREE.PerspectiveCamera(65,1,.1,80);
function rs(){const a=innerWidth/innerHeight,h=240;R.setSize(Math.round(h*a),h,false);cam.aspect=a;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
function tex(r,g,b,v,ln,rep){const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');
for(let i=0;i<32;i++)for(let j=0;j<32;j++){const k=(Math.random()-.5)*v;x.fillStyle=`rgb(${r+k|0},${g+k|0},${b+k|0})`;x.fillRect(i,j,1,1)}
if(ln){x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,0,32,1);x.fillRect(0,0,1,32)}
const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(rep,rep);return t}
const C=5,N=30,S=C*N,H=3.2,B=[],lights=[];
const mFloor=new THREE.MeshLambertMaterial({map:tex(150,130,70,40,0,S/2)});
const mWall=new THREE.MeshLambertMaterial({map:tex(175,160,95,25,1,1)});
const mCeil=new THREE.MeshLambertMaterial({map:tex(190,185,160,20,1,S/2.5)});
const fl=new THREE.Mesh(new THREE.PlaneGeometry(S,S).rotateX(-Math.PI/2),mFloor);fl.position.set(S/2,0,S/2);scene.add(fl);
const ce=new THREE.Mesh(new THREE.PlaneGeometry(S,S).rotateX(Math.PI/2),mCeil);ce.position.set(S/2,H,S/2);scene.add(ce);
function box(x,z,w,d,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,H,d),mat);m.position.set(x,H/2,z);scene.add(m);B.push([x-w/2,x+w/2,z-d/2,z+d/2])}
box(S/2,-.5,S+2,1,mWall);box(S/2,S+.5,S+2,1,mWall);box(-.5,S/2,1,S+2,mWall);box(S+.5,S/2,1,S+2,mWall);
let sd=7;const rnd=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const panelG=new THREE.BoxGeometry(1.6,.05,.6);
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const x=(i+.5)*C,z=(j+.5)*C;
 if(Math.hypot(x-S/2,z-S/2)>9){const r=rnd();
  if(r<.14)box(x,z,1.2,1.2,mWall);
  else if(r<.25){const o=rnd()*1.5-.75;rnd()<.5?box(x+o,z,4,.4,mWall):box(x,z+o,.4,4,mWall)}}
 if((i+j)%2==0&&rnd()>.3){const m=new THREE.Mesh(panelG,new THREE.MeshBasicMaterial({color:0xfff5c0}));m.position.set(x,H-.03,z);scene.add(m);lights.push([m,rnd()*50,rnd()<.2])}}
const amb=new THREE.AmbientLight(0x554f30,.9);scene.add(amb);
const spot=new THREE.SpotLight(0xfff0c0,2.4,45,.42,.5,1);scene.add(spot,spot.target);
const beam=new THREE.Mesh(new THREE.ConeGeometry(2.6,10,14,1,true).rotateX(-Math.PI/2).translate(0,0,5),
 new THREE.MeshBasicMaterial({color:0xffeebb,transparent:true,opacity:.06,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));scene.add(beam);
// ---- furry: cabeza redonda, orejitas, cuerpo capsula, cola
const fox=new THREE.Group(),blk=new THREE.MeshLambertMaterial({color:0x101014,flatShading:true}),grey=new THREE.MeshLambertMaterial({color:0x2c2c36,flatShading:true}),eyeM=new THREE.MeshBasicMaterial({color:0xd8ffb0});
const add=(g,m,x,y,z,p=fox)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o};
const bodyG=new THREE.Group();fox.add(bodyG);
add(new THREE.CapsuleGeometry(.3,.5,3,8),blk,0,.78,0,bodyG);
const head=new THREE.Group();head.position.set(0,1.55,-.02);fox.add(head);
add(new THREE.SphereGeometry(.34,9,7),blk,0,0,0,head);
for(const s of[-1,1]){add(new THREE.ConeGeometry(.1,.24,5),blk,s*.2,.31,0,head).rotation.z=-s*.25;add(new THREE.SphereGeometry(.04,5,4),eyeM,s*.12,.04,-.33,head)}
add(new THREE.SphereGeometry(.05,5,4),grey,0,-.05,-.37,head);
const feet=[];for(const s of[-1,1]){const g=new THREE.Group();g.position.set(s*.14,.2,0);fox.add(g);add(new THREE.BoxGeometry(.16,.14,.28),blk,0,-.12,-.04,g);feet.push(g)}
add(new THREE.CapsuleGeometry(.07,.22,3,6),blk,-.34,.85,0,bodyG);
const arm=add(new THREE.CapsuleGeometry(.07,.22,3,6),blk,.34,.9,-.15,bodyG);arm.rotation.x=-1.3;
add(new THREE.CylinderGeometry(.05,.05,.28,6).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:0xfff0c0}),.34,.88,-.45,bodyG);
const tail=new THREE.Group();tail.position.set(0,.55,.28);tail.rotation.x=-.5;fox.add(tail);
add(new THREE.CapsuleGeometry(.12,.4,3,6).rotateX(Math.PI/2).translate(0,0,.35),blk,0,0,0,tail);add(new THREE.SphereGeometry(.13,6,5),grey,0,0,.75,tail);
fox.scale.setScalar(.8);scene.add(fox);
// ---- input
const P=new THREE.Vector3(S/2,0,S/2),K={};let yaw=0,pitch=0,ph=0,lastS=0,on=false,jx=0,jy=0,runB=false,lightOn=true;
const toggleLight=()=>{lightOn=!lightOn;spot.visible=beam.visible=lightOn};
addEventListener('keydown',e=>{K[e.code]=1;if(e.code=='KeyF')toggleLight()});addEventListener('keyup',e=>K[e.code]=0);
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
// ---- audio
let A;
function audio(){if(A)return;const x=new(window.AudioContext||window.webkitAudioContext)(),m=x.createGain();m.gain.value=.6;m.connect(x.destination);
const L=x.sampleRate*4,ir=x.createBuffer(2,L,x.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}
const rv=x.createConvolver();rv.buffer=ir;const rg=x.createGain();rg.gain.value=.9;rv.connect(rg);rg.connect(m);
const dl=x.createDelay(2);dl.delayTime.value=.62;const fb=x.createGain();fb.gain.value=.55;const lp=x.createBiquadFilter();lp.frequency.value=1400;
dl.connect(lp);lp.connect(fb);fb.connect(dl);const eg=x.createGain();eg.gain.value=.7;lp.connect(eg);eg.connect(m);eg.connect(rv);
const bus=x.createGain();bus.connect(m);bus.connect(rv);bus.connect(dl);A={x,m,rv,bus};
const f=x.createBiquadFilter();f.frequency.value=700;f.connect(bus);
const lfo=x.createOscillator();lfo.frequency.value=.07;const lg=x.createGain();lg.gain.value=300;lfo.connect(lg);lg.connect(f.frequency);lfo.start();
const ch=[[110,164.8,220,261.6,329.6,493.9],[87.3,130.8,174.6,220,261.6,392],[73.4,110,146.8,220,261.6,329.6],[98,146.8,196,246.9,293.7,440]],os=[];
for(let k=0;k<6;k++)for(const dt of[-7,7]){const o=x.createOscillator();o.type=k%2?'sine':'triangle';o.frequency.value=ch[0][k];o.detune.value=dt;const g=x.createGain();g.gain.value=.035;o.connect(g);g.connect(f);o.start();os.push([o,k])}
let ci=0;setInterval(()=>{ci=(ci+1)%ch.length;os.forEach(([o,k])=>o.frequency.setTargetAtTime(ch[ci][k],x.currentTime,2.5))},14000);
const hm=x.createOscillator();hm.type='sawtooth';hm.frequency.value=60;const hf=x.createBiquadFilter();hf.frequency.value=180;const hg=x.createGain();hg.gain.value=.01;hm.connect(hf);hf.connect(hg);hg.connect(m);hm.start();
const pn=[440,493.9,587.3,659.3,784,880,987.8];
(function bell(){if(!document.hidden){const t=x.currentTime,o=x.createOscillator(),g=x.createGain();o.frequency.value=pn[Math.random()*pn.length|0]*(Math.random()<.3?.5:1);
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+4);o.connect(g);g.connect(bus);o.start(t);o.stop(t+4.2)}setTimeout(bell,4000+Math.random()*7000)})()}
function step(){if(!A)return;const x=A.x,b=x.createBuffer(1,x.sampleRate*.1|0,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
const s=x.createBufferSource();s.buffer=b;const f=x.createBiquadFilter();f.frequency.value=350;const g=x.createGain();g.gain.value=.25;s.connect(f);f.connect(g);g.connect(A.m);g.connect(A.rv);s.start()}
// ---- loop
const PAL=[new THREE.Color(0x3a3318),new THREE.Color(0x123533),new THREE.Color(0x33202c)],tc=new THREE.Color(),clk=new THREE.Clock(),dv=new THREE.Vector3();
function loop(){requestAnimationFrame(loop);const dt=Math.min(clk.getDelta(),.05),t=clk.elapsedTime;
if(K.ArrowLeft)yaw+=dt*2;if(K.ArrowRight)yaw-=dt*2;if(K.ArrowUp)pitch=Math.min(.7,pitch+dt);if(K.ArrowDown)pitch=Math.max(-.6,pitch-dt);
const f={x:-Math.sin(yaw),z:-Math.cos(yaw)},r={x:Math.cos(yaw),z:-Math.sin(yaw)};
const run=K.ShiftLeft||runB;let mx=(K.KeyW?1:0)-(K.KeyS?1:0)-jy,mz=(K.KeyD?1:0)-(K.KeyA?1:0)+jx;const mh=Math.hypot(mx,mz),len=Math.min(1,mh),mv=on&&len>.08;
if(mv){const sp=(run?5.5:3)*dt*len/mh;P.x+=(f.x*mx+r.x*mz)*sp;P.z+=(f.z*mx+r.z*mz)*sp;ph+=(run?9:6)*dt*len;
 const n=Math.floor(ph/Math.PI);if(n!==lastS){lastS=n;step()}}
for(const b of B){const cx=cl(P.x,b[0],b[1]),cz=cl(P.z,b[2],b[3]),dx=P.x-cx,dz=P.z-cz,d=Math.hypot(dx,dz);if(d<.4&&d>0){P.x+=dx/d*(.4-d);P.z+=dz/d*(.4-d)}}
fox.position.copy(P);fox.rotation.y=yaw;head.rotation.x=pitch*.6;
feet[0].rotation.x=mv?Math.sin(ph)*.7:0;feet[1].rotation.x=mv?-Math.sin(ph)*.7:0;
bodyG.rotation.z=mv?Math.sin(ph)*.05:0;fox.position.y=mv?Math.abs(Math.sin(ph))*.05:0;tail.rotation.y=Math.sin(t*(mv?6:1.5))*.4;
cam.position.set(P.x+r.x*.85-f.x*2.8,1.7-pitch*1.4,P.z+r.z*.85-f.z*2.8);
cam.lookAt(P.x+r.x*.4+f.x*8,1+Math.tan(pitch)*8,P.z+r.z*.4+f.z*8);
const cp=Math.cos(pitch);dv.set(f.x*cp,Math.sin(pitch),f.z*cp);
spot.position.set(P.x+r.x*.27+f.x*.36,.7,P.z+r.z*.27+f.z*.36);spot.target.position.copy(spot.position).addScaledVector(dv,10);
beam.position.copy(spot.position);beam.lookAt(spot.target.position);
lights.forEach(([m,p,bad])=>{let k=.95;if(bad)k=Math.sin(t*30+p)>.2?.95:.15;else if(Math.sin(t*.7+p)>.985)k=.4;m.material.color.setRGB(k,k*.96,k*.75)});
const w=(Math.sin(P.x*.05)+Math.sin(P.z*.04)+2)/4;w<.5?tc.copy(PAL[0]).lerp(PAL[1],w*2):tc.copy(PAL[1]).lerp(PAL[2],w*2-1);
scene.fog.color.copy(tc);scene.background.copy(tc);amb.color.copy(tc).multiplyScalar(1.6).addScalar(.1);
R.render(scene,cam)}
loop();
