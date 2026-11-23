import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { App } from '@capacitor/app';
const $=id=>document.getElementById(id),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cv=$('c'),touch=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;
if(touch)document.body.classList.add('touch');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:false});R.setPixelRatio(1);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x080b14,.1);scene.background=new THREE.Color(0x080b14);
const cam=new THREE.PerspectiveCamera(65,1,.1,70);
function rs(){const a=innerWidth/innerHeight,h=240;R.setSize(Math.round(h*a),h,false);cam.aspect=a;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
function tex(r,g,b,v,rep,c2){const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');
for(let i=0;i<32;i++)for(let j=0;j<32;j++){const q=c2&&((i>>4)^(j>>4))&1,[a,e,f]=q?c2:[r,g,b],k=(Math.random()-.5)*v;x.fillStyle=`rgb(${a+k|0},${e+k|0},${f+k|0})`;x.fillRect(i,j,1,1)}
const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(rep,rep);return t}
const LM=(r,g,b,v=14,rep=1,c2)=>new THREE.MeshLambertMaterial({map:tex(r,g,b,v,rep,c2)}),BM=c=>new THREE.MeshBasicMaterial({color:c});
const H=3.6,B=[],bk=new Map(),lights=[];
const asph=LM(48,48,54,16,100),tile=LM(175,165,145,12,15,[150,42,36]),wIn=LM(165,152,118),wOut=LM(150,140,125),red=LM(160,30,30,12),roofM=LM(60,55,55),ceilM=LM(150,145,125,10,12),
 wood=LM(95,60,34,24),steel=LM(125,130,135,12),dark=LM(45,45,50),pinkM=LM(205,120,160),blueM=LM(40,70,170),yelM=LM(210,170,30),
 cars=[LM(120,30,30),LM(30,60,110),LM(70,75,70),LM(150,140,110)],white=BM(0x9a9a9a),gMenu=BM(0xb08a30),gSign=BM(0xd02a20),gLamp=BM(0x9a8a50);
function gb(m,w,h,d,x,y,z){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);if(!bk.has(m))bk.set(m,[]);bk.get(m).push(g)}
function solid(m,w,h,d,x,y,z){gb(m,w,h,d,x,y,z);B.push([x-w/2,x+w/2,z-d/2,z+d/2])}
const gr=new THREE.Mesh(new THREE.PlaneGeometry(300,300).rotateX(-Math.PI/2),asph);scene.add(gr);
const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,22).rotateX(-Math.PI/2),tile);fl.position.y=.02;scene.add(fl);
const ce=new THREE.Mesh(new THREE.PlaneGeometry(30,22).rotateX(Math.PI/2),ceilM);ce.position.y=H;scene.add(ce);
// edificio
solid(wOut,30.4,H,.4,0,H/2,-11);solid(wOut,.4,H,22.4,-15,H/2,0);solid(wOut,.4,H,22.4,15,H/2,0);solid(wOut,13,H,.4,-8.5,H/2,11);solid(wOut,13,H,.4,8.5,H/2,11);
gb(red,13,.5,.1,-8.5,3.2,11.25);gb(red,13,.5,.1,8.5,3.2,11.25);gb(roofM,31,.4,23,0,H+.2,0);gb(gSign,4,.6,.2,0,3.3,11.3);
solid(wood,13.5,1.1,.6,-8.25,.55,-4);solid(wood,13.5,1.1,.6,8.25,.55,-4);gb(gMenu,6,1.4,.1,0,2.5,-10.75);
// parqueadero: lineas, autos, postes, letrero
for(let z of[22,36])for(let i=-12;i<=12;i++)gb(white,.12,.02,5,i*3.2,.02,z);
for(let z of[22,36])for(let i=-12;i<12;i++)if(Math.random()<.45){const c=cars[Math.random()*4|0],x=i*3.2+1.6;solid(c,1.8,.7,4.2,x,.55,z);gb(dark,1.6,.5,2,x,1.15,z)}
for(const x of[-24,-8,8,24])for(const z of[16,30]){solid(dark,.2,6,.2,x,3,z);gb(gLamp,.9,.15,.6,x,6,z)}
solid(dark,.5,8,.5,16,4,18);gb(gSign,3.4,2.2,.4,16,8,18);
B.push([-60,60,-30,-29],[-60,60,59,60],[-61,-60,-30,60],[60,61,-30,60]);
// zona de pelotas
solid(red,9.2,.7,.3,10,.35,1);solid(red,9.2,.7,.3,10,.35,10.5);solid(red,.3,.7,3,5.5,.35,2.5);solid(red,.3,.7,4.5,5.5,.35,8.25);solid(blueM,1.8,1.6,1.8,13.4,.8,2.4);solid(yelM,1.8,1.1,1.8,13.4,.55,9.2);
const balls=new THREE.InstancedMesh(new THREE.SphereGeometry(.22,6,4),new THREE.MeshLambertMaterial({flatShading:true}),380),bc=[0xd02a20,0x2a60d0,0xe0c020,0x30b050,0xe070b0],tm=new THREE.Object3D();
for(let i=0;i<380;i++){tm.position.set(5.9+Math.random()*8.4,.16+Math.random()*.14,1.4+Math.random()*8.7);tm.updateMatrix();balls.setMatrixAt(i,tm.matrix);balls.setColorAt(i,new THREE.Color(bc[i%5]))}scene.add(balls);
// mesas, basura, estaciones
const TB=[],BINS=[{x:7,z:-10},{x:3,z:10.3}],ST=[];
[[-11,1],[-6,1],[-1,1],[-11,6],[-6,6],[-1,6]].forEach(([x,z],i)=>{gb(wood,1.5,.08,1,x,.78,z);for(const a of[-1,1])for(const b of[-1,1])gb(wood,.08,.75,.08,x+a*.65,.375,z+b*.4);
 B.push([x-.75,x+.75,z-.5,z+.5]);for(const a of[-1,1])gb(blueM,.5,.5,.5,x+a*1.15,.25,z);TB.push({x,z,i,order:null,placed:[],dirty:[],meshes:[],done:0})});
