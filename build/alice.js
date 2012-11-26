/*jslint devel: true, browser: true, white: true, nomen: true */
/*global jWorkflow: false */

/* ===========================================================================
 * AliceJS
 *
 * @description
 * A Lightweight Independent CSS Engine
 *
 * @author Laurent Hasson (@ldhasson)       [original]
 * @author Jim Ing (@jim_ing)               [original]
 * @author Gord Tanner (@gtanner)           [contributor, jWorkflow]
 * @author Matt Lantz (@mattylantz)         [contributor] 
 * 
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

 //===================================================================================

/*
 * jWorkflow is embedded directly into the core to ensure we can do sequencial animations
 *
 *   ** Licensed Under **
 *
 *   The MIT License
 *   http://www.opensource.org/licenses/mit-license.php
 *
 *   Copyright (c) 2010 all contributors:
 *
 *   Gord Tanner
 *   tinyHippos Inc.
 */
    // jWorkflow.js
// (c) 2010 tinyHippos inc.
// jWorkflow is freely distributable under the terms of the MIT license.
// Portions of jWorkflow are inspired by Underscore.js
var jWorkflow = (function () {
    function _valid(func) {
        if (typeof(func) !== 'function') {
            throw "expected function but was " + typeof(func);
        }
    }

    function _isWorkflow(func) {
        return typeof func.andThen === 'function' &&
               typeof func.start === 'function' &&
               typeof func.chill === 'function';
    }

    function _isArray(func) {
        return !!func.map && !!func.reduce;
    }

    var transfunctioner =  {
        order: function (func, context) {
            var _workflow = [],
                _tasks,
                _callback = null,
                _baton = (function () {
                    var _taken = false; 
                    return {

                        take: function () {
                            _taken = true;
                        },

                        pass: function (result) {
                            var task;
                            _taken = false;

                            if (_tasks.length) {
                                task = _tasks.shift();
                                result = task.func.apply(task.context, [result, _baton]);

                                if (!_taken) {
                                    _baton.pass(result);
                                }
                            }
                            else { 
                                if (_callback.func) {
                                    _callback.func.apply(_callback.context, [result]);
                                }
                            }
                        },

                        drop: function (result) {
                            _taken = true;
                            _tasks = [];
                            setTimeout(function () {
                                _baton.pass(result);
                            }, 1);
                        }
                    };
                }()),
                _self = {

                    andThen: function (func, context) {
                        if (_isWorkflow(func)) {
                            var f = function (prev, baton) {
                                baton.take();
                                func.start({
                                    callback: function (result) {
                                        baton.pass(result);
                                    }, 
                                    context: context, 
                                    initialValue: prev
                                });
                            };
                            _workflow.push({func: f, context: context});
                        }
                        else if (_isArray(func)) {
                            var orch = function (prev, baton) {
                                baton.take();

                                var l = func.length,
                                    join = function () {
                                        return --l || baton.pass();
                                    };

                                func.forEach(function (f) {
                                    jWorkflow.order(f).start(join);
                                });
                            };
                            _workflow.push({func: orch, context: context});
                        }
                        else {
                            _valid(func);
                            _workflow.push({func: func, context: context});
                        }
                        return _self;
                    },

                    chill: function (time) {
                        return _self.andThen(function (prev, baton) {
                            baton.take();
                            
                            setTimeout(function () {
                                baton.pass(prev);
                                }, time);  
                        });
                    },

                    start: function () {
                        var callback,
                            context,
                            initialValue;

                        if (arguments[0] && typeof arguments[0] === 'object') {
                            callback = arguments[0].callback;
                            context = arguments[0].context;
                            initialValue = arguments[0].initialValue;
                        }
                        else {
                            callback = arguments[0];
                            context = arguments[1];
                        }

                        _callback = {func: callback, context: context};
                        _tasks = _workflow.slice();
                        _baton.pass(initialValue);
                    }
                };

            return func ? _self.andThen(func, context) : _self;
        }
    };

    return transfunctioner;
}());

if (typeof module === "object" && typeof require === "function") {
    module.exports = jWorkflow;
}


    //===================================================================================

/**
 * @description
 */
