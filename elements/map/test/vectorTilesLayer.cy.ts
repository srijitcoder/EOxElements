import { VectorTile } from "ol/layer";
import "../main";
import vectorTileLayerStyleJson from "./vectorTilesLayer.json";
import { Fill, Style } from "ol/style";

describe("VectorTile Layer", () => {
  it("loads a Vector Tile Layer, applies flat style", () => {
    cy.intercept(/^.*geoserver.*$/, {
      fixture: "/tiles/mapbox-streets-v6/14/8937/5679.vector.pbf,null",
      encoding: "binary",
    });

    // @ts-ignore
    vectorTileLayerStyleJson[0].style = {
      // @ts-ignore
      "fill-color": "yellow",
      "stroke-color": "black",
      "stroke-width": 4,
    };
    cy.mount(
      `<eox-map zoom=1 layers='${JSON.stringify(
        vectorTileLayerStyleJson
      )}'></eox-map>`
    ).as("eox-map");
    return new Cypress.Promise((resolve) => {
      cy.get("eox-map").should(($el) => {
        const eoxMap = <EOxMap>$el[0];
        const layer = eoxMap.getLayerById("countries") as VectorTile;
        setTimeout(() => {
          // to do: not able to wait for rendercomplete directly, as `applyStyle` is async
          const features = layer
            .getSource()
            .getFeaturesInExtent(eoxMap.map.getView().calculateExtent());
          expect(features.length).to.be.greaterThan(10);
          resolve();
        }, 1000);
      });
    });
  });
  it("loads a Vector Tile Layer, applies style constructors", () => {
    cy.intercept(/^.*geoserver.*$/, {
      fixture: "/tiles/mapbox-streets-v6/14/8937/5679.vector.pbf,null",
      encoding: "binary",
    });

    // @ts-ignore
    vectorTileLayerStyleJson[0].style = new Style({
      fill: new Fill({
        color: "#f00",
      }),
    });

    cy.mount(
      `<eox-map zoom=1 layers='${JSON.stringify(
        vectorTileLayerStyleJson
      )}'></eox-map>`
    ).as("eox-map");

    cy.get("eox-map").and(($el) => {
      const eoxMap = <EOxMap>$el[0];

      const layer = eoxMap.getLayerById("countries") as VectorTile;
      expect(layer.getStyle()).to.not.be(null);
    });
  });
  /*it("loads a Vector Tile Layer, applies mapbox style", () => {
    // @ts-ignore
    vectorTileLayerStyleJson[0].style = {
      version: 8,
      name: "countries",
      sources: {},
      layers: [
        {
          id: "countries_fill",
          type: "fill",
          source: "countries",
          "source-layer": "ne_10m_admin_0_countries",
          paint: {
            "fill-color": "green",
            "fill-opacity": 1,
          },
        },
        {
          id: "countries_outline",
          type: "line",
          source: "countries",
          "source-layer": "ne_10m_admin_0_countries",
          paint: {
            "line-color": "#cdcdcd",
            "line-width": 2.5,
          },
        },
      ],
    };
    cy.mount(
      `<eox-map layers='${JSON.stringify(vectorTileLayerStyleJson)}'></eox-map>`
    ).as("eox-map");
    return new Cypress.Promise((resolve) => {
      cy.get("eox-map").should(($el) => {
        const eoxMap = <EOxMap>$el[0];
        const layer = eoxMap.getLayerById("countries") as VectorTile;
        setTimeout(() => {
          // to do: not able to wait for rendercomplete directly, as `applyStyle` is async
          const features = layer
            .getSource()
            .getFeaturesInExtent(eoxMap.map.getView().calculateExtent());
          expect(features.length).to.be.greaterThan(10);
          resolve();
        }, 1000);
      });
    });
  });*/
});
