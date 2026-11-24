import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { App } from '@capacitor/app';
const $=id=>document.getElementById(id),cl=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a);
const cv=$('c'),coarse=matchMedia('(pointer:coarse)').matches;
let touch=coarse; // se corrige solo en cuanto se detecta un toque real (ver "controles táctiles")
if(touch)document.body.classList.add('touch');
const NIGHT=0x050814; // aquí SIEMPRE es de noche
const R=new THREE.WebGLRenderer({canvas:cv,antialias:false});R.setPixelRatio(1);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(NIGHT,.1);scene.background=new THREE.Color(NIGHT);
const cam=new THREE.PerspectiveCamera(65,1,.1,70);
function rs(){const a=innerWidth/innerHeight,h=240;R.setSize(Math.round(h*a),h,false);cam.aspect=a;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
function tex(r,g,b,v,rep,c2){const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');
for(let i=0;i<32;i++)for(let j=0;j<32;j++){const q=c2&&((i>>4)^(j>>4))&1,[a,e,f]=q?c2:[r,g,b],k=(Math.random()-.5)*v;x.fillStyle=`rgb(${a+k|0},${e+k|0},${f+k|0})`;x.fillRect(i,j,1,1)}
const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(rep,rep);return t}
// texturas suaves (halos de luz, luna, copos)
function soft(size,stops){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d'),h=size/2,g=x.createRadialGradient(h,h,0,h,h,h);stops.forEach(([o,col])=>g.addColorStop(o,col));x.fillStyle=g;x.fillRect(0,0,size,size);return new THREE.CanvasTexture(c)}
const LM=(r,g,b,v=14,rep=1,c2)=>new THREE.MeshLambertMaterial({map:tex(r,g,b,v,rep,c2)}),BM=c=>new THREE.MeshBasicMaterial({color:c});
const H=3.6,B=[],bk=new Map();
const asph=LM(48,48,54,16,100),tile=LM(175,165,145,12,15,[150,42,36]),wIn=LM(165,152,118),wOut=LM(150,140,125),red=LM(160,30,30,12),roofM=LM(60,55,55),ceilM=LM(150,145,125,10,12),
 wood=LM(95,60,34,24),steel=LM(125,130,135,12),dark=LM(45,45,50),pinkM=LM(205,120,160),blueM=LM(40,70,170),yelM=LM(210,170,30),genM=LM(58,84,52,10),
 ceilTileM=LM(150,145,125,14),white=LM(150,150,145,0),gMenu=BM(0xb08a30),gSign=BM(0xd02a20),gExit=BM(0xd01818);
function gb(m,w,h,d,x,y,z){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);if(!bk.has(m))bk.set(m,[]);bk.get(m).push(g)}
function solid(m,w,h,d,x,y,z){gb(m,w,h,d,x,y,z);B.push([x-w/2,x+w/2,z-d/2,z+d/2])}
const gr=new THREE.Mesh(new THREE.PlaneGeometry(300,300).rotateX(-Math.PI/2),asph);scene.add(gr);
const fl=new THREE.Mesh(new THREE.PlaneGeometry(30,22).rotateX(-Math.PI/2),tile);fl.position.y=.02;scene.add(fl);
const ce=new THREE.Mesh(new THREE.PlaneGeometry(30,22).rotateX(Math.PI/2),ceilM);ce.position.y=H;scene.add(ce);
// edificio
solid(wOut,30.4,H,.4,0,H/2,-11);solid(wOut,.4,H,22.4,-15,H/2,0);solid(wOut,.4,H,22.4,15,H/2,0);solid(wOut,13,H,.4,-8.5,H/2,11);solid(wOut,13,H,.4,8.5,H/2,11);
gb(red,13,.5,.1,-8.5,3.2,11.25);gb(red,13,.5,.1,8.5,3.2,11.25);gb(roofM,31,.4,23,0,H+.2,0);gb(gSign,4,.6,.2,0,3.3,11.3);
gb(gExit,1.1,.28,.1,0,3.05,10.6); // cartel de salida: la única luz que sobrevive a un apagón
solid(wood,13.5,1.1,.6,-8.25,.55,-4);solid(wood,13.5,1.1,.6,8.25,.55,-4);gb(gMenu,6,1.4,.1,0,2.5,-10.75);
// ===== parqueadero VACÍO: solo líneas pintadas y postes de luz =====
for(let z of[22,36,50])for(let i=-12;i<=12;i++)gb(white,.12,.02,5,i*3.2,.02,z);
const glow=soft(64,[[0,'rgba(255,225,160,1)'],[.35,'rgba(255,200,110,.35)'],[1,'rgba(255,190,100,0)']]);
const LAMPS=[]; // postes: {x,z,hm(cabeza),hal(halo),pool(charco de luz),k(brillo actual),bad(parpadea siempre)}
for(const x of[-40,-24,-8,8,24,40])for(const z of[16,30,44]){
 solid(dark,.2,6,.2,x,3,z);
 const hm=BM(0xffe0a0),head=new THREE.Mesh(new THREE.BoxGeometry(.9,.15,.6),hm);head.position.set(x,6,z);scene.add(head);
 const hal=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xffd890,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,fog:false}));hal.scale.set(5,5,1);hal.position.set(x,5.9,z);scene.add(hal);
 const pool=new THREE.Mesh(new THREE.PlaneGeometry(13,13).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:glow,color:0xffcf80,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.5}));pool.position.set(x,.04,z);scene.add(pool);
 LAMPS.push({x,z,hm,hal,pool,k:1,ph:Math.random()*100,bad:Math.random()<.18})}
const lampL=[0,1].map(()=>{const l=new THREE.PointLight(0xffd890,0,24,1);l.position.set(0,5.4,0);scene.add(l);return l}); // 2 luces reales que siguen a los postes más cercanos
solid(dark,.5,8,.5,16,4,18);gb(gSign,3.4,2.2,.4,16,8,18); // letrero del local
B.push([-60,60,-30,-29],[-60,60,59,60],[-61,-60,-30,60],[60,61,-30,60]);
// ===== generador (costado este, afuera) =====
const GEN={x:19,z:3};
solid(genM,1.5,.9,1,GEN.x,.55,GEN.z);gb(dark,1.7,.12,1.2,GEN.x,.06,GEN.z);gb(red,.5,.3,.7,GEN.x+.2,1.15,GEN.z);gb(steel,.12,.7,.12,GEN.x+.5,1.3,GEN.z-.3);gb(yelM,.16,.16,.34,GEN.x-.85,.75,GEN.z);
const genLed=new THREE.Mesh(new THREE.SphereGeometry(.1,6,5),new THREE.MeshBasicMaterial({color:0x33ff55,fog:false}));genLed.position.set(GEN.x-.5,1.2,GEN.z+.4);scene.add(genLed);
// ===== congelador de la cocina (puerta animada) =====
const FR={x:-13,z:-7,open:false,t:0,beep:0,ang:0};
solid(steel,1.2,1.8,1.4,-14.2,.9,-7);
const frPivot=new THREE.Object3D();frPivot.position.set(-13.58,.95,-7.65);scene.add(frPivot);
{const d=new THREE.Mesh(new THREE.BoxGeometry(.06,1.7,1.3).translate(0,0,.65),new THREE.MeshLambertMaterial({color:0xaab0b8}));frPivot.add(d)}
// ===== teléfono de la cocina =====
const PH={x:11,z:-10.2,ring:0,t:0};
solid(wood,.9,.9,.7,11,.45,-10.4);
const phLed=new THREE.Mesh(new THREE.SphereGeometry(.05,5,4),new THREE.MeshBasicMaterial({color:0x330000}));phLed.position.set(10.75,1.0,-10.2);scene.add(phLed);
{const a=new THREE.Mesh(new THREE.BoxGeometry(.38,.1,.26),new THREE.MeshLambertMaterial({color:0x6a1a1a}));a.position.set(11,.95,-10.4);scene.add(a);
 const b=new THREE.Mesh(new THREE.BoxGeometry(.42,.06,.08),new THREE.MeshLambertMaterial({color:0x1c1c20}));b.position.set(11,1.03,-10.4);scene.add(b)}
