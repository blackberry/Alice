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
//----------------------------------------------------------------------------