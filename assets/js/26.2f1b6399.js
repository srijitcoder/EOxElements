(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{577:function(e,t,n){"use strict";n.r(t);var o=n(316),a={components:{MapBasic:n.n(o).a},data:function(){return{zoom:14,center:[307260,4390400]}},computed:{layers:function(){return[{type:"webgl",source:{type:"geotiff",sources:[{url:"https://s2gm-gmv-eox-samples.s3.eu-central-1.amazonaws.com/utm/30N/monthly/2021/06/no_brdf/5/1014/31.tif",bands:[1,2,3],min:50,nodata:0,max:3100}],attribution:"<a href='https://s2maps.eu'>Sentinel-2 cloudless</a> by <a href='https://eox.at/'>EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2019)"}}]}}},s=n(45),r=Object(s.a)(a,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("map-basic",{ref:"map",staticStyle:{height:"100%",width:"100%"},attrs:{zoom:e.zoom,center:e.center,layers:e.layers,mapConfig:{"data-projection":"EPSG:32630"},viewConfig:{projection:"EPSG:32630","min-zoom":13,"max-zoom":15}},on:{"update:zoom":function(t){e.zoom=t},"update:center":function(t){e.center=t}}})}),[],!1,null,null,null);t.default=r.exports}}]);