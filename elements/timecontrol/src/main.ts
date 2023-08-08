import { LitElement, html, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Map } from "ol";
import Layer from "ol/layer/Layer";
import TileSource from "ol/source/Tile";
import "toolcool-range-slider";
import { style } from "./style";
import { styleEOX } from "./style.eox";
import { UrlFunction } from "ol/Tile";
import { DateTime } from 'luxon';

@customElement("eox-timecontrol")
export class EOxDrawTools extends LitElement {
  /**
   * The WMS parameter to update
   */
  @property({ attribute: "animation-property" })
  animationProperty?: string;

  /**
   * The list of available values for the animation property
   */
  @property({ attribute: "animation-values", type: Array })
  animationValues: Array<string> = [];

  /**
   * The query selector for the map
   */
  @property()
  for: string;

  /**
   * The layerid of the animated layer
   */
  @property()
  layer: string;

  /**
   * Display a slider for the values
   */
  @property({ type: Boolean })
  slider: boolean;

  /**
   * Custom url function to manually override the url creation. Receives the current url as property.
   * @param url the current url function output
   * @returns url the new url string
   * @example ```
   * document.querySelector("eox-timecontrol").urlFunction = (url) => {
   *   // do something with the url
   *   const newUrl = url.replace('foo', 'bar');
   *   return newUrl;
   *};
   * ```
   */
  @property()
  urlFunction: Function;

  /**
   * Original tile url function of the source.
   * Used to get the correct TileGrid-Values, while manipulating certain parts of the URL.
   */
  @property()
  private _originalTileUrlFunction: UrlFunction;

  /**
   * Go to next step
   */
  next() {
    this._updateStep(+1);
  }

  /**
   * Go to previous step
   */
  previous() {
    this._updateStep(-1);
  }

  /**
   * Toggle play animation
   * @param on animation on/off
   */
  playAnimation(on: boolean) {
    if (on) {
      this._animationInterval = setInterval(() => this._updateStep(1), 500);
    } else {
      clearInterval(this._animationInterval);
    }
    this._isAnimationPlaying = on;
    this.requestUpdate();
  }

  /**
   * Set the config at a later point
   * @param config
   */
  setConfig(config: {
    layer: string;
    animationProperty: string;
    animationValues: Array<string>;
  }) {
    this.layer = config.layer ?? this.layer;
    this.animationProperty = config.animationProperty ?? this.animationProperty;
    this.animationValues = config.animationValues ?? this.animationValues;
    this.requestUpdate();
    this._updateStep(0);
  }

  @state()
  private _animationInterval: ReturnType<typeof setInterval>;

  @state()
  private _animationSource: TileSource;

  @state()
  private _isAnimationPlaying: boolean;

  @state()
  private _newTimeIndex: number = 0;

  @property({ type: Boolean })
  unstyled: Boolean;

  private _updateStep(step = 1) {
    this._newTimeIndex = this._newTimeIndex + step;
    if (this._newTimeIndex > this.animationValues.length - 1) {
      this._newTimeIndex = 0;
    }
    if (this._newTimeIndex < 0) {
      this._newTimeIndex = this.animationValues.length - 1;
    }

    //@ts-ignore
    this._animationSource.setTileUrlFunction(
      //@ts-ignore
      (tileCoord, pixelRatio, projection) => {
        let src = this._originalTileUrlFunction(
          tileCoord,
          pixelRatio,
          projection
        );
        if (this.urlFunction) {
          return this.urlFunction(src);
        }
        const searchParams = new URLSearchParams(
          src.substring(src.indexOf("?"))
        );
        searchParams.set(
          this.animationProperty,
          this.animationValues[this._newTimeIndex]
        );

        return src.substring(0, src.indexOf("?") + 1) + searchParams.toString();
      }
    );
    //@ts-ignore
    this._animationSource.setKey(new Date());
    this._animationSource.changed();
    this.requestUpdate();
  }

  render() {
    const mapQuery = document.querySelector(this.for as string);
    // @ts-ignore
    const olMap: Map = mapQuery.map || mapQuery;

    olMap.once("loadend", () => {
      if (!this._originalTileUrlFunction) {
        const animationLayer = olMap
          .getLayers()
          .getArray()
          .find(
            (l) =>
              l.get("id") === this.layer ||
              l.get("mapbox-layers")?.includes(this.layer)
          ) as Layer;
        this._animationSource = animationLayer.getSource() as TileSource;
        this._originalTileUrlFunction =
          //@ts-ignore
          this._animationSource.getTileUrlFunction();
      }
    });

    return html`
      <style>
        ${style}
        ${!this.unstyled && styleEOX}
      </style>
      <main>
        <div id="controls" part="controls">
          <button
            part="previous"
            class="icon previous"
            @click="${() => this.previous()}"
          >
            <
          </button>
          <button part="next" class="icon next" @click="${() => this.next()}">
            >
          </button>
          <button
            part="play"
            class="icon-text ${this._isAnimationPlaying ? "pause" : "play"}"
            @click="${() =>
              this.playAnimation(this._isAnimationPlaying ? false : true)}"
          >
            ${this._isAnimationPlaying ? "Pause" : "Play"}
          </button>

          ${this.slider
            ? html`
                <div class="slider-col">
                  <tc-range-slider
                    data="${this.animationValues}"
                    part="slider"
                    value="${this.animationValues[this._newTimeIndex]}"
                    style="display: inline-block;"
                    @change="${(evt: { detail: { value: string } }) =>
                      this._updateStep(
                        this.animationValues.findIndex(
                          (v) => v === evt.detail.value
                        ) - this._newTimeIndex
                      )}"
                  ></tc-range-slider>

