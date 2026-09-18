import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { makeInteractions, type Interaction } from './interactions';
import type { ExpeditionSave } from './expedition';
import { stations } from './stations';
import { makeTerrain, heightAt } from './terrain';
import { makeEcosystem, addMesh, surface } from './ecosystem';
import { makeAtmosphere } from './atmosphere';
import { makeExplorer } from './explorer';
import { makeController } from './controller';

export type Telemetry = { fuel:number; jetting:boolean; grounded:boolean; altitude:number; x:number; y:number; z:number; heading:number; nearest:number; distance:number; speed:number; scanning:boolean; boundary:boolean; interaction:Interaction|null; expedition:ExpeditionSave };
export type World = {
  interact:()=>number|null; visit:(id:number)=>void; beacon:(id:string)=>void; dispose:()=>void; pause:(value:boolean)=>void; travel:(id:number)=>void;
  move:(x:number,y:number)=>void; jump:(held:boolean)=>void; sprint:(value:boolean)=>void; look:()=>void; scan:()=>void;
};
export function createWorld(host:HTMLDivElement,onNear:(id:number)=>void,onReady:()=>void,onError:()=>void,onState?:(state:Telemetry)=>void,onNotice?:(message:string)=>void):World {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile=host.clientWidth<700;
  const scene=new T.Scene();
  const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.3:1.5));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.domElement.setAttribute('aria-label','Serein alien landscape. WASD to move, shift to sprint, tap space to jump, hold space to fly, drag to look.');
  host.appendChild(renderer.domElement);
  const camera=new T.PerspectiveCamera(62,1,.08,1500);
  const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.22;
  room.dispose();pmrem.dispose();
  const atmosphere=makeAtmosphere(scene),ground=makeTerrain();scene.add(ground);
  const ecosystem=makeEcosystem(scene,mobile,reduced),explorer=makeExplorer();scene.add(explorer.player);
  const loader=new GLTFLoader();let disposed=false,paused=false;
  const materials=new Set<T.Material>(),geometries=new Set<T.BufferGeometry>(),textures=new Set<T.Texture>();
  function disposeObject(object:T.Object3D) {
    object.traverse(child=>{
      if(child instanceof T.Mesh||child instanceof T.LineSegments||child instanceof T.Points||child instanceof T.Sprite){
        if('geometry' in child)geometries.add(child.geometry);
        if(child instanceof T.InstancedMesh)child.dispose();
        const list=Array.isArray(child.material)?child.material:[child.material];
        list.forEach(material=>{materials.add(material);Object.values(material).forEach(value=>{if(value instanceof T.Texture)textures.add(value);});});
      }
    });
  }
  function releaseCollected(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());geometries.clear();materials.clear();textures.clear();}
  function loadModel(url:string,parent:T.Group,size:number) {
    return new Promise<void>(resolve=>loader.load(url,gltf=>{
      if(disposed){disposeObject(gltf.scene);releaseCollected();resolve();return;}
      const model=gltf.scene,box=new T.Box3().setFromObject(model),dimensions=box.getSize(new T.Vector3());
      model.scale.setScalar(size/Math.max(dimensions.x,dimensions.y,dimensions.z));
      const bounds=new T.Box3().setFromObject(model),center=bounds.getCenter(new T.Vector3());
      model.position.set(-center.x,-bounds.min.y,-center.z);
      model.traverse(child=>{if(child instanceof T.Mesh){child.castShadow=true;child.receiveShadow=true;
        (Array.isArray(child.material)?child.material:[child.material]).forEach(mat=>{
          if(mat instanceof T.MeshStandardMaterial){
            mat.metalness=.12;mat.roughness=.64;
            const palette:Record<string,string>={metal:'#e8ebef',metalDark:'#4a6488',metalRed:'#edb36c',dark:'#163650',grass:'#b335a0',dirt:'#655374',colorRed:'#9b449b'};
            if(palette[mat.name])mat.color.set(palette[mat.name]);
          }
        });
      }});parent.add(model);resolve();
    },undefined,()=>resolve()));
  }
  const white=surface('#dce5ed',{flatShading:false,metalness:.12}),navy=surface('#263e5c'),cyan=surface('#64e8e4',{emissive:'#39b9d5',emissiveIntensity:1.8});
  const labels:T.Sprite[]=[],beacons:T.Mesh[]=[],loads:Promise<void>[]=[];
  stations.forEach((s,i)=>{
    const group=new T.Group();group.position.set(s.x,heightAt(s.x,s.z),s.z);scene.add(group);
    ecosystem.obstacles.push({x:s.x,z:s.z,radius:2.6,height:5});
    const platform=addMesh(group,new T.CylinderGeometry(3.2,3.5,.32,8),navy,0,.1,0);
    addMesh(group,new T.CylinderGeometry(3.12,3.12,.12,8),white,0,.3,0);
    for(const x of [-2.3,2.3])for(const z of [-2,2]){
      addMesh(group,new T.CylinderGeometry(.15,.25,1,6),white,x,-.25,z);
      addMesh(group,new T.BoxGeometry(.35,.09,.35),cyan,x,.4,z);
    }
    const prop=new T.Group();prop.position.y=.4;group.add(prop);
    const asset=i===1?'/zen/quaternius/geodesic-dome.glb':i===3?'/zen/quaternius/habitat.glb':'/zen/models/'+s.model;
    loads.push(loadModel(asset,prop,i===0?5.7:5.3));
    // Functional-looking consoles and light rails give each outpost a human scale.
    const consoleGroup=new T.Group();consoleGroup.position.set(1.9,0,3.1);group.add(consoleGroup);
    addMesh(consoleGroup,new T.BoxGeometry(.7,1.05,.5),navy,0,.52,0);
    const screen=addMesh(consoleGroup,new T.BoxGeometry(.62,.4,.045),cyan,0,1.14,.12);screen.rotation.x=-.32;
    const beacon=addMesh(group,new T.OctahedronGeometry(.16),cyan,0,6.6,0);beacons.push(beacon);
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d')!;
    ctx.fillStyle='rgba(13,27,51,.75)';ctx.fillRect(12,20,488,86);ctx.strokeStyle='#75ecf4';ctx.lineWidth=2;ctx.strokeRect(12,20,488,86);
    ctx.font='500 23px monospace';ctx.textAlign='center';ctx.fillStyle='#effaff';ctx.fillText(`${String(i+1).padStart(2,'0')} / ${s.name.toUpperCase()}`,256,73);
    const texture=new T.CanvasTexture(canvas),label=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:true,transparent:true,toneMapped:false}));
    label.position.set(0,7.5,0);label.scale.set(5.5,1.375,1);group.add(label);labels.push(label);
    platform.receiveShadow=true;
  });
  const interactions=makeInteractions(scene,ecosystem.obstacles,message=>onNotice?.(message));
  let controller:Awaited<ReturnType<typeof makeController>>|null=null;
  Promise.all([explorer.ready,ecosystem.ready,...loads]).then(async()=>{
    if(disposed)return;
    const next=await makeController(explorer.player,camera,renderer.domElement,ecosystem.obstacles,reduced);
    if(disposed){next.dispose();return;}controller=next;controller.pause(paused);onReady();
  }).catch(()=>{if(!disposed)onError();});
  const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new T.Vector2(1,1),.22,.5,1.15);composer.addPass(bloom);
  const output=new OutputPass();composer.addPass(output);
  const pulse=new T.Mesh(new T.SphereGeometry(1,32,16),new T.MeshBasicMaterial({color:'#75fcff',transparent:true,opacity:.12,wireframe:true,depthWrite:false}));pulse.visible=false;scene.add(pulse);
  let scanTime=-100,elapsed=0,last=0,frame=0,near=-2,lastTelemetry=0;
  const scan=()=>{if(paused)return;scanTime=elapsed;pulse.position.copy(explorer.player.position);};
  const scanKey=(e:KeyboardEvent)=>{if(e.code==='KeyR'&&!e.repeat&&!paused){e.preventDefault();scan();}};
  window.addEventListener('keydown',scanKey);
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const contextLost=(e:Event)=>{e.preventDefault();onError();};renderer.domElement.addEventListener('webglcontextlost',contextLost);
  const animate=(now:number)=>{
    if(disposed)return;frame=requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.035);last=now;if(document.hidden)return;
    if(!paused)elapsed+=dt;
    if(!controller)return;
    const state=controller.update(dt);explorer.animate(paused?0:dt,state.speed,state.grounded,state.verticalSpeed,state.jetting,reduced);
    atmosphere.update(explorer.player.position);ecosystem.update(elapsed,explorer.player.position);interactions.update(paused?0:dt,elapsed,explorer.player.position,elapsed-scanTime<7);
    let closest=0,distance=Infinity;
    stations.forEach((s,i)=>{const d=Math.hypot(s.x-explorer.player.position.x,s.z-explorer.player.position.z);if(d<distance){distance=d;closest=i;}labels[i].visible=(d<20&&d>7)||elapsed-scanTime<7;if(!reduced)beacons[i].rotation.y=elapsed*.5;});
    const next=distance<7?closest:-1;if(next!==near){near=next;onNear(next);}
    const scanAge=elapsed-scanTime;pulse.visible=!reduced&&scanAge<2.5;pulse.scale.setScalar(Math.max(.01,scanAge*24));(pulse.material as T.MeshBasicMaterial).opacity=.13*(1-scanAge/2.5);
    if(now/1000-lastTelemetry>.15||lastTelemetry===0){
      lastTelemetry=now/1000;onState?.({fuel:state.fuel,jetting:state.jetting,grounded:state.grounded,altitude:state.altitude,x:explorer.player.position.x,y:explorer.player.position.y,z:explorer.player.position.z,heading:((-state.yaw*180/Math.PI)%360+360)%360,nearest:closest,distance,speed:state.speed,scanning:scanAge<7,boundary:Math.hypot(explorer.player.position.x,explorer.player.position.z)>370,interaction:interactions.target(),expedition:interactions.state()});
    }
    composer.render();
  };
  frame=requestAnimationFrame(animate);

  return {
    pause:value=>{paused=value;controller?.pause(value);},move:(x,y)=>controller?.move(x,y),jump:held=>controller?.jump(held),sprint:value=>controller?.sprint(value),look:()=>controller?.look(),scan,
    interact:()=>{if(paused)return null;if(interactions.target()){interactions.interact();return null;}return near>=0?near:null;},
    visit:id=>{if(near===id)interactions.visit(id);},
    beacon:id=>{const e=interactions.beacon(id);if(e)controller?.travel(e.x+2,e.z+2);},
    travel:id=>{const s=stations[id];if(s&&interactions.state().visited.includes(id))controller?.travel(s.x,s.z+5.5);},
    dispose:()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();controller?.dispose();explorer.dispose();ecosystem.dispose();window.removeEventListener('keydown',scanKey);renderer.domElement.removeEventListener('webglcontextlost',contextLost);disposeObject(scene);releaseCollected();atmosphere.sun.shadow.dispose();environment.dispose();bloom.dispose();output.dispose();composer.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();},
  };
}