for(const b of BINS)solid(steel,.8,1,.8,b.x,.5,b.z);
const SD={grill:{e:'🍔',n:'Poner carne',c:6,g:7,item:'burger',m:dark},fry:{e:'🍟',n:'Freír papas',c:5,g:7,item:'fries',m:steel},shake:{e:'🥤',n:'Preparar malteada',c:4,g:15,item:'shake',m:pinkM}};
[['grill',-11],['grill',-8.5],['fry',-5],['fry',-2.5],['shake',1],['shake',3.5]].forEach(([type,x])=>{solid(SD[type].m,1.7,1,1,x,.5,-9.8);
 const ind=new THREE.Mesh(new THREE.SphereGeometry(.14,6,5),new THREE.MeshBasicMaterial({color:0x666666}));ind.position.set(x,1.4,-9.8);scene.add(ind);ST.push({type,x,z:-9.8,s:'idle',t:0,ind})});
for(let x=-12;x<=12;x+=6)for(let z=-9;z<=9;z+=6){const m=new THREE.Mesh(new THREE.BoxGeometry(1.6,.05,.6),BM(0xfff0c0));m.position.set(x,H-.03,z);scene.add(m);lights.push([m,Math.random()*50,Math.random()<.2])}
for(const[m,gs]of bk)scene.add(new THREE.Mesh(mergeGeometries(gs),m));
const amb=new THREE.AmbientLight(0x887050,.9);scene.add(amb);
const spot=new THREE.SpotLight(0xfff0c0,3.2,34,.4,.5,1);scene.add(spot,spot.target);
const beam=new THREE.Mesh(new THREE.ConeGeometry(2.4,9,14,1,true).rotateX(-Math.PI/2).translate(0,0,4.5),new THREE.MeshBasicMaterial({color:0xffeebb,transparent:true,opacity:.07,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));scene.add(beam);
// items
const cyl=(a,b,h)=>new THREE.CylinderGeometry(a,b,h,7),bx=(a,b,c)=>new THREE.BoxGeometry(a,b,c),LB=c=>new THREE.MeshLambertMaterial({color:c,flatShading:true});
const mt={bun:LB(0xc08030),pat:LB(0x4a2a18),red:LB(0xc02020),fr:LB(0xe8c030),pk:LB(0xe070a0),wh:LB(0xeeeeee),tr:LB(0x77746a)};
function mk(t){const g=new THREE.Group(),a=(ge,m,y)=>{const o=new THREE.Mesh(ge,m);o.position.y=y;g.add(o)};
 if(t=='burger'){a(cyl(.16,.16,.07),mt.bun,.03);a(cyl(.17,.17,.05),mt.pat,.09);a(cyl(.16,.16,.09),mt.bun,.17)}
 else if(t=='fries'){a(bx(.18,.1,.12),mt.red,.05);a(bx(.14,.14,.09),mt.fr,.16)}
 else if(t=='shake'){a(cyl(.09,.06,.25),mt.pk,.13);a(cyl(.1,.1,.03),mt.wh,.27)}
 else a(bx(.2,.12,.16),mt.tr,.06);return g}
const MENU={burger:{e:'🍔',p:8},fries:{e:'🍟',p:4},shake:{e:'🥤',p:6},trash:{e:'🗑️',p:0}};
// zorro
const fox=new THREE.Group(),blk=new THREE.MeshLambertMaterial({color:0x121216,flatShading:true}),eyeM=BM(0xd8ffb0);
const add=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);fox.add(o);return o};
add(new THREE.CapsuleGeometry(.3,.5,3,8),blk,0,.55,0);add(new THREE.SphereGeometry(.34,9,7),blk,0,1.38,0);
for(const s of[-1,1]){add(new THREE.ConeGeometry(.11,.42,5),blk,s*.17,1.9,0).rotation.z=-s*.15;add(new THREE.SphereGeometry(.04,5,4),eyeM,s*.12,1.42,-.33)}
add(new THREE.SphereGeometry(.05,5,4),LB(0x2c2c36),0,1.33,-.37);add(new THREE.CylinderGeometry(.05,.05,.3,6).rotateX(Math.PI/2),BM(0xfff0c0),.2,.7,-.3);
fox.scale.setScalar(.8);scene.add(fox);
const mark=new THREE.Mesh(new THREE.ConeGeometry(.18,.4,5).rotateX(Math.PI),BM(0xffd040));mark.visible=false;scene.add(mark);
// juego
let state='title',hand=[],money=0,tips=0,day=1,dayT=180,served=0,lost=0,orders=[],oid=0,spawnT=4,litT=8,hudT=0,snd=true;
const stains=[],litter=[],P=new THREE.Vector3(0,0,15),K={};let yaw=0,pitch=0,ph=0,lastS=0,jx=0,jy=0,runB=false,lightOn=true;
const LORE=['📞 Suena un teléfono en alguna parte…','📟 Un pedido apareció en la pantalla.','🔔 Alguien pidió. No hay nadie en la mesa.','📠 El ticket salió solo de la impresora.'];
function toast(s){const t=$('toasts'),d=document.createElement('div');d.textContent=s;t.appendChild(d);setTimeout(()=>d.remove(),3500);while(t.children.length>3)t.firstChild.remove()}
const dirtN=()=>stains.length+litter.length+TB.filter(t=>t.dirty.length).length,cleanM=()=>cl(1-.07*dirtN(),.4,1);
const need=(tb,t)=>tb.order&&tb.order.items.filter(i=>i==t).length>tb.placed.filter(i=>i==t).length;
const slot=(tb,i)=>[tb.x+[-.45,0,.45][i%3],.82,tb.z];
function clearTb(tb){tb.meshes.forEach(m=>scene.remove(m));tb.meshes=[];tb.placed=[]}
function spawnOrder(){const free=TB.filter(t=>!t.order&&!t.dirty.length);if(!free.length||orders.length>=4)return;const tb=free[Math.random()*free.length|0],ks=['burger','fries','shake'],n=1+(Math.random()<.6)+(Math.random()<.3),items=[];
 for(let i=0;i<n;i++)items.push(ks[Math.random()*3|0]);const p=Math.max(40,70-day*3)+12*n;tb.order={id:++oid,tb,items,t:p,max:p};orders.push(tb.order);sfx.ding();toast(LORE[Math.random()*4|0])}
