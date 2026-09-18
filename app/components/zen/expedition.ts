export type EncounterKind = 'cell' | 'relay' | 'flora' | 'bridge' | 'drone' | 'dish' | 'cache' | 'view' | 'beacon';
export type Encounter = { id:string; kind:EncounterKind; name:string; x:number; z:number; action:string; result:string; needsCell?:boolean };
export const encounters:Encounter[] = [
  {id:'landing-cell',kind:'cell',name:'Spare power cell',x:8,z:1,action:'Pick up power cell',result:'Power cell collected. A silent relay is just beyond the landing craft.'},
  {id:'landing-relay',kind:'relay',name:'Landing relay',x:-21,z:-17,action:'Restore landing relay',needsCell:true,result:'Landing relay restored. Its lights mark the route into the valley.'},
  {id:'silver-reed',kind:'flora',name:'Silver reed',x:22,z:-26,action:'Catalogue silver reed',result:'Silver reed catalogued. Its fronds close around a warm light when disturbed.'},
  {id:'pip',kind:'drone',name:'Pip, a stranded survey drone',x:-30,z:25,action:'Wake the survey drone',result:'Pip is awake. Your new companion will follow you through the valley.'},
  {id:'basin-cell',kind:'cell',name:'Weathered supply case',x:-89,z:8,action:'Recover power cell',result:'A second power cell. The nearby crossing has an empty power socket.'},
  {id:'basin-bridge',kind:'bridge',name:'Basin crossing',x:-68,z:-15,action:'Restore the crossing',needsCell:true,result:'Crossing restored. The bridge now connects the meadow and basalt basin.'},
  {id:'crashed-probe',kind:'cache',name:'Crashed survey probe',x:-150,z:-60,action:'Recover survey recording',result:'Survey recording recovered: “The grove responds to sound. Look for three pale crowns.”'},
  {id:'basalt-view',kind:'view',name:'Basalt overlook',x:-205,z:-108,action:'Record the panorama',result:'Basalt panorama recorded in your field journal.'},
  {id:'basin-beacon',kind:'beacon',name:'Basin trail beacon',x:-122,z:-130,action:'Activate trail beacon',result:'Basin beacon activated. You can return here from the journal.'},
  {id:'grove-cell',kind:'cell',name:'Abandoned research pack',x:108,z:-43,action:'Recover power cell',result:'Research pack recovered. The habitat power socket is further into the grove.'},
  {id:'grove-relay',kind:'relay',name:'Grove habitat relay',x:150,z:-105,action:'Power the grove habitat',needsCell:true,result:'Habitat restored. The greenhouse lights bring the research garden back to life.'},
  {id:'glass-bloom',kind:'flora',name:'Glass bloom',x:180,z:-137,action:'Catalogue glass bloom',result:'Glass bloom catalogued. Light travels from its roots to the tips of its branches.'},
  {id:'grove-beacon',kind:'beacon',name:'Grove trail beacon',x:206,z:-75,action:'Activate trail beacon',result:'Grove beacon activated. You can return here from the journal.'},
  {id:'ridge-array',kind:'dish',name:'Ridge signal array',x:20,z:-225,action:'Align signal array',result:'Signal aligned. A transmission has arrived at the northern observatory.'},
  {id:'ridge-view',kind:'view',name:'The quiet summit',x:48,z:-295,action:'Record the panorama',result:'Summit panorama recorded. Take a moment; the whole valley is below you.'},
  {id:'archive-cache',kind:'cache',name:'Explorer’s time capsule',x:-172,z:119,action:'Open the time capsule',result:'“Build things. Stay curious. Leave a little room for the unexpected.” — Rohan'},
];
export type ExpeditionSave = { completed:string[]; cells:number; visited:number[] };
const SAVE_KEY='serein-expedition-v3';
export function readExpedition():ExpeditionSave {
  try {
    const value=JSON.parse(localStorage.getItem(SAVE_KEY)??'null');
    if(value&&Array.isArray(value.completed))return {
      completed:value.completed.filter((id:unknown)=>typeof id==='string'&&encounters.some(e=>e.id===id)),
      cells:Number.isInteger(value.cells)?Math.max(0,Math.min(value.cells,3)):0,
      visited:Array.isArray(value.visited)?value.visited.filter((id:unknown)=>Number.isInteger(id)&&Number(id)>=0&&Number(id)<5):[],
    };
  }catch{/* Storage can be unavailable in private browsing. */}
  return {completed:[],cells:0,visited:[]};
}
export function saveExpedition(save:ExpeditionSave){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch{/* The session remains playable without persistence. */}}
export function biomeAt(x:number,z:number) {
  if(z< -185)return {name:'Observatory Ridge',label:'HIGHLAND / THIN ATMOSPHERE',color:'#9cabb9'};
  if(x< -60)return {name:'Basalt Basin',label:'VOLCANIC SHELVES / SHELTERED VALLEYS',color:'#8d9186'};
  if(x>85)return {name:'Luminous Grove',label:'ALIEN WOODLAND / LIVING CANOPIES',color:'#809b9b'};
  return {name:'Landing Meadow',label:'GRASSLAND / TEMPERATE',color:'#a0b69b'};
}
