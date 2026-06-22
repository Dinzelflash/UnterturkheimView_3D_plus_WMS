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