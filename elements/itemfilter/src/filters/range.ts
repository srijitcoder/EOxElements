import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import dayjs from "dayjs";
import _debounce from "lodash.debounce";

@customElement("eox-itemfilter-range")
export class EOxItemFilterRange extends LitElement {
  @property()
  filterObject: RangeFilterObject;

  inputHandler = (evt: CustomEvent) => {
    [this.filterObject.state.min, this.filterObject.state.max] =
      evt.detail.values;
    this.dispatchEvent(new CustomEvent("filter"));
    this.requestUpdate();
  };

  debouncedInputHandler = _debounce(this.inputHandler, 0, {
    leading: true,
  });

  public reset() {
    this.filterObject.state.min = this.filterObject.min;
    this.filterObject.state.max = this.filterObject.max;
    this.requestUpdate();
  }

  render() {
    return html`
      <div>
        ${this.filterObject.format === "date"
          ? dayjs.unix(this.filterObject.state.min)
          : this.filterObject.state.min}
      </div>
      <tc-range-slider
        min="${this.filterObject.min}"
        max="${this.filterObject.max}"
        value1="${this.filterObject.state.min}"
        value2="${this.filterObject.state.max}"
        step="1"
        @change="${this.debouncedInputHandler}"
      ></tc-range-slider>
      <div>
        ${this.filterObject.format === "date"
          ? dayjs.unix(this.filterObject.state.max)
          : this.filterObject.state.max}
      </div>
    `;
  }
}
