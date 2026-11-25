import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/environments/RoomEnvironment.js';

const W=1200,H=900,view=document.querySelector('#threeView');
const renderer=new THREE.WebGLRenderer({canvas:view,alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); renderer.setSize(W,H,false);
renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.18;
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
const pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
const camera=new THREE.OrthographicCamera(0,W,H,0,.1,5000); camera.position.set(W/2,H/2,1800);camera.lookAt(W/2,H/2,0);
scene.add(new THREE.HemisphereLight(0xe9efff,0x332c25,.95));
const key=new THREE.DirectionalLight(0xfff4e6,2.3);key.position.set(-260,760,1000);scene.add(key);
const fill=new THREE.DirectionalLight(0xc4d9ff,1.05);fill.position.set(950,320,700);scene.add(fill);
const rim=new THREE.DirectionalLight(0xffffff,1.8);rim.position.set(500,-500,450);scene.add(rim);
const root=new THREE.Group();scene.add(root);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const seeded=(seed)=>{let x=(seed|0)||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}};
const colorOf=s=>new THREE.Color(s||'#d8d4cc');
function canvasMap(kind,base='#c9c5bd',size=512){
 const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d'),r=seeded(kind.length*977+17),col=colorOf(base);
 x.fillStyle=base;x.fillRect(0,0,size,size);
 // Multi-scale stochastic surface relief. The map is tileable enough for short strokes.
 for(let layer=0;layer<4;layer++){
  const count=[1800,700,220,70][layer],rad=[1.2,2.5,5,11][layer];
  for(let i=0;i<count;i++){const px=r()*size,py=r()*size,q=rad*(.25+r()*1.5),v=(r()-.5)*[52,38,25,18][layer];
   x.fillStyle=`rgba(${v>0?255:0},${v>0?255:0},${v>0?255:0},${Math.abs(v)/220})`;x.beginPath();x.arc(px,py,q,0,Math.PI*2);x.fill();
  }
 }
 if(kind==='foam'||kind==='porous'){
  // Cellular network: irregular closed cells with thick, non-uniform walls.
  for(let i=0;i<190;i++){const px=r()*size,py=r()*size,rx=3+r()*17,ry=rx*(.55+r()*.8);
   x.beginPath();x.ellipse(px,py,rx,ry,r()*Math.PI,0,Math.PI*2);
   x.strokeStyle=`rgba(35,43,40,${.18+r()*.32})`;x.lineWidth=1+r()*4;x.stroke();
   x.strokeStyle=`rgba(255,255,255,${.16+r()*.3})`;x.lineWidth=.7+r()*1.6;x.stroke();
  }
 }
 if(kind==='stone'||kind==='sand'){
  for(let i=0;i<2600;i++){let px=r()*size,py=r()*size,q=.4+r()*2.8;x.fillStyle=`rgba(25,23,20,${.08+r()*.32})`;x.fillRect(px,py,q,q)}
 }
 if(kind==='wood'){
  for(let i=0;i<150;i++){let px=r()*size;x.strokeStyle=`rgba(35,19,8,${.08+r()*.28})`;x.lineWidth=.5+r()*2.5;x.beginPath();x.moveTo(px,0);x.bezierCurveTo(px+18,150,px-15,350,px+8,size);x.stroke()}
 }
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;
}

function heightMap(kind,size=512){
 const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d'),im=x.createImageData(size,size),rand=seeded(kind.length*419+91);
 for(let y=0;y<size;y++)for(let xx=0;xx<size;xx++){
  let v=128,n1=rand();
  if(kind==='stone')v+=((n1-.5)*115)+Math.sin(xx*.17+Math.sin(y*.09)*3)*12+Math.sin(y*.31)*7;
  else if(kind==='foam')v+=((n1-.5)*42)+Math.sin(xx*.08)*4;
  else if(kind==='ceramic')v+=((n1-.5)*7)+Math.sin(xx*.035+y*.012)*2;
  else if(kind==='metal')v+=((n1-.5)*12)+Math.sin(xx*.21+Math.sin(y*.03)*2)*8;
  else v+=(n1-.5)*65;
  const i=(y*size+xx)*4,q=Math.max(0,Math.min(255,v));im.data[i]=im.data[i+1]=im.data[i+2]=q;im.data[i+3]=255;
 }
 x.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.NoColorSpace;t.anisotropy=8;return t;
}

