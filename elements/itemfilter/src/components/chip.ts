import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('eox-itemfilter-chip')
export class EOxItemFilterChip extends LitElement {
  @property({ type: String }) label = '';

  static styles = css`
    .chip {
      display: inline-block;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 16px;
      background-color: #f0f0f0;
      font-size: 14px;
      margin: 4px;
    }
  `;

  render() {
    return html`<div class="chip">${this.label}</div>`;
  }
}
