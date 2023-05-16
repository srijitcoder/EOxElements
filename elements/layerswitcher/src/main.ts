// @ts-ignore
import Sortable from "sortablejs/modular/sortable.core.esm.js";
import { layerSwitcherTemplate, layerSwitcherItem } from "./template";

const template = document.createElement("template");
template.innerHTML = layerSwitcherTemplate;

export class EOxLayerSwitcher extends HTMLElement {
  shadowRoot: ShadowRoot;

  /**
   * @param A native OpenLayers map object
   */
  attachTo: Function;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    this.shadowRoot.appendChild(div);

    // @ts-ignore// TODO import OL collection type
    const renderSwitcher = (layerCollection) => {
      const layerIdentifier = this.getAttribute("identifier");
      const layerTitle = this.getAttribute("title");

      const initialLayers = [...layerCollection.getArray()].filter(
        (l) => l.get("displayInLayerSwitcher") !== false
      );
      const zIndexSorting = this.getAttribute("sortBy") === "zIndex";
      if (zIndexSorting) {
        initialLayers.sort((lA, lB) => {
          return lA.get("zIndex")
            ? lA.get("zIndex") < lB.get("zIndex")
              ? 1
              : -1
            : 1;
        });
      } else {
        initialLayers.reverse();
      }

      const ul = this.shadowRoot.querySelector("ul");
      ul.innerHTML = "";
      initialLayers.forEach((layer) => {
        const li = document.createElement("template");
        li.innerHTML = layerSwitcherItem;
        // @ts-ignore
        const item: Element = li.content.cloneNode(true);

        if (layer.getVisible()) {
          item
            .querySelector("input[type='checkbox']")
            .setAttribute("checked", "true");
        }
        item
          .querySelector("input[type='checkbox']")
          .addEventListener("click", () => {
            layer.setVisible(!layer.getVisible());
          });
        item
          .querySelector("input[type='range']")
          .addEventListener("input", (evt) => {
            // @ts-ignore
            layer.setOpacity(evt.target.value / 100);
          });
        item.querySelector("span.title").innerHTML = layer.get(layerTitle);
        item
          .querySelector("li")
          .setAttribute("layerid", layer.get(layerIdentifier));

        ul.appendChild(item);
      });
      if (!zIndexSorting) {
        // TODO implement zIndex sorting logic
        Sortable.create(ul, {
          handle: ".dragHandle",
          onChange: (evt: any) => {
            // current state of layers
            const layers = layerCollection.getArray();
            const draggedItem = layers.find(
              // @ts-ignore // TODO import OL Layer type
              (l) => l.get(layerIdentifier) === evt.item.getAttribute("layerid")
            ); // TODO replace by id?
            layerCollection.removeAt(
              // @ts-ignore // TODO import OL Layer type
              layers.findIndex((l) => l === draggedItem)
            );
            layerCollection.insertAt(layers.length - evt.newIndex, draggedItem);
          },
        });
      } else {
        ul.querySelectorAll(".dragHandle").forEach(
          // @ts-ignore
          (e) => (e.style.display = "none")
        );
      }
    };
    // @ts-ignore // TODO import OL map
    // TODO maybe this should be a native OL control registration, e.g. https://github.com/Viglino/ol-ext/blob/master/src/control/LayerSwitcher.js#L50
    this.attachTo = (olMap) => {
      olMap.once("loadend", () => {
        const collection = olMap.getLayers();
        renderSwitcher(collection);
        collection.on("change:length", () => {
          renderSwitcher(collection);
        });
      });
    };
  }
}

customElements.define("eox-layerswitcher", EOxLayerSwitcher);