// zona de pelotas
solid(red,9.2,.7,.3,10,.35,1);solid(red,9.2,.7,.3,10,.35,10.5);solid(red,.3,.7,3,5.5,.35,2.5);solid(red,.3,.7,4.5,5.5,.35,8.25);solid(blueM,1.8,1.6,1.8,13.4,.8,2.4);solid(yelM,1.8,1.1,1.8,13.4,.55,9.2);
const balls=new THREE.InstancedMesh(new THREE.SphereGeometry(.22,6,4),new THREE.MeshLambertMaterial({flatShading:true}),380),bc=[0xd02a20,0x2a60d0,0xe0c020,0x30b050,0xe070b0],tm=new THREE.Object3D();
for(let i=0;i<380;i++){tm.position.set(5.9+Math.random()*8.4,.16+Math.random()*.14,1.4+Math.random()*8.7);tm.updateMatrix();balls.setMatrixAt(i,tm.matrix);balls.setColorAt(i,new THREE.Color(bc[i%5]))}scene.add(balls);
// mesas, basura, estaciones
const TB=[],BINS=[{x:7,z:-10},{x:3,z:10.3}],ST=[],lights=[];
[[-11,1],[-6,1],[-1,1],[-11,6],[-6,6],[-1,6]].forEach(([x,z],i)=>{gb(wood,1.5,.08,1,x,.78,z);for(const a of[-1,1])for(const b of[-1,1])gb(wood,.08,.75,.08,x+a*.65,.375,z+b*.4);
 B.push([x-.75,x+.75,z-.5,z+.5]);for(const a of[-1,1])gb(blueM,.5,.5,.5,x+a*1.15,.25,z);TB.push({x,z,i,order:null,placed:[],dirty:[],meshes:[],done:0})});
for(const b of BINS)solid(steel,.8,1,.8,b.x,.5,b.z);
const SD={grill:{e:'🍔',n:'Poner carne',c:6,g:7,item:'burger',m:dark},fry:{e:'🍟',n:'Freír papas',c:5,g:7,item:'fries',m:steel},shake:{e:'🥤',n:'Preparar malteada',c:4,g:15,item:'shake',m:pinkM}};
[['grill',-11],['grill',-8.5],['fry',-5],['fry',-2.5],['shake',1],['shake',3.5]].forEach(([type,x])=>{solid(SD[type].m,1.7,1,1,x,.5,-9.8);
 const ind=new THREE.Mesh(new THREE.SphereGeometry(.14,6,5),new THREE.MeshBasicMaterial({color:0x666666}));ind.position.set(x,1.4,-9.8);scene.add(ind);ST.push({type,x,z:-9.8,s:'idle',t:0,ind})});
