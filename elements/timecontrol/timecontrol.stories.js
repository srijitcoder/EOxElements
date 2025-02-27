import { html } from "lit";
import "../map/main";
import "./src/main";

export default {
  title: "Elements/eox-timecontrol",
  tags: ["autodocs"],
  component: "eox-timecontrol",
};

export const Primary = {
  args: {
    for: "eox-map#primary",
    layer: "AWS_NO2-VISUALISATION",
    animationProperty: "TIME",
    animationValues: [
      "2022-12-05",
      "2022-12-12",
      "2022-12-19",
      "2022-12-26",
      "2023-01-16",
      "2023-01-23",
      "2023-01-30",
      "2023-02-06",
      "2023-02-13",
      "2023-02-27",
      "2023-03-06",
      "2023-03-13",
      "2023-03-20",
      "2023-03-27",
      "2023-04-03",
      "2023-04-10",
      "2023-04-17",
      "2023-04-24",
    ],
  },
  render: (args) => html`
    <eox-map
      id="primary"
      style="width: 400px; height: 300px;"
      zoom="3"
      center="[1000000, 6000000]"
      layers='[
    {
      "type": "Tile",
      "properties": {
        "id":"AWS_NO2-VISUALISATION"
      },
      "source": {
        "type": "TileWMS",
        "url": "https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54",
        "params": {
          "LAYERS": "AWS_NO2-VISUALISATION"
        }
      }
    },
    {
      "type":"Tile",
      "source":{
        "type":"OSM"
      }
    }
  ]'
    ></eox-map>
    <eox-timecontrol
      .for=${args.for}
      .layer=${args.layer}
      .animationProperty=${args.animationProperty}
      .animationValues=${args.animationValues}
      .slider=${args.slider}
    ></eox-timecontrol>
  `,
};

export const Slider = {
  args: {
    ...Primary.args,
    for: "eox-map#slider",
    slider: true,
  },
  render: (args) => html`
    <eox-map
      id="slider"
      style="width: 400px; height: 300px;"
      zoom="3"
      center="[1000000, 6000000]"
      layers='[
{
  "type": "Tile",
  "properties": {
    "id":"AWS_NO2-VISUALISATION"
  },
  "source": {
    "type": "TileWMS",
    "url": "https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54",
    "params": {
      "LAYERS": "AWS_NO2-VISUALISATION"
    }
  }
},
{
  "type":"Tile",
  "source":{
    "type":"OSM"
  }
}
]'
    ></eox-map>
    <eox-timecontrol
      .for=${args.for}
      .layer=${args.layer}
      .animationProperty=${args.animationProperty}
      .animationValues=${args.animationValues}
      .slider=${args.slider}
    ></eox-timecontrol>
  `,
};