var alice = (function () {
    "use strict";

    /*
     * The core
     */
    var core = {
        id: "alice",
        name: "AliceJS",
        description: "A Lightweight Independent CSS Engine",
        version: "0.5",
        build: "20121101-1034",

        prefix: "",
        prefixJS: "",

        elems: null,

        cleaner: {},

        format: {},
        helper: {},
        plugins: {},
        anima: null,

        debug: false,

            /**
             * Returns array of elements
             */
            elements: function (params) {
                var elemId, elems = [],
                    each = function (arr, func) {
                        Array.prototype.forEach.apply(arr, [func]);
                    },
                    push = function (v) {
                        elems.push(v);
                    },
                    lookup = function (query) {
                        if (typeof query !== 'string'){ return []; }
                        var result = document.getElementById(query);
                        return result ? [result] : document.querySelectorAll(query);
                    };

                if (typeof params === "string") {
                    //just to make sure we're not dealing with a jquery object.
                    if(params.indexOf("$") === 0){
                        //if we are and its an id, or class
                        if(params.indexOf('#') > -1){
                            elemId = params.substring((params.indexOf('#')+1), params.indexOf('\')'));
                            each(lookup(elemId), push);
                        }else if(params.indexOf('.') > -1){
                            elemId = params.substring((params.indexOf('.')+1), params.indexOf('\')'));
                            each(lookup(elemId), push);
                        }else{
                            console.warn('jQuery selectors must be either classes or ids.');
                            return;
                        }
                    }else{
                        each(lookup(params), push);
                    }
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
                    'undefined': {x: "50%", y: "50%"}
                };
                return coordsArray[params]; // {x: 320, y: 240}
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
                        switch(params){
                        case "left":
                            return {start: 0, end: -360 * numTurns, axis: "Y"};
                        case "right":
                            return {start: 0, end: 360 * numTurns, axis: "Y"};
                        case "up":
                            return {start: 0, end: 360 * numTurns, axis: "X"};
                        case "down":
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
                else if ("msAnimation" in el.style) {
                    this.prefix = "-ms-";
                    this.prefixJS = "ms";
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
                    var ruleNum = 0;
                    try {
                        if(document.styleSheets[0].cssRules.length > 0){
                            ruleNum = document.styleSheets[0].cssRules.length;
                        }
                        document.styleSheets[0].insertRule(rule, ruleNum);
                        //console.log(rule);
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
                this.style[this.prefixJS + "AnimationName"] = " ";
                this.style[this.prefixJS + "AnimationDelay"] = " ";
                this.style[this.prefixJS + "AnimationDuration"] = " ";
                this.style[this.prefixJS + "AnimationTimingFunction"] = " ";
                this.style[this.prefixJS + "AnimationIterationCount"] = " ";
                this.style[this.prefixJS + "AnimationDirection"] = " ";
                //this.style[this.prefixJS + "AnimationFillMode"] = "";
                this.style[this.prefixJS + "AnimationPlayState"] = " ";

                // TODO: add evt.animationName to a delete queue?
                alice.keyframeDelete(evt.animationName);

                return;
            },

            init: function (params) {
                console.info("Initializing " + this.name + " (" + this.description + ") " + this.version);

                this.vendorPrefix();

                if (params && params.elems) {
                    this.elems = this.elements(params.elems);
                    //console.log(this.elems);
                }

                // Add optional support for jWorkflow (https://github.com/tinyhippos/jWorkflow)
                if (params && params.workflow === true) {
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
            }
        };

        return core;
}());

/**
 * Performs various acts of formating changes
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
     * configures the output of the object
     */
    easing: function (e) {
        "use strict";
        var eObj = alice.easing(e),
            eVal = "cubic-bezier(" + eObj.p1 + ", " + eObj.p2 + ", " + eObj.p3 + ", " + eObj.p4 + ")";
        return eVal;
    },

    coords: function (c) {
        "use strict";
        var cObj = alice.coords(c),
            cVal = cObj.x + " " + cObj.y;
        return cVal;
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
        "use strict";
        if (param && param.offset) {
            if (calc) {
                calc = parseInt(calc, 10) + parseInt(param.offset, 10);
            }
            else {
                calc = parseInt(alice.format.duration(duration), 10);
            }
        }
        else {
            calc = parseInt(alice.format.duration(duration), 10);
        }
        calc += "ms";
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

/**
 * Functions that cleanse the DOM
 */
alice.cleaner = {
    // Clear the Elements style tag and thusly the animation call.
    removeAni: function(elems){
        "use strict";
        var i, AniElems;
        document.addEventListener(alice.prefixJS+'AnimationEnd', 
            function(){ 
                AniElems = alice.elements(elems);
                for(i = 0; i < AniElems.length; i++){   
                    //we may need something here to tell the browser to remember the style in case they want the animation to start again
                    document.getElementById(AniElems[i].getAttribute('id')).removeAttribute('style');
                }
            }, false);
    },
    // Removes the animated elements from the DOM completely.
    removeElems: function(elems){
        "use strict";
        var ob, AniObj;
        document.addEventListener(alice.prefixJS+'AnimationEnd', 
            function(){ 
                AniObj = alice.elements(elems);    
                for(ob = 0; ob < AniObj.length; ob++){
                    var animationElement = document.getElementById(AniObj[ob].getAttribute('id')); 
                    animationElement.parentNode.removeChild(animationElement);
                }
            }, false);
    }
};

/* 
 * Main Function
 */
var alicejs = alice.init();
//----------------------------------------------------------------------------/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

/* ===========================================================================
 * alice.plugins.cheshire.js
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
 * cheshire performs the actual build of the animation
 * [cheshire description]
 * @param  {[type]} params [description]
 * @return {[type]}
 */
alice.plugins.cheshire = function (params) {
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

        cleanUp = params.cleanUp || 'partial',

        // temporary variables
        calc = {}, container, elems, elem, i, animId, css, transformStart, transformOver, transformEnd, boxShadowStart, boxShadowEnd, dir, size, shadowSize;

    // needs to be an option in the fx elements
    if(params.cleanUp === 'partial'){
        alice.cleaner.removeAni(params.elems);
    }else if(params.cleanUp === 'total'){
        alice.cleaner.removeElems(params.elems);
    }

    // Set the elements using our means of grabbing elements
    elems = alice.elements(params.elems);

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
};

//---[ Shortcut Methods ]-----------------------------------------------------

/*
 * CSS Syntax:
 *     animation: name duration timing-function delay iteration-count direction;
 *
 * Parameter Syntax:
 *     elems, <options>, duration, timing, delay, iteration, direction, playstate
 */

/**
 * [bounce description]
 * @param  {[type]} scale     [description]
 * @param  {[type]} shadow    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.bounce = function (params) {
    "use strict";
    console.info("bounce: ", arguments);

    if(!params){ params = ''; }

    var scaleObj = {from: "100%", to: "150%"}; // default
    if (params.scale) {
        if (typeof params.scale === "object") {
            scaleObj = params.scale;
        }
        else {
            scaleObj.to = params.scale;
        }
    }

    var opts = {
        elems: params.elems || alice.anima,

        scale: scaleObj,
        shadow: params.shadow || true,

        duration: params.duration || "750ms",
        timing: params.timing || "easeOutSine",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [dance description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.dance = function (params) {
    "use strict";
    console.info("dance: ", arguments);

     if(!params){ params = ''; }

    var opts = {

        elems: params.elems || alice.anima,

        rotate: params.rotate || 45,

        duration: params.duration || "750ms",
        timing: params.timing || "easeInOutBack",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [drain description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.drain = function (params) {
    "use strict";
    console.info("drain: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        scale: (params.fade === "in") ? {from: "0%", to: "100%"} : {from: "100%", to: "0%"},

        elems: params.elems || alice.anima,

        //fade: params.fade || "out",
        rotate: params.rotate || -2880,

        duration: params.duration || "4500ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [fade description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.fade = function (params) {
    "use strict";
    console.info("fade: ", arguments);

    if(!params){ params = ''; }

    var opts = {

        elems: params.elems || alice.anima,

        fade: params.fade || "in",

        duration: params.duration || "4500ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [hinge description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.hinge = function (params) {
    "use strict";
    console.info("hinge: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        perspectiveOrigin: "top-left",

        elems: params.elems || alice.anima,

        rotate: params.rotate || 25,
        overshoot: params.overshoot || 0,

        duration: params.duration || "1000ms",
        timing: params.timing || "linear",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [pageFlip description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} turns     [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.pageFlip = function (params) {
    "use strict";
    console.info("pageFlip: ", arguments);

    if(!params){ params = ''; }

    var perspectiveOrigin = "";

    switch (params.flipDirection) {
    case "right":
        perspectiveOrigin = "right";
        break;
    case "up":
        perspectiveOrigin = "top";
        break;
    case "down":
        perspectiveOrigin = "bottom";
        break;
    }

    var opts = {
        perspectiveOrigin: perspectiveOrigin || 'left',

        elems: params.elems || alice.anima,

        flip: params.flipDirection || "left",
        turns: params.turns || 1,
        overshoot: params.overshoot || 0,

        duration: params.duration || "2000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 'infinite',
        direction: params.direction || 'normal',
        playstate: params.playstate || 'running'
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [pendulum description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.pendulum = function (params) {
    "use strict";
    console.info("pendulum: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        perspectiveOrigin: "top",

        elems: params.elems || alice.anima,

        rotate: params.rotate || 45,
        overshoot: params.overshoot || 0,

        duration: params.duration || "2000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [phantomZone description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.phantomZone = function (params) {
    "use strict";
    console.info("phantomZone: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        scale: (params.fade === "in") ? {from: "1%", to: "100%"} : {from: "100%", to: "1%"},

        elems: params.elems || alice.anima,

        //fade: params.fade || "out", //blocked this out due to a problem with Chrome 21
        rotate: params.rotate || -720,
        flip: params.flip || "left",

        duration: params.duration || "5000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [raceFlag description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} rotate            [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} direction         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.raceFlag = function (params) {
    "use strict";
    console.info("raceFlag: ", arguments);

    if(!params){ params = ''; } 

    var opts = {
        flip: "down",

        elems: params.elems || alice.anima,

        rotate: params.rotate || -720,
        perspectiveOrigin: params.perspectiveOrigin || "top-right",

        duration: params.duration || "3000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [slide description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} move      [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.slide = function (params) {
    "use strict";
    console.info("slide: ", arguments);

    if(!params){ params = ''; } 

    var opts = {
        elems: params.elems || alice.anima,

        move: params.move || 'left',
        overshoot: params.overshoot || '0',

        duration: params.duration || '4000ms',
        timing: params.timing || "ease-in-out",
        delay: params.delay || '0ms',
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [spin description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} turns     [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.spin = function (params) {
    "use strict";
    console.info("spin: ", arguments);

    if(!params){ params = ''; } 

    var opts = {
        perspectiveOrigin: "center",
        direction: "normal",

        elems: params.elems || alice.anima,

        flip: params.flip || "left",
        turns: params.turns || 1,
        overshoot: params.overshoot || 0,

        duration: params.duration || "1200ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [toss description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} move              [description]
 * @param  {[type]} overshoot         [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} direction         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.toss = function (params) {
    "use strict";
    console.info("toss: ", arguments);

    if(!params){ params = ''; } 

    var opts = {
        rotate: (params.move === "left" || params.move === "down") ? 720 : -720,
        //fade: "in",

        elems: params.elems || alice.anima,

        move: params.move || "right",
        overshoot: params.overshoot || 0,
        perspectiveOrigin: params.perspectiveOrigin || "center",

        duration: params.duration || "2500ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [twirl description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.twirl = function (params) {
    "use strict";
    console.info("twirl: ", arguments);

    if(!params){params = '';}

    var opts = {
        rotate: (params.flip === "left") ? -135 : 135,

        elems: params.elems || alice.anima,

        flip: params.flip || "left",

        duration: params.duration || "3000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [wobble description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} rotate            [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.wobble = function (params) {
    "use strict";
    console.info("wobble: ", arguments);

    if(!params){params = '';}

    var opts = {
        elems: params.elems || alice.anima,

        rotate: params.rotate || 5,
        perspectiveOrigin: params.perspectiveOrigin || "center",

        duration: params.duration || "200ms",
        timing: params.timing || "linear",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: "alternate",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [zoom description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} scale     [description]
 * @param  {[type]} shadow    [description]
 * @param  {[type]} move      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.zoom = function (params) {
    "use strict";
    console.info("zoom: ", arguments);

    if(!params){params = '';}

    var scaleObj = {from: "1%", to: "125%"}; // default
    if (params.scale) {
        if (typeof params.scale === "object") {
            scaleObj = params.scale;
            //scaleObj = {from: alice.percentage(params.scale.from), to: alice.percentage(params.scale.to)};
        }
        else {
            scaleObj.to = scale;
        }
    }

    var opts = {
        elems: params.elems || alice.anima,

        scale: scaleObj,
        shadow: params.shadow || true,

        move: params.move || "none",

        duration: params.duration || "2000ms",
        timing: params.timing || "ease",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

//----------------------------------------------------------------------------

/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

/* ===========================================================================
 * alice.plugins.caterpillar.js
 * 
 * @author Matt Lantz @Mattylantz
 * ===========================================================================
 *
 * Copyright 2012 Research In Motion Limited.
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
 * caterpillar performs the actual build of the animation
 * [caterpillar description]
 * @param  {[type]} params [description]
 * @return {[type]}
 */

alice.plugins.caterpillar = (function () {
    "use strict";

    var core = {
        
        docWidth: function(){ var width = document.body.clientWidth; return width; },   // get the screen width
        docHeight: alice.docHeight(),                                                   // get the screen height
        
        _rot270: '(262deg)',
        _rot180: '(180deg)',
        _rot90: '(90deg)',
        _rot0: '(0deg)',
        _rotNeg90: '(-90deg)',
        _rotNeg180: '(-180deg)',
        _rotNeg270: '(-262deg)',
        originZero: '',             

        onPageTrigger: '',

        helper: {

            getThisId: function(pageId){
            "use strict";
                var page = pageId.substring((pageId.indexOf('_')+1), pageId.length);
                    page = parseInt(page, 10);
                    return page;
            },

            setAnimationDefaults: function(page, mySpeed){
                page.style[alice.prefixJS+'AnimationDuration'] = mySpeed;  
                page.style[alice.prefixJS+'AnimationFillMode'] = "forwards";                                
                page.style[alice.prefixJS+'AnimationPlayState'] = "running";                                
                page.style[alice.prefixJS+'AnimationDirection'] = 'normal';                                 
                page.style[alice.prefixJS+'AnimationTimingFunction'] = "linear";                            
                page.style.display = 'block';
            },

            findCSSRule: function(selector) {
                var numOfSheets, s, mySheet, i, bW, bH, theRules;
                numOfSheets = document.styleSheets.length;
                for(s = 0; s < numOfSheets; s++){
                    mySheet = document.styleSheets[s]; 
                    if (mySheet.rules) {
                        theRules = mySheet.rules;
                    } else {
                        theRules = mySheet.cssRules;
                    }
                    theRules = mySheet.cssRules ? mySheet.cssRules : mySheet.rules;
                    for (i=0; i<theRules.length; i++) { 
                        if (theRules[i].selectorText == selector) { 
                            bW = theRules[i].style.width.toString(); 
                            bH = theRules[i].style.height.toString();
                            return [bW, bH];
                        }
                    }
                }
            }, 

            piggyback: function(id, type, pageName, book, speed, transformOrigin, binding, transformRotate, realPageCount, piggyBg){
            "use strict";
                if(id === 0){
                    id = realPageCount;
                }
                var mybook = document.getElementById(book),
                    myPageStyle = document.getElementById(pageName+id).style,
                    aniName = (type === "standard") ? pageName+"abstrPageTurnF" : pageName+"abstrPageReTurnF",
                    numZ = "0",
                    piggy = document.createElement('div'); 
                    
                    piggy.setAttribute("style", myPageStyle);
                    piggy.setAttribute('id', '_piggy');  
                    piggy.setAttribute('class', document.getElementById(pageName+id).getAttribute('class'));
                    piggy.style[alice.prefix+'backfaceVisibility'] = 'visible';
                    piggy.style.width = mybook.style.width;
                    piggy.style.height = mybook.style.height;
                    piggy.style.position = 'absolute';
                    piggy.style.background = piggyBg || '#222';
                    piggy.style.top = '0px';
                    piggy.style.left = '0px';
                    if(type === "advanced"){
                        var rotAngle;
                        rotAngle = core._rot270;
                        switch (binding){
                            case "left":
                                rotAngle = core._rotNeg270;
                                break;
                            case "bottom":
                                rotAngle = core._rotNeg270;
                                break;
                        }
                        piggy.style[alice.prefixJS+'Transform'] = transformRotate+rotAngle;
                    }
                    piggy.style.zIndex = numZ;
                    piggy.style[alice.prefixJS+'AnimationName'] = aniName;
                    piggy.style[alice.prefixJS+'TransformOrigin'] = transformOrigin;
                    piggy.style[alice.prefixJS+'AnimationDuration'] = speed;
                    piggy.style[alice.prefixJS+'AnimationFillMode'] = "forwards"; 
                    piggy.style[alice.prefixJS+'AnimationPlayState'] = "running";
                    piggy.style[alice.prefixJS+'AnimationDirection'] = 'normal';
                    piggy.style[alice.prefixJS+'AnimationTimingFunction'] = "linear";
                    piggy.style.display = 'block';
                    mybook.appendChild(piggy);
            }
        },

        AnimGenerator: function(params){
            var abstrPageReTurnR, abstrPageReTurnF, abstrPageTurnR, abstrPageTurnF, 
                oddPageTurnF, oddPageTurnR, evenPageTurnF, evenPageTurnR;
            var tranRot90, tranRot270, tranRotNeg270, tranRotNeg90, tranRot0, 
                originL, originM, originR, 
                Szero, Sfifty, Shundred, SfiftyRev, ShundredRev, 
                oddPageF, oddPageR, evenPageF, evenPageR, 
                abstrPageF, abstrPageR, abstrPageReF, abstrPageReR,
                closure;

            // transforms
            tranRot90 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rot90+';';
            tranRot270 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rot270+';';
            tranRotNeg270 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rotNeg270+';';
            tranRotNeg90 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rotNeg90+';';
            tranRot0 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rot0+';';

            //transform-origins
            originL = '\n\t'+alice.prefix+'transform-origin: '+params.originZero+';';
            originM = '\n\t'+alice.prefix+'transform-origin: 50% 50%;';
            originR = '\n\t'+alice.prefix+'transform-origin: '+params.transformOrigin+';';

            //Shadows
            Szero = '\t0%{'+alice.prefix+'box-shadow:'+params.shadowPattern0+';';
            Sfifty = '\t50%{'+alice.prefix+'box-shadow:'+params.shadowPattern50+';';
            Shundred = '\t100%{'+alice.prefix+'box-shadow:'+params.shadowPattern100+';';
            SfiftyRev = '50%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev50+';'+'\n';
            ShundredRev = '100%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev100+';'+'\n';

            //Keyframe titles
            oddPageF = '@'+alice.prefix+'keyframes '+params.bookName+'p_oddPageTurnF{\n';
            oddPageR = '@'+alice.prefix+'keyframes '+params.bookName+'p_oddPageTurnR{\n';
            evenPageF = '@'+alice.prefix+'keyframes '+params.bookName+'p_evenPageTurnF{\n';
            evenPageR = '@'+alice.prefix+'keyframes '+params.bookName+'p_evenPageTurnR{\n';
            abstrPageF = '@'+alice.prefix+'keyframes '+params.bookName+'p_abstrPageTurnF{\n';
            abstrPageR = '@'+alice.prefix+'keyframes '+params.bookName+'p_abstrPageTurnR{\n';
            abstrPageReF = '@'+alice.prefix+'keyframes '+params.bookName+'p_abstrPageReTurnF{\n';
            abstrPageReR = '@'+alice.prefix+'keyframes '+params.bookName+'p_abstrPageReTurnR{\n';

            closure = '}\n';

            // For single paging
            if(params.paging === 'single'){
                if(params.binding === 'left'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(params.binding === 'right'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                if(params.binding === 'top'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(params.binding === 'bottom'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                // Abstract bindings
                if(params.binding === 'center'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originM+tranRotNeg90+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originM+tranRot90+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                }
                if(params.binding === 'middle'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originM+tranRotNeg90+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originM+tranRot90+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                }

                // Insert the keyframes!
                alice.keyframeInsert(abstrPageTurnF);
                alice.keyframeInsert(abstrPageTurnR);
                alice.keyframeInsert(abstrPageReTurnF);
                alice.keyframeInsert(abstrPageReTurnR);
            }

            if(params.paging === 'double'){
                //vertical axis
                if(params.binding === 'left'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRot90+closure+'\n'+closure;
                }
                if(params.binding === 'right'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originL+tranRotNeg90+closure+'\n'+closure;
                }
                //horizontal axis
                if(params.binding === 'top'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRotNeg90+closure+'\n'+closure;
                }
                if(params.binding === 'bottom'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRotNeg90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originL+tranRot90+closure+'\n'+closure;
                }

                //Insert the keyframes!
                alice.keyframeInsert(oddPageTurnF);
                alice.keyframeInsert(oddPageTurnR);
                alice.keyframeInsert(evenPageTurnF);
                alice.keyframeInsert(evenPageTurnR);
            }
        },

        clearSinglePages: function (id, dir, pageName, mybook, params, doNotHide) { 
            var nextpage, prepage, piggyPapa,
                idNum = core.helper.getThisId(id),
                page = document.getElementById(id);

            if(document.getElementById("_piggy")){
                piggyPapa = document.getElementById("_piggy").parentNode;
                piggyPapa.removeChild(document.getElementById("_piggy"));
                document.getElementById(params.bookName).setAttribute("data-state", "paused");
            }

            // Simple blanks for replacing
            page.style[alice.prefixJS + "Animation"] = '';
            page.style[alice.prefixJS + "AnimationDelay"] = "";
            page.style[alice.prefixJS + "AnimationDuration"] = "";
            page.style[alice.prefixJS + "AnimationTimingFunction"] = "";
            page.style[alice.prefixJS + "AnimationIterationCount"] = "";
            page.style[alice.prefixJS + "AnimationDirection"] = "";
            page.style[alice.prefixJS + "AnimationPlayState"] = "";

            // determine page display
            if(params.binding === 'center' || params.binding === 'middle'){
                if(!doNotHide){ page.style.display = 'none'; }
            }else if(params.binding === 'left' || params.binding === 'top' || params.binding === 'right' || params.binding === 'bottom'){
                page.style.display = 'none';
            }

            // First by default
            prepage = document.getElementById(pageName+(parseInt(idNum, 10)-1));
            nextpage = document.getElementById(pageName+(parseInt(idNum, 10)+1));
            if(idNum === params.realPageCount){ 
                nextpage = document.getElementById(pageName+'1'); 
            }
            page.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[0];
            page.style.zIndex = '0';
            
            if(dir === 'forwards'){
                 if(idNum === 1 ){
                    prepage = document.getElementById(pageName+params.realPageCount);
                }
                else if(idNum > 1){
                    if(params.binding === 'left' || params.binding === 'right' || params.binding === 'top' || params.binding === 'bottom'){     
                        nextpage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[0];
                    }
                }
                prepage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[1];
            }
            if(dir === 'reverse'){
                if(idNum > 0){ 
                    if(params.binding === "center" || params.binding === "middle"){   
                        if(params.wrap === true){
                            if(idNum === 1 ){
                                prepage = document.getElementById(pageName+params.realPageCount);
                            }else{
                                prepage = document.getElementById(pageName+(idNum-1));
                            }
                        }else{
                            if(idNum !== 1){
                                prepage = document.getElementById(pageName+(idNum-1)); 
                            }
                        }  
                        prepage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[2];
                    }
                    if(params.wrap === true){
                        if(idNum !== params.realPageCount){
                            nextpage = document.getElementById(pageName+(parseInt(idNum, 10)+1));
                        }
                    }
                    if(params.binding === 'left' || params.binding === 'top' || params.binding === 'right' || params.binding === 'bottom'){
                        nextpage.style.display = 'none';
                        page.style.display = 'block';
                    }

                    nextpage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[2]; 
                }

                if(idNum === 1){
                    prepage = document.getElementById(params.pageName+params.realPageCount);                                                
                    prepage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[2]; 
                    nextpage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[1];  
                }
            } 
        },

        clearDoublePages: function(flipDirection, binding, id, params){
            var flipAngleOdd, flipAngleEven,
                thisPage = document.getElementById(id),
                idNum = core.helper.getThisId(id),
                nextPage = document.getElementById(params.pageName+(parseInt(idNum, 10)+1)),
                basicSettings = 'display: block; left: 0px; top: 0px;'; 

            if(idNum % 2 === 1 ){                                           
                thisPage.setAttribute('style', '');                                                                     
                if(flipDirection === 'forward'){
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;                                                                       
                    flipAngleOdd = params.transformRotate + core._rot90;
                    switch(params.binding){           
                        case "top":                                                                                     
                            thisPage.style.top = params.pageHeight+'px';                                                  
                            break;
                        case "right":  
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin; 
                            break;
                        case "left":
                            flipAngleOdd = params.transformRotate + core._rotNeg90;
                            thisPage.style.left = params.pageWidth+'px';
                            break;
                        case "bottom":
                            flipAngleOdd = params.transformRotate + core._rotNeg90;
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = flipAngleOdd;
                }
                else if(flipDirection === 'reverse'){
                    thisPage.setAttribute('style', basicSettings);
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;
                    switch(params.binding){
                        case "top":
                            thisPage.style.top = params.pageHeight+'px'; 
                            break;
                        case "right":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin; 
                            break;
                        case "left":
                            thisPage.style.left = params.pageWidth+'px';
                            break;
                        case "bottom":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin; 
                            break;
                        default:
                            thisPage.style.top = '0px'; 
                            break;
                    }
                }                                  
            } 
            if(idNum % 2 === 0 ){
                thisPage.setAttribute('style', '');                                                                     
                if(flipDirection === 'forward'){  
                    thisPage.setAttribute('style', basicSettings);  
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;                                                                    
                    switch(params.binding){           
                        case "top":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin;                                                                                     
                            break;
                        case "right":                                                                                    
                            thisPage.style.left = params.pageWidth+'px';
                            break;
                        case "left":   
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin;   
                            thisPage.style.left = '0px';
                            break;
                        case "bottom":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;
                            thisPage.style.top = params.pageHeight+'px'; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = core.transformRotate + core._rot0;
                }
                else if(flipDirection === 'reverse'){
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;
                    flipAngleEven = core.transformRotate + core._rotNeg90;
                    switch(params.binding){
                        case "top":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin;
                            break;
                        case "right": 
                            thisPage.style.left = params.pageWidth+'px';  
                            break;
                        case "bottom":
                            flipAngleEven = params.transformRotate + core._rot90; 
                            thisPage.style.top = params.pageHeight+'px';  
                            break;
                        case "left":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin;
                            flipAngleEven = params.transformRotate + core._rot90;   
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = flipAngleEven;  
                }                                       
            }
            thisPage.style[alice.prefixJS+"boxShadow"] = params.shadowPattern0;
        },

        styleConfig: function(params){
            var page = document.getElementById(params.pageName+params.pageId);
            if(params.paging === 'single'){
                if(params.binding === 'center' || params.binding === 'middle'){
                    page.setAttribute('style', 'display: none; '+
                        alice.prefix+'transform-origin: 50% 50%;'+
                        alice.prefix+'transform: '+ params.transformRotate + core._rot90 +';'+
                        alice.prefix+'box-shadow: '+ params.shadowPattern100 +';');
                }
                if(params.binding === 'left' || params.binding === 'top' || params.binding === 'bottom' || params.binding === 'right'){
                    page.setAttribute('style', 'display: none; '+ 
                        alice.prefix+'transform-origin:'+params.transformOrigin+';'+
                        alice.prefix+'transform: '+ params.transformRotate + core._rot0 +';'+
                        alice.prefix+'box-shadow: '+ params.shadowPattern100 +';');
                }
            }
            if(params.paging === 'double'){
                if(params.binding === 'left'){
                    if(params.pageId % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.originZero;
                        page.style.left = params.pageWidth+'px';
                    }
                    if(params.pageId % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.transformOrigin;
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot90;
                    }
                }
                if(params.binding === 'right'){
                    if(params.pageId % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.transformOrigin;
                    }
                    if(params.pageId % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.originZero;
                        page.style.left = params.pageWidth+'px';
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg90;
                    }
                }
                if(params.binding === 'top'){
                    if(params.pageId % 2 === 1){
                        page.style.top = params.pageHeight+'px';
                        page.style[alice.prefixJS+'TransformOrigin'] = params.originZero;
                    }
                    if(params.pageId % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.transformOrigin;
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg90;
                    }
                }
                if(params.binding === 'bottom'){
                    if(params.pageId % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.transformOrigin;
                    }
                    if(params.pageId % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.originZero;
                        page.style.top = params.pageHeight+'px';
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot90;
                    }
                }
            }
        },

        init: function(params){
            var config = {}, bWidth, bHeight, symW, pw, bw, symH, ph, bh, rawPages, rpn, p, leatherCover;

            // Book details 
            config.pages = [];
            config.realPageCount = 0;
            config.speed = alice.duration(params.speed);                                // page turn duration
            config.book = document.getElementById(params.elems);                        // the book
            config.bookName = config.book.id;
            config.timing = core.timing;                                                // the timing of the animation (always linear)
            config.binding = params.binding;                                            // the location of what would be the binding
            config.piggyBg = params.piggyBg;                                            // the background of a single page turn 
            config.originZero = '0 0';                                                  // The default transform origin think top left
            config.pageClass = params.pageClass;                                        // Potential page class the author wants to add
            config.pageName = params.elems+'p_';
            config.paging = params.paging;
            config.randomize = params.randomize;
            config.wrap = params.wrap;
            config.shadow = params.shadow;

            // Configure the book itself
            config.book.setAttribute('data-state', 'paused');
            config.book.setAttribute('data-page-number', "1");
            config.bookSize = core.helper.findCSSRule("#"+config.book.getAttribute('id'));
            if(config.bookSize){
                bWidth = config.bookSize[0];
                bHeight = config.bookSize[1];
            }else{
                bWidth = config.book.style.width;
                bHeight = config.book.style.height;
            }

            if(bWidth.indexOf("%") > 0){                                    // redefine the page width in case of px|%|int 
                symW = "%";
                pw = '0.'+bWidth.substring(0, bWidth.indexOf(symW));
                pw = parseFloat(pw);
                bw = config.docWidth()*pw;
            }
            else if(bWidth.indexOf("px") > 0){
                symW = "px";
                bw = bWidth.substring(0, bWidth.indexOf(symW));
            }
            else{   
                bw = bWidth;
            }
            config.pageWidth = bw; 
            
            if(bHeight.indexOf("%") > 0){                                   // redefine the height in case of px|%|int
                symH = "%";
                ph = '0.'+bHeight.substring(0, bHeight.indexOf(symH));
                ph = parseFloat(ph);
                bh = config.docHeight*ph;
            }
            else if(bHeight.indexOf("px") > 0){ 
                symH = "px";
                bh = bHeight.substring(0, bHeight.indexOf(symH));
            }
            else{
                bh = bHeight;
            }
            config.pageHeight = bh;

            // Configure the perspective depth [ there was no science used in the formulating of this. ]
            config.goggles = Math.floor(config.pageWidth*4);
            
            //Set the shadows
            if(config.shadow === true){
                config.shadowPattern0 = '0px 0px 14px rgba(0, 0, 0, 0.1)';
                config.shadowPattern50 = '10px 0px 14px rgba(0, 0, 0, 0.3)';
                config.shadowPattern100 = '0px 0px 14px rgba(0, 0, 0, 0.3)';
                config.shadowPatternRev50 = '-10px 0px 14px rgba(0, 0, 0, 0.3)';
                config.shadowPatternRev100 = '0px 0px 14px rgba(0, 0, 0, 0.1)';
                if(config.binding === "center" || config.binding === "middle"){
                    config.shadowPattern50 = '0px 0px 14px rgba(0, 0, 0, 0.3)';
                }
            }else{
                config.shadowPattern0 = '0px 0px 0px rgba(0, 0, 0, 0)';
                config.shadowPattern50 = '0px 0px 0px rgba(0, 0, 0, 0)';
                config.shadowPattern100 = '0px 0px 0px rgba(0, 0, 0, 0)';
                config.shadowPatternRev50 = '0px 0px 0px rgba(0, 0, 0, 0)';
                config.shadowPatternRev100 = '0px 0px 0px rgba(0, 0, 0, 0)';
            }

            // create a new class
            config.NewPageClass = params.elems+ new Date().getTime();

            // Configure animation parts for silly Mozilla
            core.animationEnd = alice.prefixJS+'AnimationEnd';
            if(alice.prefixJS === 'Moz'){                         
                core.animationEnd = 'animationend';                
            }

            // Set the array of pages for the book
            rawPages = config.book.childNodes;  
            rpn = 0;  
            for(p = 0; p < rawPages.length; p++){
                if(rawPages[p].nodeType === 1){ 
                    if(rawPages[p].tagName === "DIV" || rawPages[p].tagName === "div"){                         
                        config.pages[rpn] = rawPages[p]; 
                        config.realPageCount = config.realPageCount+1; 
                        rpn++;   
                    }
                    else{
                        console.error("Your pages must be all be the DIV tag element. Please place the contents inside.");  
                        return false;  
                    }
                }
            }

            // Fashion me a book!
            config.book.style[alice.prefixJS+'Perspective'] = config.goggles+'px'; 
            config.book.style.zIndex = '1000';    
            config.book.style.position = 'relative';  
            config.binding = params.binding;   

            // set the transform axis
            if(params.binding === 'center' || params.binding === 'left' || params.binding === 'right'){         // For the Y axis
                config.transformRotate = 'rotateY';                                   
            }
            if(params.binding === 'middle' || params.binding === 'top' || params.binding === 'bottom'){         // For the X axis
                config.transformRotate = 'rotateX';
            }

            // If single paging we need a small book
            if(params.paging === 'single'){
                config.book.style.width = config.pageWidth+'px';  
                config.book.style.height = config.pageHeight+'px'; 
            }

            //If double paging we need a big book
            else if(params.paging === 'double'){
                if(params.binding === 'left' || params.binding === 'right'){        // wide book with normal height
                    config.book.style.width = (config.pageWidth * 2)+'px';              // set width
                    config.book.style.height = config.pageHeight+'px';                  // set height
                }
                else if(params.binding === 'top' || params.binding === 'bottom'){   // tall book with normal width
                    config.book.style.width = config.pageWidth+'px';                    // set width
                    config.book.style.height = (config.pageHeight * 2)+'px';            // set height
                }
            }  

            // Set the details per binding
            if(params.paging === 'single'){
                config.transformDegrees = [core._rot0, core._rot0, core._rot0]; //0, 0, 0
                switch(params.binding){
                    case "center":
                        config.transformDegrees = [core._rot0, core._rot90, core._rotNeg90]; //0, 90, -90
                        config.transformOrigin = '50% 50%';
                        break;
                    case "middle":
                        config.transformDegrees = [core._rot0, core._rot90, core._rotNeg90]; //0, 90, -90
                        config.transformOrigin = '50% 50%';
                        break;
                    case "left":
                        config.transformOrigin = config.originZero;
                        break;
                    case "top":
                        config.transformOrigin = config.originZero;
                        break;
                    case "right":
                        config.transformOrigin = config.pageWidth+'px 0px';
                        break;
                    case "bottom":
                        config.transformDegrees = [core._rot0, core._rot0, core._rotNeg270]; //0, 0, 0
                        config.transformOrigin = '0px '+pageHeight+'px';
                        break;
                }
            }

            if(config.paging === 'double'){
                switch(params.binding){
                    case "left":
                        config.transformOrigin = config.pageWidth+'px 0px';
                        break;
                    case "right":
                        config.transformOrigin = config.pageWidth+'px 0px';
                        break;
                    case "top":
                        config.transformOrigin = '0px '+config.pageHeight+'px';
                        break;
                    case "bottom":
                        config.transformOrigin = '0px '+config.pageHeight+'px';
                        break;
                }
                config.transformDegrees = [core._rot0, core._rot0]; //0, 0, 0
            }

            config.pageClass = config.pageClass;

            core.onPageTrigger = document.createEvent("Event");
            core.onPageTrigger.initEvent("onPageTrigger", true, true);

            core.AnimGenerator(config);  
            core.pageBuilder(config);

            leatherCover = {
                bookName: config.book.id,
                realPageCount: config.realPageCount,
                book: document.getElementById(config.bookName),
                pageNumber: (function(){ return parseInt(document.getElementById(config.bookName).getAttribute('data-page-number'), 10) }),
                nxtPage: function(){
                    var pageNum, dets, runState;
                    pageNum = this.pageNumber();

                    if(config.paging === "single"){
                        if(pageNum < 1){
                            pageNum = 1;
                        }
                    }
                    if(config.paging === "double"){
                        if(pageNum === 0){
                            document.getElementById(config.bookName).setAttribute('data-page-number', "1");
                            pageNum = this.pageNumber();
                        }
                        if(pageNum % 2 !== 1){
                            pageNum++;
                        }
                    }

                    dets = {    
                        pageId: pageNum,
                        pageName: config.pageName, 
                        bookName: config.bookName, 
                        binding: config.binding, 
                        wrap: config.wrap, 
                        speed: config.speed, 
                        randomizer: config.randomize, 
                        transformOrigin: config.transformOrigin, 
                        paging: config.paging, 
                        realPageCount: config.realPageCount,
                        piggyBg: config.piggyBg
                    };

                    runState = document.getElementById(config.bookName).getAttribute('data-state');

                    if(config.paging === "single"){
                        if(config.binding !== "center" && config.binding !== "middle"){    
                            if(pageNum === config.realPageCount && config.wrap === true){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurn(dets); 
                                    document.getElementById(config.bookName).setAttribute('data-page-number', "1");
                                }    
                            }
                            else if(pageNum < config.realPageCount){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurn(dets);
                                    document.getElementById(config.bookName).setAttribute('data-page-number', (pageNum+1)); 
                                }  
                            } 
                        }else{    
                            if(pageNum === config.realPageCount && config.wrap === true){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurn(dets); 
                                    document.getElementById(config.bookName).setAttribute('data-page-number', "1"); 
                                }
                            }
                            else if(pageNum < config.realPageCount){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurn(dets); 
                                    document.getElementById(config.bookName).setAttribute('data-page-number', (pageNum+1));
                                } 
                            }
                        }
                    }else{
                        if( document.getElementById(config.bookName).getAttribute('data-page-number') < config.realPageCount ){
                            if(runState === "paused"){ 
                                alice.plugins.caterpillar.turnPage(dets); 
                                document.getElementById(config.bookName).setAttribute('data-page-number', (pageNum+2)); 
                            }
                        } 
                        if( document.getElementById(config.bookName).getAttribute('data-page-number') >= config.realPageCount ){
                            document.getElementById(config.bookName).setAttribute('data-page-number', config.realPageCount);    
                        }
                    }
                    document.getElementById(config.bookName).dispatchEvent(core.onPageTrigger);
                },
                prePage: function(){
                    var pageNum, dets, runState;

                    if(config.paging === "single"){
                        pageNum = (this.pageNumber()-1);
                    }else{
                        pageNum = this.pageNumber();
                    }

                    if(config.paging === "double"){
                        if(pageNum % 2 !== 0 ){
                            pageNum--;
                        }
                    }

                    dets = {    
                        pageId: pageNum,
                        pageName: config.pageName, 
                        bookName: config.bookName, 
                        binding: config.binding, 
                        wrap: config.wrap, 
                        speed: config.speed, 
                        randomizer: config.randomize, 
                        transformOrigin: config.transformOrigin, 
                        paging: config.paging, 
                        realPageCount: config.realPageCount,
                        transformRotate: config.transformRotate,
                        originZero: config.originZero
                    };

                    runState = document.getElementById(config.bookName).getAttribute('data-state');

                    if(config.paging === "single"){
                        if(config.binding !== "center" && config.binding !== "middle"){
                            if(config.wrap === true){
                                if(pageNum === 0){
                                    if(runState === "paused"){     
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', config.realPageCount); 
                                    }
                                }else{
                                    if(runState === "paused"){     
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', pageNum); 
                                    } 
                                }
                            }else{
                                if(pageNum === 1){
                                    if(runState === "paused"){     
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', 1);
                                    }
                                }else{    
                                    if(runState === "paused"){   
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', pageNum); 
                                    } 
                                }
                            }
                        }else{
                            if(pageNum === 0 && config.wrap === true){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurnR(dets);
                                    document.getElementById(config.bookName).setAttribute('data-page-number', config.realPageCount); 
                                }
                            }else{
                                if(pageNum > 1){
                                    if(runState === "paused"){ 
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', pageNum); 
                                    }
                                }else{
                                    if(runState === "paused"){ 
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', 1); 
                                    }
                                }
                            }
                        }
                    }else{
                        if(pageNum !== 0){
                            if(runState === "paused"){ 
                                alice.plugins.caterpillar.turnPage(dets); 
                                document.getElementById(config.bookName).setAttribute('data-page-number', (pageNum-=2));
                                if(pageNum === 0){
                                    document.getElementById(config.bookName).setAttribute('data-page-number', "1");    
                                } 
                            }   
                        }else{
                            document.getElementById(config.bookName).setAttribute('data-page-number', "1");
                        }
                    }
                    document.getElementById(config.bookName).dispatchEvent(core.onPageTrigger);
                },
                appendPages: function(divId){
                    var realBook = document.getElementById(config.bookName),
                        realBookPages = config.realPageCount,
                        paging = config.paging,
                        realPageOne = document.getElementById(config.bookName+"p_1"),
                        realPageTwo = document.getElementById(config.bookName+"p_2"),
                        xPages = document.getElementById(divId).childNodes,
                        _rpn = (config.realPageCount+1),
                        _newPageArray = [];

                    
                    for(var p = 0; p < xPages.length; p++){
                        if(xPages[p].nodeType === 1){ 
                            if(xPages[p].tagName === "DIV" || xPages[p].tagName === "div"){ 

                                // Odd Pages
                                if(_rpn % 2 === 1){
                                    var pageToCopy = (paging === "single")? realPageTwo : realPageOne;
                                    xPages[p].setAttribute("style", pageToCopy.getAttribute("style"));
                                }
                                //Even Pages
                                if(_rpn % 2 === 0){
                                    xPages[p].setAttribute("style", realPageTwo.getAttribute("style"));
                                }

                                xPages[p].style.display = "none";
                                xPages[p].setAttribute("class", realPageOne.getAttribute("class"));
                                xPages[p].setAttribute("id", config.pageName+_rpn);

                                core.eventListenerFunc(_rpn, config);

                                realBook.appendChild(xPages[p]);
                                 
                                config.realPageCount = config.realPageCount+1;   
                                _rpn++;                                                                                       
                            }
                        }
                    }
                }
            }
            return leatherCover;
        },

        eventListenerFunc: function(idNum, params){
            var page = document.getElementById(params.pageName+idNum);

            page.addEventListener(core.animationEnd, function(){

                // Single Paged
                if(params.paging === "single"){
                    var pageId = params.pageName+idNum;

                    if(this.style[alice.prefixJS+'AnimationName'] === params.pageName+'abstrPageTurnF'){
                        if(params.binding === 'center' || params.binding === 'middle'){
                            alice.plugins.caterpillar.abstrPageFlip(pageId, 'forwards', params.bookName, params);
                        }
                        core.clearSinglePages(pageId, 'forwards', params.pageName, params.bookName, params);
                    }
                    if(this.style[alice.prefixJS+'AnimationName'] === params.pageName+'abstrPageReTurnF'){ 
                        if(params.binding === 'center' || params.binding === 'middle'){
                            alice.plugins.caterpillar.abstrPageFlip(pageId, 'reverse', params.bookName, params);
                        }
                        core.clearSinglePages(pageId, 'reverse', params.pageName, params.bookName, params);
                    }
                }

                // Double Paged
                if(params.paging === "double"){
                    
                    if(this.style[alice.prefixJS+'AnimationName'] === params.bookName+'p_oddPageTurnF'){
                        core.turnNextPage(this.getAttribute('id'), 'odd', params.bookName, params);
                        core.clearDoublePages('forward', params.binding, this.getAttribute('id'), params);
                    }   
                    
                    if(this.style[alice.prefixJS+'AnimationName'] === params.bookName+'p_oddPageTurnR'){
                        core.clearDoublePages('reverse', core.binding, this.getAttribute('id'), params);
                        document.getElementById(params.bookName).setAttribute("data-state", "paused");  

                        var nxtId = core.helper.getThisId(this.getAttribute('id'));
                        nxtId = parseInt(nxtId, 10)+2;
                        if(nxtId < params.realPageCount+1){
                            document.getElementById(params.pageName+nxtId).style.display = 'none';    
                        }
                    } 
                    
                    if(this.style[alice.prefixJS+'AnimationName'] === params.bookName+'p_evenPageTurnF'){   
                        core.clearDoublePages('forward', params.binding, this.getAttribute('id'), params);
                        document.getElementById(params.bookName).setAttribute("data-state", "paused");    
                    }
                    
                    if(this.style[alice.prefixJS+'AnimationName'] === params.bookName+'p_evenPageTurnR'){    
                        core.turnNextPage(this.getAttribute('id'), 'even', params.bookName, params);
                        core.clearDoublePages('reverse', params.binding, this.getAttribute('id'), params);
                    }
                }

            }, false);
        },

        pageBuilder: function(params){
            var pageClassName = params.pages[0].getAttribute('class');
            var currentPageClass = pageClassName + ' ' + params.pageClass;
            
            var bookClass = '.'+params.NewPageClass+
                            '{ display: none; '+
                            alice.prefix+'box-shadow: '+ params.shadowPattern100 +';'+
                            alice.prefix+'backface-visibility: hidden;' +
                            'width: '+params.pageWidth+"px;"+
                            'height: '+params.pageHeight+"px;"+
                            'position: absolute;'+
                            'border: none;' +
                            'left: 0px;'+
                            'top: 0px;'+
                            'z-index: 0;'+ 
                            'overflow: hidden;'+
                            '}';

            // insert the new class
            alice.keyframeInsert(bookClass);

            //==================================================================================
            // Initial Page Setup
            
            var f = 1, pageId, b;
            for(b = 0; b < params.pages.length; b++){
                params.pages[b].setAttribute('id', params.pageName+f);
                params.pages[b].setAttribute('class', currentPageClass + ' ' +params.NewPageClass);

                core.eventListenerFunc(f, params);
                
                core.styleConfig({ 
                        pageId: f, 
                        pageName: params.pageName, 
                        binding: params.binding, 
                        paging: params.paging, 
                        bookName: params.bookName,
                        pageWidth: params.pageWidth,
                        pageHeight: params.pageHeight, 
                        speed: params.speed, 
                        randomizer: params.randomize, 
                        transformOrigin: params.transformOrigin,
                        transformRotate: params.transformRotate,
                        originZero: params.originZero
                    });     


                if(params.paging === 'single'){ 
                    if(f === 1){
                        params.pages[b].style.display = 'block';
                        params.pages[b].setAttribute('style', 'display: block; z-index: 1;'+
                        alice.prefix+'transform-origin:'+params.transformOrigin+';'+
                        alice.prefix+'transform: '+ params.transformRotate + core._rot0 +';' +
                        alice.prefix+'box-shadow: '+ params.shadowPatternRev100 +';');
                    }
                }else if(params.paging === "double"){
                    if(f === 1){ 
                        params.pages[b].style.display = 'block';
                        params.pages[b].style[alice.prefixJS+'BoxShadow'] = params.shadowPattern100+';';
                    } 
                }

            f++;
            
            }

            return core;
        },

        abstrPageFlip: function(id, dir, bookName, params){    
            var idNum, ani, pageId, page, mySpeed;
            if(dir === 'forwards'){
                idNum = core.helper.getThisId(id)+1;
                ani = bookName+"p_abstrPageTurnR";
                
                if(idNum === params.realPageCount+1){   
                    idNum = 1; 
                }
            }                                                         
            else if(dir === 'reverse'){
                ani = bookName+"p_abstrPageReTurnR";
                idNum = core.helper.getThisId(id)-1;          
            }
            if(params.binding === "center" || params.binding === "middle"){
                if(idNum === 0){
                    idNum = params.realPageCount;
                }
            }

            pageId = params.book.querySelector('div:nth-child('+idNum+')').getAttribute('id');
            page = document.getElementById(pageId); 
            page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg90;

            core.styleConfig({ 
                pageId: idNum, 
                pageName: params.pageName, 
                binding: params.binding, 
                paging: params.paging, 
                bookName: params.bookName, 
                wrap: params.wrap, 
                animationRunning: true, 
                speed: params.speed, 
                randomizer: params.randomize , 
                transformOrigin: params.transformOrigin,
                transformRotate: params.transformRotate
            });   
                                                        
            page.style[alice.prefixJS+'AnimationName'] = ani; 
            mySpeed = alice.randomize(alice.duration(params.speed), params.randomize)+'ms';   
            core.helper.setAnimationDefaults(page, mySpeed);

            page.addEventListener(core.animationEnd, function(){  
                if(page.style[alice.prefixJS+'AnimationName'] === ani){  
                    core.clearSinglePages(pageId, dir, params.pageName, params.bookName, params, "doNotHide");
                    document.getElementById(params.bookName).setAttribute("data-state", "paused");
                }
            }, false);
        },

        abPageTurn: function (params){
            var dataPageNum, page, nxtPageId, nxtPage, mySpeed;
            dataPageNum = (params.pageId >= params.realPageCount)? 1 : (params.pageId+1);
            
            if(document.getElementById(params.bookName).getAttribute("data-state") === "paused"){
                
                if(params.pageId === 0 && params.wrap === true){
                    if(params.binding === 'center' || params.binding === 'middle'){
                        pageId = params.realPageCount;
                    }
                }

                page = document.getElementById(params.pageName+params.pageId), nxtPageId, nxtPage;

                try{
                    if(params.pageId >= params.realPageCount && params.wrap === true){
                        params.pageId = 0;
                    }
                    nxtPage = document.getElementById(params.bookName+"p_"+(params.pageId+1));
                    nxtPage.style.display = 'block'; 
                    if(params.binding === 'center' || params.binding === 'middle'){
                        nxtPage.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot90;   
                    }
                }catch(err){ 
                    if(params.wrap !== true){   
                        console.log("This is the end of the book!");
                        return false;  
                    }
                }

                page.style.zIndex = '100';
                page.style[alice.prefixJS+'AnimationName'] = params.pageName+"abstrPageTurnF";
                document.getElementById(params.bookName).setAttribute("data-state", "running");

                mySpeed = alice.randomize(alice.duration(params.speed), params.randomizer)+'ms';    
                core.helper.setAnimationDefaults(page, mySpeed);

                if(params.binding !== "center" && params.binding !== "middle" ){
                    core.helper.piggyback(params.pageId, "standard", params.pageName, params.bookName, mySpeed, params.transformOrigin, params.binding, params.transformRotate, params.realPageCount, params.piggyBg);
                }
            }
        },

        abPageTurnR: function (params){
            if(document.getElementById(params.bookName).getAttribute("data-state") === "paused"){

                var page, pageTwo, mySpeed;

                if(params.binding === 'center' || params.binding === 'middle'){
                    if(params.pageId !== 0){
                        pageTwo = document.getElementById(params.pageName+params.pageId);
                        pageTwo.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg90;
                        params.pageId++;
                    }
                }

                page = document.getElementById(params.pageName+params.pageId);
                if(params.binding !== "center" && params.binding !== "middle"){
                    if(params.pageId === 0 && params.wrap === true){
                        page = document.getElementById(params.pageName+params.realPageCount);
                        document.getElementById(params.bookName).setAttribute('data-page-number', params.realPageCount); 
                    }
                }else{
                    if(params.pageId === 0 && params.wrap === true){
                        page = document.getElementById(params.pageName+"1"); 
                    }
                }

                try{
                    page.style.zIndex = '10'; 
                }catch(err){
                   if(params.wrap !== true){   
                        console.log("This is the start of the book!");
                        return false; 
                    } 
                }

                switch (params.binding){ 
                    case "left":
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg270;
                        break;
                    case "bottom":
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg270;
                        break;
                    case "top":
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot270;
                        break;
                    case "right": 
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot270;
                        break;
                }

                page.style[alice.prefixJS+'AnimationName'] = params.pageName+"abstrPageReTurnF";
                document.getElementById(params.bookName).setAttribute("data-state", "running");

                mySpeed = alice.randomize(alice.duration(params.speed), params.randomizer)+'ms';                                      
                core.helper.setAnimationDefaults(page, mySpeed);

                if(params.binding !== "center" && params.binding !== "middle" ){
                    core.helper.piggyback(params.pageId, "advanced", params.pageName, params.bookName, mySpeed, params.transformOrigin, params.binding, params.transformRotate, params.realPageCount, params.piggyBg); 
                }
            }
        },

        turnNextPage: function(id, type, bookName, params){                                                  
            var pg, pgId, page, aniName, mySpeed;  

            pg = core.helper.getThisId(id);
            pg = (type === 'odd') ? (pg+1) : (pg-1);                                        
            aniName = (type === 'even') ? bookName+"p_oddPageTurnR" : bookName+"p_evenPageTurnF";     

            pgId = document.getElementById(bookName).querySelector('div:nth-child('+pg+')').getAttribute('id');  
            page = document.getElementById(pgId);
            page.style.zIndex = 1; 

            if(type === 'odd'){
                page.style.display = 'block';
            }
            
            page.style[alice.prefixJS+'AnimationName'] = aniName;
            mySpeed = alice.randomize(alice.duration(params.speed), params.randomize)+'ms';                                     
            core.helper.setAnimationDefaults(page, mySpeed);
        },

        turnPage: function (params){
            if(document.getElementById(params.bookName).getAttribute("data-state") === "paused"){

                var thirdChild, ani, page, pageCounter, nxtNxtPageId, nxtNxtPage, mySpeed;
                
                if(params.pageId % 2 === 1){                               
                    thirdChild = params.pageId + 2;
                    ani = params.bookName+"p_oddPageTurnF";
                }else{                                             
                    thirdChild = params.pageId - 2;
                    ani = params.bookName+"p_evenPageTurnR";
                }

                nxtNxtPageId = document.getElementById(params.bookName).querySelector('div:nth-child('+thirdChild+')');

                if(nxtNxtPageId){                                                                                   
                    nxtNxtPageId = nxtNxtPageId.getAttribute('id');                                                
                    nxtNxtPage = document.getElementById(nxtNxtPageId);
                    nxtNxtPage.style.zIndex = '0';
                    nxtNxtPage.style.display = 'block';
                }

                page = document.getElementById(params.pageName+params.pageId);                                                   
                    page.style.zIndex = '1';                                                                     
                    page.style[alice.prefixJS+'AnimationName'] = ani;
                    document.getElementById(params.bookName).setAttribute("data-state", "running");

                    mySpeed = alice.randomize(alice.duration(params.speed), params.randomizer)+'ms';                                     
                    core.helper.setAnimationDefaults(page, mySpeed);
            }
        }
    };

    return core;

})();

//---[ Shortcut Methods ]-----------------------------------------------------

/*
 * CSS Syntax:
 *     animation: name duration timing-function delay iteration-count direction;
 *
 * Parameter Syntax:
 *     elems, <options>, duration, timing, delay, iteration, direction, playstate
 */

alice.plugins.book = function (params) {
    "use strict";
    console.info("book: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,
        pageClass: params.pageClass || '',     
        
        bookWidth: params.bookWidth || document.getElementById(params.elems || alice.anima).style.width,
        bookHeight: params.bookHeight || document.getElementById(params.elems || alice.anima).style.height,

        shadow: params.shadow || false,
        speed: params.speed || "500ms",

        randomize: params.randomize || '15%',

        binding: params.binding || "left",
        paging: "double"
    };

    console.log(opts);
    return alice.plugins.caterpillar.init(opts);
};

alice.plugins.notebook = function (params) {
    "use strict";
    console.info("notebook: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,
        pageClass: params.pageClass || '',     
        
        bookWidth: params.bookWidth || document.getElementById(params.elems || alice.anima).style.width,
        bookHeight: params.bookHeight || document.getElementById(params.elems || alice.anima).style.height,

        shadow: params.shadow || false,
        speed: params.speed || "500ms",

        randomize: params.randomize || '15%',

        binding: params.binding || "top",
        paging: "single",
        wrap: params.wrap || false,
        piggyBg: params.pageBackground || '#222'
    };

    console.log(opts);
    return alice.plugins.caterpillar.init(opts);
};

alice.plugins.flipbook = function (params) {
    "use strict";
    console.info("flipbook: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,
        pageClass: params.pageClass || '',     
        
        bookWidth: params.bookWidth || document.getElementById(params.elems || alice.anima).style.width,
        bookHeight: params.bookHeight || document.getElementById(params.elems || alice.anima).style.height,

        shadow: params.shadow || false,
        speed: params.speed || "500ms",

        randomize: params.randomize || '15%',

        binding: params.binding || "center",
        paging: "single",
        wrap: params.wrap || false,
    };

    console.log(opts);
    return alice.plugins.caterpillar.init(opts);
};

//----------------------------------------------------------------------------