(function(t,e){typeof exports=="object"&&typeof module<"u"?e(exports):typeof define=="function"&&define.amd?define(["exports"],e):(t=typeof globalThis<"u"?globalThis:t||self,e(t.Interface={}))})(this,function(t){"use strict";var u=Object.defineProperty;var f=(t,e,o)=>e in t?u(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var c=(t,e,o)=>(f(t,typeof e!="symbol"?e+"":e,o),o);const e=new MessageChannel,o=e.port1;class d{constructor(r){c(this,"iframe");this.iframe=r}setData(r){o.postMessage({type:"setData",body:{data:r}})}getFoo(){return new Promise(r=>{const n=Date.now();o.onmessage=i=>{i.data.ts===n&&r(i.data.body)},o.postMessage({ts:n,type:"getFoo",body:"hello world"})})}}const l=s=>s?new Promise(r=>{var i;const n=document.createElement("iframe");n.style.cssText="width: 100%; height: 100%; display: block; margin: 0; border: none;",n.setAttribute("src",(i=typeof document>"u"&&typeof location>"u"?require("url").pathToFileURL(__filename).href:typeof document>"u"?location.href:document.currentScript&&document.currentScript.src||new URL("interface.umd.js",document.baseURI).href)!=null&&i.includes("localhost")?"http://localhost:5173/index.html":"https://www.unpkg.com/@eox/chart/dist/index.html"),n.setAttribute("id","EOxChart"),s==null||s.appendChild(n),n.onload=()=>{var a;(a=n.contentWindow)==null||a.postMessage("init","*",[e.port2]),r(new d(n))}}):(console.error("no div selected"),null);t.createChart=l,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});