for(let x=-12;x<=12;x+=6)for(let z=-9;z<=9;z+=6){const m=new THREE.Mesh(new THREE.BoxGeometry(1.6,.05,.6),BM(0xfff0c0));m.position.set(x,H-.03,z);scene.add(m);lights.push([m,Math.random()*50,Math.random()<.2])}
for(const[m,gs]of bk)scene.add(new THREE.Mesh(mergeGeometries(gs),m));
// luces: ambiente (cambia con dentro/fuera/apagón), luna, linterna
const amb=new THREE.AmbientLight(0x887050,.9);scene.add(amb);
const moon=new THREE.DirectionalLight(0x6a7cc0,.4);moon.position.set(-20,40,25);scene.add(moon);
const spot=new THREE.SpotLight(0xfff0c0,3.2,34,.4,.5,1);scene.add(spot,spot.target);
const beam=new THREE.Mesh(new THREE.ConeGeometry(2.4,9,14,1,true).rotateX(-Math.PI/2).translate(0,0,4.5),new THREE.MeshBasicMaterial({color:0xffeebb,transparent:true,opacity:.07,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));scene.add(beam);
// ===== cielo nocturno: estrellas + luna (siguen a la cámara) =====
const sky=new THREE.Group(),starG=new THREE.BufferGeometry(),sPos=new Float32Array(360*3);
for(let i=0;i<360;i++){const a=Math.random()*6.283,e=.18+Math.random()*1.25,r=55;sPos[i*3]=Math.cos(a)*Math.cos(e)*r;sPos[i*3+1]=Math.sin(e)*r;sPos[i*3+2]=Math.sin(a)*Math.cos(e)*r}
starG.setAttribute('position',new THREE.BufferAttribute(sPos,3));
const stars=new THREE.Points(starG,new THREE.PointsMaterial({color:0xcfd8ff,size:1.2,sizeAttenuation:false,fog:false,transparent:true,depthWrite:false}));stars.frustumCulled=false;
const moonS=new THREE.Sprite(new THREE.SpriteMaterial({map:soft(64,[[0,'rgba(240,245,255,1)'],[.38,'rgba(235,240,255,1)'],[.42,'rgba(170,185,230,.35)'],[1,'rgba(150,170,230,0)']]),fog:false,transparent:true,depthWrite:false}));moonS.scale.set(7,7,1);moonS.position.set(-26,30,-38);
sky.add(stars,moonS);scene.add(sky);
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

// ===== CLIMA: despejado, niebla, lluvia, tormenta, nieve =====
// n=nombre, e=emoji, sky=color del cielo, fog=densidad extra de niebla, cloud=nubosidad (tapa estrellas/luna),
// rain/snow=intensidad de partículas, wind=viento, w=probabilidad relativa de salir
const WX={clear:{n:'Despejado',e:'🌙',sky:0x050814,fog:0,cloud:0,rain:0,snow:0,wind:.12,w:5},
 fog:{n:'Niebla',e:'🌫️',sky:0x0f1218,fog:.12,cloud:.8,rain:0,snow:0,wind:.08,w:2},
 rain:{n:'Lluvia',e:'🌧️',sky:0x080b11,fog:.04,cloud:.9,rain:.6,snow:0,wind:.35,w:3},
 storm:{n:'Tormenta',e:'⛈️',sky:0x06070b,fog:.06,cloud:1,rain:1,snow:0,wind:1,w:2},
 snow:{n:'Nevada',e:'❄️',sky:0x141722,fog:.06,cloud:.75,rain:0,snow:1,wind:.5,w:2}};
const WXMSG={clear:'🌙 Las nubes se abren. Cielo despejado.',fog:'🌫️ Se levanta una niebla densa.',rain:'🌧️ Empieza a llover.',storm:'⛈️ Se acerca una tormenta.',snow:'❄️ Empieza a nevar.'};
const wx={type:'clear',rain:0,snow:0,fog:0,cloud:0,wind:.12,sky:new THREE.Color(NIGHT),thunderT:8,nextT:80};
let flash=0; // destello de relámpago (0..1)
const RN=900,SN=500,BOX=14,BOXY=14; // partículas: tamaño de la caja que sigue al jugador
const rd=new Float32Array(RN*3),sd=new Float32Array(SN*3);
const rainG=new THREE.BufferGeometry();rainG.setAttribute('position',new THREE.BufferAttribute(new Float32Array(RN*6),3));
const rainM=new THREE.LineSegments(rainG,new THREE.LineBasicMaterial({color:0x8fa0c0,transparent:true,opacity:.4,fog:false,depthWrite:false}));rainM.frustumCulled=false;rainM.visible=false;scene.add(rainM);
const snowG=new THREE.BufferGeometry();snowG.setAttribute('position',new THREE.BufferAttribute(new Float32Array(SN*3),3));
const snowM=new THREE.Points(snowG,new THREE.PointsMaterial({color:0xffffff,size:.18,map:soft(16,[[0,'rgba(255,255,255,1)'],[.5,'rgba(255,255,255,.8)'],[1,'rgba(255,255,255,0)']]),transparent:true,depthWrite:false}));snowM.frustumCulled=false;snowM.visible=false;scene.add(snowM);
function pickWx(skip){const ks=Object.keys(WX).filter(k=>k!=skip),tot=ks.reduce((s,k)=>s+WX[k].w,0);let r=Math.random()*tot;for(const k of ks){if((r-=WX[k].w)<=0)return k}return ks[0]}
function setWx(k,quiet){wx.type=k;wx.thunderT=rnd(4,10);if(!quiet)toast(WXMSG[k])}
function initWx(){setWx(pickWx(),true);const T=WX[wx.type];for(const q of['rain','snow','fog','cloud','wind'])wx[q]=T[q];wx.sky.setHex(T.sky);wx.nextT=rnd(70,130);
 for(let i=0;i<RN;i++){rd[i*3]=P.x+rnd(-BOX,BOX);rd[i*3+1]=rnd(0,BOXY);rd[i*3+2]=P.z+rnd(-BOX,BOX)}
 for(let i=0;i<SN;i++){sd[i*3]=P.x+rnd(-BOX,BOX);sd[i*3+1]=rnd(0,BOXY);sd[i*3+2]=P.z+rnd(-BOX,BOX)}}
const inB=(x,z)=>Math.abs(x)<15&&Math.abs(z)<11; // ¿dentro del edificio?
function updParticles(dt,t){
 const nr=(RN*wx.rain)|0,ns=(SN*wx.snow)|0;rainM.visible=nr>0;snowM.visible=ns>0;
 if(nr>0){const a=rainG.attributes.position.array,sp=18+wx.rain*10;
  for(let i=0;i<nr;i++){const j=i*3;let x=rd[j],y=rd[j+1],z=rd[j+2];
   y-=sp*dt;x+=wx.wind*3*dt;if(y<0){y+=BOXY;x=P.x+rnd(-BOX,BOX);z=P.z+rnd(-BOX,BOX)}
   const dx=x-P.x,dz=z-P.z;if(dx>BOX)x-=2*BOX;else if(dx<-BOX)x+=2*BOX;if(dz>BOX)z-=2*BOX;else if(dz<-BOX)z+=2*BOX;
   rd[j]=x;rd[j+1]=y;rd[j+2]=z;const o=i*6;
   if(y<H+.5&&Math.abs(x)<15.4&&Math.abs(z)<11.4){a[o+1]=a[o+4]=-9} // no llueve dentro del local
   else{a[o]=x;a[o+1]=y;a[o+2]=z;a[o+3]=x-wx.wind*.12;a[o+4]=y+.5;a[o+5]=z}}
  rainG.attributes.position.needsUpdate=true;rainG.setDrawRange(0,nr*2)}
 if(ns>0){const a=snowG.attributes.position.array;
  for(let i=0;i<ns;i++){const j=i*3;let x=sd[j],y=sd[j+1],z=sd[j+2];
   y-=(1.1+(i%5)*.15)*dt;x+=(Math.sin(t*.8+i)*.4+wx.wind*2)*dt;z+=Math.cos(t*.6+i*1.7)*.25*dt;if(y<0){y+=BOXY;x=P.x+rnd(-BOX,BOX);z=P.z+rnd(-BOX,BOX)}
   const dx=x-P.x,dz=z-P.z;if(dx>BOX)x-=2*BOX;else if(dx<-BOX)x+=2*BOX;if(dz>BOX)z-=2*BOX;else if(dz<-BOX)z+=2*BOX;
   sd[j]=x;sd[j+1]=y;sd[j+2]=z;
   if(y<H+.5&&Math.abs(x)<15.4&&Math.abs(z)<11.4){a[j]=0;a[j+1]=-9;a[j+2]=0}else{a[j]=x;a[j+1]=y;a[j+2]=z}}
  snowG.attributes.position.needsUpdate=true;snowG.setDrawRange(0,ns)}}
const tcol=new THREE.Color();
function updWx(dt,t){
 if(state=='play'){wx.nextT-=dt;if(wx.nextT<=0){setWx(pickWx(wx.type));wx.nextT=rnd(70,140)}}
 const T=WX[wx.type],k=1-Math.exp(-dt/5);
 for(const q of['rain','snow','fog','cloud','wind'])wx[q]+=(T[q]-wx[q])*k;
 wx.sky.lerp(tcol.setHex(T.sky),k);
 if(wx.type=='storm'&&wx.rain>.6&&state=='play'){wx.thunderT-=dt;if(wx.thunderT<=0){lightning();wx.thunderT=rnd(5,20)}}
 flash=Math.max(0,flash-dt*3.2);
 updParticles(dt,t)}
function lightning(){const d=rnd(.2,3);flash=1;after(.12,()=>flash=Math.max(flash,.8));after(.3,()=>flash=Math.max(flash,.5));after(d,()=>sfx.thunder(d))}

// ===== juego =====
let state='title',hand=[],money=0,tips=0,day=1,dayT=180,served=0,lost=0,orders=[],oid=0,spawnT=4,litT=8,hudT=0,snd=true;
const stains=[],litter=[],P=new THREE.Vector3(0,0,15),K={};let yaw=0,pitch=0,ph=0,lastS=0,jx=0,jy=0,runB=false,lightOn=true;
const LORE=['📞 Suena un teléfono en alguna parte…','📟 Un pedido apareció en la pantalla.','🔔 Alguien pidió. No hay nadie en la mesa.','📠 El ticket salió solo de la impresora.'];
function toast(s){const t=$('toasts'),d=document.createElement('div');d.textContent=s;t.appendChild(d);setTimeout(()=>d.remove(),3500);while(t.children.length>3)t.firstChild.remove()}
// planificador en tiempo de juego (se congela en pausa)
const sched=[],after=(s,f)=>sched.push({t:s,f});
function runSched(dt){for(let i=sched.length-1;i>=0;i--){const q=sched[i];if((q.t-=dt)<=0){sched.splice(i,1);try{q.f()}catch(e){console.warn(e)}}}}
const dirtN=()=>stains.length+litter.length+TB.filter(t=>t.dirty.length).length,cleanM=()=>cl(1-.07*dirtN(),.4,1);
const need=(tb,t)=>tb.order&&tb.order.items.filter(i=>i==t).length>tb.placed.filter(i=>i==t).length;
const slot=(tb,i)=>[tb.x+[-.45,0,.45][i%3],.82,tb.z];
function clearTb(tb){tb.meshes.forEach(m=>scene.remove(m));tb.meshes=[];tb.placed=[]}
function spawnOrder(){const free=TB.filter(t=>!t.order&&!t.dirty.length);if(!free.length||orders.length>=4)return false;const tb=free[Math.random()*free.length|0],ks=['burger','fries','shake'],n=1+(Math.random()<.6)+(Math.random()<.3),items=[];
 for(let i=0;i<n;i++)items.push(ks[Math.random()*3|0]);const p=Math.max(40,70-day*3)+12*n;tb.order={id:++oid,tb,items,t:p,max:p};orders.push(tb.order);sfx.ding();toast(LORE[Math.random()*4|0]);return true}
function pay(tb){const o=tb.order,price=o.items.reduce((s,t)=>s+MENU[t].p,0),tip=Math.round(price*.6*cl(o.t/o.max,0,1)*cleanM());money+=price+tip;tips+=tip;served++;sfx.cash();toast(`💰 +$${price+tip} (propina $${tip}) — apareció en la caja`);
 orders.splice(orders.indexOf(o),1);tb.order=null;clearTb(tb);tb.dirty=o.items.map(()=>'trash');tb.dirty.forEach((t,i)=>{const m=mk('trash');m.position.set(...slot(tb,i));scene.add(m);tb.meshes.push(m)});
 if(Math.random()<.45)addStain(tb.x+(Math.random()-.5)*2.6,tb.z+1.2+Math.random())}
function lose(tb){orders.splice(orders.indexOf(tb.order),1);tb.order=null;clearTb(tb);money=Math.max(0,money-5);lost++;toast(`❌ Mesa ${tb.i+1} se esfumó sin comer… -$5`)}
function addStain(x,z,col=0x3a2410){const m=new THREE.Mesh(new THREE.CircleGeometry(.5,8).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85}));x=cl(x,-14,4.5);z=cl(z,-3,10);m.position.set(x,.04,z);scene.add(m);stains.push({x,z,m,hp:2})}
function addLitter(){if(litter.length>=8)return;const o=Math.random()<.6,x=o?-14+Math.random()*18:-6+Math.random()*12,z=o?-3+Math.random()*13:12.5+Math.random()*8,m=mk('trash');m.position.set(x,.02,z);m.rotation.y=Math.random()*6;scene.add(m);litter.push({x,z,m})}
const stPr=s=>!pw.on&&s.s=='idle'?'⚡ Sin energía':s.s=='idle'?'▶ '+SD[s.type].n:s.s=='cook'?null:hand.length<3?(s.s=='ready'?'✋ Tomar '+SD[s.type].e:'♻️ Retirar quemado'):null;
function stRun(s){const d=SD[s.type];if(s.s=='idle'){if(!pw.on)return;s.s='cook';s.t=d.c;sfx.sizzle()}else{hand.push(s.s=='ready'?d.item:'trash');s.s='idle';sfx.pick()}}
const tPr=tb=>tb.dirty.length&&hand.length<3?'🗑️ Recoger platos':tb.order&&hand.some(t=>need(tb,t))?'🍽️ Servir mesa '+(tb.i+1):null;
function tRun(tb){if(tb.dirty.length&&hand.length<3){const n=Math.min(tb.dirty.length,3-hand.length);for(let i=0;i<n;i++){tb.dirty.pop();hand.push('trash');scene.remove(tb.meshes.pop())}sfx.pick();return}
 for(let i=hand.length-1;i>=0;i--){const t=hand[i];if(need(tb,t)){hand.splice(i,1);tb.placed.push(t);const m=mk(t);m.position.set(...slot(tb,tb.placed.length-1));scene.add(m);tb.meshes.push(m)}}
 sfx.pick();if(tb.placed.length==tb.order.items.length)tb.done=1.2}