function pay(tb){const o=tb.order,price=o.items.reduce((s,t)=>s+MENU[t].p,0),tip=Math.round(price*.6*cl(o.t/o.max,0,1)*cleanM());money+=price+tip;tips+=tip;served++;sfx.cash();toast(`💰 +$${price+tip} (propina $${tip}) — apareció en la caja`);
 orders.splice(orders.indexOf(o),1);tb.order=null;clearTb(tb);tb.dirty=o.items.map(()=>'trash');tb.dirty.forEach((t,i)=>{const m=mk('trash');m.position.set(...slot(tb,i));scene.add(m);tb.meshes.push(m)});
 if(Math.random()<.45)addStain(tb.x+(Math.random()-.5)*2.6,tb.z+1.2+Math.random())}
function lose(tb){orders.splice(orders.indexOf(tb.order),1);tb.order=null;clearTb(tb);money=Math.max(0,money-5);lost++;toast(`❌ Mesa ${tb.i+1} se esfumó sin comer… -$5`)}
function addStain(x,z){const m=new THREE.Mesh(new THREE.CircleGeometry(.5,8).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x3a2410,transparent:true,opacity:.85}));x=cl(x,-14,4.5);z=cl(z,-3,10);m.position.set(x,.04,z);scene.add(m);stains.push({x,z,m,hp:2})}
function addLitter(){if(litter.length>=8)return;const o=Math.random()<.6,x=o?-14+Math.random()*18:-6+Math.random()*12,z=o?-3+Math.random()*13:12.5+Math.random()*8,m=mk('trash');m.position.set(x,.02,z);m.rotation.y=Math.random()*6;scene.add(m);litter.push({x,z,m})}
const stPr=s=>s.s=='idle'?'▶ '+SD[s.type].n:s.s=='cook'?null:hand.length<3?(s.s=='ready'?'✋ Tomar '+SD[s.type].e:'♻️ Retirar quemado'):null;
function stRun(s){const d=SD[s.type];if(s.s=='idle'){s.s='cook';s.t=d.c;sfx.sizzle()}else{hand.push(s.s=='ready'?d.item:'trash');s.s='idle';sfx.pick()}}
const tPr=tb=>tb.dirty.length&&hand.length<3?'🗑️ Recoger platos':tb.order&&hand.some(t=>need(tb,t))?'🍽️ Servir mesa '+(tb.i+1):null;
function tRun(tb){if(tb.dirty.length&&hand.length<3){const n=Math.min(tb.dirty.length,3-hand.length);for(let i=0;i<n;i++){tb.dirty.pop();hand.push('trash');scene.remove(tb.meshes.pop())}sfx.pick();return}
 for(let i=hand.length-1;i>=0;i--){const t=hand[i];if(need(tb,t)){hand.splice(i,1);tb.placed.push(t);const m=mk(t);m.position.set(...slot(tb,tb.placed.length-1));scene.add(m);tb.meshes.push(m)}}
 sfx.pick();if(tb.placed.length==tb.order.items.length)tb.done=1.2}
