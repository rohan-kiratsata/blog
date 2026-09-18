import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clearing, heightAt, noise, pathDistance, random } from './terrain';
import { biomeAt } from './expedition';
export type Obstacle={x:number;z:number;radius:number;height:number;shape?:'box';width?:number;depth?:number;y?:number;enabled?:boolean};
export const surface=(color:string,extra:T.MeshStandardMaterialParameters={})=>new T.MeshStandardMaterial({color,roughness:.88,flatShading:true,...extra});
export function addMesh(parent:T.Object3D,geometry:T.BufferGeometry,material:T.Material,x:number,y:number,z:number){const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function grassGeometry(variant:number){
  const vertices:number[]=[],colors:number[]=[];
  const rand=random(721+variant*43);
  for(let blade=0;blade<6;blade++){
    const a=rand()*Math.PI*2,h=.19+rand()*.25,w=.018+rand()*.016;
    const bx=Math.cos(a)*rand()*.13,bz=Math.sin(a)*rand()*.13;
    const edge=(t:number,side:number)=>[bx+Math.cos(a)*t*t*.14-Math.sin(a)*w*(1-t)*side,h*t,bz+Math.sin(a)*t*t*.14+Math.cos(a)*w*(1-t)*side];
    for(let j=0;j<3;j++){
      const t=j/3,n=(j+1)/3;
      vertices.push(...edge(t,-1),...edge(n,-1),...edge(t,1),...edge(t,1),...edge(n,-1),...edge(n,1));
      for(const value of [t,n,t,t,n,n])colors.push(.62+value*.38,.62+value*.38,.62+value*.38);
    }
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();return geometry;
}
export function makeEcosystem(scene:T.Scene,mobile:boolean,reduced:boolean){
  const obstacles:Obstacle[]=[],rand=random(817),dummy=new T.Object3D(),color=new T.Color();
  const time={value:0},walker={value:new T.Vector3()},geometries=[0,1,2].map(grassGeometry);
  const grass=surface('#ffffff',{vertexColors:true,side:T.DoubleSide,flatShading:false});
  grass.onBeforeCompile=shader=>{
    shader.uniforms.uTime=time;shader.uniforms.uWalker=walker;
    shader.vertexShader='uniform float uTime; uniform vec3 uWalker;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      #ifdef USE_INSTANCING
      vec3 root=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xyz;
      float bend=1.0-smoothstep(.2,.85,distance(root.xz,uWalker.xz));
      vec2 away=normalize(root.xz-uWalker.xz+vec2(.001));
      transformed.xz+=away*bend*position.y*.7;
      transformed.y*=1.0-bend*.45;
      transformed.x+=sin(uTime*1.7+root.x*.8+root.z*.55)*position.y*.09;
      transformed.y*=1.0-smoothstep(62.,82.,distance(root.xz,cameraPosition.xz));
      #endif
    `);
  };
  const tiles=new Map<string,T.InstancedMesh>(),tileSize=20;
  function createTile(tx:number,tz:number){
    const rng=random(Math.abs(tx*73856093^tz*19349663)+1),count=mobile?320:520;
    const tile=new T.InstancedMesh(geometries[Math.abs(tx+tz)%3],grass,count);let used=0;
    tile.position.set(tx*tileSize,0,tz*tileSize);
    for(let i=0;i<count;i++){
      const lx=rng()*tileSize,lz=rng()*tileSize,x=lx+tx*tileSize,z=lz+tz*tileSize;
      if(Math.hypot(x,z)>385||clearing(x,z)||pathDistance(x,z)<1.5||noise(x*.06,z*.06)<-.25)continue;
      const slope=Math.hypot(heightAt(x+1,z)-heightAt(x-1,z),heightAt(x,z+1)-heightAt(x,z-1));if(slope>1.15)continue;
      if(x< -60&&rng()<.7)continue;
      const scale=.7+rng()*.5;dummy.position.set(lx,heightAt(x,z)-.01,lz);dummy.rotation.set(0,rng()*6.28,0);dummy.scale.set(scale,scale,scale);dummy.updateMatrix();
      tile.setMatrixAt(used,dummy.matrix);color.set(x>85?'#729990':x< -60?'#8f977e':'#819f70');color.multiplyScalar(.88+rng()*.23);tile.setColorAt(used++,color);
    }
    tile.count=used;tile.receiveShadow=true;tile.computeBoundingSphere();scene.add(tile);tiles.set(`${tx},${tz}`,tile);
  }
  function updateGrass(position:T.Vector3){
    const tx=Math.floor(position.x/tileSize),tz=Math.floor(position.z/tileSize);
    for(const [key,tile] of tiles){const [x,z]=key.split(',').map(Number);if(Math.abs(x-tx)>4||Math.abs(z-tz)>4){scene.remove(tile);tile.dispose();tiles.delete(key);}}
    let budget=3;
    for(let ring=0;ring<=4;ring++)for(let x=tx-ring;x<=tx+ring;x++)for(let z=tz-ring;z<=tz+ring;z++){
      if(budget>0&&!tiles.has(`${x},${z}`)){createTile(x,z);budget--;}
    }
  }
  // Mineral shelves and boulders share a restrained material family.
  const rockGeo=new T.IcosahedronGeometry(1,1),rocks=new T.InstancedMesh(rockGeo,surface('#71787e'),650);rocks.castShadow=true;rocks.receiveShadow=true;scene.add(rocks);let rockCount=0;
  for(let i=0;i<650;i++){
    const x=(rand()-.5)*730,z=(rand()-.5)*730;if(clearing(x,z)||pathDistance(x,z)<4)continue;
    const s=.6+Math.pow(rand(),2)*4.4;dummy.position.set(x,heightAt(x,z)+s*.3,z);dummy.scale.set(s,s*.65,s*.8);dummy.rotation.set(rand()*.15,rand()*6.28,rand()*.12);dummy.updateMatrix();rocks.setMatrixAt(rockCount++,dummy.matrix);obstacles.push({x,z,radius:s*.73,height:s});
  }rocks.count=rockCount;rocks.computeBoundingSphere();
  // Authored branching trees replace the procedural mushroom silhouettes.
  let disposed=false;const loader=new GLTFLoader();
  const treeSources=['tree_oak','tree_detailed','tree_pineTallA_detailed'];
  const ready=Promise.all(treeSources.map((name,index)=>new Promise<void>(resolve=>loader.load('/zen/nature/'+name+'.glb',gltf=>{
    const model=gltf.scene;
    if(disposed){model.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});resolve();return;}
    const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
    model.position.set(-center.x,-box.min.y,-center.z);const template=new T.Group();template.add(model);template.updateMatrixWorld(true);
    for(let i=0;i<60;i++){
      const x=index===2?-100+(rand()-.5)*280:110+(rand()-.5)*200,z=index===2?-180+(rand()-.5)*170:-70+(rand()-.5)*240;
      if(clearing(x,z)||pathDistance(x,z)<6)continue;
      const tree=template.clone(true),height=4.5+rand()*5;tree.scale.setScalar(height/size.y);tree.position.set(x,heightAt(x,z),z);tree.rotation.y=rand()*6.28;
      tree.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m instanceof T.MeshStandardMaterial){m.metalness=0;m.roughness=1;if(m.name==='grass'||m.name.toLowerCase().includes('leav'))m.color.set(index===2?'#788b8c':'#729b91');}});}});
      scene.add(tree);obstacles.push({x,z,radius:.65,height});
    }resolve();
  },undefined,()=>resolve()))));
  return {obstacles,ready,update:(seconds:number,position:T.Vector3)=>{time.value=reduced?0:seconds;walker.value.copy(position);updateGrass(position);},dispose:()=>{disposed=true;tiles.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());grass.dispose();}};
}