function findAct(){let bd=1e9,ba=null;const c=(x,z,r,pr,run)=>{const d=Math.hypot(P.x-x,P.z-z);if(d<r&&d<bd){const s=pr();if(s){bd=d;ba={x,z,s,run}}}};
 ST.forEach(s=>c(s.x,s.z,2.1,()=>stPr(s),()=>stRun(s)));TB.forEach(t=>c(t.x,t.z,1.9,()=>tPr(t),()=>tRun(t)));
 BINS.forEach(b=>c(b.x,b.z,1.9,()=>hand.includes('trash')?'🗑️ Tirar basura':null,()=>{const n=hand.filter(t=>t=='trash').length;hand=hand.filter(t=>t!='trash');money+=n;sfx.pick();toast('♻️ +$'+n)}));
 stains.forEach(s=>c(s.x,s.z,1.5,()=>'🧽 Limpiar mancha',()=>{sfx.scrub();if(--s.hp<=0){scene.remove(s.m);stains.splice(stains.indexOf(s),1)}else s.m.material.opacity=.4}));
 litter.forEach(l=>c(l.x,l.z,1.5,()=>l.deb?'🧹 Barrer placa del techo':hand.length<3?'🧹 Recoger basura':null,()=>{scene.remove(l.m);litter.splice(litter.indexOf(l),1);if(!l.deb)hand.push('trash');sfx.pick()}));
 // tareas aparte (incidentes)
 c(GEN.x,GEN.z,2.8,()=>pw.on?null:`⚙️ Jalar la cuerda (${pw.pulls+1}/${pw.need})`,pullCord);
 c(PH.x,PH.z,2.3,()=>PH.ring>0?'📞 Contestar':null,answerPhone);
 c(FR.x,FR.z,2.3,()=>FR.open?'🧊 Cerrar el congelador':null,()=>closeFridge());
 return ba}
const act=()=>{if(state!='play')return;const a=findAct();a&&a.run()};
function endDay(){setState('sum');$('sumT').textContent='DÍA '+day+' TERMINADO';$('sumP').innerHTML=`Pedidos servidos: ${served}<br>Perdidos: ${lost}<br>Propinas: $${tips}<br>Dinero total: $${money}<br>Limpieza: ${Math.round(cleanM()*100)}%`}
function newDay(){day++;dayT=180;served=lost=tips=0;orders.length=0;TB.forEach(t=>{t.order=null;t.done=0;t.placed=[];t.meshes=t.meshes.slice(0,t.dirty.length)});hand=[];spawnT=3;
 pw.on=true;pw.flick=0;PH.ring=0;if(FR.open)closeFridge(true);incT=rnd(35,60);creepT=rnd(8,18);setState('play')}

// ===== INCIDENTES: cosas que hay que atender (sin enemigos) =====
const pw={on:true,lvl:1,flick:0,pulls:0,need:4}; // generador
let pwL=1,flickT=0,incT=40,creepT=rnd(12,20),duck=0,duckT=0,lastCr=null;
const falling=[]; // placas del techo cayendo
function failPower(){if(!pw.on||pw.flick>0)return;pw.flick=2.2;sfx.sputter();
 after(2.2,()=>{pw.on=false;pw.pulls=0;pw.need=3+(Math.random()*3|0);sfx.blackout();toast('⚡ Se fue la luz. El generador está afuera, al costado este del local.')})}
function pullCord(){if(pw.on)return;pw.pulls++;const ok=pw.pulls>=pw.need;sfx.pull(ok);
 if(ok){pw.on=true;pw.flick=1.8;sfx.restart();toast('💡 El generador arrancó. Volvió la luz.')}else toast('⚙️ …tosió y se apagó.')}
function ringPhone(){PH.ring=5+(Math.random()*3|0);PH.t=0;toast('📞 Suena el teléfono, en la cocina.')}
function answerPhone(){if(PH.ring<=0)return;PH.ring=0;sfx.pick();sfx.staticLine(PH.x,PH.z);
 const L=['📞 …solo estática.','📞 Alguien respira al otro lado. Cuelga.','📞 Una voz lejana dice “mesa seis”. Cuelga.','📞 Se oye lluvia al otro lado. Cuelga.'],o=Math.random();
 after(1.2,()=>{if(o<.4&&orders.length<4&&pw.on){toast('📞 Un pedido por teléfono. La voz no tiene boca.');spawnOrder()}else toast(L[Math.random()*L.length|0])})}
function openFridge(){FR.open=true;FR.t=100;FR.beep=0;sfx.fridgeDoor(true);toast('🧊 La puerta del congelador se abrió sola. Suena una alarma.')}
function closeFridge(q){if(!FR.open)return;FR.open=false;if(!q)sfx.fridgeDoor(false)}
function leak(){const x=rnd(-12.5,3.5),z=rnd(-1.5,9);toast('💧 Gotea el techo en alguna parte del salón.');for(let i=0;i<7;i++)after(i*1.3,()=>sfx.drip(x,z));after(9.5,()=>{addStain(x,z,0x16222e);sfx.splash(x,z)})}
const busy=()=>!pw.on||pw.flick>0||PH.ring>0||FR.open;
function pickIncident(){const s=wx.type=='storm',r=wx.type=='rain'||s||wx.type=='snow',
 L=[[failPower,2*(s?3:1)],[ringPhone,2],[openFridge,2],[leak,1.5*(r?3:1)]],tot=L.reduce((a,b)=>a+b[1],0);let q=Math.random()*tot;for(const[f,w]of L){if((q-=w)<=0)return f()}}
// placa del techo que se cae, sin aviso. Deja un agujero negro y escombro que hay que barrer
const HOLES=[-9,-3,3,9].flatMap(x=>[-6,0,6].map(z=>({x,z,used:false})));
function tileFall(){const fr=HOLES.filter(h=>!h.used&&Math.hypot(h.x-P.x,h.z-P.z)>4);if(!fr.length||litter.filter(l=>l.deb).length>=3)return false;const h=fr[Math.random()*fr.length|0];h.used=true;
 const hole=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2).rotateX(Math.PI/2),BM(0x030303));hole.position.set(h.x,H-.012,h.z);scene.add(hole);
 const tl=new THREE.Mesh(new THREE.BoxGeometry(1.15,.04,1.15),ceilTileM);tl.position.set(h.x,H-.06,h.z);tl.rotation.y=rnd(0,6);scene.add(tl);
 falling.push({m:tl,vy:0,x:h.x,z:h.z});sfx.crack(h.x,h.z);return true}
