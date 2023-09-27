import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { when } from "lit/directives/when.js";
import { button } from "../../../utils/styles/button";

@customElement("eox-autocomplete")
export class EOxAutocomplete extends LitElement {
  @property()
  idProperty = "id";

  @property()
  items = [];

  @property()
  labelProperty = "label";

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Boolean })
  unstyled = false;

  @state()
  _itemFilter = "";

  @state()
  selectedItems = [];

  _handleKeyboard(key) {
    if (key === "Escape") {
      // If nothing is selected yet, first clear the input,
      // then on second escape blur the input
      if (this.selectedItems.length < 1 || this.multiple) {
        if (this.renderRoot.querySelector("input").value !== "") {
          this.renderRoot.querySelector("input").value = "";
        } else {
          this.renderRoot.querySelector("input").blur();
        }
        return;
      }
      if (!this.multiple) {
        // In single-select mode, check if the currently displayed text matches
        // the selected item or not. Useful if the user "browses" the list but
        // wants to abort; resets input to the currently selected item
        if (
          this.renderRoot.querySelector("input").value !==
          this.selectedItems[0][this.labelProperty]
        ) {
          this.renderRoot.querySelector("input").value =
            this.selectedItems[0][this.labelProperty];
        } else {
          this.renderRoot.querySelector("input").blur();
        }
      }
      return;
    }
    const highlightedChip = this.renderRoot.querySelector(".chip.highlighted");
    if (key === "Backspace") {
      if (
        this.multiple &&
        this.selectedItems.length &&
        this.renderRoot.querySelector("input[type=text]").value === ""
      ) {
        if (highlightedChip) {
          this.selectedItems.splice(
            Array.from(this.renderRoot.querySelectorAll(".chip")).indexOf(
              highlightedChip
            ),
            1
          );
        }
        const lastChip =
          this.renderRoot.querySelectorAll(".chip")[
            this.renderRoot.querySelectorAll(".chip").length - 1
          ];
        if (!Array.from(lastChip.classList).includes("highlighted")) {
          lastChip.classList.add("highlighted");
        }
        this.requestUpdate();
      }
    }
    if (key === "ArrowLeft" || key === "ArrowRight") {
      if (this.renderRoot.querySelectorAll(".chip").length < 1) {
        return;
      }
      let highlightedChipIndex = 0;
      const highlightedChip =
        this.renderRoot.querySelector(".chip.highlighted");
      if (highlightedChip) {
        highlightedChipIndex = Array.from(
          this.renderRoot.querySelectorAll(".chip")
        ).indexOf(highlightedChip);
        highlightedChip.classList.remove("highlighted");
      }
      highlightedChipIndex =
        highlightedChipIndex + (key === "ArrowLeft" ? -1 : +1);
      if (key === "ArrowLeft" && highlightedChipIndex < 0) {
        highlightedChipIndex =
          this.renderRoot.querySelectorAll(".chip").length - 1;
      }
      if (
        key === "ArrowRight" &&
        highlightedChipIndex >
          this.renderRoot.querySelectorAll(".chip").length - 1
      ) {
        highlightedChipIndex = 0;
      }
      Array.from(this.renderRoot.querySelectorAll(".chip"))[
        highlightedChipIndex
      ].classList.add("highlighted");
    }
    this.renderRoot.querySelector("input").select();
  }

  _handleHighlight(items) {
    this.renderRoot.querySelector("input").value = items[0][this.labelProperty];
    this.renderRoot.querySelector("input").select();
  }

  _handleSelect(items) {
    this.selectedItems = items;
    if (items.length > 0) {
      if (this.multiple) {
        this.renderRoot.querySelector("input").value = "";
        this.renderRoot.querySelector("input").focus();
      } else {
        this.renderRoot.querySelector("input").value =
          items[0][this.labelProperty];
        this.renderRoot.querySelector("input").blur();
      }
    } else {
      this.renderRoot.querySelector("input").select();
      this.renderRoot.querySelector("input").focus();
    }
    this._dispatchEvent();
    this.requestUpdate();
  }

  _handleScroll() {
    const dropdown = this.renderRoot.querySelector("eox-selectionlist");
    const autocomplete = this.renderRoot.querySelector(".container");
    const { bottom, left, width } = autocomplete?.getBoundingClientRect();
    dropdown.style.top = `${bottom}px`;
    dropdown.style.left = `${left}px`;
    dropdown.style.width = `${width}px`;
  }

  _dispatchEvent() {
    this.dispatchEvent(
      new CustomEvent("items-selected", {
        detail: this.selectedItems,
      })
    );
  }

  firstUpdated() {
    this.getRootNode().addEventListener("keydown", (event) => {
      if (
        ["ArrowLeft", "ArrowRight", "Escape", "Backspace"].includes(event.code)
      ) {
        this._handleKeyboard(event.code);
      }
    });

    if (!this.unstyled) {
      this._handleScroll();
      window.addEventListener("scroll", () => this._handleScroll());
    }
  }

  render() {
    return html`
      <style>
        :host,
        .container {
          display: flex;
        }
        eox-selectionlist {
          display: none;
        }
        input:focus ~ eox-selectionlist,
        eox-selectionlist:active {
          display: block;
        }
        .chip.highlighted {
          background: lightgrey;
        }
        ${!this.unstyled
          ? html`
              ${button} :host { position: relative; overflow: hidden;}
              .container { width: 100%; position: relative; border: 1px solid
              #00417066; border-radius: 4px; height: 24px; padding: 5px; flex:
              1; justify-content: space-between; cursor: text; transition: all
              0.2s ease-in-out; overflow-x: auto; } .container:hover { border:
              1px solid #004170; } .chip-container { display: flex; flex: 0; }
              .chip { display: flex; align-items: center; background: #00417022;
              border-radius: 4px; margin-right: 4px; padding: 5px 10px;
              font-size: small; cursor: default; } .chip.highlighted {
              background: #004170; color: white; } .chip-close { cursor:
              pointer; margin-left: 4px; } .input-container { display: flex;
              flex: 1; align-items: center; } input, input:focus { border: none;
              outline: none; } eox-selectionlist { position: fixed; top: 0px;
              left: 0; width: 100%; margin: 0; padding: 0; background: white;
              border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;
              box-shadow: 0 4px 4px #0007; cursor: default; max-height: 200px;
              overflow-y: auto; z-index: 99;} .button-container { display: flex;
              align-items: center; justify-content: center; position: absolute;
              right: 1px; top: 5px; height: calc(100% - 10px); width: 34px;
              background: white; } button.icon { color: #004170; height: 24px;
              font-size: large; width: unset; } .container::-webkit-scrollbar {
              height: 2px; } .container::-webkit-scrollbar-thumb { background:
              lightgrey; border-radius: 2px; }
            `
          : nothing}
      </style>
      <div
        class="container"
        @click=${() =>
          this.renderRoot.querySelector("input[type=text]").focus()}
      >
        ${when(
          this.multiple,
          () => html`
            <span class="chip-container">
              ${map(
                this.selectedItems,
                (item) => html`
                  <span class="chip">
                    <span class="chip-label">${item[this.labelProperty]}</span>
                    <span
                      class="chip-close"
                      @click=${() => {
                        this.selectedItems.splice(item, 1);
                        this._dispatchEvent();
                        this.requestUpdate();
                      }}
                      >✕</span
                    >
                  </span>
                `
              )}
            </span>
          `
        )}
        <div class="input-container">
          <input
            type="text"
            @focus=${() => {
              this._currentHighlight = null;
              this._itemFilter = "";
              this.requestUpdate();
            }}
            @input=${(evt) => {
              this._itemFilter = evt.target.value.toLowerCase();
            }}
          />
          ${when(
            this.items.length > 0,
            () => html`
              <eox-selectionlist
                .filter=${this._itemFilter}
                .items=${this.items.filter((f) =>
                  this._itemFilter
                    ? f[this.labelProperty]
                        .toLowerCase()
                        .includes(this._itemFilter.toLowerCase())
                    : true
                )}
                .multiple=${this.multiple}
                .selectedItems=${this.selectedItems}
                .unstyled=${this.unstyled}
                @items-highlighted=${(event) => {
                  this._handleHighlight(event.detail);
                }}
                @items-selected=${(event) => {
                  this._handleSelect(event.detail);
                }}
              >
              </eox-selectionlist>
            `
          )}
        </div>
      </div>
      ${when(
        this.selectedItems.length > 0,
        () => html`
          <div class="button-container">
            <button
              class="icon"
              @click=${() => {
                this._handleSelect([]);
              }}
            >
              ✕
            </button>
          </div>
        `
      )}
    `;
  }
}
