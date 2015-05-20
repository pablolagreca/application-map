'use strict';
var BASEDIR = "../..";
var JSG_HOME = BASEDIR + "/lib";
var ARAC_HOME = JSG_HOME;
var JSG_LIB = "jsg.js";
var ARAC_LIB = "jsgarac.js";


function onAppLoaded() {
	JSG.init(JSG_HOME);
	onWindowLoaded();
}

function loadDemo() {
	Loader.addScript(JSG_LIB, JSG_HOME);
	Loader.addScript(ARAC_LIB, ARAC_HOME);
    Loader.addScript("index.js", undefined, onAppLoaded);
    Loader.load();
   
}