// ===== SONIDOS RAROS: no pasa nada, solo se oye =====
const rp=(a,b)=>{const q=Math.random()*6.283,r=rnd(a,b);return{x:P.x+Math.cos(q)*r,z:P.z+Math.sin(q)*r}};
const CREEP=[
 {w:4,f(){const roof=Math.random()<.3,a0=Math.random()*6.283,r0=roof?5:rnd(9,13),r1=roof?1.5:rnd(2.5,4),n=5+(Math.random()*5|0);
  for(let i=0;i<n;i++)after(i*(.56+(i&1)*.05),()=>{const k=i/(n-1),r=r0+(r1-r0)*k,a=a0+k*.3;stepAt(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r,roof)})}}, // pasos que se acercan y se detienen de golpe
 {w:3,f(){tileFall()},ok:()=>litter.filter(l=>l.deb).length<3},
 {w:2,f(){sfx.chime(0,11)}}, // campanita de la puerta: nadie entró
 {w:2,f(){const ps=[[-15.3,2],[15.3,-3],[0,-11.3],[-6,11.3],[P.x+3,P.z+3]],p=ps[Math.random()*ps.length|0],n=2+(Math.random()*3|0);for(let i=0;i<n;i++)after(i*rnd(.35,.5),()=>sfx.knock(p[0],p[1]))}},
 {w:3,f(){const p=rp(4,12);sfx.creak(p.x,p.z)}},
 {w:2,f(){const p=rp(6,13);sfx.drag(p.x,p.z)}},
 {w:2,f(){sfx.clang(-6,-8)}},
 {w:2,f(){sfx.radio(12,-10)}},
 {w:1.5,f(){const p=rp(2.5,4);sfx.whisper(p.x,p.z)}},
 {w:2,f(){const p=rp(3,9);sfx.vent(p.x,p.z)}},
 {w:3,f(){flickT=rnd(2,4);sfx.buzz()}}, // las luces parpadean un rato
 {w:1,f(){const p=rp(14,22);sfx.musicbox(p.x,p.z)}},
 {w:1,f(){sfx.pa(0,0)}},
 {w:2,f(){duckT=.93;after(rnd(4,7),()=>duckT=0)}}, // el silencio también asusta
 {w:2,f(){const p=rp(3,8);for(let i=0;i<rnd(4,8);i++)after(i*rnd(.8,1.5),()=>sfx.drip(p.x,p.z))}},
 {w:2,f(){const p=rp(1,4);sfx.roofThud(p.x,p.z)}}];
function creep(){const ok=CREEP.filter(c=>c!==lastCr&&(!c.ok||c.ok())),tot=ok.reduce((s,c)=>s+c.w,0);let r=Math.random()*tot;for(const c of ok){if((r-=c.w)<=0){lastCr=c;c.f();return}}}
function tickEvents(dt,t){
 // luz del local: apagón + parpadeos
 if(pw.flick>0)pw.flick-=dt;
 pw.lvl+=((pw.on?1:0)-pw.lvl)*Math.min(1,dt*(pw.on?3:14));
 pwL=pw.lvl*(pw.flick>0&&Math.sin(t*37)*Math.sin(t*23+1)>.05?.12:1);
 if(flickT>0)flickT-=dt;
 // generador
 genLed.material.color.setHex(pw.on?0x33ff55:(Math.sin(t*5)>0?0xff2222:0x330000));
 // teléfono
 if(PH.ring>0){PH.t-=dt;if(PH.t<=0){sfx.ring(PH.x,PH.z);PH.ring--;PH.t=2.6;if(PH.ring==0)toast('📞 Dejó de sonar.')}}
 phLed.material.color.setHex(PH.ring>0&&Math.sin(t*14)>0?0xff2020:0x330000);
 // congelador
 FR.ang+=((FR.open?1.75:0)-FR.ang)*Math.min(1,dt*4);frPivot.rotation.y=FR.ang;
 if(FR.open){FR.beep-=dt;if(FR.beep<=0){sfx.beep(FR.x,FR.z);FR.beep=1.4}FR.t-=dt;if(FR.t<=0)closeFridge()}
 // placas cayendo
 for(let i=falling.length-1;i>=0;i--){const f=falling[i];f.vy+=9.8*dt;f.m.position.y-=f.vy*dt;f.m.rotation.x+=dt*.6;
  if(f.m.position.y<=.04){f.m.position.y=.04;f.m.rotation.x=0;falling.splice(i,1);litter.push({x:f.x,z:f.z,m:f.m,deb:true});sfx.thud(f.x,f.z)}}
 if(state!='play')return;
 // directores de eventos aleatorios
 creepT-=dt;if(creepT<=0){creep();creepT=rnd(11,32)*(pw.on?1:.6)}
 incT-=dt;if(incT<=0){if(dayT>40&&!busy())pickIncident();incT=rnd(40,90)}
 duck+=(duckT-duck)*Math.min(1,dt*1.5)}

// ===== entrada =====
const setState=s=>{state=s;const sh=(i,v)=>$(i).style.display=v?'flex':'none';sh('title',s=='title');sh('pause',s=='pause');sh('sum',s=='sum');$('hud').style.display=s=='title'?'none':'block';if(s!='play'){resetTouch();if(document.pointerLockElement)document.exitPointerLock()}
 if(s=='play'){A&&A.x.resume();if(!touch&&cv.requestPointerLock)cv.requestPointerLock()}};
const toggleLight=()=>{lightOn=!lightOn;spot.visible=beam.visible=lightOn;click(lightOn)};
addEventListener('keydown',e=>{K[e.code]=1;if(e.repeat)return;if(e.code=='KeyF'&&state=='play')toggleLight();if(e.code=='KeyE')act();if(e.code=='KeyP'&&state=='play')setState('pause')});addEventListener('keyup',e=>K[e.code]=0);
addEventListener('mousemove',e=>{if(state!='play'||touch)return;yaw-=e.movementX*.0025;pitch=cl(pitch-e.movementY*.0025,-.6,.7)});
document.addEventListener('pointerlockchange',()=>{if(!touch&&!document.pointerLockElement&&state=='play')setState('pause')});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(state=='play')setState('pause');A&&A.x.suspend()}});
addEventListener('blur',()=>{K.ShiftLeft=K.KeyW=K.KeyA=K.KeyS=K.KeyD=0;resetTouch()});
$('bPlay').onclick=()=>{audio();setState('play');if(touch){try{document.documentElement.requestFullscreen?.({navigationUI:'hide'})?.catch(()=>{});screen.orientation?.lock?.('landscape')?.catch(()=>{})}catch(e){}}};
$('bResume').onclick=()=>setState('play');$('bNext').onclick=newDay;
$('bSnd').onclick=()=>{snd=!snd;if(A)A.m.gain.value=snd?.9:0;$('bSnd').textContent='🔊 Sonido: '+(snd?'SÍ':'NO')};
$('bExit').onclick=async()=>{try{await App.exitApp()}catch(e){}setState('title')};$('bPause').onclick=()=>state=='play'&&setState('pause');
// el botón "atrás" de Android pausa en vez de cerrar el juego
try{Promise.resolve(App.addListener('backButton',()=>{if(state=='play')setState('pause');else if(state=='pause')setState('play')})).catch(()=>{})}catch(e){}

// ===== controles táctiles =====
// Joystick flotante a la izquierda, mirar arrastrando a la derecha. Se escucha en window (no depende de la captura del puntero)
// y se limpia solo al pausar / perder foco / cancelar, para que nunca quede un dedo "fantasma" bloqueando el control.
const stickEl=$('stick'),knob=$('knob'),SR=60;let stickId=null,lookId=null,sox=0,soy=0,lkx=0,lky=0;
function resetTouch(){stickId=lookId=null;jx=jy=0;runB=false;$('bRun').classList.remove('on');stickEl.style.display='none';knob.style.transform=''}
function setTouch(v){if(touch===v)return;touch=v;document.body.classList.toggle('touch',v);if(!v)resetTouch();else if(document.pointerLockElement)document.exitPointerLock()}
// detecta toque real aunque matchMedia diga lo contrario (y viceversa con un mouse en laptop táctil)
document.addEventListener('pointerdown',e=>{if(e.pointerType=='touch'||e.pointerType=='pen')setTouch(true);else if(e.pointerType=='mouse'&&!coarse)setTouch(false)},true);
function moveStick(e){let dx=e.clientX-sox,dy=e.clientY-soy;const d=Math.hypot(dx,dy);if(d>SR){dx*=SR/d;dy*=SR/d}jx=dx/SR;jy=dy/SR;knob.style.transform=`translate(${dx}px,${dy}px)`}
$('zl').addEventListener('pointerdown',e=>{if(state!='play'||stickId!==null)return;e.preventDefault();stickId=e.pointerId;try{e.target.setPointerCapture(stickId)}catch(_){}
 sox=cl(e.clientX,SR+8,innerWidth-SR-8);soy=cl(e.clientY,SR+8,innerHeight-SR-8); // el joystick nunca se sale de la pantalla
 stickEl.style.cssText=`display:block;left:${sox-SR}px;top:${soy-SR}px`;knob.style.transform='';moveStick(e)});
