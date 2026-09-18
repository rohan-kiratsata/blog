import * as T from 'three';
import { encounters, readExpedition, saveExpedition, type ExpeditionSave } from './expedition';
import { heightAt } from './terrain';
import { addMesh, surface, type Obstacle } from './ecosystem';

export type Interaction={id:string;name:string;action:string};
export function makeInteractions(scene:T.Scene,obstacles:Obstacle[],notify:(message:string)=>void){
  const save=readExpedition(),done=new Set(save.completed);
  const white=surface('#cfdcdb'),dark=surface('#394c58'),amber=surface('#dfa56b'),glass=surface('#8ccebf',{emissive:'#52998f',emissiveIntensity:.25});
  const nodes=new Map<string,{group:T.Group;light:T.MeshStandardMaterial;moving:T.Object3D;marker:T.Mesh;bridge?:T.Group;collision?:Obstacle[]}>();
  let nearest:Interaction|null=null,dishTurns=0;
  const commit=()=>{save.completed=[...done];saveExpedition(save);};
  encounters.forEach(e=>{
    const group=new T.Group();group.name=e.id;
    const x=e.x+(e.kind==='bridge'?11:0);group.position.set(x,heightAt(x,e.z),e.z);scene.add(group);
    const light=surface('#73c6ba',{emissive:'#71d6cb',emissiveIntensity:.25});
    const marker=addMesh(group,new T.OctahedronGeometry(.12),light,0,2.9,0);marker.castShadow=false;
    let moving:T.Object3D=group,bridge:T.Group|undefined,collision:Obstacle[]|undefined;
    if(e.kind==='cell'){
      addMesh(group,new T.BoxGeometry(1.2,.3,.85),dark,0,.15,0);
      moving=new T.Group();moving.position.y=.6;group.add(moving);
      addMesh(moving,new T.CylinderGeometry(.18,.18,.6,8),white,0,0,0);
      addMesh(moving,new T.CylinderGeometry(.185,.185,.23,8),light,0,0,0);
    }else if(e.kind==='flora'){
      for(let i=0;i<7;i++){
        const angle=i*Math.PI*2/7,stem=new T.Group();stem.rotation.set(.2*Math.cos(angle),angle,.25*Math.sin(angle));group.add(stem);
        addMesh(stem,new T.CylinderGeometry(.025,.045,1.4,5),dark,Math.sin(angle)*.35,.7,Math.cos(angle)*.35);
        const leaf=addMesh(stem,new T.OctahedronGeometry(.4),glass,Math.sin(angle)*.5,1.25,Math.cos(angle)*.5);leaf.scale.set(.5,1.5,.25);leaf.rotation.z=Math.sin(angle)*.4;
      }
      moving=addMesh(group,new T.IcosahedronGeometry(.17,1),light,0,1.3,0);
    }else if(e.kind==='drone'){
      moving=new T.Group();group.add(moving);moving.position.y=.55;
      const body=addMesh(moving,new T.SphereGeometry(.37,12,8),white,0,0,0);body.scale.set(1,.7,1);
      addMesh(moving,new T.BoxGeometry(.34,.12,.12),light,0,0,.32);
      for(const side of [-1,1]){addMesh(moving,new T.BoxGeometry(.35,.07,.2),dark,side*.42,.04,0);addMesh(moving,new T.CylinderGeometry(.15,.2,.1,8),amber,side*.57,0,0);}
    }else if(e.kind==='cache'){
      addMesh(group,new T.BoxGeometry(1.3,.65,.9),dark,0,.325,0);
      moving=new T.Group();moving.position.set(0,.65,-.45);group.add(moving);
      addMesh(moving,new T.BoxGeometry(1.36,.12,.94),white,0,0,.45);
      addMesh(group,new T.BoxGeometry(.28,.12,.04),light,0,.45,.47);
    }else if(e.kind==='view'){
      addMesh(group,new T.CylinderGeometry(.8,1,.15,8),white,0,.075,0);
      addMesh(group,new T.CylinderGeometry(.08,.14,1.1,8),dark,0,.6,0);
      moving=addMesh(group,new T.BoxGeometry(.65,.22,.38),light,0,1.2,0);moving.rotation.x=.2;
    }else{
      addMesh(group,new T.CylinderGeometry(.65,.85,.25,6),dark,0,.125,0);
      addMesh(group,new T.BoxGeometry(.65,1.3,.45),white,0,.9,0);
      addMesh(group,new T.BoxGeometry(.45,.35,.04),light,0,1.15,.25);
      addMesh(group,new T.CylinderGeometry(.06,.1,1.1,6),dark,0,1.9,0);
      moving=new T.Group();moving.position.y=2.35;group.add(moving);
      if(e.kind==='dish'){
        const dish=addMesh(moving,new T.SphereGeometry(.8,12,6,0,Math.PI*2,0,Math.PI*.42),white,0,0,0);dish.rotation.x=.9;
        addMesh(moving,new T.CylinderGeometry(.025,.04,.8,6),light,0,.4,0);
      }else addMesh(moving,new T.OctahedronGeometry(.25),light,0,0,0);
      obstacles.push({x,z:e.z,radius:.55,height:1.6});
      if(e.kind==='relay'){
        const destination=e.id==='landing-relay'?{x:-12,z:0}:{x:140,z:-95};
        for(let i=0;i<8;i++){
          const t=i/7,lx=T.MathUtils.lerp(e.x,destination.x,t)+2,lz=T.MathUtils.lerp(e.z,destination.z,t);
          const lamp=new T.Group();lamp.position.set(lx,heightAt(lx,lz),lz);scene.add(lamp);
          addMesh(lamp,new T.CylinderGeometry(.06,.1,.5,6),dark,0,.25,0);addMesh(lamp,new T.BoxGeometry(.2,.08,.2),light,0,.52,0);
        }
      }
      if(e.kind==='bridge'){
        bridge=new T.Group();scene.add(bridge);collision=[];
        const y1=heightAt(e.x-12,e.z),y2=heightAt(e.x+12,e.z);
        for(let i=0;i<24;i++){
          const bx=e.x-11.5+i,by=T.MathUtils.lerp(y1,y2,(i+.5)/24)+.05;
          addMesh(bridge,new T.BoxGeometry(1.02,.2,3.2),i%3===0?white:dark,bx,by-.1,e.z);
          for(const side of [-1,1])addMesh(bridge,new T.BoxGeometry(.85,.05,.08),light,bx,by+.03,e.z+side*1.5);
          const o:Obstacle={x:bx,z:e.z,radius:1.7,height:.2,shape:'box',width:1.02,depth:3.2,y:by-.2,enabled:done.has(e.id)};obstacles.push(o);collision.push(o);
        }
        bridge.visible=done.has(e.id);
      }
    }
    nodes.set(e.id,{group,light,moving,marker,bridge,collision});
  });
  function apply(){for(const e of encounters){const node=nodes.get(e.id)!;const complete=done.has(e.id);node.light.emissiveIntensity=complete?1.7:.15;if(e.kind==='cell')node.moving.visible=!complete;if(e.kind==='cache')node.moving.rotation.x=complete?-1.3:0;if(e.kind==='bridge'){node.bridge!.visible=complete;node.collision!.forEach(o=>o.enabled=complete);}node.marker.visible=!complete;}}
  apply();
  return {
    state:():ExpeditionSave=>({...save,completed:[...done],visited:[...save.visited]}),
    visit:(id:number)=>{if(!save.visited.includes(id)){save.visited.push(id);commit();}},
    target:()=>nearest,
    interact:()=>{
      if(!nearest)return;
      const e=encounters.find(e=>e.id===nearest!.id)!;
      if(e.needsCell&&save.cells===0){notify('An empty power socket. Find a supply case along the trail.');return;}
      if(e.kind==='dish'&&++dishTurns<3){nodes.get(e.id)!.moving.rotation.y+=Math.PI*2/3;notify(`Signal strength ${dishTurns===1?'34':'68'}%. Adjust the dish again.`);return;}
      if(e.needsCell)save.cells--;if(e.kind==='cell')save.cells++;
      done.add(e.id);nearest=null;apply();commit();notify(e.result);
    },
    beacon:(id:string)=>{const e=encounters.find(e=>e.id===id&&e.kind==='beacon');return e&&done.has(id)?e:null;},
    update:(dt:number,time:number,player:T.Vector3,scanning:boolean)=>{
      let distance=Infinity;nearest=null;
      for(const e of encounters){
        const node=nodes.get(e.id)!,d=Math.hypot(node.group.position.x-player.x,node.group.position.z-player.z);
        if(!done.has(e.id)&&d<3.3&&d<distance){distance=d;nearest={id:e.id,name:e.name,action:e.action};}
        node.marker.visible=!done.has(e.id)&&(d<32||scanning);node.marker.rotation.y=time*.5;
        if(e.kind==='cell')node.moving.rotation.y=time*.4;
        if(e.kind==='drone'&&done.has(e.id)){
          const target=player.clone().add(new T.Vector3(1.6,1.65,-1.6));target.y=Math.max(target.y,heightAt(target.x,target.z)+1.2);
          node.group.position.lerp(target,1-Math.exp(-dt*2.5));node.moving.position.y=Math.sin(time*2)*.08;node.group.lookAt(player.x,node.group.position.y,player.z);node.marker.visible=false;
        }
        if(e.kind==='flora'&&done.has(e.id))node.moving.scale.setScalar(1+Math.sin(time*1.6)*.12);
      }
    },
  };
}
