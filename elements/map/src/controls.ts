import { EOxMap } from "../main";
import * as olControls from "ol/control";
import { generateLayers } from "./generate";

type controlType =
  | "Attribution"
  | "FullScreen"
  | "MousePosition"
  | "OverviewMap"
  | "Rotate"
  | "ScaleLine"
  | "ZoomSlider"
  | "ZoomToExtent"
  | "Zoom";

type controlDictionary = {
  [key in controlType]?: Object;
};

/**
 * adds initial controls from webcomponent attributes, if any are given.
 */
export function addInitialControls(EOxMap: EOxMap) {
  const controls = JSON.parse(
    EOxMap.getAttribute("controls")
  ) as controlDictionary;
  if (controls) {
    const keys = Object.keys(controls);
    for (let i = 0, ii = keys.length; i < ii; i++) {
      const controlName = keys[i] as controlType;
      const controlOptions = controls[controlName];
      // @ts-ignore
      if (controlOptions && controlOptions.layers) {
        // @ts-ignore
        controlOptions.layers = generateLayers(controlOptions.layers); // parse layers (OverviewMap)
      }
      const control = new olControls[controlName](controlOptions);
      EOxMap.map.addControl(control);
      EOxMap.controls[controlName] = control;
    }
  }
}