$('zr').addEventListener('pointerdown',e=>{if(state!='play'||lookId!==null)return;e.preventDefault();lookId=e.pointerId;try{e.target.setPointerCapture(lookId)}catch(_){}lkx=e.clientX;lky=e.clientY});
addEventListener('pointermove',e=>{if(e.pointerId===stickId){if(state=='play')moveStick(e)}
 else if(e.pointerId===lookId&&state=='play'){const s=.0055*(390/Math.max(300,innerHeight))**.5;yaw-=(e.clientX-lkx)*s;pitch=cl(pitch-(e.clientY-lky)*s,-.6,.7);lkx=e.clientX;lky=e.clientY}});
const touchUp=e=>{if(e.pointerId===stickId){stickId=null;jx=jy=0;runB=false;$('bRun').classList.remove('on');stickEl.style.display='none';knob.style.transform=''}if(e.pointerId===lookId)lookId=null};
addEventListener('pointerup',touchUp);addEventListener('pointercancel',touchUp);
for(const z of[$('zl'),$('zr')])z.addEventListener('lostpointercapture',touchUp);
const press=(el,fn)=>el.addEventListener('pointerdown',e=>{e.preventDefault();if(state=='play')fn()});
press($('bAct'),act);press($('bLight'),toggleLight);
press($('bRun'),()=>{runB=!runB;$('bRun').classList.toggle('on',runB)}); // correr = interruptor (se apaga al soltar el joystick)
// evita menú contextual, gestos de zoom y "tirar para recargar" del WebView
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});

// ===== audio (sin música) =====
let A;
function audio(){if(A)return;const x=new(window.AudioContext||window.webkitAudioContext)(),m=x.createGain();m.gain.value=snd?.9:0;m.connect(x.destination);
const L=x.sampleRate*2.5|0,ir=x.createBuffer(2,L,x.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}
const rv=x.createConvolver();rv.buffer=ir;const rg=x.createGain();rg.gain.value=.5;rv.connect(rg);rg.connect(m);A={x,m,rv};
// capas continuas: lluvia, viento, zumbido de fluorescentes y motor del generador
const nl=s=>{const n=x.sampleRate*s|0,b=x.createBuffer(1,n,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;const q=x.createBufferSource();q.buffer=b;q.loop=true;q.start();return q};
const chain=(src,type,fq,Q)=>{const f=x.createBiquadFilter();f.type=type;f.frequency.value=fq;if(Q)f.Q.value=Q;src.connect(f);return f};
const lay=(node,v=0)=>{const g=x.createGain();g.gain.value=v;node.connect(g);g.connect(m);return g};
const rf=chain(chain(nl(3),'highpass',700),'lowpass',7000);A.rainF=rf;A.rainG=lay(rf);
const wf=chain(nl(4),'lowpass',420);A.windG=lay(wf);const lfo=x.createOscillator(),lg=x.createGain();lfo.frequency.value=.17;lg.gain.value=.03;lfo.connect(lg);lg.connect(A.windG.gain);lfo.start();
const ho=x.createOscillator();ho.type='sawtooth';ho.frequency.value=100;A.humG=lay(chain(ho,'lowpass',320));ho.start();
const go=x.createOscillator();go.type='sawtooth';go.frequency.value=47;A.genG=lay(chain(go,'lowpass',170));go.start()}
function nz(t,dur,type,fq,vol,rev,o){const x=A.x,n=x.sampleRate*dur|0,b=x.createBuffer(1,n,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
 const s=x.createBufferSource();s.buffer=b;const f=x.createBiquadFilter();f.type=type;f.frequency.value=fq;const g=x.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(o||A.m);const r=x.createGain();r.gain.value=rev;g.connect(r);r.connect(A.rv);s.start(t)}
function tone(f,d,ty='sine',v=.2,f2,dl=0,o){const x=A.x,t=x.currentTime+dl,os=x.createOscillator(),g=x.createGain();os.type=ty;os.frequency.setValueAtTime(f,t);if(f2)os.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);os.connect(g);g.connect(o||A.m);g.connect(A.rv);os.start(t);os.stop(t+d+.02)}
// ruido filtrado con barrido de frecuencia (arrastres, soplidos, estática)
function nsw(dur,f1,f2,q,vol,o,type='bandpass'){const x=A.x,t=x.currentTime,n=x.sampleRate*dur|0,b=x.createBuffer(1,n,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 const s=x.createBufferSource();s.buffer=b;const f=x.createBiquadFilter();f.type=type;f.Q.value=q;f.frequency.setValueAtTime(f1,t);f.frequency.exponentialRampToValueAtTime(f2,t+dur);
 const g=x.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.3);g.gain.linearRampToValueAtTime(0,t+dur);s.connect(f);f.connect(g);g.connect(o||A.m);const r=x.createGain();r.gain.value=.3;g.connect(r);r.connect(A.rv);s.start(t)}
// oscilador con filtro y envolvente (crujidos de madera/metal)
function voice(type,f1,f2,d,v,fq,q,o){const x=A.x,t=x.currentTime,s=x.createOscillator(),f=x.createBiquadFilter(),g=x.createGain();s.type=type;s.frequency.setValueAtTime(f1,t);s.frequency.exponentialRampToValueAtTime(f2,t+d);f.type='bandpass';f.frequency.value=fq;f.Q.value=q;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+d*.3);g.gain.linearRampToValueAtTime(0,t+d);s.connect(f);f.connect(g);g.connect(o||A.m);g.connect(A.rv);s.start(t);s.stop(t+d+.05)}
// destino "posicional": volumen por distancia, paneo según hacia dónde mira el zorro y amortiguado si hay una pared de por medio
function at(x,z,amp=1){const X=A.x,dx=x-P.x,dz=z-P.z,d=Math.hypot(dx,dz),wall=inB(x,z)!==inB(P.x,P.z),g=X.createGain(),lp=X.createBiquadFilter();
 g.gain.value=amp*cl(1/(1+d*.22),.04,1)*(wall?.55:1);lp.type='lowpass';lp.frequency.value=wall?1500:cl(9000/(1+d*.12),700,9000);g.connect(lp);let out=lp;
 if(X.createStereoPanner){const p=X.createStereoPanner();p.pan.value=d>.01?cl((dx*Math.cos(yaw)-dz*Math.sin(yaw))/d,-1,1)*.9:0;lp.connect(p);out=p}
 out.connect(A.m);return g}
