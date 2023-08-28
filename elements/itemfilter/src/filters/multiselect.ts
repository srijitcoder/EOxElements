import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import "../inline.ts";

@customElement("eox-itemfilter-multiselect")
export class EOxItemFilterMultiselect extends LitElement {
  @property()
  filterObject: FilterObject;

  public reset() {
    this.renderRoot
      .querySelectorAll("input[type='checkbox']")
      .forEach((f: Element) => {
        if (f instanceof HTMLInputElement) {
          f.checked = false;
        }
      });
    for (const filter in this.filterObject.state) {
      this.filterObject.state[filter] = false;
    }
    delete this.filterObject.dirty;
    this.requestUpdate();
  }

  // skip shadow root creation
  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.renderRoot.querySelector("eox-itemfilter-inline").options = Object.keys(this.filterObject.state).map(key => ({key}))
  }

  render() {
    return html`
    <eox-itemfilter-inline></eox-itemfilter-inline>
      <ul>
        ${map(
          Object.keys(this.filterObject.state).sort((a, b) =>
            a.localeCompare(b)
          ),
          (key) => html`
            <li class=${this.filterObject.state[key] ? "highlighted" : nothing}>
              <label>
                <input
                  data-cy="multiselect-checkbox"
                  name="selection"
                  type="checkbox"
                  class="multiselect-checkbox"
                  id=${key}
                  checked="${this.filterObject.state[key] || nothing}"
                  @click=${() => {
                    this.filterObject.state[key] =
                      !this.filterObject.state[key];
                    this.filterObject.dirty = true;
                    this.dispatchEvent(new CustomEvent("filter"));
                    this.requestUpdate();
                  }}
                />
                <span class="title">${key}</span>
              </label>
            </li>
          `
        )}
      </ul>
    `;
  }
}
