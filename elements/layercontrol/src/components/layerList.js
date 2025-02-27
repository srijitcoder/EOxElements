import { LitElement, html } from "lit";
import { when } from "lit/directives/when.js";
import { keyed } from "lit/directives/keyed.js";
import { createSortable, getLayerType } from "../helpers";
import "./layer";
import "./layerGroup";

/**
 * Display of a list of layers
 *
 * @element eox-layercontrol-layer-list
 */
export class EOxLayerControlLayerList extends LitElement {
  static properties = {
    idProperty: { attribute: "id-property" },
    layers: { attribute: false },
    map: { attribute: false, state: true },
    titleProperty: { attribute: "title-property", type: String },
    showLayerZoomState: { attribute: "show-layer-zoom-state", type: Boolean },
    tools: { attribute: false },
    unstyled: { type: Boolean },
    noShadow: { type: Boolean },
  };

  constructor() {
    super();

    /**
     * The layer id property
     */
    this.idProperty = "id";

    /**
     * The OL layer collection
     * @type {import("ol").Collection<import("ol/layer").Layer | import("ol/layer").Group>}
     * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_Collection-Collection.html}
     */
    this.layers = null;

    /**
     * The native OL map
     * @type {import("ol").Map}
     * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html}
     */
    this.map = null;

    /**
     * @type Array<string>
     */
    this.tools = undefined;

    /**
     * The layer title property
     */
    this.titleProperty = "title";

    /**
     * Show layer state based on zoom level or not
     */
    this.showLayerZoomState = false;

    /**
     * Render the element without additional styles
     */
    this.unstyled = false;

    /**
     * Renders the element without a shadow root
     */
    this.noShadow = true;
  }

  updated() {
    if (!this.layers) {
      return;
    }
    this.layers.on("change:length", () => {
      this.requestUpdate();
      this.dispatchEvent(new CustomEvent("changed", { bubbles: true }));
    });
    createSortable(this.renderRoot.querySelector("ul"), this.layers, this);
  }

  createRenderRoot() {
    return this.noShadow ? this : super.createRenderRoot();
  }

  render() {
    return html`
      <style>
        ${this.#styleBasic}
        ${!this.unstyled && this.#styleEOX}
      </style>
      <ul>
        ${when(
          this.layers,
          () => html`
            ${this.layers
              .getArray()
              .filter(
                (l) =>
                  !l.get("layerControlHide") && !l.get("layerControlOptional")
              )
              .reverse()
              .map((layer) =>
                keyed(
                  layer.get(this.idProperty),
                  html`
                    <li
                      data-layer="${layer.get(this.idProperty)}"
                      data-type="${getLayerType(layer, this.map)}"
                    >
                      ${
                        /** @type {import("ol/layer").Group} */ (layer)
                          .getLayers
                          ? html`
                              <eox-layercontrol-layer-group
                                .noShadow=${true}
                                .group=${layer}
                                .idProperty=${this.idProperty}
                                .map=${this.map}
                                .titleProperty=${this.titleProperty}
                                .showLayerZoomState=${this.showLayerZoomState}
                                .tools=${this.tools}
                                .unstyled=${this.unstyled}
                                @changed=${() => this.requestUpdate()}
                              >
                              </eox-layercontrol-layer-group>
                            `
                          : html`
                              <eox-layercontrol-layer
                                .noShadow=${true}
                                .layer=${layer}
                                .map=${this.map}
                                .titleProperty=${this.titleProperty}
                                .showLayerZoomState=${this.showLayerZoomState}
                                .tools=${this.tools}
                                .unstyled=${this.unstyled}
                                @changed=${() => {
                                  this.requestUpdate();
                                }}
                              ></eox-layercontrol-layer>
                            `
                      }
                    </li>
                  `
                )
              )}
          `
        )}
      </ul>
    `;
  }

  #styleBasic = ``;

  #styleEOX = `
    ul {
      padding: 0;
    }
    ul ul {
      padding-left: 48px;
    }
    li {
      list-style: none;
    }
    li {
      border-bottom: 1px solid #0041703a;
    }
    li:first-child {
      border-top: 1px solid #0041703a;
    }
    li:last-child {
      border: none;
    }
    li.sortable-chosen {
      background: #eeea;
    }
    li.sortable-drag {
      opacity: 0;
    }
    li.sortable-ghost {
    }
  `;
}

customElements.define("eox-layercontrol-layer-list", EOxLayerControlLayerList);
