import * as T from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import { stations } from './stations';
import { encounters, biomeAt } from './expedition';
const perlin=new ImprovedNoise();
export const WORLD_RADIUS=380;
export const TERRAIN_SIZE=1024, TERRAIN_SEGMENTS=512, CELL_SIZE=2;
export const noise=(x:number,z:number)=>perlin.noise(x+127.4,z-83.2,19.73);
export function random(seed=174){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};}
export const smooth=(a:number,b:number,x:number)=>{const t=T.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const flatSites=[...stations,...encounters.filter(e=>e.kind!=='bridge')];
export function baseHeight(x:number,z:number){
  const rolling=noise(x*.007,z*.007)*15+noise(x*.019,z*.019)*4+noise(x*.047,z*.047)*1.15;
  return rolling+smooth(150,290,-z)*18+smooth(330,460,Math.hypot(x,z))*(16+Math.pow(1-Math.abs(noise(x*.009,z*.009)),3)*42);
}
function rawHeight(x:number,z:number){
  let y=baseHeight(x,z);
  for(const site of flatSites){const d=Math.hypot(x-site.x,z-site.z);if(d<12)y=T.MathUtils.lerp(y,baseHeight(site.x,site.z),1-smooth(5,12,d));}
  const channel=(1-smooth(3.5,9,Math.abs(x+68)))*smooth(-100,-75,z)*(1-smooth(25,48,z));
  return y-channel*5;
}
const cache=new Map<number,number>();
export function gridHeight(ix:number,iz:number){
  const key=ix*(TERRAIN_SEGMENTS+1)+iz;
  let y=cache.get(key);if(y===undefined){y=rawHeight(ix*CELL_SIZE-TERRAIN_SIZE/2,iz*CELL_SIZE-TERRAIN_SIZE/2);cache.set(key,y);}return y;
}
export function heightAt(x:number,z:number){
  const gx=T.MathUtils.clamp((x+512)/2,0,511.99999),gz=T.MathUtils.clamp((z+512)/2,0,511.99999);
  const ix=Math.floor(gx),iz=Math.floor(gz),u=gx-ix,v=gz-iz;
  const a=gridHeight(ix,iz),b=gridHeight(ix+1,iz),c=gridHeight(ix,iz+1),d=gridHeight(ix+1,iz+1);
  return u+v<=1?a+(b-a)*u+(c-a)*v:d+(c-d)*(1-u)+(b-d)*(1-v);
}
const paths=[
  [[0,13],[-12,0],[-21,-17],[-58,-15],[-78,-15],[-150,-60],[-122,-130],[-110,-170],[20,-225],[60,-265]],
  [[-12,0],[22,-26],[108,-43],[140,-95],[180,-137],[206,-75]],
  [[-12,0],[-30,25],[-115,90],[-172,119]],
  [[140,-95],[80,-160],[20,-225]],
];
export function pathDistance(x:number,z:number){
  let d=Infinity;
  for(const path of paths)for(let i=0;i<path.length-1;i++){
    const a=path[i],b=path[i+1],dx=b[0]-a[0],dz=b[1]-a[1];
    const t=T.MathUtils.clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);
    d=Math.min(d,Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz));
  }return d;
}
export function clearing(x:number,z:number){return flatSites.some(s=>Math.hypot(x-s.x,z-s.z)<( 'model' in s?7:2.5))||Math.hypot(x,z-13)<3;}
export function makeTerrain(){
  const group=new T.Group();group.name='terrain';
  const material=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true});
  const color=new T.Color(),soil=new T.Color('#b0aa94'),stone=new T.Color('#797d81');
  // 64 m tiles share one material and are culled independently.
  for(let tx=0;tx<16;tx++)for(let tz=0;tz<16;tz++){
    const geometry=new T.PlaneGeometry(64,64,32,32);geometry.rotateX(-Math.PI/2);
    const positions=geometry.attributes.position,colors=new Float32Array(positions.count*3);
    const cx=-480+tx*64,cz=-480+tz*64;
    for(let i=0;i<positions.count;i++){
      const x=positions.getX(i)+cx,z=positions.getZ(i)+cz,y=heightAt(x,z);positions.setY(i,y);
      color.set(biomeAt(x,z).color);color.multiplyScalar(.91+noise(x*.06,z*.06)*.14);
      const slope=Math.hypot(heightAt(x+1,z)-heightAt(x-1,z),heightAt(x,z+1)-heightAt(x,z-1));color.lerp(stone,smooth(.7,2,slope)*.8);
      color.lerp(soil,clearing(x,z)?.8:(1-smooth(1,3.5,pathDistance(x,z)))*.68);
      color.toArray(colors,i*3);
    }
    geometry.setAttribute('color',new T.BufferAttribute(colors,3));geometry.computeVertexNormals();
    const tile=new T.Mesh(geometry,material);tile.position.set(cx,0,cz);tile.receiveShadow=true;group.add(tile);
  }
  return group;
}
