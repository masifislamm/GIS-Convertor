import { Loader } from '@googlemaps/js-api-loader';
import { llToIIB } from './projection.js';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
document.body.style.margin = '0';
const app = document.getElementById('app');
app.innerHTML = `
<div class="wrap">
  <style>
    :root {
      --primary-color: #2563eb;
      --text-color: #333;
      --muted-text-color: #6b7280;
      --background-color: #f9fafb;
      --panel-background: #fff;
      --border-color: #e5e7eb;
      --shadow-color: rgba(0, 0, 0, 0.1);
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      overflow: hidden; /* Prevents scrolling of the whole page */
    }
    .wrap {
      display: grid;
      grid-template-columns: 360px 1fr;
      height: 100vh;
    }
    #map {
      height: 100%;
    }
    .panel {
      background: var(--panel-background);
      box-shadow: 0 4px 6px -1px var(--shadow-color), 0 2px 4px -1px rgba(0,0,0,0.06);
      z-index: 10;
      display: flex;
      flex-direction: column;
      padding: 24px;
      border-right: 1px solid var(--border-color);
    }
    .panel-content {
      overflow-y: auto;
    }
    .panel-toggle-btn {
      display: none; /* Hidden on desktop */
    }
    h1 {
      font-size: 1.5rem;
      margin: 0 0 8px;
      font-weight: 600;
    }
    .muted {
      color: var(--muted-text-color);
      font-size: 0.9rem;
      margin: 0 0 24px;
    }
    .search input {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
      margin-bottom: 16px;
    }
    .kv { display: grid; gap: 12px; }
    .cell {
      background: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
    }
    .label {
      font-size: 0.8rem;
      color: var(--muted-text-color);
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .value {
      font-family: 'SFMono-Regular', Consolas, 'Menlo', monospace;
      font-size: 1.1rem;
      font-weight: 500;
    }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .controls { display: flex; align-items: center; margin-bottom: 24px; }
    .switch { position: relative; display: inline-block; width: 44px; height: 24px; margin-right: 12px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; inset: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider { background-color: var(--primary-color); }
    input:checked + .slider:before { transform: translateX(20px); }
    button.copy {
      margin-top: 24px;
      border: none;
      background: var(--primary-color);
      color: white;
      border-radius: 8px;
      padding: 12px 18px;
      cursor: pointer;
      font-weight: 600;
      width: 100%;
      font-size: 1rem;
    }
    footer {
      text-align: center;
      font-size: 0.8rem;
      color: var(--muted-text-color);
      margin-top: auto;
      padding-top: 20px;
    }

    /* Mobile-first styles */
    @media (max-width: 768px) {
      .wrap {
        grid-template-columns: 1fr; /* Map takes full width */
      }
      .panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateY(100%);
        transition: transform 0.3s ease-in-out;
        z-index: 100;
        border-right: none;
        box-shadow: none;
        box-sizing: border-box;
      }
      .wrap.panel-open .panel {
        transform: translateY(0);
      }
      .panel-toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        cursor: pointer;
        z-index: 101;
      }
    }
  </style>
  <div class="panel">
    <div class="panel-content">
      <h1>Map to Grid number zone India-IIB</h1>
      <p class="muted">Click the map to drop a marker or enable <b>Live (center)</b> to update as you pan/zoom.</p>
      <div class="search"><input id="searchBox" type="text" placeholder="Search for a place..."/></div>
      <div class="controls">
        <label class="switch"><input id="liveToggle" type="checkbox"/><span class="slider"></span></label>
        <span class="muted" style="user-select:none;">Live (center) mode</span>
      </div>
      <div class="kv">
        <div class="cell"><div class="label">Longitude (°E)</div><div class="value" id="lon">—</div></div>
        <div class="cell"><div class="label">Latitude (°N)</div><div class="value" id="lat">—</div></div>
        <div class="row">
          <div class="cell"><div class="label">Easting / X (m)</div><div class="value" id="E">—</div></div>
          <div class="cell"><div class="label">Northing / Y (m)</div><div class="value" id="N">—</div></div>
        </div>
      </div>
      <button class="copy" id="copyBtn">Copy Values</button>
      <footer>© 2025 Md Asif Islam</footer>
    </div>
  </div>
  <div id="map"></div>
  <button id="togglePanel" class="panel-toggle-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
  </button>
</div>
`;

function setOutput(lon, lat, E, N) {
    document.getElementById('lon').textContent = lon.toFixed(5);
    document.getElementById('lat').textContent = lat.toFixed(5);
    document.getElementById('E').textContent = E.toLocaleString('en-IN');
    document.getElementById('N').textContent = N.toLocaleString('en-IN');
}

document.getElementById('copyBtn').addEventListener('click', () => {
    const lon = document.getElementById('lon').textContent;
    const lat = document.getElementById('lat').textContent;
    const E = document.getElementById('E').textContent;
    const N = document.getElementById('N').textContent;
    const t = `Longitude: ${lon}\nLatitude: ${lat}\nEasting: ${E}\nNorthing: ${N}`;
    navigator.clipboard.writeText(t).then(() => alert('Copied values to clipboard.'));
});

document.getElementById('togglePanel').addEventListener('click', () => {
    document.querySelector('.wrap').classList.toggle('panel-open');
});

(async function init() {
    const loader = new Loader({ apiKey: apiKey || '', version: 'weekly', libraries: ['places'] });
    const google = await loader.load();
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 25, lng: 90 },
        zoom: 6,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
    });
    const info = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({ map, draggable: true, visible: false });

    function computeAndShow(pos) {
        const lat = pos.lat(), lon = pos.lng();
        const { E, N } = llToIIB(lon, lat);
        setOutput(lon, lat, E, N);
        info.setContent(`Lon: ${lon.toFixed(5)}<br>Lat: ${lat.toFixed(5)}<br><b>E:</b> ${E}<br><b>N:</b> ${N}`);
        info.open({ anchor: marker.getVisible() ? marker : undefined, map });
    }

    map.addListener('click', e => {
        marker.setVisible(true);
        marker.setPosition(e.latLng);
        computeAndShow(e.latLng);
    });
    marker.addListener('dragend', () => computeAndShow(marker.getPosition()));

    const toggle = document.getElementById('liveToggle');
    map.addListener('idle', () => {
        if (toggle.checked) computeAndShow(map.getCenter());
    });

    const input = document.getElementById('searchBox');
    const ac = new google.maps.places.Autocomplete(input, { fields: ['geometry', 'name'] });
    ac.bindTo('bounds', map);
    ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (!place.geometry) return;
        const loc = place.geometry.location;
        map.fitBounds(place.geometry.viewport ?? new google.maps.LatLngBounds(loc, loc));
        marker.setVisible(true);
        marker.setPosition(loc);
        computeAndShow(loc);
        
        // On mobile, close the panel after a place is selected
        if (window.innerWidth <= 768) {
            document.querySelector('.wrap').classList.remove('panel-open');
        }
    });
    
    computeAndShow(map.getCenter());
})();