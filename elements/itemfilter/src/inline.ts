import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { map } from 'lit/directives/map.js';
import "./components/chip.ts";

@customElement('eox-itemfilter-inline')
class EOxItemFilterInline extends LitElement {
  @property({ type: Array }) options: { title?: string, key: string, type?: string }[] = [];
  @property({ type: String }) selectedOption: string = '';
  @property({ type: Array }) filteredOptions: { title?: string, key: string, type?: string }[] = [];
  @property({ type: Array }) selectedFilters: string[] = [];
  @property({ type: Object }) clickedElement: EventTarget | null = null;

  static styles = css`
    :host {
      display: inline-block;
    }
    
    .autocomplete {
      width: 100%;
      border: 1px solid #000;
      height: 40px;
    }

    input {
      padding: 8px;
      display: inline-block;
    }

    #dropdown {
      position: relative;
      top: 100%;
      left: 0;
      margin: 0;
      list-style-type: none;
      display: none;
      padding: 0;
      border: 1px solid #ccc;
      background-color: white;
      z-index: 1;
    }

    input:focus + .dropdown {
      display: block;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    addEventListener('click', this.handleClick);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.handleClick);
  }

  handleClick(e: Event) {
    this.clickedElement = e.target;
    console.log(this.clickedElement);
  }

  handleSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
  }
  
  handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const filterText = input.value.toLowerCase();
  
    if (filterText === '') {
      this.filteredOptions = this.options; // Reset filteredOptions when filter is cleared
    } else {
      this.filteredOptions = this.options.filter(option =>
        option.title?.toLowerCase().includes(filterText) ||
        option.key?.toLowerCase().includes(filterText)
      );
    }

    console.log(filterText, this.filteredOptions)
  }

  openDropdown() {
    const dropdown = this.shadowRoot?.querySelector('#dropdown') as HTMLElement;
    if (dropdown) {
      dropdown.style.display = "block";
    }
  }

  closeDropdown() {
    const dropdown = this.shadowRoot?.querySelector('#dropdown') as HTMLElement;
    const itemFilter = this.shadowRoot?.querySelector('eox-itemfilter-inline');
    console.log(itemFilter);

    if (dropdown && this.clickedElement !== itemFilter) {
      dropdown.style.display = "none";
    }
  }

  _addFilterItem(item) {
    return () => {
      this.selectedFilters.push(item);
      this.requestUpdate();
      console.log(this.selectedFilters)
    }
  }

  
  protected render() {
    return html`
      <div class="autocomplete">
        <span class="chipContainer">
        ${map(this.selectedFilters, (item) => html`
        <eox-itemfilter-chip label=${item.title || item.key}></eox-itemfilter-chip>
      `)}
          <eox-itemfilter-chip label="Chip example"></eox-itemfilter-chip>
          <eox-itemfilter-chip label="This is a waaaaay loooonger chip!!!"></eox-itemfilter-chip>
        </span>
        <input
          type="text"
          .value=${this.selectedOption}
          @input=${this.handleInput}
          @focus=${this.openDropdown}
          @blur=${this.closeDropdown}
        />
      </div>
      <ul id="dropdown">
      ${this.filteredOptions.length > 0 ? this.filteredOptions.map(option => html`
        <li value=${option.key} @click=${this._addFilterItem(option)}>${option.title || option.key}</li>
      `) : this.options.map(option => html`
      <li value=${option.key} @click=${this._addFilterItem(option)}>${option.title || option.key}</li>
    `)}
    </ul>
    `;
  }
}
