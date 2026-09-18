import * as T from 'three';
import { heightAt, WORLD_RADIUS } from './terrain';
import type { Obstacle } from './ecosystem';
import RAPIER from '@dimforge/rapier3d-compat';

export async function makeController(player:T.Group,camera:T.PerspectiveCamera,canvas:HTMLCanvasElement,obstacles:Obstacle[],reduced:boolean) {
  await RAPIER.init();
  const physics=new RAPIER.World({x:0,y:-18,z:0});physics.timestep=1/60;
  const body=physics.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,heightAt(0,13)+.92,13));
  const capsule=physics.createCollider(RAPIER.ColliderDesc.capsule(.6,.3),body);
  const character=physics.createCharacterController(.025);
  character.enableAutostep(.38,.2,false);character.enableSnapToGround(.32);
  character.setMaxSlopeClimbAngle(Math.PI*.25);character.setMinSlopeSlideAngle(Math.PI*.29);
  const tiles=new Map<string,RAPIER.Collider>();
  const solids=obstacles.map(o=>{
    const desc=o.shape==='box'?RAPIER.ColliderDesc.cuboid((o.width??o.radius*2)/2,o.height/2,(o.depth??o.radius*2)/2):RAPIER.ColliderDesc.cylinder(o.height/2,o.radius);
    return physics.createCollider(desc.setTranslation(o.x,(o.y??heightAt(o.x,o.z))+o.height/2,o.z).setEnabled(o.enabled!==false));
  });
  function groundTiles(x:number,z:number){
    const gx=Math.floor(x/32),gz=Math.floor(z/32);
    for(const [key,c] of tiles){const [tx,tz]=key.split(':').map(Number);if(Math.abs(tx-gx)>2||Math.abs(tz-gz)>2){physics.removeCollider(c,true);tiles.delete(key);}}
    for(let tx=gx-2;tx<=gx+2;tx++)for(let tz=gz-2;tz<=gz+2;tz++){
      const key=`${tx}:${tz}`;if(tiles.has(key))continue;
      const vertices=new Float32Array(17*17*3),indices=new Uint32Array(16*16*6);
      for(let iz=0;iz<=16;iz++)for(let ix=0;ix<=16;ix++){const px=tx*32+ix*2,pz=tz*32+iz*2;vertices.set([px,heightAt(px,pz),pz],(iz*17+ix)*3);}
      for(let iz=0;iz<16;iz++)for(let ix=0;ix<16;ix++){const a=iz*17+ix,b=a+1,c=a+17,d=c+1;indices.set([a,c,b,b,c,d],(iz*16+ix)*6);}
      tiles.set(key,physics.createCollider(RAPIER.ColliderDesc.trimesh(vertices,indices)));
    }
  }
  groundTiles(0,13);physics.step();
  canvas.tabIndex=-1;
  const keys=new Set<string>(),touch=new T.Vector2(),velocity=new T.Vector2(),desiredVelocity=new T.Vector2();
  let yaw=0,pitch=.17,distance=7.8,verticalSpeed=0,grounded=true,paused=false,jumpQueued=false,touchSprint=false;
  let accumulator=0,simulationTime=0,lastGround=0,jumpTime=-100,actualSpeed=0;
  let jumpHeld=false,heldSince=-100,jetting=false,fuel=100,flightUsed=false;
  let drag:{x:number;y:number;id:number}|null=null,phase=0;
  const target=new T.Vector3(),desired=new T.Vector3(),offset=new T.Vector3();
  const rotation=new T.Quaternion(),euler=new T.Euler();
  player.position.set(0,heightAt(0,13),13);player.rotation.y=Math.PI;
  const clear=()=>{actualSpeed=0;jumpHeld=false;jetting=false;keys.clear();touch.set(0,0);velocity.set(0,0);jumpQueued=false;touchSprint=false;drag=null;};
  const keydown=(e:KeyboardEvent)=>{
    if(paused||(e.target as HTMLElement).closest('input,textarea,select,[contenteditable=true]'))return;
    if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight'].includes(e.code)){
      if(e.code!=='Space'||!(e.target as HTMLElement).closest('button,a'))e.preventDefault();
      keys.add(e.code);if(e.code==='Space'&&!e.repeat&&!(e.target as HTMLElement).closest('button,a')){jumpQueued=true;jumpHeld=true;heldSince=simulationTime;}
    }
  };
  const keyup=(e:KeyboardEvent)=>{keys.delete(e.code);if(e.code==='Space')jumpHeld=false;};
  const pointerdown=(e:PointerEvent)=>{if(paused||document.pointerLockElement===canvas)return;canvas.focus();drag={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);};
  const rotate=(dx:number,dy:number)=>{yaw-=dx*.0035;pitch=T.MathUtils.clamp(pitch+dy*.003,-.32,1.1);};
  const pointermove=(e:PointerEvent)=>{
    if(paused)return;
    if(document.pointerLockElement===canvas)rotate(e.movementX,e.movementY);
    else if(drag&&drag.id===e.pointerId){rotate(e.clientX-drag.x,e.clientY-drag.y);drag.x=e.clientX;drag.y=e.clientY;}
  };
  const pointerup=()=>{drag=null;};
  const wheel=(e:WheelEvent)=>{e.preventDefault();if(!paused)distance=T.MathUtils.clamp(distance+e.deltaY*.007,3,11);};
  const contextmenu=(e:Event)=>e.preventDefault();
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',clear);
  canvas.addEventListener('pointerdown',pointerdown);canvas.addEventListener('pointermove',pointermove);canvas.addEventListener('pointerup',pointerup);canvas.addEventListener('pointercancel',pointerup);canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('contextmenu',contextmenu);
  function updateCamera(dt:number,snap=false) {
    target.copy(player.position);target.y+=1.5;
    offset.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));
    const hit=physics.castShape(target,{x:0,y:0,z:0,w:1},offset,new RAPIER.Ball(.22),0,distance,true,undefined,undefined,capsule,body);
    const safe=hit?Math.max(.6,hit.time_of_impact-.12):distance;
    desired.copy(target).addScaledVector(offset,safe);
    const alpha=snap||reduced||safe<camera.position.distanceTo(target)?1:1-Math.exp(-dt*10);
    camera.position.lerp(desired,alpha);camera.position.y=Math.max(camera.position.y,heightAt(camera.position.x,camera.position.z)+.25);
    camera.lookAt(target);
  }
  updateCamera(1,true);
  return {
    update:(dt:number)=>{
      if(!paused){
        let x=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+touch.x;
        let z=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)+touch.y;
        const length=Math.hypot(x,z);if(length>1){x/=length;z/=length;}
        const sprint=keys.has('ShiftLeft')||keys.has('ShiftRight')||touchSprint;
        const speed=jetting?(sprint?13:10):sprint?7.8:4.3;
        const desiredX=(x*Math.cos(yaw)+z*Math.sin(yaw))*speed,desiredZ=(z*Math.cos(yaw)-x*Math.sin(yaw))*speed;
        velocity.lerp(desiredVelocity.set(desiredX,desiredZ),1-Math.exp(-dt*(length>0?9:14)));
        if(jumpQueued){jumpTime=simulationTime;jumpQueued=false;}
        accumulator+=Math.min(dt,.06);
        while(accumulator>=1/60){
          const step=1/60;simulationTime+=step;accumulator-=step;
          const pos=body.translation();groundTiles(pos.x,pos.z);
          obstacles.forEach((o,i)=>{if(solids[i].isEnabled()!==(o.enabled!==false))solids[i].setEnabled(o.enabled!==false);});
          if(grounded)lastGround=simulationTime;
          if(simulationTime-jumpTime<.13&&simulationTime-lastGround<.1){verticalSpeed=6.2;grounded=false;jumpTime=-100;lastGround=-100;}
                    jetting=jumpHeld&&simulationTime-heldSince>.22&&fuel>0&&pos.y-heightAt(pos.x,pos.z)<90;
          if(jetting){flightUsed=true;fuel=Math.max(0,fuel-13*step);verticalSpeed=Math.min(8,verticalSpeed+25*step);}
          else{verticalSpeed=Math.max(flightUsed?-9:-25,verticalSpeed-(flightUsed?10:18)*step);if(grounded){fuel=Math.min(100,fuel+26*step);flightUsed=false;}}

          let dx=velocity.x*step,dz=velocity.y*step;
          if(Math.hypot(pos.x+dx,pos.z+dz)>WORLD_RADIUS){dx=0;dz=0;velocity.set(0,0);}
          character.computeColliderMovement(capsule,{x:dx,y:verticalSpeed*step,z:dz});
          const movement=character.computedMovement();
          body.setNextKinematicTranslation({x:pos.x+movement.x,y:pos.y+movement.y,z:pos.z+movement.z});
          physics.step();grounded=character.computedGrounded();
          if(grounded&&verticalSpeed<0)verticalSpeed=-1;
          if(verticalSpeed>0&&movement.y<verticalSpeed*step*.5)verticalSpeed=0;
        }
        const pos=body.translation();actualSpeed=T.MathUtils.lerp(actualSpeed,Math.hypot(pos.x-player.position.x,pos.z-player.position.z)/Math.max(dt,.001),1-Math.exp(-dt*16));player.position.set(pos.x,pos.y-.92,pos.z);
        if(velocity.lengthSq()>.02){euler.set(0,Math.atan2(velocity.x,velocity.y),0);rotation.setFromEuler(euler);player.quaternion.slerp(rotation,1-Math.exp(-dt*12));}
        phase+=velocity.length()*dt*2.5;
      }
      updateCamera(dt);
      return {speed:paused?0:actualSpeed,phase,yaw,pitch,distance,verticalSpeed,jetting,fuel,grounded,altitude:Math.max(0,player.position.y-heightAt(player.position.x,player.position.z))};
    },
    pause:(value:boolean)=>{paused=value;clear();accumulator=0;if(value&&document.pointerLockElement===canvas)document.exitPointerLock();},
    move:(x:number,y:number)=>touch.set(x,y),jump:(held:boolean)=>{if(paused)return;if(held&&!jumpHeld){jumpQueued=true;heldSince=simulationTime;}jumpHeld=held;},sprint:(value:boolean)=>{touchSprint=value;},
    look:()=>{if(!paused){canvas.focus();canvas.requestPointerLock()?.catch(()=>{});}},
    travel:(x:number,z:number)=>{clear();groundTiles(x,z);body.setTranslation({x,y:heightAt(x,z)+.92,z},true);body.setNextKinematicTranslation({x,y:heightAt(x,z)+.92,z});physics.step();player.position.set(x,heightAt(x,z),z);verticalSpeed=0;grounded=true;updateCamera(1,true);},
    dispose:()=>{physics.free();if(document.pointerLockElement===canvas)document.exitPointerLock();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',clear);canvas.removeEventListener('pointerdown',pointerdown);canvas.removeEventListener('pointermove',pointermove);canvas.removeEventListener('pointerup',pointerup);canvas.removeEventListener('pointercancel',pointerup);canvas.removeEventListener('wheel',wheel);canvas.removeEventListener('contextmenu',contextmenu);},
  };
}
