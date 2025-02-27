class MockLayer {
  constructor(layer) {
    Object.keys(layer).forEach((k) => {
      if (k === "properties") {
        this.properties = {
          ...this.properties,
          ...layer.properties,
        };
      } else {
        this[k] = layer[k];
      }
      if (layer.layers) {
        this.layers = new MockCollection(layer.layers);
      }
    });
  }
  get(prop) {
    return this.properties[prop] || this[prop];
  }
  getLayers() {
    return this.layers || new MockCollection([]);
  }
  getOpacity() {
    return this.opacity;
  }
  getVisible() {
    return this.visible;
  }
  layers;
  opacity = 1;
  properties = {
    id: "foo",
    title: "layer",
  };
  minZoom = -Infinity;
  maxZoom = Infinity;
  set(prop, value) {
    this.properties[prop] = value;
  }
  setVisible(visible) {
    this.visible = visible;
  }
  visible = true;
}

class MockCollection {
  constructor(layers) {
    this.layers = layers.map((l) => new MockLayer(l));
    setTimeout(() => {
      this.events["change:length"]();
    });
  }
  events = {
    ["change:length"]: () => undefined,
  };
  getArray = () => {
    return this.layers;
  };
  layers = [];
  on = (event, fun) => (this.events = { [event]: fun });
  pop() {
    this.layers.pop();
    this.events["change:length"]();
  }
  push(newLayer) {
    this.layers.push(new MockLayer(newLayer));
    this.events["change:length"]();
  }
}

export class MockMap extends HTMLElement {
  constructor() {
    super();
  }
  layers;
  events = {
    "change:resolution": [],
  };
  map = {
    getInteractions: () => ({
      getArray: () => [{}],
    }),
    getLayers: () => {
      if (this.layers) {
        return this.layers;
      } else {
        return new MockCollection([]);
      }
    },
    getEvents: () => this.events,
    getView: () => ({
      getZoom: () => this.zoom,
      on: (type, listener) => {
        this.events = {
          ...this.events,
          [type]: [...this.events[type], listener],
        };
      },
    }),
  };
  zoom = 1;
  setZoom = (z) => {
    this.zoom = z;
  };
  setLayers = (layers) => {
    this.layers = new MockCollection(layers);
  };
}
customElements.define("mock-map", MockMap);
