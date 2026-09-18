import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function makeExplorer() {
  const player=new T.Group();player.name='explorer';
  let mixer:T.AnimationMixer|undefined,active:T.AnimationAction|undefined,wasGrounded=true,landing=0,dead=false;
  let visual:T.Group|undefined,baseY=0;
  const soles:{mesh:T.SkinnedMesh;index:number}[]=[],point=new T.Vector3();
  const jets:T.Mesh[]=[];let thrust=0;
  const actions=new Map<string,T.AnimationAction>();
  const ready=new GLTFLoader().loadAsync('/zen/quaternius/explorer.glb').then(gltf=>{
    if(dead){gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{Object.values(m).forEach(v=>{if(v instanceof T.Texture)v.dispose();});m.dispose();});}});return;}
    const model=gltf.scene;mixer=new T.AnimationMixer(model);
    gltf.animations.forEach(clip=>actions.set(clip.name,mixer!.clipAction(clip)));
    actions.get('Idle')?.play();mixer.update(0);
    model.updateMatrixWorld(true);
    // Keep the authored suit and skeleton, and fit a closed survey helmet to the head joint.
    model.traverse(o=>{if(!(o instanceof T.SkinnedMesh))return;
      const head=o.skeleton.bones.findIndex(b=>b.name==='Head'),joints=o.geometry.getAttribute('skinIndex'),weights=o.geometry.getAttribute('skinWeight');
      if(head<0||!joints||!weights)return;
      const headVertices=new Set<number>(),headBox=new T.Box3();
      for(let i=0;i<joints.count;i++){
        let headWeight=0,footWeight=0;
        for(let j=0;j<4;j++){const joint=joints.getComponent(i,j),weight=weights.getComponent(i,j);if(joint===head)headWeight+=weight;if(o.skeleton.bones[joint]?.name.startsWith('Foot'))footWeight+=weight;}
        if(headWeight>.45){headVertices.add(i);o.getVertexPosition(i,point);headBox.expandByPoint(point.clone().applyMatrix4(o.matrixWorld));}
        if(footWeight>.8)soles.push({mesh:o,index:i});
      }
      if(headBox.isEmpty())return;
      const indices=o.geometry.getIndex();if(indices){const kept:number[]=[];for(let i=0;i<indices.count;i+=3){const a=indices.getX(i),b=indices.getX(i+1),c=indices.getX(i+2);if(!headVertices.has(a)&&!headVertices.has(b)&&!headVertices.has(c))kept.push(a,b,c);}o.geometry.setIndex(kept);}
      const center=headBox.getCenter(new T.Vector3()),size=headBox.getSize(new T.Vector3()),radius=Math.max(size.x*.49,size.y*.44);
      const helmet=new T.Group();helmet.position.copy(center);model.add(helmet);
      const shell=new T.Mesh(new T.SphereGeometry(radius,20,14),new T.MeshStandardMaterial({color:'#e8e8de',roughness:.48,metalness:.15}));helmet.add(shell);
      const visor=new T.Mesh(new T.SphereGeometry(radius*.88,20,14),new T.MeshStandardMaterial({color:'#102e39',roughness:.19,metalness:.65}));visor.position.set(0,0,radius*.34);visor.scale.set(1,.77,.88);helmet.add(visor);
      const band=new T.Mesh(new T.TorusGeometry(radius*.78,radius*.045,6,20),new T.MeshStandardMaterial({color:'#d1a16b',metalness:.2,roughness:.5}));band.position.z=radius*.73;band.scale.y=.78;helmet.add(band);
      model.updateMatrixWorld(true);o.skeleton.bones[head].attach(helmet);
    });
    const box=new T.Box3().setFromObject(model,true),size=box.getSize(new T.Vector3());model.scale.setScalar(1.9/size.y);
    const bounds=new T.Box3().setFromObject(model,true),center=bounds.getCenter(new T.Vector3());model.position.set(-center.x,-bounds.min.y,-center.z);
    model.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});
    visual=model;baseY=model.position.y;player.add(model);player.updateMatrixWorld(true);
    // An EVA life-support pack with twin downward-facing thrusters follows the animated torso.
    const pack=new T.Group();pack.position.set(0,1.05,-.34);player.add(pack);
    const shellMat=new T.MeshStandardMaterial({color:'#e0e5dc',roughness:.5,metalness:.18});
    const sealMat=new T.MeshStandardMaterial({color:'#263b43',roughness:.72});
    const goldMat=new T.MeshStandardMaterial({color:'#ca985a',roughness:.48,metalness:.3});
    const add=(g:T.BufferGeometry,m:T.Material,x:number,y:number,z:number)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=true;pack.add(mesh);return mesh;};
    add(new T.BoxGeometry(.48,.63,.26),shellMat,0,0,0);
    add(new T.BoxGeometry(.34,.38,.05),sealMat,0,.03,-.16);
    for(let i=0;i<3;i++)add(new T.BoxGeometry(.24,.025,.025),goldMat,0,-.06+i*.09,-.2);
    for(const side of [-1,1]){
      add(new T.CapsuleGeometry(.105,.32,4,10),shellMat,side*.29,-.05,0);
      add(new T.CylinderGeometry(.1,.13,.14,10),sealMat,side*.29,-.34,0);
      add(new T.TorusGeometry(.108,.023,5,12),goldMat,side*.29,-.3,0).rotation.x=Math.PI/2;
      const plume=add(new T.ConeGeometry(.1,.65,10),new T.MeshBasicMaterial({color:'#8cecff',transparent:true,opacity:.7,depthWrite:false}),side*.29,-.72,0);plume.rotation.z=Math.PI;plume.visible=false;plume.castShadow=false;jets.push(plume);
    }
    model.updateMatrixWorld(true);const torso=model.getObjectByName('Torso');if(torso)torso.attach(pack);
    active=actions.get('Idle');
  });
  function play(name:string,fade=.16){
    const next=actions.get(name);if(!next||next===active)return;
    next.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).play();
    if(name==='Jump'||name==='Jump_Land'){next.setLoop(T.LoopOnce,1);next.clampWhenFinished=true;}
    else next.setLoop(T.LoopRepeat,Infinity);
    active?.fadeOut(fade);next.fadeIn(fade);active=next;
  }
  return {player,ready,animate:(dt:number,speed:number,grounded:boolean,verticalSpeed:number,jetting:boolean,reduced:boolean)=>{
    if(!mixer)return;
    if(grounded&&!wasGrounded){landing=.18;play('Jump_Land',.08);}
    if(!grounded&&wasGrounded)play(verticalSpeed>0?'Jump':'Jump_Idle',.1);
    landing=Math.max(0,landing-dt);
    if(!grounded){if(verticalSpeed<1||jetting)play('Jump_Idle',.18);}
    else if(landing===0){play(speed<.18?'Idle':speed<5?'Walk':'Run',.2);if(active&&speed>.18)active.timeScale=T.MathUtils.clamp(speed/(speed<5?3.1:6.3),.4,1.5);}
    thrust=T.MathUtils.damp(thrust,jetting?1:0,14,dt);
    jets.forEach((jet,i)=>{jet.visible=thrust>.03;jet.scale.set(1,thrust*(reduced?1:1+Math.sin(performance.now()*.025+i)*.09),1);});
    mixer.update(dt);
    if(visual){
      visual.position.y=baseY;player.updateMatrixWorld(true);
      if(grounded&&soles.length){
        let low=Infinity;for(const sole of soles){sole.mesh.getVertexPosition(sole.index,point);point.applyMatrix4(sole.mesh.matrixWorld);low=Math.min(low,point.y);}
        // Sole contact follows the physical capsule, including raised bridge decks.
        visual.position.y+=T.MathUtils.clamp(player.position.y-low,-.4,.4);
      }
    }
    wasGrounded=grounded;
  },dispose:()=>{dead=true;mixer?.stopAllAction();if(mixer)mixer.uncacheRoot(mixer.getRoot());}};
}
