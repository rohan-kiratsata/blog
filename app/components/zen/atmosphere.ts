import * as T from 'three';
import { random } from './terrain';

export function makeAtmosphere(scene: T.Scene) {
  scene.fog = new T.FogExp2('#aaa6bd', .0023);
  const sky = new T.Mesh(new T.SphereGeometry(950,32,20), new T.ShaderMaterial({
    side:T.BackSide,depthWrite:false,toneMapped:false,
    uniforms:{zenith:{value:new T.Color('#4931b5')},horizon:{value:new T.Color('#c197d7')}},
    vertexShader:'varying vec3 vDirection; void main(){ vDirection=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:`uniform vec3 zenith; uniform vec3 horizon; varying vec3 vDirection;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.0,a=.5;for(int i=0;i<5;i++){v+=a*noise2(p);p=p*2.03+vec2(19.2,4.7);a*=.5;}return v;}
      void main(){ vec3 d=normalize(vDirection); float h=pow(max(d.y,0.0),.48);
        vec3 col=mix(horizon,zenith,h); vec3 sun=normalize(vec3(-.65,.42,-.6));
        float glow=pow(max(dot(d,sun),0.0),28.0); col+=vec3(.27,.13,.055)*glow;
        vec2 uv=d.xz/max(d.y+.18,.08)*1.3+vec2(4.6,11.2);
        float density=fbm(uv);float cloud=smoothstep(.49,.7,density)*smoothstep(.015,.12,d.y);
        float lighting=clamp((fbm(uv+vec2(.06,.08))-density)*5.0+.65,.2,1.0);
        vec3 cloudColor=mix(vec3(.4,.28,.56),vec3(.95,.76,.85),lighting);
        col=mix(col,cloudColor,cloud*.94);
        gl_FragColor=vec4(col,1.0); }`,
  })); scene.add(sky);
  const hemisphere=new T.HemisphereLight('#a6baff','#455044',.8);scene.add(hemisphere);
  const sun=new T.DirectionalLight('#ffe8c9',2.8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-35,right:35,top:35,bottom:-35,near:1,far:160});
  sun.shadow.bias=-.00015;sun.shadow.normalBias=.035;sun.shadow.radius=3;
  scene.add(sun,sun.target);
  const fill=new T.DirectionalLight('#9aaad0',.35);fill.position.set(60,20,40);scene.add(fill);
  const rand=random(44);
  const planet=new T.Mesh(new T.SphereGeometry(27,40,24),new T.MeshStandardMaterial({color:'#c486b8',roughness:1,fog:false}));planet.position.set(170,100,-380);scene.add(planet);
  const ring=new T.Mesh(new T.RingGeometry(34,46,96),new T.MeshBasicMaterial({color:'#d3a8d1',side:T.DoubleSide,transparent:true,opacity:.45,depthWrite:false,fog:false}));
  ring.position.copy(planet.position);ring.rotation.set(1.28,.2,-.35);scene.add(ring);
  const stars=new Float32Array(300*3);
  for(let i=0;i<300;i++){const angle=rand()*Math.PI*2,h=.2+rand()*.8;stars.set([Math.cos(angle)*700*Math.sqrt(1-h*h),h*700,Math.sin(angle)*700*Math.sqrt(1-h*h)],i*3);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(stars,3));scene.add(new T.Points(geo,new T.PointsMaterial({color:'#dfddff',size:1.1,transparent:true,opacity:.55,fog:false,depthWrite:false})));
  return {sun, update:(player:T.Vector3)=>{
    sun.position.set(player.x-48,player.y+60,player.z-42);sun.target.position.copy(player);
  }};
}
