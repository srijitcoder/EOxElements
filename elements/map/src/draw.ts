import Draw from "ol/interaction/Draw.js";
import { EOxMap } from "../main";
import { getArea, getLength } from "ol/sphere";
import { LineString, Polygon } from "ol/geom";
import GeoJSON from "ol/format/GeoJSON";

export function addDraw(EOxMap: EOxMap, layerId: string, options: any): void {
  if (EOxMap.interactions[options.id]) {
    throw Error(`Interaction with id: ${layerId} already exists.`);
  }

  const map = EOxMap.map;

  // get mapbox-style layer or manually generated ol layer
  let drawLayer =
    map
      .getLayers()
      .getArray()
      .find((l) => l.get("id") === layerId) ||
    map
      .getLayers()
      .getArray()
      .filter((l) => l.get("mapbox-layers"))
      .find((l) => l.get("mapbox-layers").includes(layerId));

  if (!drawLayer) {
    throw Error(`Layer with id: ${layerId} does not exist.`);
  }

  // @ts-ignore
  const source = drawLayer.getSource();

  const drawInteraction = new Draw({
    type: options.type,
    source,
  });

  const format = new GeoJSON();
  drawInteraction.on("drawend", (e) => {
    const geom = e.feature.getGeometry();
    if (geom instanceof LineString) {
      length = getLength(geom, { radius: 6378137, projection: "EPSG:3857" });

      e.feature.set("measure", length);
    } else if (geom instanceof Polygon) {
      const area = getArea(geom, { radius: 6378137, projection: "EPSG:3857" });
      e.feature.set("measure", area);
    }
    const geoJsonObject = format.writeFeatureObject(e.feature);
    const drawendEvt = new CustomEvent("drawend", {
      detail: { geojson: geoJsonObject },
    });
    EOxMap.dispatchEvent(drawendEvt);
  });

  // identifier to retrieve the interaction
  map.addInteraction(drawInteraction);
  EOxMap.interactions[options.id] = drawInteraction;
}