const heights={ceramic:heightMap('ceramic'),stone:heightMap('stone'),metal:heightMap('metal'),foam:heightMap('foam')};
const maps={
 ceramic:canvasMap('ceramic','#e9e4db'),stone:canvasMap('stone','#89877f'),metal:canvasMap('metal','#9aa0a4'),
 foam:canvasMap('foam','#e8eee9'),sand:canvasMap('sand','#b7a68c'),clay:canvasMap('clay','#b7aaa0'),
 wood:canvasMap('wood','#70513a'),porous:canvasMap('porous','#68774c'),leaf:canvasMap('leaf','#526b36')
};
function material(color,kind){
 const c=colorOf(color);
 const common={color:c,envMapIntensity:1.25};
 switch(kind){
 case 'ceramic':return new THREE.MeshPhysicalMaterial({...common,map:maps.ceramic,roughness:.13,metalness:0,clearcoat:1,clearcoatRoughness:.045,bumpMap:heights.ceramic,bumpScale:.012,envMapIntensity:1.8});
 case 'stone':return new THREE.MeshStandardMaterial({...common,map:maps.stone,roughness:.96,metalness:0,bumpMap:heights.stone,bumpScale:.24,roughnessMap:heights.stone});
 case 'metal':return new THREE.MeshPhysicalMaterial({...common,metalness:1,roughness:.075,roughnessMap:heights.metal,clearcoat:1,clearcoatRoughness:.055,anisotropy:.32,envMapIntensity:2.35});
 case 'foam':return new THREE.MeshPhysicalMaterial({...common,map:maps.foam,roughness:.34,metalness:0,clearcoat:.24,clearcoatRoughness:.24,bumpMap:heights.foam,bumpScale:.085,transmission:.015,thickness:.35,envMapIntensity:.9});
 case 'sand':return new THREE.MeshStandardMaterial({...common,map:maps.sand,roughness:1,bumpMap:maps.sand,bumpScale:.22});
 case 'clay':return new THREE.MeshStandardMaterial({...common,map:maps.clay,roughness:.72,bumpMap:maps.clay,bumpScale:.09});
 case 'wood':return new THREE.MeshStandardMaterial({...common,map:maps.wood,roughness:.82,bumpMap:maps.wood,bumpScale:.13});
 case 'leaf':return new THREE.MeshPhysicalMaterial({...common,map:maps.leaf,roughness:.48,clearcoat:.2,side:THREE.DoubleSide});
 case 'bead':return new THREE.MeshPhysicalMaterial({...common,metalness:.92,roughness:.12,clearcoat:1});
 default:return new THREE.MeshPhysicalMaterial({...common,roughness:.38,clearcoat:.65});
 }
}
function pathOf(l){let pts=(l.pts||[]).map(p=>new THREE.Vector3(p[0]+(l.ox||0),H-(p[1]+(l.oy||0)),0));if(pts.length<2){let p=pts[0]||new THREE.Vector3(W/2,H/2,0);pts.push(p.clone().add(new THREE.Vector3(1,0,0)))}return pts}
function curveOf(l){return new THREE.CatmullRomCurve3(pathOf(l),false,'centripetal')}
function tube(g,c,r,m,seg=120,rad=18){let mesh=new THREE.Mesh(new THREE.TubeGeometry(c,Math.max(8,seg),Math.max(.5,r),rad,false),m);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh}
function ball(g,p,r,m,detail=2,scale=null){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(r,detail),m);o.position.copy(p);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
function offsetCurve(c,off,z=0){const ps=c.getSpacedPoints(Math.max(14,Math.ceil(c.getLength()/7))).map((p,i,a)=>{const t=c.getTangentAt(i/(a.length-1));return new THREE.Vector3(p.x-t.y*off,p.y+t.x*off,z)});return new THREE.CatmullRomCurve3(ps)}
function variableTube(c,radiusFn,matr,segments=120,radial=16){
 const frames=c.computeFrenetFrames(segments,false),verts=[],uv=[],idx=[];
 for(let i=0;i<=segments;i++){const t=i/segments,p=c.getPointAt(t),r=Math.max(.25,radiusFn(t));for(let j=0;j<=radial;j++){const a=j/radial*Math.PI*2,n=frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i],Math.sin(a));const v=p.clone().addScaledVector(n,r);verts.push(v.x,v.y,v.z);uv.push(t*4,j/radial)}}
 for(let i=0;i<segments;i++)for(let j=0;j<radial;j++){let a=i*(radial+1)+j,b=a+radial+1;idx.push(a,b,a+1,b,b+1,a+1)}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,matr);mesh.castShadow=mesh.receiveShadow=true;return mesh;
}

