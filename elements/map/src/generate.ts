import * as olLayers from "ol/layer";
import * as olSources from "ol/source";
import * as olFormats from "ol/format";
import STAC from "ol-stac";
import { applyStyle } from "ol-mapbox-style";
import { FlatStyleLike } from "ol/style/flat";
import mapboxgl, { AnySourceData } from "mapbox-gl";
import { Collection } from "ol";

const availableLayers = {
  ...olLayers,
  STAC,
};

export type layerType =
  | "Group"
  | "Heatmap"
  | "Image"
  | "Layer"
  | "Tile"
  | "Vector"
  | "VectorImage"
  | "VectorTile";
export type sourceType =
  | "BingMaps"
  | "Cluster"
  | "GeoTIFF"
  | "IIIF"
  | "Image"
  | "ImageCanvas"
  | "ImageStatic"
  | "ImageWMS"
  | "OSM"
  | "Raster"
  | "StadiaMaps"
  | "Tile"
  | "TileArcGISRest"
  | "TileDebug"
  | "TileImage"
  | "TileJSON"
  | "TileWMS"
  | "UrlTile"
  | "Vector"
  | "VectorTile"
  | "WMTS"
  | "XYZ";

const availableSources = {
  ...olSources,
};

export type EoxLayer = {
  type: layerType;
  properties: object & {
    id: string;
  };
  source?: { type: sourceType };
  layers?: Array<EoxLayer>;
  style?: mapboxgl.Style | FlatStyleLike;
};

export function createLayer(layer: EoxLayer): olLayers.Layer {
  const newLayer = availableLayers[layer.type];
  const newSource = availableSources[layer.source?.type];
  if (!newLayer) {
    throw new Error(`Layer type ${layer.type} not supported!`);
  }
  if (layer.source && !newSource) {
    throw new Error(`Source type ${layer.source.type} not supported!`);
  }

  //@ts-ignore
  const olLayer = new newLayer({
    ...layer,
    ...(layer.source && {
      //@ts-ignore
      source: new newSource({
        ...layer.source,
        // @ts-ignore
        ...(layer.source.format && {
          // @ts-ignore
          format: new olFormats[layer.source.format](),
        }),
      }),
    }),
    ...(layer.type === "Group" && {
      layers: [],
    }),
    style: undefined, // override layer style, apply style after
  });

  if (layer.type === "Group") {
    const groupLayers = layer.layers.reverse().map((l) => createLayer(l));
    // set a reference to the parent group to each layer of the group
    groupLayers.forEach((l) => l.set("_group", olLayer, true));
    olLayer.setLayers(new Collection(groupLayers));
  }

  if (layer.style) {
    if ("version" in layer.style) {
      const mapboxStyle: mapboxgl.Style = layer.style;
      // existing layer source will not get overridden by "style" property
      // to allow vector layers without defined sources, create a dummy-geojson-source
      // if source does exist
      if (!mapboxStyle.sources) {
        mapboxStyle.sources = {};
      }
      const sourceName = layer.properties.id;
      if (!mapboxStyle.sources[sourceName]) {
        const dummy =
          layer.source.type === "VectorTile"
            ? {
                type: "vector",
              }
            : {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  //@ts-ignore
                  features: [],
                },
              };
        mapboxStyle.sources[sourceName] = dummy as AnySourceData;
      }
      olLayer.set(
        "sourcePromise",
        applyStyle(olLayer, mapboxStyle, sourceName, {
          updateSource: false,
        })
      );
    } else {
      olLayer.setStyle(layer.style);
      olLayer.set("sourcePromise", Promise.resolve(), true);
    }
  }
  return olLayer;
}

export const generateLayers = (layerArray: Array<EoxLayer>) => {
  if (!layerArray) {
    return [];
  }

  return layerArray.reverse().map((l) => createLayer(l));
};