const sfx={ding(){A&&(tone(880,.7),tone(1320,.9,'sine',.15,0,.12))},cash(){A&&(tone(1200,.1,'square',.07),tone(1800,.3,'square',.07,0,.09))},pick(){A&&tone(500,.09,'triangle',.25,850)},sizzle(){A&&nz(A.x.currentTime,.6,'highpass',3000,.3,.1)},scrub(){A&&nz(A.x.currentTime,.3,'bandpass',1200,.5,.1)},
 thunder(d){if(!A)return;const t=A.x.currentTime,m=inB(P.x,P.z)?.5:1,v=1.2/(1+d*.4);nz(t,2.8,'lowpass',160*m,v,.9);nz(t+.12,1.8,'lowpass',420*m,v*.5,.8);tone(46,2.2,'sine',.4*v,26)},
 sputter(){if(!A)return;for(let i=0;i<4;i++){tone(68+i*4,.12,'sawtooth',.16,42,i*.19);nz(A.x.currentTime+i*.19,.08,'lowpass',500,.3,.3)}},
 blackout(){if(!A)return;nz(A.x.currentTime,.3,'lowpass',320,.9,.5);tone(85,.9,'sawtooth',.2,20);tone(60,.2,'square',.2,30)},
 pull(ok){if(!A)return;nz(A.x.currentTime,.4,'bandpass',900,.5,.2);tone(70,.5,'sawtooth',ok?.3:.18,ok?120:38,.15)},
 restart(){if(!A)return;tone(38,1.6,'sawtooth',.3,75);nz(A.x.currentTime,1,'lowpass',350,.5,.3);after(.9,()=>tone(900,.1,'square',.05))},
 ring(x,z){if(!A)return;const X=A.x,t=X.currentTime,o=at(x,z,.9);for(let k=0;k<2;k++){const b=t+k*.55,g=X.createGain(),am=X.createGain(),lf=X.createOscillator(),lg=X.createGain();
  g.gain.setValueAtTime(0,b);g.gain.linearRampToValueAtTime(.18,b+.02);g.gain.setValueAtTime(.18,b+.4);g.gain.linearRampToValueAtTime(0,b+.43);am.gain.value=.55;lf.type='square';lf.frequency.value=24;lg.gain.value=.45;lf.connect(lg);lg.connect(am.gain);
  for(const f of[440,480]){const q=X.createOscillator();q.frequency.value=f;q.connect(am);q.start(b);q.stop(b+.45)}lf.start(b);lf.stop(b+.45);am.connect(g);g.connect(o);g.connect(A.rv)}},
 staticLine(x,z){if(!A)return;nsw(1.2,3000,900,.8,.25,at(x,z,1),'bandpass');after(1.1,()=>A&&nz(A.x.currentTime,.05,'highpass',1500,.5,.2,at(x,z)))},
 beep(x,z){if(!A)return;tone(2600,.16,'square',.07,0,0,at(x,z,1))},
 fridgeDoor(open){if(!A)return;const o=at(FR.x,FR.z,1);nz(A.x.currentTime,.25,'lowpass',700,.8,.4,o);tone(open?120:90,.18,'sine',.5,50,0,o)},
 drip(x,z){if(!A)return;const o=at(x,z,.8);tone(rnd(1500,2100),.07,'sine',.16,rnd(500,800),0,o)},
 splash(x,z){if(!A)return;nz(A.x.currentTime,.25,'bandpass',1800,.5,.5,at(x,z,1))},
 crack(x,z){if(!A)return;const o=at(x,z,1);voice('sawtooth',rnd(220,320),90,.5,.12,500,5,o);nz(A.x.currentTime+.1,.3,'bandpass',2600,.18,.6,o)},
 thud(x,z){if(!A)return;const t=A.x.currentTime,o=at(x,z,1.15);nz(t,.5,'lowpass',500,1,.7,o);tone(90,.35,'sine',.8,32,0,o);nz(t+.12,.5,'highpass',3000,.14,.8,o)},
 chime(x,z){if(!A)return;const o=at(x,z,1);tone(1568,1.1,'sine',.18,0,0,o);tone(2093,1.3,'sine',.14,0,.14,o)},
 knock(x,z){if(!A)return;const o=at(x,z,1.1);tone(150,.1,'sine',.9,65,0,o);nz(A.x.currentTime,.06,'lowpass',900,.8,.3,o)},
 creak(x,z){if(!A)return;voice('sawtooth',rnd(80,130),rnd(52,80),rnd(.9,1.8),.22,rnd(300,600),6,at(x,z,1))},
 drag(x,z){if(!A)return;nsw(rnd(2,3),150,380,3,.5,at(x,z,1))},
 clang(x,z){if(!A)return;const o=at(x,z,1);[523,1137,1810].forEach((f,i)=>tone(f,.9-.25*i,'triangle',.14,0,0,o));nz(A.x.currentTime,.2,'highpass',2000,.5,.5,o);for(let i=0;i<4;i++)after(.35+i*.13*(i+1),()=>A&&nz(A.x.currentTime,.04,'highpass',2500,.25,.4,at(x,z,1)))},
 radio(x,z){if(!A)return;for(let i=0;i<16;i++)after(i*.13,()=>A&&nz(A.x.currentTime,.12,'bandpass',rnd(500,3500),.16,.3,at(x,z,1)));after(.5,()=>A&&tone(rnd(300,600),.6,'sine',.05,rnd(600,900),0,at(x,z,1)))},
 whisper(x,z){if(!A)return;const X=A.x,t=X.currentTime,dur=2.4,n=X.sampleRate*dur|0,b=X.createBuffer(1,n,X.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
  const s=X.createBufferSource();s.buffer=b;const f=X.createBiquadFilter();f.type='bandpass';f.Q.value=2.5;const g=X.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(at(x,z,1));const r=X.createGain();r.gain.value=.5;g.connect(r);r.connect(A.rv);
  let u=0;while(u<dur-.3){const l=.12+Math.random()*.2;f.frequency.setValueAtTime(rnd(900,2400),t+u);g.gain.setValueAtTime(0,t+u);g.gain.linearRampToValueAtTime(.08+Math.random()*.25,t+u+.04);g.gain.linearRampToValueAtTime(0,t+u+l);u+=l+.05+Math.random()*.15}s.start(t)},
 vent(x,z){if(!A)return;nsw(1.2,2200,900,1,.22,at(x,z,1),'highpass')},
 buzz(){if(!A)return;for(let i=0;i<9;i++)after(i*.22,()=>A&&(tone(110,.12,'sawtooth',.05,0,0),nz(A.x.currentTime,.06,'highpass',2000,.18,.2)))},
 musicbox(x,z){if(!A)return;const nt=[784,988,880,659,740,587,659,523],n=4+(Math.random()*4|0);for(let i=0;i<n;i++)after(i*.55,()=>{if(!A)return;const o=at(x,z,1);tone(nt[i],1.6,'sine',.06,0,0,o);tone(nt[i]*2.01,.8,'triangle',.015,0,0,o)})}, // se corta antes de terminar
 pa(x,z){if(!A)return;const o=at(x,z,1);nz(A.x.currentTime,.03,'highpass',1000,.6,.3,o);tone(1000,.7,'sine',.07,0,.06,o);after(.9,()=>A&&nz(A.x.currentTime,.03,'highpass',1000,.5,.3,at(x,z,1)))},
 roofThud(x,z){if(!A)return;const o=at(x,z,1.1);tone(70,.3,'sine',.9,34,0,o);nz(A.x.currentTime,.4,'lowpass',380,.8,.7,o);after(rnd(.7,1.2),()=>A&&(tone(80,.18,'sine',.5,40,0,at(x+1,z,1))))}};
function stepAt(x,z,roof){if(!A)return;const t=A.x.currentTime,o=at(x,z,roof?1.1:.9);
 if(roof){nz(t,.18,'lowpass',180,.9,.5,o);tone(70,.18,'sine',.5,35,0,o)}else{nz(t,.1,'lowpass',inB(x,z)?320:1800,.6,.5,o);tone(110,.1,'sine',.3,45,0,o)}}
function step(run){if(!A)return;const t=A.x.currentTime;nz(t,.12,'lowpass',260+Math.random()*200,run?.6:.45,.8);tone(115,.1,'sine',.35,45)}
function click(on){if(!A)return;for(const[dl,fq]of[[0,on?2300:1600],[.045,on?1500:2100]]){nz(A.x.currentTime+dl,.02,'highpass',1800,.5,.25);tone(fq,.025,'square',.1,0,dl)}}
// mezcla de las capas continuas (se actualiza ~5 veces por segundo)
let ambAcc=0;
function ambTick(dt,w){if(!A)return;ambAcc+=dt;if(ambAcc<.2)return;ambAcc=0;const now=A.x.currentTime,out=1-w,q=1-duck;
 A.rainG.gain.setTargetAtTime(wx.rain*(.3*out+.12*w)*q,now,.25);A.rainF.frequency.setTargetAtTime(900+6100*out,now,.3);
 A.windG.gain.setTargetAtTime((.03+.1*wx.wind+wx.snow*.02)*(.3+.7*out)*q,now,.4);
 A.humG.gain.setTargetAtTime(.02*w*pwL*q,now,.2);
 A.genG.gain.setTargetAtTime(pw.on?.06*cl(1-Math.hypot(P.x-GEN.x,P.z-GEN.z)/28,0,1)*q:0,now,.3)}

// ===== bucle =====
const tc=new THREE.Color(),cIn=new THREE.Color(),cDark=new THREE.Color(0x060505),cExt=new THREE.Color(),cFl=new THREE.Color(0xb8c8ff),
 aCold=new THREE.Color(0x3a4878),aWarm=new THREE.Color(),aEm=new THREE.Color(0x4a1a1a),aTmp=new THREE.Color(),
 clk=new THREE.Clock(),dv=new THREE.Vector3(),cp3={x:0,z:0},ECOL={idle:0x666666,cook:0xff8800,ready:0x44ff44,burnt:0xff2222};
function resolve(p,rad){for(const b of B){const qx=cl(p.x,b[0],b[1]),qz=cl(p.z,b[2],b[3]),dx=p.x-qx,dz=p.z-qz,d=Math.hypot(dx,dz);if(d<rad&&d>0){p.x+=dx/d*(rad-d);p.z+=dz/d*(rad-d)}}}
function loop(){requestAnimationFrame(loop);const play=state=='play',dt=play?Math.min(clk.getDelta(),.05):(clk.getDelta(),0),t=clk.elapsedTime;
 if(K.ArrowLeft)yaw+=.016*2;if(K.ArrowRight)yaw-=.016*2;if(K.ArrowUp)pitch=Math.min(.7,pitch+.016);if(K.ArrowDown)pitch=Math.max(-.6,pitch-.016);
 const f={x:-Math.sin(yaw),z:-Math.cos(yaw)},r={x:Math.cos(yaw),z:-Math.sin(yaw)},run=K.ShiftLeft||runB,inP=P.x>5.5&&P.x<14.5&&P.z>1&&P.z<10.5;
 const mx=(K.KeyW?1:0)-(K.KeyS?1:0)-jy,mz=(K.KeyD?1:0)-(K.KeyA?1:0)+jx,mh=Math.hypot(mx,mz),len=Math.min(1,mh),mv=play&&len>.08;
 if(mv){const sp=(run?5.5:3)*(inP?.55:1)*dt*len/mh;P.x+=(f.x*mx+r.x*mz)*sp;P.z+=(f.z*mx+r.z*mz)*sp;ph+=(run?9:6)*dt*len;const n=Math.floor(ph/Math.PI);if(n!==lastS){lastS=n;step(run)}}
 resolve(P,.4);fox.position.set(P.x,(inP?-.18:0)+(mv?Math.abs(Math.sin(ph))*.02:0),P.z);fox.rotation.y=yaw;
 const w=1-cl(Math.max(Math.abs(P.x)-15,P.z-11,-P.z-11,0)/5,0,1); // 1 = dentro del local, 0 = a la intemperie
 if(play){dayT-=dt;if(dayT<=0)endDay();spawnT-=dt;if(spawnT<=0){if(dayT>12&&pw.on)spawnOrder();spawnT=Math.max(8,20-day*1.5)+Math.random()*5}litT-=dt;if(litT<=0){addLitter();litT=14}
  ST.forEach(s=>{if(!pw.on)return;if(s.s=='cook'&&(s.t-=dt)<=0){s.s='ready';s.t=SD[s.type].g;sfx.pick()}else if(s.s=='ready'&&(s.t-=dt)<=0)s.s='burnt';s.ind.material.color.setHex(ECOL[s.s])});
  TB.forEach(tb=>{if(tb.order){tb.order.t-=dt*(pw.on?1:.5);if(tb.done>0&&(tb.done-=dt)<=0)pay(tb);else if(tb.order&&tb.order.t<=0)lose(tb)}});runSched(dt)}
 tickEvents(dt,t);updWx(dt,t);
 hudT-=dt;if(hudT<=0&&state!='title'){hudT=.25;$('tickets').innerHTML=orders.map(o=>{const pl=[...o.tb.placed];return`<div class="tk"><b>#${o.id} Mesa ${o.tb.i+1}</b> ${o.items.map(i=>{const k=pl.indexOf(i);if(k>=0){pl.splice(k,1);return'✅'}return MENU[i].e}).join(' ')}<i style="width:${Math.max(0,o.t/o.max*100)}%"></i></div>`}).join('');
  const s=Math.max(0,dayT|0);$('stats').textContent=`📅${day} 💰$${money} ⏱${s/60|0}:${String(s%60).padStart(2,'0')} ✨${Math.round(cleanM()*100)}% ${pw.on?'':'🔌'}${WX[wx.type].e}`;$('hand').textContent=[0,1,2].map(i=>hand[i]?MENU[hand[i]].e:'·').join(' ')}
 const a=play?findAct():null;if(a){$('prompt').textContent=a.s;mark.visible=true;mark.position.set(a.x,1.9+Math.sin(t*4)*.08,a.z)}else{if(state!='title')$('prompt').textContent='';mark.visible=false}
 cp3.x=P.x+r.x*.6-f.x*1.9;cp3.z=P.z+r.z*.6-f.z*1.9;resolve(cp3,.3);cam.position.set(cp3.x,1.5-pitch*1.0,cp3.z);cam.lookAt(P.x+r.x*.3+f.x*8,1.05+Math.tan(pitch)*8,P.z+r.z*.3+f.z*8);
 const cp=Math.cos(pitch);dv.set(f.x*cp,Math.sin(pitch),f.z*cp);spot.position.set(P.x+r.x*.16+f.x*.3,.56,P.z+r.z*.16+f.z*.3);spot.target.position.copy(spot.position).addScaledVector(dv,10);beam.position.copy(spot.position);beam.lookAt(spot.target.position);
 // luces del techo: parpadeo propio, eventos de parpadeo y apagón
 lights.forEach(([m,p,bad])=>{let k=.9;if(bad)k=Math.sin(t*30+p)>.3?.9:.1;else if(Math.sin(t*.7+p)>.99)k=.3;if(flickT>0&&Math.sin(t*47+p*5)>.1)k*=.08;k*=pwL;m.material.color.setRGB(k,k*.96,k*.78)});
 // carteles encendidos / apagados
 gSign.color.setHex(0xd02a20).multiplyScalar(.12+.88*pwL);gMenu.color.setHex(0xb08a30).multiplyScalar(.1+.9*pwL);
 // postes del parqueadero
 let b1=null,b2=null,d1=1e9,d2=1e9;
 for(const l of LAMPS){let k=pwL;if(l.bad)k*=Math.sin(t*21+l.ph)*Math.sin(t*7+l.ph)>-.2?1:.15;if(wx.type=='storm'&&flash>.2)k*=.7;l.k=k;
  l.hm.color.setRGB(.12+.88*k,.1+.78*k,.08+.55*k);l.hal.material.opacity=k*.85;l.pool.material.opacity=k*.5;
  if(k>.05){const d=Math.hypot(l.x-P.x,l.z-P.z);if(d<d1){b2=b1;d2=d1;b1=l;d1=d}else if(d<d2){b2=l;d2=d}}}
 [b1,b2].forEach((l,i)=>{const L=lampL[i];if(l){L.position.set(l.x,5.4,l.z);L.intensity=3.2*l.k*(1-.9*w)}else L.intensity=0});
 // cielo, niebla y luz ambiente según clima / dentro-fuera / apagón
 const out=1-w;cIn.setHex(0x2a2410).lerp(cDark,1-pwL);cExt.copy(wx.sky).lerp(cFl,flash*.55);
 tc.copy(cExt).lerp(cIn,w);scene.fog.color.copy(tc);scene.background.copy(tc);scene.fog.density=.1+(wx.fog+wx.rain*.02)*out;
 aWarm.setHex(0x887050).lerp(aEm,1-pwL);amb.color.copy(aCold).lerp(aWarm,w);
 amb.intensity=(.34+wx.snow*.1+flash*.9)*out+(.22+.78*pwL)*w;
 moon.intensity=(.42*(1-.75*wx.cloud)+flash*1.1)*out;
 const gnd=1-.3*wx.rain+2.2*wx.snow;asph.color.setRGB(gnd,gnd,gnd*1.05); // asfalto mojado / nevado
 sky.position.copy(cam.position);stars.material.opacity=cl(1-wx.cloud*1.2,0,1);moonS.material.opacity=cl(1-wx.cloud*.9,0,1);
 ambTick(dt,w);
 R.render(scene,cam)}
initWx();setState('title');loop();
