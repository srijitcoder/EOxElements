import "../main";
import stacLayerJson from "./stacLayer.json";

describe("layers", () => {
  it("loads a Vector Layer", () => {
    cy.intercept(
      "https://s3.us-west-2.amazonaws.com/sentinel-cogs/sentinel-s2-l2a-cogs/10/T/ES/2022/7/S2A_10TES_20220726_0_L2A/S2A_10TES_20220726_0_L2A.json",
      { fixture: "/stac.json" }
    );
    cy.mount(
      `<eox-map layers='${JSON.stringify(stacLayerJson)}'></eox-map>`
    ).as("eox-map");
    cy.get("eox-map").and(($el) => {
      const eoxMap = <EOxMap>$el[0];
      eoxMap.map.getLayers().getArray();
      const stacLayer = eoxMap.getLayerById("stacLayer");
      expect(stacLayer).to.exist;
      stacLayer.on("sourceready", () => {
        const view = eoxMap.map.getView();
        view.fit(stacLayer.getExtent());
      });
    });
  });
});
