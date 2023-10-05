import { html } from "lit";
import "./main";

export default {
  title: "Elements/eox-map",
  tags: ["autodocs"],
  component: "eox-map",
};

export const Primary = {
  args: {
    zoom: 7,
  },
  render: (args) =>
    html`
      <eox-map
        style="width: 400px; height: 300px;"
        zoom="${args.zoom}"
        center="[15, 48]"
        layers='[{"type":"Tile","source":{"type":"OSM"}}]'
      ></eox-map>
    `,
};

export const UpdateLayers = {
  args: {
    zoom: 4,
  },
  render: (args) =>
    html`
      <eox-map
        id="update"
        style="width: 400px; height: 300px;"
        zoom="${args.zoom}"
        center="[15, 48]"
        layers='[{"type":"Tile","properties": {"id": "customId"}, "source":{"type":"OSM"}}]'
      ></eox-map>
      <p>
        Trigger a layer update (replaces the <code>layers</code> property of the
        element): <button id="update">Update layers</button>
      </p>
      <code id="update"></code>
      <script>
        const map = document.querySelector("eox-map#update");
        document.querySelector("code#update").innerHTML = JSON.stringify(
          map.layers
        );
        document
          .querySelector("button#update")
          .addEventListener("click", () => {
            map.layers = [
              {
                type: "Tile",
                properties: {
                  id: "customId",
                },
                source: {
                  type: "TileWMS",
                  url: "https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54",
                  params: {
                    LAYERS: "AWS_NO2-VISUALISATION",
                  },
                },
              },
            ];
            document.querySelector("code#update").innerHTML = JSON.stringify(
              map.layers
            );
          });
      </script>
    `,
};

export const ABCompare = {
  render: () =>
    html`
      <style>
        eox-map-compare,
        eox-map {
          width: 400px;
          height: 300px;
        }
      </style>
      <eox-map-compare>
        <eox-map
          slot="first"
          id="a"
          layers='[{"type":"Tile","source":{"type":"OSM"}}]'
        ></eox-map>
        <eox-map
          slot="second"
          sync="eox-map#a"
          layers='[
      {
        "type": "Tile",
        "source": {
          "type": "TileWMS",
          "url": "https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54",
          "params": {
            "LAYERS": "AWS_VIS_WIND_V_10M"
          }
        }
      }
    ]'
        ></eox-map>
      </eox-map-compare>
    `,
};
