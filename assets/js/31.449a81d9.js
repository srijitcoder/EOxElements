(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{584:function(e,t,a){"use strict";a.r(t);var i=a(316),s=a.n(i),l=a(362),r=a.n(l),o={components:{MapBasic:s.a,MapLayerSwipe:r.a},data:function(){return{zoom:2,layers:[{id:"2021",title:"2021",type:"tile",visible:!0,source:{type:"wmts-capabilities",url:"https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml",layer:"s2cloudless-2021_3857",matrixSet:"GoogleMapsCompatible"}},{id:"2018",title:"2018",type:"tile",visible:!0,source:{type:"wmts-capabilities",url:"https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml",layer:"s2cloudless-2018_3857",matrixSet:"GoogleMapsCompatible"}}]}},methods:{toggleCompare:function(e){this.layerComparison=e}}},n=a(45),p=Object(n.a)(o,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("map-basic",{staticStyle:{height:"100%",width:"100%"},attrs:{zoom:e.zoom,layers:e.layers},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.mapObject;return[i?a("map-layer-swipe",{ref:"swipe",attrs:{mapObject:i,swipeLayer:e.layers[1],originalLayer:e.layers[0]},on:{swipeActive:e.toggleCompare},scopedSlots:e._u([{key:"activate",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:function(t){return e.$refs.swipe.enableSwipe(!0)}}},[a("v-icon",{attrs:{left:""}},[e._v("mdi-compare")]),e._v("\n          Compare layers\n        ")],1)]},proxy:!0},{key:"close",fn:function(){return[a("v-btn",{attrs:{fab:"",small:"",color:"primary"},on:{click:function(t){return e.$refs.swipe.enableSwipe(!1)}}},[a("v-icon",[e._v("mdi-close")])],1)]},proxy:!0}],null,!0)}):e._e()]}}])})}),[],!1,null,null,null);t.default=p.exports}}]);