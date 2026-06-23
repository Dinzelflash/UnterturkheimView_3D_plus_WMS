import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

// Step A: log in to your Cesium ion account from code,
// using the access token you copied in Step 2.
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjk3NjIyMi1iMDZiLTQ2MTYtOGE1Yy1mMjc2NDJlNWUyN2QiLCJpZCI6NDIyNDQ0LCJpYXQiOjE3NzY5NDUzNzV9.oJWgJ-dp_nD5fAErtd4yGRQfgPi9-WAzyobeBlbE5kg';  

// Step B: create the 3D globe itself, inside the <div id="cesiumContainer">
// from index.html, and load Cesium's free global terrain (hills, mountains, etc.)
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  baseLayerPicker: false, // we'll add our own basemap manually in step 5
});

// Step B (continued): add a basemap of your choice. Here, we're using a free, public OSM map server.
const wmsLayer = new Cesium.WebMapServiceImageryProvider({
  url: 'https://sgx.geodatenzentrum.de/wms_topplus_open',
  layers: 'web', // full-color version; use 'web_grau' for greyscale
  parameters: {
    service: 'WMS',
    format: 'image/png',
    transparent: true,
  },
});

viewer.imageryLayers.addImageryProvider(wmsLayer);

// --- Lighting, sky, sun & moon ---
viewer.scene.globe.enableLighting = true;
viewer.shadows = true;
viewer.scene.skyAtmosphere.show = true;
viewer.scene.skyBox.show = true;
viewer.scene.sun.show = true;
viewer.scene.moon.show = true;
viewer.scene.globe.showGroundAtmosphere = true;

// THE KEY FIX: tell the sky's color to actually track the sun's real position.
// Without this, the atmosphere can stay locked to a fixed brightness regardless
// of what time you set — which matches exactly what you saw.
viewer.scene.skyAtmosphere.dynamicLighting = Cesium.DynamicAtmosphereLightingType.SUNLIGHT;

// Freeze the clock so time ONLY changes when you move the slider —
// otherwise it keeps silently ticking forward in the background.
viewer.clock.shouldAnimate = false;

// Step C: load YOUR buildings using the Asset ID from Step 2.
const YOUR_ASSET_ID = 4877153; // <-- replace this number with your own asset ID

async function loadBuildings() {
  try {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(YOUR_ASSET_ID);
    viewer.scene.primitives.add(tileset);   // add the buildings to the scene
    await viewer.zoomTo(tileset);           // fly the camera to look at them
  } catch (error) {
    console.error('Error loading tileset:', error);
  }
}

loadBuildings();

// --- Day/night time slider ---
// Using an equinox date (Sept 22) instead of the solstice — day and night
// are roughly equal length, so the sky's transition is much more visible.
const baseDate = Cesium.JulianDate.fromIso8601('2024-09-22T00:00:00Z');
const slider = document.getElementById('timeSlider');
const timeLabel = document.getElementById('timeLabel');

function updateTime(hours) {
  const newTime = Cesium.JulianDate.addHours(baseDate, hours, new Cesium.JulianDate());
  viewer.clock.currentTime = newTime;
  viewer.scene.requestRender(); // force an immediate redraw of sky + lighting

  const wholeHour = Math.floor(hours);
  const minutes = Math.round((hours - wholeHour) * 60);
  timeLabel.textContent =
    String(wholeHour).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
}

slider.addEventListener('input', (event) => {
  updateTime(Number(event.target.value));
});

updateTime(12);