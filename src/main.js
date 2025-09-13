import { Loader } from '@googlemaps/js-api-loader'; import { llToIIB } from './projection.js';
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
document.body.style.margin='0';
const app=document.getElementById('app');
app.innerHTML=`<div class="wrap">
<style>
.wrap{display:grid;grid-template-columns:360px 1fr;height:100vh;background:#f9fafb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
#map{height:100%;min-height:300px}
.panel{padding:16px 18px;border-right:1px solid #e5e7eb;background:#fff;box-shadow:0 0 20px rgba(0,0,0,.04);z-index:1}
h1{font-size:1.2rem;margin:0 0 8px}.muted{color:#6b7280;font-size:.92rem;margin:0 0 12px}
.kv{display:grid;grid-template-columns:1fr;gap:10px;margin-top:10px}.cell{border:1px solid #e5e7eb;border-radius:12px;padding:8px 10px;background:#fff}
.label{font-size:.75rem;color:#6b7280;margin-bottom:4px}.value{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.95rem}
.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.controls{display:flex;gap:8px;align-items:center;margin:8px 0}
.switch{position:relative;display:inline-block;width:44px;height:24px}.switch input{display:none}
.slider{position:absolute;cursor:pointer;inset:0;background:#d1d5db;transition:.2s;border-radius:999px}
.slider:before{position:absolute;content:'';height:18px;width:18px;left:3px;bottom:3px;background:#fff;transition:.2s;border-radius:999px;box-shadow:0 1px 3px rgba(0,0,0,.2)}
input:checked + .slider{background:#2563eb}input:checked + .slider:before{transform:translateX(20px)}
.search{margin:8px 0 12px}.search input{width:100%;padding:10px 12px;border:1px solid #e5e7eb;border-radius:12px;font-size:.95rem}
button.copy{margin-top:8px;border:1px solid #e5e7eb;background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:600}
footer{position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:.8rem;color:#6b7280;background:rgba(255,255,255,.85);padding:4px;z-index:2}
@media (max-width:900px){.wrap{grid-template-columns:1fr;grid-template-rows:320px 1fr}.panel{border-right:none;border-bottom:1px solid #e5e7eb}}
</style>
<div class="panel">
<h1>Map to Grid number zone India-IIB</h1>
<p class="muted">Click the map to drop a marker (draggable) or enable <b>Live (center)</b> to update as you pan/zoom.</p>
<div class="search"><input id="searchBox" type="text" placeholder="Search place or address (Google Places)"/></div>
<div class="controls"><label class="switch"><input id="liveToggle" type="checkbox"/><span class="slider"></span></label>
<span class="muted" style="user-select:none;">Live (center) mode</span></div>
<div class="kv">
  <div class="cell"><div class="label">Longitude (°E)</div><div class="value" id="lon">—</div></div>
  <div class="cell"><div class="label">Latitude (°N)</div><div class="value" id="lat">—</div></div>
  <div class="row">
    <div class="cell"><div class="label">Easting / X (m)</div><div class="value" id="E">—</div></div>
    <div class="cell"><div class="label">Northing / Y (m)</div><div class="value" id="N">—</div></div>
  </div>
</div>
<button class="copy" id="copyBtn">Copy values</button>
<footer>© 2025 Md Asif Islam — Map to Grid number zone India-IIB</footer>
</div>
<div id="map"></div></div>`;

function setOutput(lon, lat, E, N){
  document.getElementById('lon').textContent=lon.toFixed(5);
  document.getElementById('lat').textContent=lat.toFixed(5);
  document.getElementById('E').textContent=E.toLocaleString('en-IN');
  document.getElementById('N').textContent=N.toLocaleString('en-IN');
}
document.getElementById('copyBtn').addEventListener('click',()=>{
  const t=`Longitude: ${lon.textContent}
Latitude: ${lat.textContent}
Easting: ${E.textContent}
Northing: ${N.textContent}`;
  navigator.clipboard.writeText(t).then(()=>alert('Copied values to clipboard.'));
});

(async function init(){
  const loader=new Loader({apiKey:apiKey||'',version:'weekly',libraries:['places']});
  const google=await loader.load();
  const map=new google.maps.Map(document.getElementById('map'),{center:{lat:25,lng:90},zoom:6,mapTypeId:'roadmap',mapTypeControl:true,streetViewControl:true,fullscreenControl:true});
  const info=new google.maps.InfoWindow();
  const marker=new google.maps.Marker({map,draggable:true,visible:false});
  function computeAndShow(pos){
    const lat=pos.lat(), lon=pos.lng(); const {E,N}=llToIIB(lon,lat);
    setOutput(lon,lat,E,N);
    info.setContent(`Lon: ${lon.toFixed(5)}<br>Lat: ${lat.toFixed(5)}<br><b>E:</b> ${E}<br><b>N:</b> ${N}`);
    info.open({anchor:marker.getVisible()?marker:undefined,map});
  }
  map.addListener('click',e=>{marker.setVisible(true);marker.setPosition(e.latLng);computeAndShow(e.latLng);});
  marker.addListener('dragend',()=>computeAndShow(marker.getPosition()));
  const toggle=document.getElementById('liveToggle');
  map.addListener('idle',()=>{if(toggle.checked) computeAndShow(map.getCenter());});
  const input=document.getElementById('searchBox');
  const ac=new google.maps.places.Autocomplete(input,{fields:['geometry','name']}); ac.bindTo('bounds',map);
  ac.addListener('place_changed',()=>{const place=ac.getPlace(); if(!place.geometry) return;
    const loc=place.geometry.location; map.fitBounds(place.geometry.viewport??new google.maps.LatLngBounds(loc,loc));
    marker.setVisible(true); marker.setPosition(loc); computeAndShow(loc);
  });
  computeAndShow(map.getCenter());
})();