                  <eox-sliderticks
                    width="300"
                    .times="${this.animationValues}"
                  ></eox-sliderticks>
                </div>
              `
            : ""}

          <span part="current"
            >${this.animationValues[this._newTimeIndex]}</span
          >
        </div>
      </main>
    `;
  }
}

@customElement("eox-sliderticks")
export class SliderTicks extends LitElement {

  @property({ type: Number }) width: number = 0;
  @property({ type: Array }) times: string[] = [];

  @state() height = 6;
  @state() svgWidth = 0;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    super.disconnectedCallback();
  }

  firstUpdated() {
    this.handleResize();
  }

  handleResize() {
    this.svgWidth = this.shadowRoot.querySelector('svg').clientWidth;
    this.height = this.shadowRoot.querySelector('svg').clientHeight;
  }

  get lines() {
    const num = this.numLines > (this.width / 2)
      ? (this.width / 2)
      : this.numLines;

    const spacing = this.width / (num - 1);
    return Array.from({ length: this.numLines }, (_, i) => i * spacing);
  }

  get numLines() {
    return this.times ? this.times.length : 0;
  }

  get yearMarks(): { label: number, position: number }[] {
    const yearIndices: { label: number, position: number }[] = [];
    let lastDecade: number = null;
    let lastYear: number = null;

    // Calculate first and last dates as fractions of a year
    const firstTime = DateTime.fromISO(this.times[0]);
    const firstYear = firstTime.year + (firstTime.ordinal / 365);
    const lastTime = DateTime.fromISO(this.times[this.times.length - 1]);
    const lastTimeYear = lastTime.year + (lastTime.ordinal / 365);

    // Calculate the total range in fractions of a year
    const totalYears = lastTimeYear - firstYear;

    // If the total range of years crosses a certain threshold (e.g., 10 years),
    // we will show marks for every decade.
    const showDecades = totalYears > 10;

    this.times.forEach((time: string) => {
      const currentTime = DateTime.fromISO(time);
      const currentTimeYear = currentTime.year + (currentTime.ordinal / 365);

      if (showDecades) {
        // If we are in a new decade, place a mark
        const currentDecade = Math.floor(currentTimeYear / 10) * 10;
        if (currentDecade !== lastDecade) {
          yearIndices.push({
            label: currentDecade,
            position: ((currentTimeYear - firstYear) / totalYears) * this.width,
          });
          lastDecade = currentDecade;
        }
      } else {
        // If we are in a new year, place a mark
        const currentYear = Math.floor(currentTimeYear);
        if (currentYear !== lastYear) {
          yearIndices.push({
            label: currentYear,
            position: ((currentTimeYear - firstYear) / totalYears) * this.width,
          });
          lastYear = currentYear;
        }
      }
    });

    // Create a new array with removed overlapping labels
    const nonOverlappingYearIndices = yearIndices.filter((yearMark, index, array) => {
      // If it's the last item in the array, it can't overlap with a next item
      if (index === array.length - 1) return true;

      // Get the next item in the array
      const nextYearMark = array[index + 1];

      // Determine the distance between the current and next labels
      const distance = nextYearMark.position - yearMark.position;

      // Only keep this label if it's more than a certain distance from the next one
      const minDistance = 50; // set this to the minimum acceptable distance
      return distance > minDistance;
    });

    return nonOverlappingYearIndices;
  }

  isYearLine(line: number): boolean {
    // Check if this line's position is approximately equal to any year mark position
    const isYearMark = this.yearMarks
    .some((yearMark) => Math.abs(yearMark.position - line) < 1.0);

    return isYearMark;
  }

  render() {
    return html`
      <div class="fill-width">
        <svg
          style="width: ${this.width}px; height: 30px;"
          viewBox="-1 0 ${this.width + 2} ${this.height}"
        >
          ${this.lines.map((line, index) => svg`
            <line
              key=${index}
              x1=${line}
              y1="0"
              x2=${line}
              y2=${this.isYearLine(line) ? 12 : 6}
              stroke=${this.isYearLine(line) ? '#333' : '#7596A2'}
              stroke-width=${this.isYearLine(line) ? 1 : 1}
            ></line>
          `)}

          ${this.yearMarks.map((year, index) => svg`
            <text
              key=${`y${index}`}
              x=${year.position - 1}
              y=${this.height - 1}
              fill="#555"
              font-size="13"
              font-weight="500"
            >
              ${year.label}
            </text>
          `)}
        </svg>
      </div>
    `;
  }
}
