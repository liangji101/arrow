/*jslint forin:true sub:true undef: true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/
/*jslint undef: true*/
/*
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

// Provided by the fw
// ARROW = {};
// ARROW.autoTest = false; // for self contained app and test, such as html
// ARROW.testParams = {};
// ARROW.appSeed = ""; // YUI min or equivalent
// ARROW.testLibs = [];
// ARROW.scriptType = "test";
// ARROW.testScript = "test-file.js";
// ARROW.actionScript = "action-file.js";
// ARROW.onSeeded = function() { /* add test, hand over to runner */}

ARROW.testBag = ["test"];
ARROW.testReport = null;
ARROW.actionReport = null;
ARROW.actionReported = false;


var isCommonJS = typeof window == "undefined" && typeof exports == "object";
var seed = isCommonJS ? require('../interface/engine-seed').engineSeed : window.engineSeed

//var YUI_TEST_URL = "http://yui.yahooapis.com/combo?3.8.1/build/yui-base/yui-base-min.js&3.8.1/build/oop/oop-min.js&3.8.1/build/event-custom-base/event-custom-base-min.js&3.8.1/build/event-base/event-base-min.js&3.8.1/build/event-simulate/event-simulate-min.js&3.8.1/build/event-custom-complex/event-custom-complex-min.js&3.8.1/build/substitute/substitute-min.js&3.8.1/build/json-stringify/json-stringify-min.js&3.8.1/build/test/test-min.js";
//var YUI_RUNE_URL = "http://yui.yahooapis.com/combo?3.8.1/build/yui-base/yui-base-min.js&3.8.1/build/array-extras/array-extras-min.js&3.8.1/build/oop/oop-min.js&3.8.1/build/attribute-core/attribute-core-min.js&3.8.1/build/event-custom-base/event-custom-base-min.js&3.8.1/build/event-custom-complex/event-custom-complex-min.js&3.8.1/build/attribute-observable/attribute-observable-min.js&3.8.1/build/base-core/base-core-min.js&3.8.1/build/cookie/cookie-min.js&3.8.1/build/features/features-min.js&3.8.1/build/dom-core/dom-core-min.js&3.8.1/build/dom-base/dom-base-min.js&3.8.1/build/selector-native/selector-native-min.js&3.8.1/build/selector/selector-min.js&3.8.1/build/node-core/node-core-min.js&3.8.1/build/node-base/node-base-min.js&3.8.1/build/event-base/event-base-min.js";

/**
 * @constructor
 * @param config
 */
function yuitestSeed(config) {
	this.config = config || {};
	seed.call(this, config);
}

yuitestSeed.prototype = Object.create(seed.prototype);

yuitestSeed.prototype.captureModuleTests = function (cb) {
	var module = ARROW.testParams["module"],
		yuiAddFunc = YUI.add;

	// capture module style tests
	YUI.add = function (name, fn, version, meta) {
		yuiAddFunc(name, fn, version, meta);

		if (module && (name !== module)) {
			return;
		}

		if (("test" === ARROW.scriptType) && (-1 !== name.indexOf("-tests"))) {
			//console.log("Found test module: " + name);
			ARROW.testBag.push(name);
		} else if (("action" === ARROW.scriptType) && (-1 !== name.indexOf("-action"))) {
			//console.log("Found test action: " + name);
			ARROW.testBag.push(name);
		}
	};
}
/**
 * yuitest generate server side seed
 * default we will have yui required
 * @param cb
 */
yuitestSeed.prototype.generateServerSideSeed = function (cb) {
	this.captureModuleTests();
	cb();
}
/**
 * yuitest client side seed
 * for now load yui-min.js
 * @param cb
 */
yuitestSeed.prototype.generateClientSideSeed = function (cb) {

	// parseFloat(YUI.version) < parseFloat("3.4.0")
	// or yui version > 3.x,both inject yui seed
	var self = this;

	// don't load external script,just get all necessary yui module

//	this.loadScript(ARROW.appSeed, function () {
//
//	});

	self.captureModuleTests();
	cb();

}

new yuitestSeed(ARROW.engineConfig).run();