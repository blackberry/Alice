/*jslint devel: true, browser: true, white: true, nomen: true */
/*global jWorkflow: false */

/* ===========================================================================
 * AliceJS
 *
 * @description
 * A Lightweight Independent CSS Engine
 *
 * @author Laurent Hasson (@ldhasson)
 * @author Jim Ing (@jim_ing)
 * @author Matt Lantz (@mattylantz)
 * @author Gord Tanner (@gtanner) [ jWorkflow ]
 * ===========================================================================
 *
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @description
 *
 */
var alice = (function () {
    "use strict";

    /*
     * jWorkflow is embedded directly into the core to ensure we can do sequencial animations
     */
    var jWorkflow=function(){return{order:function(j,k){var f=[],h,g=null,i=function(){var a=false;return{take:function(){a=true},pass:function(b){var c;a=false;h.length?(c=h.shift(),b=c.func.apply(c.context,[b,i]),a||i.pass(b)):g.func&&g.func.apply(g.context,[b])}}}(),e={andThen:function(a,b){if(typeof a.andThen==="function"&&typeof a.start==="function"&&typeof a.chill==="function")f.push({func:function(c,d){d.take();a.start({callback:function(a){d.pass(a)},context:b,initialValue:c})},context:b});else if(a.map&&
a.reduce)f.push({func:function(b,d){d.take();var f=a.length,g=function(){return--f||d.pass()};a.forEach(function(a){jWorkflow.order(a).start(g)})},context:b});else{if(typeof a!=="function")throw"expected function but was "+typeof a;f.push({func:a,context:b})}return e},chill:function(a){return e.andThen(function(b,c){c.take();setTimeout(function(){c.pass(b)},a)})},start:function(a,b){var c,d,e;a&&typeof a==="object"?(c=a.callback,d=a.context,e=a.initialValue):(c=a,d=b);g={func:c,context:d};h=f.slice();
i.pass(e)}};return j?e.andThen(j,k):e}}}();if(typeof module==="object"&&typeof require==="function")module.exports=jWorkflow;

    /*
     * The core
     */

    var core = {
        id: "alice",
        name: "AliceJS",
        description: "A Lightweight Independent CSS Engine",
        version: "0.3",
        build: "20120204-1040",

        prefix: "",
        prefixJS: "",

        elems: null,

        format: {},
        helper: {},
        plugins: {},

        debug: false,

            /**
             * Returns array of elements
             */
            elements: function (params) {
                var elems = [],
                    each = function (arr, func) {
                        Array.prototype.forEach.apply(arr, [func]);
                    },
                    push = function (v) {
                        elems.push(v);
                    },
                    lookup = function (query) {
                        if (typeof query != 'string') return [];
                        var result = document.getElementById(query);
                        return result ? [result] : document.querySelectorAll(query);
                    };

                if (typeof params === "string") {
                    each(lookup(params), push);
                }
                else if (params.length === undefined) {
                    elems.push(params); // myElem1
                }
                else {
                    each(params, function(param) {
                        if (param.nodeType && param.nodeType !== 3) {
                            elems.push(param);
                        }
                        else {
                            each(lookup(param), push);
                        }
                    });
                }

                return elems;
            },

            /**
             * Returns random number +/- the factor
             */
            randomize: function (num, factor) {
                var f, r,
                    n = parseInt(num, 10);

                if (typeof factor === "string" && factor.indexOf("%") > -1) {
                    f = parseInt(factor, 10) / 100;
                }
                else {
                    f = parseFloat(factor, 10);
                }

                r = n + n * ((Math.random() * 2 * f) - f);

                //console.log("randomize:", "n=" + n, "factor=" + factor, "r=" + r);
                return Math.floor(r);
            },

            /**
             * Returns duration in milliseconds
             */
            duration: function (params) {
                //console.info("duration", params, typeof params);
                var dur,
                    parseNum = function (num) {
                        return num;
                    },
                    parseStr = function (str) {
                        var val;
                        if (str.indexOf("ms") > -1) {
                            val = parseInt(str, 10); // "1000ms", "1500ms"
                        }
                        else if (str.indexOf("s") > -1) {
                            val = parseFloat(str, 10) * 1000; // "1s", "1.5s"
                        }
                        else {
                            val = parseInt(str, 10); // "1000"
                        }
                        return val;
                    },
                    parseObj = function (obj) {
                        var val;
                        if (obj.value) {
                            if (typeof obj.value === "string") {
                                val = parseStr(obj.value);
                            }
                            else {
                                val = parseNum(obj.value); // {value: 2000}
                            }
                        }
                        return val;
                    };

                switch (typeof params) {
                case "number":
                    dur = parseNum(params);
                    break;
                case "string":
                    dur = parseStr(params);
                    break;
                case "object":
                    dur = parseObj(params);
                    break;
                default:
                    dur = params;
                }

                //console.log("duration:", "dur=" + dur);
                return dur;
            },

            /**
             * Returns x and y coordinates as percentages
             */
            coords: function (params) {
                //console.info("coords", params);
                var coordsArray = {
                    'top-left':{x: "0%", y: "0%"},
                    'top-center':{x: "50%", y: "0%"},
                    'top-right':{x: "100%", y: "0%"},
                    'middle-left':{x: "0%", y: "50%"},
                    'middle-center':{x: "50%", y: "50%"},
                    'middle-right':{x: "100%", y: "50%"},
                    'bottom-left':{x: "0%", y: "100%"},
                    'bottom-center':{x: "50%", y: "100%"},
                    'bottom-right':{x: "100%", y: "100%"},
                    'top':{x: "50%", y: "0%"},
                    'left':{x: "0%", y: "50%"},
                    'center':{x: "50%", y: "50%"},
                    'right':{x: "100%", y: "50%"},
                    'bottom':{x: "50%", y: "100%"},
                    'NW':{x: "0%", y: "0%"},
                    'N':{x: "50%", y: "0%"},
                    'NE':{x: "100%", y: "0%"},
                    'W':{x: "0%", y: "50%"},
                    'E':{x: "100%", y: "50%"},
                    'SW':{x: "0%", y: "100%"},
                    'S':{x: "50%", y: "100%"},
                    'SE':{x: "100%", y: "100%"},
                    '':{x: "50%", y: "50%"},
                    'undefined': {x: "50%", y: "50%"},
                    null: {x: "50%", y: "50%"} 
                };

                return coordsArray[params]; // {x: 320, y: 240} > returns matching value from array!
            },

            /**
             * Returns cubic bezier function
             */
            easing: function (params) {
                var easingArray = {
                    'linear':{p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750},
                    'ease':{p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000},
                    'ease-in':{p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000},
                    'ease-out':{p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000},
                    'ease-in-out':{p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000},
                    'easeInQuad':{p1: 0.550, p2: 0.085, p3: 0.680, p4: 0.530},
                    'easeInCubic':{p1: 0.550, p2: 0.055, p3: 0.675, p4: 0.190},
                    'easeInQuart':{p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220},
                    'easeInQuint':{p1: 0.755, p2: 0.050, p3: 0.855, p4: 0.060},
                    'easeInSine':{p1: 0.470, p2: 0.000, p3: 0.745, p4: 0.715},
                    'easeInExpo':{p1: 0.950, p2: 0.050, p3: 0.795, p4: 0.035},
                    'easeInCirc':{p1: 0.600, p2: 0.040, p3: 0.980, p4: 0.335},
                    'easeInBack':{p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045},
                    'easeOutQuad':{p1: 0.250, p2: 0.460, p3: 0.450, p4: 0.940},
                    'easeOutCubic':{p1: 0.215, p2: 0.610, p3: 0.355, p4: 1.000},
                    'easeOutQuart':{p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000},
                    'easeOutQuint':{p1: 0.230, p2: 1.000, p3: 0.320, p4: 1.000},
                    'easeOutSine':{p1: 0.390, p2: 0.575, p3: 0.565, p4: 1.000},
                    'easeOutExpo':{p1: 0.190, p2: 1.000, p3: 0.220, p4: 1.000},
                    'easeOutCirc':{p1: 0.075, p2: 0.820, p3: 0.165, p4: 1.000},
                    'easeOutBack':{p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275},
                    'easeInOutQuad':{p1: 0.455, p2: 0.030, p3: 0.515, p4: 0.955},
                    'easeInOutCubic':{p1: 0.645, p2: 0.045, p3: 0.355, p4: 1.000},
                    'easeInOutQuart':{p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000},
                    'easeInOutQuint':{p1: 0.860, p2: 0.000, p3: 0.070, p4: 1.000},
                    'easeInOutSine':{p1: 0.445, p2: 0.050, p3: 0.550, p4: 0.950},
                    'easeInOutExpo':{p1: 1.000, p2: 0.000, p3: 0.000, p4: 1.000},
                    'easeInOutCirc':{p1: 0.785, p2: 0.135, p3: 0.150, p4: 0.860},
                    'easeInOutBack':{p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550},
                    'custom':{p1: 0.000, p2: 0.350, p3: 0.500, p4: 1.300},
                    'random':{  p1: Math.random().toPrecision(3),
                                p2: Math.random().toPrecision(3),
                                p3: Math.random().toPrecision(3),
                                p4: Math.random().toPrecision(3) 
                            }
                }; //single line array of all set easing values

                if(easingArray[params]){        //make sure its real
                    return easingArray[params]; //return the array match  
                }else{
                    return {p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000}; //default ease value
                }
            },

            /**
             * Returns a flip object
             */
            flip: function (params, turns, overshoot) {
                var numTurns = turns || 1,
                    ret,
                    parseNum = function (num) {
                        return {start: 0, end: num, axis: "Y"};
                    },
                    parseStr = function (str) {
                        if (params === "left") {
                            return {start: 0, end: -360 * numTurns, axis: "Y"};
                        }
                        else if (params === "right") {
                            return {start: 0, end: 360 * numTurns, axis: "Y"};
                        }
                        else if (params === "up") {
                            return {start: 0, end: 360 * numTurns, axis: "X"};
                        }
                        else if (params === "down") {
                            return {start: 0, end: -360 * numTurns, axis: "X"};
                        }
                    },
                    parseObj = function (obj) {
                        var val;
                        if (obj.value) {
                            if (typeof obj.value === "string") {
                                val = parseStr(obj.value);
                            }
                            else {
                                val = parseNum(obj.value); // {value: -180}
                            }
                        }
                        return val;
                    };

                switch (typeof params) {
                case "number":
                    ret = parseNum(params);
                    break;
                case "string":
                    ret = parseStr(params);
                    break;
                case "object":
                    ret = parseObj(params);
                    break;
                default:
                    ret = null;
                }

                //console.warn(params, ret);
                return ret;
            },

            /**
             * Returns percentage in decimal form
             */
            percentage: function (params) {
                //console.info("percentage", params);
                var pct;

                if (typeof params === "string") {
                    if (params.indexOf("%") > -1 || params.indexOf("°") > -1) {
                        pct = parseInt(params, 10) / 100; // "5%" or "5°"
                    }
                    else {
                        if (params >= 1 || params <= -1) {
                            pct = parseInt(params, 10) / 100; // "5" or "-5"
                        }
                        else {
                            pct = parseFloat(params, 10); // "0.05" or "-0.05"
                        }
                    }
                }
                else if (typeof params === "number") {
                    if (params >= 1 || params <= -1) {
                        pct = params / 100; // 5 or -5
                    }
                    else {
                        pct = params; // 0.05 or -0.05
                    }
                }

                //console.log("percentage:", pct=" + pct);
                return pct;
            },

            /**
             * Set vendor prefix
             */
            vendorPrefix: function () {
                var el = document.createElement("div");

                // Safari 4+, iOS Safari 3.2+, Chrome 2+, and Android 2.1+
                if ("webkitAnimation" in el.style) {
                    this.prefix = "-webkit-";
                    this.prefixJS = "webkit";
                }
                // Firefox 5+
                else if ("MozAnimation" in el.style) {
                    this.prefix = "-moz-";
                    this.prefixJS = "Moz";
                }
                // Internet Explorer 10+
                else if ("MSAnimation" in el.style) {
                    this.prefix = "-ms-";
                    this.prefixJS = "MS";
                }
                // Opera 12+
                else if ("OAnimation" in el.style || "OTransform" in el.style) {
                    this.prefix = "-o-";
                    this.prefixJS = "O";
                }
                else {
                    this.prefix = "";
                    this.prefixJS = "";
                }

                if (this.debug) {
                    console.log("prefix=" + this.prefix, "prefixJS=" + this.prefixJS);
                }

                return;

            },

            /**
             * Get the document height
             */
            docHeight: function () {
                var D = document;

                return Math.max(
                Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
            },

            /**
             * return an integer value for pixels 
             */
            pixel: function (p, w) {
                if (typeof p === "number") {
                    // integers: 0, 1, 1024, ... n
                    if (p % 1 === 0) {
                        return p;
                    }
                    // floats: 0.1 ... 0.9
                    else {
                        return (parseFloat(p, 10)) * w;
                    }
                }
                // 1024px
                if (p.indexOf("px") > -1) {
                    return parseInt(p, 10);
                }
                // 80%, 100%
                if (p.indexOf("%") > -1) {
                    return Math.round((parseInt(p, 10) / 100) * w);
                }
            },

            /**
             * Insert CSS keyframe rule
             */
            keyframeInsert: function (rule) {
                if (document.styleSheets && document.styleSheets.length) {
                    try {
                        document.styleSheets[0].insertRule(rule, 0);
                    }
                    catch (ex) {
                        console.warn(ex.message, rule);
                    }
                }
                else {
                    var style = document.createElement("style");
                    style.innerHTML = rule;
                    document.head.appendChild(style);
                }

                return;
            },

            /**
             * Delete CSS keyframe rule
             */
            keyframeDelete: function (ruleName) {
                var cssrules = (document.all) ? "rules" : "cssRules",
                    i;

                for (i = 0; i < document.styleSheets[0][cssrules].length; i += 1) {
                    if (document.styleSheets[0][cssrules][i].name === ruleName) {
                        document.styleSheets[0].deleteRule(i);
                        if (this.debug) {
                            console.log("Deleted keyframe: " + ruleName);
                        }
                        break;
                    }
                }

                return;
            },

            /**
             * Clear animation settings
             */
            clearAnimation: function (evt) {
                //console.info("_clearAnimation", this, evt.srcElement.id, evt.animationName, evt.elapsedTime);
                this.style[this.prefixJS + "AnimationName"] = "";
                this.style[this.prefixJS + "AnimationDelay"] = "";
                this.style[this.prefixJS + "AnimationDuration"] = "";
                this.style[this.prefixJS + "AnimationTimingFunction"] = "";
                this.style[this.prefixJS + "AnimationIterationCount"] = "";
                this.style[this.prefixJS + "AnimationDirection"] = "";
                //this.style[this.prefixJS + "AnimationFillMode"] = "";
                this.style[this.prefixJS + "AnimationPlayState"] = "";

                // TODO: add evt.animationName to a delete queue?
                alice.keyframeDelete(evt.animationName);

                return;
            },

            /**
             * Initialize
             */
            init: function (params) {
                console.info("Initializing " + this.name + " (" + this.description + ") " + this.version);

                this.vendorPrefix();

                if (params && params.elems) {
                    this.elems = this.elements(params.elems);
                    //console.log(this.elems);
                }

                // Add optional support for jWorkflow (https://github.com/tinyhippos/jWorkflow)
                if (params.workflow === true) {
                    console.log("jWorkflow: enabled");

                    var id = (params && params.id) ? params.id : '',

                        workflow = jWorkflow.order(),

                        animation = {
                            delay: function (ms) {
                                workflow.chill(ms);
                                return animation;
                            },
                            log: function (msg) {
                                workflow.andThen(function () {
                                    console.log(msg);
                                });
                                return animation;
                            },
                            custom: function (func) {
                                workflow.andThen(func);
                                return animation;
                            },
                            start: function () {
                                workflow.start(function () {
                                    console.info("workflow.start");
                                });
                            }
                        };

                    Array.prototype.forEach.call(Object.keys(core.plugins), function (plugin) {
                        var func = core.plugins[plugin];
                        animation[plugin] = function () {
                            var args = arguments;
                            workflow.andThen(function () {
                                func.apply(document.getElementById(id), args);
                            });
                            return animation;
                        };
                    });

                    return animation;
                }
                else {
                    console.log("jWorkflow: disabled");
                }

                return core.plugins;
            },

            /**
             * cheshire performs the actual build of the animation
             * [cheshire description]
             * @param  {[type]} params [description]
             * @return {[type]}
             */
            cheshire: function (params) {
                "use strict";

                console.info("cheshire", params);

                var
                    // Initialize variables and set defaults
                    delay = params.delay || "0ms",
                    duration = params.duration || "2000ms",

                    timing = params.timing || "ease",
                    iteration = params.iteration || 1,
                    direction = params.direction || "normal",
                    playstate = params.playstate || "running",

                    perspective = params.perspective || "1000",
                    perspectiveOrigin = params.perspectiveOrigin || "center",
                    backfaceVisibility = params.backfaceVisibility || "visible",

                    overshoot = alice.percentage(params.overshoot) || 0,
                    overShootPercent = 85,

                    rotate = params.rotate || 0,

                    turns = params.turns || 1,

                    flip = alice.flip(params.flip, turns, overshoot),

                    fade = (params.fade && params.fade !== "") ? params.fade : null,
                    fadeStart = (fade && fade === "out") ? 1 : 0,
                    fadeEnd = (fade && fade === "out") ? 0 : 1,

                    scaleFrom = (params.scale && params.scale.from) ? alice.percentage(params.scale.from) : 1,
                    scaleTo = (params.scale && params.scale.to) ? alice.percentage(params.scale.to) : 1,
                    shadow = params.shadow || false,

                    move = "",
                    axis = "",
                    sign = 1,
                    posStart = 0,
                    posEnd = params.posEnd || 0,
                    over = posEnd + (sign * Math.floor(posEnd * overshoot)),

                    // temporary variables
                    calc = {}, container, elems, elem, i, animId, css, transformStart, transformOver, transformEnd, boxShadowStart, boxShadowEnd, dir, size, shadowSize;

                // TODO: use elems from init for chaining?
                if (alice.elems !== null) {
                    elems = alice.elems;
                }
                else if (params.elems) {
                    elems = alice.elements(params.elems);
                }

                // Loop through elements
                if (elems && elems.length > 0) {
                    for (i = 0; i < elems.length; i += 1) {
                        elem = elems[i];
                        container = elem.parentElement || elem.parentNode;

                        // Recalculate delay and duration for each element
                        calc.delay = alice.helper.duration(params.delay, calc.delay, delay);
                        calc.duration = alice.helper.duration(params.duration, calc.duration, duration);

                        // Recalculate rotation with randomization for each element
                        calc.rotate = alice.helper.rotation(rotate, params);
                        calc.rotateStart = alice.percentage(calc.rotate) * 100;
                        calc.rotateOver = overshoot * 100;
                        calc.rotateEnd = 0;

                        // Generate animation ID
                        animId = alice.id + "-cheshire-" + (new Date()).getTime() + "-" + Math.floor(Math.random() * 1000000);

                        // Configure movement settings
                        if (params.move) {
                            dir = params.move.direction || params.move;
                            switch (dir) {
                            case "left":
                                move = "Left";
                                axis = "X";
                                sign = -1;
                                size = window.innerWidth;
                                posStart = (params.move.start) ? alice.pixel(params.move.start, size) : size;
                                posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : 0;
                                over = sign * Math.floor(posStart * overshoot);
                                break;
                            case "right":
                                move = "Right";
                                axis = "X";
                                sign = 1;
                                size = document.body.offsetWidth - elem.clientWidth;
                                posStart = (params.move.start) ? alice.pixel(params.move.start, size) : 0;
                                posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : size;
                                over = posEnd + (sign * Math.floor(posEnd * overshoot));
                                break;
                            case "up":
                                move = "Up";
                                axis = "Y";
                                sign = -1;
                                size = window.innerHeight;
                                posStart = (params.move.start) ? alice.pixel(params.move.start, size) : size;
                                posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : 0;
                                over = sign * Math.floor(posStart * overshoot);
                                break;
                            case "down":
                                move = "Down";
                                axis = "Y";
                                sign = 1;
                                size = alice.docHeight() - (container.clientHeight * 3);
                                posStart = (params.move.start) ? alice.pixel(params.move.start, size) : 0;
                                posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : size;
                                over = posEnd + (sign * Math.floor(posEnd * overshoot));

                                if (alice.debug) {
                                    console.log(alice.docHeight(), window.innerHeight, window.pageYOffset, container.clientHeight);
                                }
                                break;
                            }
                        }

                        // Generate transforms
                        // Animation @ 0% 
                        transformStart = "";
                        transformStart += (flip) ? " rotate" + flip.axis + "(" + flip.start + "deg)" : " translate" + axis + "(" + posStart + "px)";
                        transformStart += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateStart + "deg)" : "";
                        transformStart += " scale(" + scaleFrom + ")";

                        // Animation @ 85%
                        transformOver = "";
                        transformOver += (flip) ? " rotate" + flip.axis + "(" + Math.floor((1 + overshoot) * flip.end) + "deg)" : " translate" + axis + "(" + over + "px)";
                        transformOver += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateOver + "deg)" : "";
                        transformOver += (scaleTo > 1) ? " scale(" + scaleTo + ")" : "";
                        transformOver += " scale(" + scaleTo + ")";

                        // Animation @ 100%
                        transformEnd = "";
                        transformEnd += (flip) ? " rotate" + flip.axis + "(" + flip.end + "deg)" : " translate" + axis + "(" + posEnd + "px)";

                        if (move === "" && direction === "alternate") {
                            transformEnd += " rotate(" + (-(calc.rotateStart)) + "deg)";
                        }
                        else {
                            transformEnd += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateEnd + "deg)" : "";
                        }

                        transformEnd += " scale(" + scaleTo + ")";

                        // Generate box shadow
                        if (shadow === true && scaleTo > 1) {
                            shadowSize = Math.round(scaleTo * 10);
                            boxShadowStart = " 0px 0px 0px rgba(0, 0, 0, 1)";
                            boxShadowEnd = " " + shadowSize + "px " + shadowSize + "px " + shadowSize + "px rgba(0, 0, 0, 0.5)";
                        }

                        // Generate CSS for keyframe rule
                        css = "";
                        css += "@" + alice.prefix + "keyframes " + animId + " {\n";

                        css += "\t" + "0% {" + "\n";
                        css += "\t\t" + alice.prefix + "transform:" + transformStart + ";" + "\n";
                        css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
                        css += (fade) ? "\t\t" + "opacity: " + fadeStart + ";" + "\n" : "";
                        css += (shadow === true && scaleTo > 1) ? "\t\t" + alice.prefix + "box-shadow: " + boxShadowStart + ";" + "\n" : "";

                        css += "\t" + "}" + "\n";

                        if (overshoot !== 0) {
                            css += "\t" + overShootPercent + "% {\n";
                            css += "\t\t" + alice.prefix + "transform:" + transformOver + ";" + "\n";
                            css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
                            css += "\t" + "}" + "\n";
                        }

                        css += "\t" + "100% {" + "\n";
                        css += "\t\t" + alice.prefix + "transform:" + transformEnd + ";" + "\n";
                        css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
                        css += (fade) ? "\t\t" + "opacity: " + fadeEnd + ";" + "\n" : "";
                        css += (shadow === true && scaleTo > 1) ? "\t\t" + alice.prefix + "box-shadow: " + boxShadowEnd + ";" + "\n" : "";

                        css += "\t" + "}" + "\n";

                        css += "}" + "\n";

                        console.log(css);

                        // Insert keyframe rule
                        alice.keyframeInsert(css);

                        // Apply perspective to parent container
                        container.style[alice.prefixJS + "Perspective"] = perspective + "px";
                        container.style[alice.prefixJS + "PerspectiveOrigin"] = alice.format.coords(perspectiveOrigin); 

                        // Apply properties to elements
                        elem.style[alice.prefixJS + "BackfaceVisibility"] = backfaceVisibility;

                        elem.style[alice.prefixJS + "AnimationName"] = animId;
                        elem.style[alice.prefixJS + "AnimationDelay"] = calc.delay;
                        elem.style[alice.prefixJS + "AnimationDuration"] = calc.duration;
                        elem.style[alice.prefixJS + "AnimationTimingFunction"] = alice.format.easing(timing);
                        elem.style[alice.prefixJS + "AnimationIterationCount"] = iteration;
                        elem.style[alice.prefixJS + "AnimationDirection"] = direction;
                        elem.style[alice.prefixJS + "AnimationPlayState"] = playstate;

                        // Apply styles from last key frame
                        elem.style[alice.prefixJS + "Transform"] = transformEnd;
                        elem.style.opacity = (fade) ? fadeEnd : "";
                        elem.style[alice.prefixJS + "BoxShadow"] = (shadow === true && scaleTo > 1) ? boxShadowEnd : "";

                        // Add listener to clear animation after it's done
                        if ("MozAnimation" in elem.style) {
                            elem.addEventListener("animationend", alice.clearAnimation, false);
                        }
                        else {
                            elem.addEventListener(alice.prefixJS + "AnimationEnd", alice.clearAnimation, false);
                        }

                        if (alice.debug) {
                            console.log(css);
                            console.log(container.style);
                            console.log(elem.id, alice.prefixJS, elem.style, elem.style.cssText, elem.style[alice.prefixJS + "AnimationDuration"], elem.style[alice.prefixJS + "AnimationTimingFunction"]);
                        }
                    }
                }
                else {
                    console.warn("No elements!");
                }

                return params;
            }

        };

        return core;

}());

/**
 * Performs various acts of format changes
 */
alice.format = {
    /**
     * configures the duration and potentially induces the randomness factor
     */
    duration: function (params) {
        "use strict";
        var d = 0, r = 0, dur = 0;

        d = alice.duration(params);
        dur = d;

        if (params.randomness) {
            r = alice.randomize(d, alice.percentage(params.randomness));
            dur = Math.abs(r);
        }

        //console.log(d, r, dur);
        return dur + "ms";
    },

    /**
     * configures the coords object
     */
    coords: function (c) {
        "use strict";
        var cObj = alice.coords(c),
            cVal = cObj.x + " " + cObj.y;
        return cVal;
    },

    /**
     * configures the output of the object
     */
    easing: function (e) {
        "use strict";
        var eObj = alice.easing(e),
            eVal = "cubic-bezier(" + eObj.p1 + ", " + eObj.p2 + ", " + eObj.p3 + ", " + eObj.p4 + ")";
        return eVal;
    },

    /**
     * Simply returns the oppose number
     */
    oppositeNumber: function (n) {
        "use strict";
        return -n;
    }
};

/**
 * Performs further help and/or customization on the format 
 */
alice.helper = {
    /**
     * Formats the duration and returns a string
     */
    duration: function (param, calc, duration) {
        if (param && param.offset) {
            if (calc) {
                calc = parseInt(calc, 10) + parseInt(param.offset, 10);
            }
            else {
                calc = parseInt(alice.format.duration(duration), 10);
            }
            calc += "ms";
            //console.log(duration, param.value, param.offset, calc);
        }
        else {
            calc = parseInt(alice.format.duration(duration), 10) + "ms";
        }
        return calc;
    },

    /**
     * Applies randomness to the rotation
     */
    rotation: function (rotate, params) {
        "use strict";
        var val = rotate;
        if (params.randomness) {
            val = alice.randomize(val, alice.percentage(params.randomness));
            //console.log("rotation:", "rotate=" + rotate, "params.randomness=" + params.randomness, "val=" + val);
        }
        return val;
    }
};

/* 
 * In order to condense the plugin calls ensuring jWorkflow functions if need be
 */
var aliceJs = function(workflowName){
    if(!workflowName){
        //sets if the workflow is true or false
        params = '';
    }else{
        var params = {
            workflow: true
        }
    } 
    //returns the plugins utilizing workflow if necessary
    return alice.init(params);
}

//----------------------------------------------------------------------------