function strut(g,a,b,r,matr,radial=7){
 const d=new THREE.Vector3().subVectors(b,a),len=d.length();if(len<.01)return;
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r*.78,r,len,radial,1),matr);
 mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
 mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);
}
function foamLattice(g,c,size,matr,seedFn){
 // Connected open-cell scaffold. The voids are geometric openings between struts.
 const along=Math.max(9,Math.min(90,Math.ceil(c.getLength()/(size*.19)))),around=10,grid=[];
 for(let i=0;i<=along;i++){
  const t=i/along,center=c.getPointAt(t),tan=c.getTangentAt(t),normal=new THREE.Vector3(-tan.y,tan.x,0).normalize(),ring=[];
  for(let j=0;j<around;j++){const a=j/around*Math.PI*2,variation=.78+seedFn()*.42,rad=size*.34*variation;
   ring.push(center.clone().addScaledVector(normal,Math.cos(a)*rad).add(new THREE.Vector3(0,0,Math.sin(a)*rad*.82)));}
  grid.push(ring);
 }
 const wire=size*.035;
 for(let i=0;i<=along;i++)for(let j=0;j<around;j++){
  const next=(j+1)%around;strut(g,grid[i][j],grid[i][next],wire,matr,6);
  if(i<along){strut(g,grid[i][j],grid[i+1][j],wire,matr,6);const diag=(i+j)%2===0?next:(j+around-1)%around;strut(g,grid[i][j],grid[i+1][diag],wire*.82,matr,6);}
 }
}
function deterministicNoise(t,seed,amount){const a=Math.sin((t*127.1+seed*311.7))*43758.5453;return 1+(a-Math.floor(a)-.5)*amount;}

