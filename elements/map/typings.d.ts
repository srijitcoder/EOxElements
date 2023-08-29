/// <reference types="vite/client" />
import { EOxMap as eoxMap } from "./main";
declare global {
  export type EOxMap = eoxMap;
}

declare module "*.css";
declare module "vite";
