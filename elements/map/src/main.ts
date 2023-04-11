import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { apply } from 'ol-mapbox-style';

const map = new Map({
  controls: [],
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: "map",
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

let application: MessagePort;

window.addEventListener("message", (event) => {
  // add/update layers of the map
  if (event.data === "init") {
    application = event.ports[0];
    application.onmessage = onMessage;
  }
  if (event.data.hasOwnProperty("set-layers")) {
    const styleJson = event.data["set-layers"];
    apply(map, styleJson)
  }
});

const onMessage = (event: MessageEvent) => {
  if (event.data.ts) {
    switch (event.data.type) {
      case "getLayers":
        const layers = map.getLayers().getArray();
        const simplifiedLayers = layers.map((l) => l.get("visible"));
        application.postMessage({
          ts: event.data.ts,
          body: { layers: simplifiedLayers },
        });
        break;
    }
  } else {
    switch (event.data.type) {
      case "setLayers":
        console.log(event.data.body);
        break;
    }
  }
};