function build(l){
 const p=l.p||{},size=p.size||44,col=p.color||'#d8d4cc',tex=p.texture??.55,rel=p.relief??.65,R=seeded(l.seed||17),c=curveOf(l),len=c.getLength(),n=Math.max(24,Math.ceil(len/5)),g=new THREE.Group();g.userData.layerId=l.id;
 const ceramic=material(col,'ceramic'),stone=material(col,'stone'),chrome=material(col,'metal'),foam=material(col,'foam'),sand=material(col,'sand'),clay=material(col,'clay'),wood=material(col,'wood'),leaf=material(col,'leaf'),bead=material(col,'bead');
 const pts=c.getSpacedPoints(n);
 switch(l.brush){
 case 0: {const seed=l.seed||17;g.add(variableTube(c,t=>size*.355*deterministicNoise(t,seed,.055)*(.94+.06*Math.sin(t*len/size*1.6)),ceramic,n,32));break;}
 case 1: {const seed=l.seed||17;g.add(variableTube(c,t=>size*.355*deterministicNoise(t,seed,rel*.34)*(.92+.08*Math.sin(t*len/size*3)),stone,n,20));break;}
 case 2: {const seed=l.seed||23;g.add(variableTube(c,t=>size*.325*deterministicNoise(t,seed,.045)*(.88+.12*Math.sin(t*len/size*2.2)**2),chrome,n,32));break;}
 case 3: g.add(variableTube(c,t=>size*.28*(.9+.1*Math.sin(t*12*Math.PI)),material(col,'ceramic'),n,20));break;
 case 4: g.add(variableTube(c,t=>size*.43*(.78+.22*Math.sin(t*19*Math.PI)),clay,n,24));for(let i=0;i<pts.length;i+=5)ball(g,pts[i].clone().add(new THREE.Vector3((R()-.5)*size*.2,(R()-.5)*size*.2,size*.1)),size*(.045+R()*.07),clay,2);break;
 case 5: { // open-cell foam: connected 3D strut network and polygonal voids
   foamLattice(g,c,size,foam,R);break;
 }
 case 6: {for(let k=0;k<3;k++){const cc=offsetCurve(c,(k-1)*size*.18,k*size*.09);g.add(variableTube(cc,t=>size*(.17+.09*Math.pow(Math.sin(t*len/size*2.4+k),2)),foam,n,24))}break;}
 case 7: for(let i=0;i<pts.length;i+=Math.max(2,Math.floor(size*.65/5)))ball(g,pts[i].clone().add(new THREE.Vector3(0,0,size*.12)),size*.24,bead,3);break;
 case 8: for(const q of pts)for(let k=0;k<Math.round(7+tex*15);k++){let a=R()*6.283,d=(R()-.5)*size*.9;ball(g,new THREE.Vector3(q.x+Math.cos(a)*d,q.y+Math.sin(a)*d,(R()-.5)*size*.12),.4+R()*1.5,sand,1)}break;
 case 9: for(const q of pts)for(let k=0;k<14;k++){let a=R()*6.283,d=(R()-.5)*size*.85;ball(g,new THREE.Vector3(q.x+Math.cos(a)*d,q.y+Math.sin(a)*d,R()*size*.1),.5+R()*1.2,stone,1)}break;
 case 10: { // porous mass with deep shaded pits and a rough outer silhouette
   g.add(variableTube(c,t=>size*.36*(.9+.1*Math.sin(t*len/size*5)),material(col,'porous'),n,18));
   for(let i=0;i<pts.length;i+=3){let q=pts[i],a=R()*6.283,d=(R()-.5)*size*.42,rr=size*(.035+R()*.055);const pit=new THREE.Mesh(new THREE.CircleGeometry(rr,12),new THREE.MeshBasicMaterial({color:0x252b20}));pit.position.set(q.x+Math.cos(a)*d,q.y+Math.sin(a)*d,size*.34);g.add(pit)}
   break;
 }
 case 11: {tube(g,offsetCurve(c,size*.075),size*.045,chrome,n,8);tube(g,offsetCurve(c,-size*.075),size*.045,chrome,n,8);for(let i=0;i<pts.length;i+=Math.max(3,Math.floor(size*.8/5))){let q=pts[i],t=c.getTangentAt(i/n),d=new THREE.Vector3(-t.y,t.x,0).multiplyScalar((i%2?1:-1)*size*.42),base=q.clone().add(new THREE.Vector3(0,0,size*.03)),tip=base.clone().add(d).addScaledVector(t,size*.18);tube(g,new THREE.CatmullRomCurve3([base,base.clone().addScaledVector(d,.55),tip]),size*.035,chrome,8,7)}break}
 case 12: {tube(g,c,size*.11,chrome,n,12);for(let i=0;i<pts.length;i+=Math.max(3,Math.floor(size*.6/5))){let q=pts[i],t=c.getTangentAt(i/n),d=new THREE.Vector3(-t.y,t.x,0).multiplyScalar((i%2?1:-1)*size*.48),base=q.clone().add(new THREE.Vector3(0,0,size*.04)),tip=base.clone().add(d).addScaledVector(t,size*.28);tube(g,new THREE.CatmullRomCurve3([base,base.clone().addScaledVector(d,.5),tip]),size*.055,chrome,9,8)}break}
 case 13: {tube(g,c,size*.055,wood,n,10);for(let i=0;i<pts.length;i+=Math.max(3,Math.floor(size*.5/5))){let q=pts[i],t=c.getTangentAt(i/n);for(const side of [-1,1]){let a=Math.atan2(t.y,t.x)+side*.9,dir=new THREE.Vector3(Math.cos(a),Math.sin(a),.12),start=q.clone().add(new THREE.Vector3(0,0,size*.04)),end=start.clone().addScaledVector(dir,size*.5);tube(g,new THREE.CatmullRomCurve3([start,start.clone().addScaledVector(dir,size*.23),end]),size*.025,wood,8,7);let lm=new THREE.Mesh(new THREE.SphereGeometry(size*.14,12,8),leaf);lm.scale.set(1.5,.55,.22);lm.position.copy(end);lm.rotation.z=a;g.add(lm)}}break}
 case 14: g.add(variableTube(c,t=>size*.39*(.9+.1*Math.sin(t*len/size*12)),clay,n,24));break;
 case 15: {tube(g,c,size*.24,wood,n,14);for(let i=0;i<pts.length;i+=Math.max(4,Math.floor(size/5))){let q=pts[i],t=c.getTangentAt(i/n),side=new THREE.Vector3(-t.y,t.x,0).multiplyScalar(i%2?1:-1),end=q.clone().addScaledVector(side,size*(.45+R()*.6)).addScaledVector(t,size*.22);tube(g,new THREE.CatmullRomCurve3([q,q.clone().addScaledVector(side,size*.2),end]),size*.075,wood,12,9)}break}
 }
 const depth=clamp(p.d3??.75,0,1);g.scale.z=.65+depth*2.4;return g;
}
function clear(){while(root.children.length){const o=root.children[0];root.remove(o);o.traverse?.(x=>{x.geometry?.dispose();if(x.material){if(Array.isArray(x.material))x.material.forEach(m=>m.dispose());else mDispose(x.material)}})}}
function mDispose(m){m.dispose()}
let last='',lightKey='',dynamicLights=[];
function update(layers,lights=[],ambient=.3){
 renderer.setSize(W,H,false);
 const sig=layers.filter(l=>l.vis&&l.type==='stroke'&&l.brush<16).map(l=>JSON.stringify([l.id,l.seed,l.brush,l.pts,l.ox,l.oy,l.p])).join('|');
 if(sig!==last){clear();for(const l of layers)if(l.vis&&l.type==='stroke'&&l.brush<16){const m=build(l);m.userData.layerId=l.id;root.add(m)}last=sig}
 if(JSON.stringify([lights,ambient])!==lightKey){dynamicLights.forEach(x=>scene.remove(x));dynamicLights=[];const ambLight=new THREE.AmbientLight(0xffffff,clamp(ambient*1.8,.12,1.8));ambLight.userData.dynamicLight=true;scene.add(ambLight);dynamicLights.push(ambLight);
  for(const L of lights.slice(0,6)){const light=new THREE.PointLight(L.col||'#ffffff',Math.max(.1,(L.int||1)*180),Math.max(100,(L.r||600)*2),2);light.position.set(L.x,H-L.y,L.z||320);light.userData.dynamicLight=true;scene.add(light);dynamicLights.push(light)}lightKey=JSON.stringify([lights,ambient])}
 renderer.render(scene,camera);
}
function renderExport(scale=1){renderer.setSize(W*scale,H*scale,false);renderer.render(scene,camera);return view}
window.FORM3D={update,renderExport,ready:true,renderer,scene,camera};
window.dispatchEvent(new Event('form3d-ready'));