function findAct(){let bd=1e9,ba=null;const c=(x,z,r,pr,run)=>{const d=Math.hypot(P.x-x,P.z-z);if(d<r&&d<bd){const s=pr();if(s){bd=d;ba={x,z,s,run}}}};
 ST.forEach(s=>c(s.x,s.z,2.1,()=>stPr(s),()=>stRun(s)));TB.forEach(t=>c(t.x,t.z,1.9,()=>tPr(t),()=>tRun(t)));
 BINS.forEach(b=>c(b.x,b.z,1.9,()=>hand.includes('trash')?'🗑️ Tirar basura':null,()=>{const n=hand.filter(t=>t=='trash').length;hand=hand.filter(t=>t!='trash');money+=n;sfx.pick();toast('♻️ +$'+n)}));
 stains.forEach(s=>c(s.x,s.z,1.5,()=>'🧽 Limpiar mancha',()=>{sfx.scrub();if(--s.hp<=0){scene.remove(s.m);stains.splice(stains.indexOf(s),1)}else s.m.material.opacity=.4}));
 litter.forEach(l=>c(l.x,l.z,1.5,()=>hand.length<3?'🧹 Recoger basura':null,()=>{scene.remove(l.m);litter.splice(litter.indexOf(l),1);hand.push('trash');sfx.pick()}));return ba}
