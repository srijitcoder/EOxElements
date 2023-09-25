import { html } from "lit";
import "../map/main";
import "./src/main";

export default {
  title: "Elements/eox-drawtools",
  tags: ["autodocs"],
  component: "eox-drawtools",
};

export const Primary = {
  render: () => html` <eox-map
      id="primary"
      style="width: 400px; height: 300px;"
      layers='[
    {"type": "Vector","id": "draw","source": {"type": "Vector"}},
    {"type":"Tile","source":{"type":"OSM"}}
  ]'
    ></eox-map>
    <eox-drawtools for="eox-map#primary" layer="draw"></eox-drawtools>`,
};

export const MultiPolygon = {
  render: () => html` <eox-map
      id="multi"
      style="width: 400px; height: 300px;"
      layers='[
      {"type": "Vector","id": "draw","source": {"type": "Vector"}},
      {"type":"Tile","source":{"type":"OSM"}}
    ]'
    ></eox-map>
    <eox-drawtools
      for="eox-map#multi"
      layer="draw"
      multiplefeatures
    ></eox-drawtools>`,
};
