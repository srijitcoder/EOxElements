import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

@customElement("eox-itemfilter-select")
export class EOxItemFilterSelect extends LitElement {
  @property()
  filterObject: FilterObject;

  public reset() {
    this.renderRoot
      .querySelectorAll("input[type='radio']")
      .forEach((f: Element) => {
        if (f instanceof HTMLInputElement) {
          f.checked = false;
        }
      });
    for (const filter in this.filterObject.state) {
      this.filterObject.state[filter] = false;
    }
    delete this.filterObject.dirty;
  }

  // skip shadow root creation
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <ul>
        ${map(
          Object.keys(this.filterObject.state).sort((a, b) =>
            a.localeCompare(b)
          ),
          (key) => html`
            <li>
              <label>
                <input
                  name="selection"
                  type="radio"
                  checked="${this.filterObject.state[key] || nothing}"
                  @click=${() => {
                    for (const el in this.filterObject.state) {
                      this.filterObject.state[el] = el === key;
                    }
                    this.filterObject.dirty = true;
                    this.dispatchEvent(new CustomEvent("filter"));
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