const act=()=>{if(state!='play')return;const a=findAct();a&&a.run()};
function endDay(){setState('sum');$('sumT').textContent='DÍA '+day+' TERMINADO';$('sumP').innerHTML=`Pedidos servidos: ${served}<br>Perdidos: ${lost}<br>Propinas: $${tips}<br>Dinero total: $${money}<br>Limpieza: ${Math.round(cleanM()*100)}%`}
function newDay(){day++;dayT=180;served=lost=tips=0;orders.length=0;TB.forEach(t=>{t.order=null;t.done=0;t.placed=[];t.meshes=t.meshes.slice(0,t.dirty.length)});hand=[];spawnT=3;setState('play')}
// entrada
const setState=s=>{state=s;const sh=(i,v)=>$(i).style.display=v?'flex':'none';sh('title',s=='title');sh('pause',s=='pause');sh('sum',s=='sum');$('hud').style.display=s=='title'?'none':'block';if(s!='play'&&document.pointerLockElement)document.exitPointerLock();
 if(s=='play'){A&&A.x.resume();if(!touch&&cv.requestPointerLock)cv.requestPointerLock()}};
const toggleLight=()=>{lightOn=!lightOn;spot.visible=beam.visible=lightOn;click(lightOn)};
addEventListener('keydown',e=>{K[e.code]=1;if(e.repeat)return;if(e.code=='KeyF'&&state=='play')toggleLight();if(e.code=='KeyE')act();if(e.code=='KeyP'&&state=='play')setState('pause')});addEventListener('keyup',e=>K[e.code]=0);
addEventListener('mousemove',e=>{if(state!='play'||touch)return;yaw-=e.movementX*.0025;pitch=cl(pitch-e.movementY*.0025,-.6,.7)});
document.addEventListener('pointerlockchange',()=>{if(!touch&&!document.pointerLockElement&&state=='play')setState('pause')});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(state=='play')setState('pause');A&&A.x.suspend()}});
$('bPlay').onclick=()=>{audio();setState('play')};$('bResume').onclick=()=>setState('play');$('bNext').onclick=newDay;
$('bSnd').onclick=()=>{snd=!snd;if(A)A.m.gain.value=snd?.9:0;$('bSnd').textContent='🔊 Sonido: '+(snd?'SÍ':'NO')};
$('bExit').onclick=async()=>{try{await App.exitApp()}catch(e){}setState('title')};$('bPause').onclick=()=>state=='play'&&setState('pause');
(()=>{const z=$('zl'),st=$('stick'),kn=$('knob');let id=null,ox,oy;
z.addEventListener('pointerdown',e=>{if(id!==null)return;id=e.pointerId;z.setPointerCapture(id);ox=e.clientX;oy=e.clientY;st.style.cssText=`display:block;left:${ox-60}px;top:${oy-60}px`});
z.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;let dx=e.clientX-ox,dy=e.clientY-oy;const d=Math.hypot(dx,dy);if(d>60){dx*=60/d;dy*=60/d}jx=dx/60;jy=dy/60;kn.style.transform=`translate(${dx}px,${dy}px)`});
const end=e=>{if(e.pointerId!==id)return;id=null;jx=jy=0;st.style.display='none';kn.style.transform=''};z.addEventListener('pointerup',end);z.addEventListener('pointercancel',end);
const r=$('zr');let rid=null,lx,ly;
r.addEventListener('pointerdown',e=>{if(rid!==null)return;rid=e.pointerId;r.setPointerCapture(rid);lx=e.clientX;ly=e.clientY});
r.addEventListener('pointermove',e=>{if(e.pointerId!==rid)return;yaw-=(e.clientX-lx)*.006;pitch=cl(pitch-(e.clientY-ly)*.006,-.6,.7);lx=e.clientX;ly=e.clientY});
const re=e=>{if(e.pointerId===rid)rid=null};r.addEventListener('pointerup',re);r.addEventListener('pointercancel',re);
const b=$('bRun'),up=()=>runB=false;b.addEventListener('pointerdown',()=>runB=true);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up);
$('bLight').addEventListener('pointerdown',()=>state=='play'&&toggleLight());$('bAct').addEventListener('pointerdown',act)})();
// audio (sin musica)
let A;
function audio(){if(A)return;const x=new(window.AudioContext||window.webkitAudioContext)(),m=x.createGain();m.gain.value=snd?.9:0;m.connect(x.destination);
const L=x.sampleRate*2.5|0,ir=x.createBuffer(2,L,x.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}
const rv=x.createConvolver();rv.buffer=ir;const rg=x.createGain();rg.gain.value=.5;rv.connect(rg);rg.connect(m);A={x,m,rv}}
function nz(t,dur,type,fq,vol,rev){const x=A.x,n=x.sampleRate*dur|0,b=x.createBuffer(1,n,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
 const s=x.createBufferSource();s.buffer=b;const f=x.createBiquadFilter();f.type=type;f.frequency.value=fq;const g=x.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(A.m);const r=x.createGain();r.gain.value=rev;g.connect(r);r.connect(A.rv);s.start(t)}
function tone(f,d,ty='sine',v=.2,f2,dl=0){const x=A.x,t=x.currentTime+dl,o=x.createOscillator(),g=x.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(A.m);g.connect(A.rv);o.start(t);o.stop(t+d+.02)}
const sfx={ding(){A&&(tone(880,.7),tone(1320,.9,'sine',.15,0,.12))},cash(){A&&(tone(1200,.1,'square',.07),tone(1800,.3,'square',.07,0,.09))},pick(){A&&tone(500,.09,'triangle',.25,850)},sizzle(){A&&nz(A.x.currentTime,.6,'highpass',3000,.3,.1)},scrub(){A&&nz(A.x.currentTime,.3,'bandpass',1200,.5,.1)}};
function step(run){if(!A)return;const t=A.x.currentTime;nz(t,.12,'lowpass',260+Math.random()*200,run?.6:.45,.8);tone(115,.1,'sine',.35,45)}
function click(on){if(!A)return;for(const[dl,fq]of[[0,on?2300:1600],[.045,on?1500:2100]]){nz(A.x.currentTime+dl,.02,'highpass',1800,.5,.25);tone(fq,.025,'square',.1,0,dl)}}
// bucle
const tc=new THREE.Color(),cIn=new THREE.Color(0x2a2410),cOut=new THREE.Color(0x080b14),clk=new THREE.Clock(),dv=new THREE.Vector3(),cp3={x:0,z:0},ECOL={idle:0x666666,cook:0xff8800,ready:0x44ff44,burnt:0xff2222};
function resolve(p,rad){for(const b of B){const qx=cl(p.x,b[0],b[1]),qz=cl(p.z,b[2],b[3]),dx=p.x-qx,dz=p.z-qz,d=Math.hypot(dx,dz);if(d<rad&&d>0){p.x+=dx/d*(rad-d);p.z+=dz/d*(rad-d)}}}
function loop(){requestAnimationFrame(loop);const play=state=='play',dt=play?Math.min(clk.getDelta(),.05):(clk.getDelta(),0),t=clk.elapsedTime;
 if(K.ArrowLeft)yaw+=.016*2;if(K.ArrowRight)yaw-=.016*2;if(K.ArrowUp)pitch=Math.min(.7,pitch+.016);if(K.ArrowDown)pitch=Math.max(-.6,pitch-.016);
 const f={x:-Math.sin(yaw),z:-Math.cos(yaw)},r={x:Math.cos(yaw),z:-Math.sin(yaw)},run=K.ShiftLeft||runB,inP=P.x>5.5&&P.x<14.5&&P.z>1&&P.z<10.5;
 const mx=(K.KeyW?1:0)-(K.KeyS?1:0)-jy,mz=(K.KeyD?1:0)-(K.KeyA?1:0)+jx,mh=Math.hypot(mx,mz),len=Math.min(1,mh),mv=play&&len>.08;
 if(mv){const sp=(run?5.5:3)*(inP?.55:1)*dt*len/mh;P.x+=(f.x*mx+r.x*mz)*sp;P.z+=(f.z*mx+r.z*mz)*sp;ph+=(run?9:6)*dt*len;const n=Math.floor(ph/Math.PI);if(n!==lastS){lastS=n;step(run)}}
 resolve(P,.4);fox.position.set(P.x,(inP?-.18:0)+(mv?Math.abs(Math.sin(ph))*.02:0),P.z);fox.rotation.y=yaw;
 if(play){dayT-=dt;if(dayT<=0)endDay();spawnT-=dt;if(spawnT<=0){if(dayT>12)spawnOrder();spawnT=Math.max(8,20-day*1.5)+Math.random()*5}litT-=dt;if(litT<=0){addLitter();litT=14}
  ST.forEach(s=>{if(s.s=='cook'&&(s.t-=dt)<=0){s.s='ready';s.t=SD[s.type].g;sfx.pick()}else if(s.s=='ready'&&(s.t-=dt)<=0)s.s='burnt';s.ind.material.color.setHex(ECOL[s.s])});
  TB.forEach(tb=>{if(tb.order){tb.order.t-=dt;if(tb.done>0&&(tb.done-=dt)<=0)pay(tb);else if(tb.order&&tb.order.t<=0)lose(tb)}})}
 hudT-=dt;if(hudT<=0&&state!='title'){hudT=.25;$('tickets').innerHTML=orders.map(o=>{const pl=[...o.tb.placed];return`<div class="tk"><b>#${o.id} Mesa ${o.tb.i+1}</b> ${o.items.map(i=>{const k=pl.indexOf(i);if(k>=0){pl.splice(k,1);return'✅'}return MENU[i].e}).join(' ')}<i style="width:${Math.max(0,o.t/o.max*100)}%"></i></div>`}).join('');
  const s=Math.max(0,dayT|0);$('stats').textContent=`📅${day} 💰$${money} ⏱${s/60|0}:${String(s%60).padStart(2,'0')} ✨${Math.round(cleanM()*100)}%`;$('hand').textContent=[0,1,2].map(i=>hand[i]?MENU[hand[i]].e:'·').join(' ')}
 const a=play?findAct():null;if(a){$('prompt').textContent=a.s;mark.visible=true;mark.position.set(a.x,1.9+Math.sin(t*4)*.08,a.z)}else{if(state!='title')$('prompt').textContent='';mark.visible=false}
 cp3.x=P.x+r.x*.6-f.x*1.9;cp3.z=P.z+r.z*.6-f.z*1.9;resolve(cp3,.3);cam.position.set(cp3.x,1.5-pitch*1.0,cp3.z);cam.lookAt(P.x+r.x*.3+f.x*8,1.05+Math.tan(pitch)*8,P.z+r.z*.3+f.z*8);
 const cp=Math.cos(pitch);dv.set(f.x*cp,Math.sin(pitch),f.z*cp);spot.position.set(P.x+r.x*.16+f.x*.3,.56,P.z+r.z*.16+f.z*.3);spot.target.position.copy(spot.position).addScaledVector(dv,10);beam.position.copy(spot.position);beam.lookAt(spot.target.position);
 lights.forEach(([m,p,bad])=>{let k=.9;if(bad)k=Math.sin(t*30+p)>.3?.9:.1;else if(Math.sin(t*.7+p)>.99)k=.3;m.material.color.setRGB(k,k*.96,k*.78)});
 const w=1-cl(Math.max(Math.abs(P.x)-15,P.z-11,-P.z-11,0)/5,0,1);tc.copy(cOut).lerp(cIn,w);scene.fog.color.copy(tc);scene.background.copy(tc);amb.intensity=.4+.6*w;
 R.render(scene,cam)}
setState('title');loop();
