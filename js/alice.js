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
        version: "0.4",
        build: "20120204-1040",

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



alice.plugins.playPause = function() {
    var elms = alice.anima;
    var i, elems = alice.elements(elms),pfx = alice.prefixJS;
    
    for(i = 0; i < elems.length; i++){
    var elemId = elems[i].getAttribute('id');
        if(document.getElementById(elemId).style[pfx + "AnimationPlayState"] === "paused"){
            document.getElementById(elemId).style[pfx + "AnimationPlayState"] = "running";
        }
        else{
            document.getElementById(elemId).style[pfx + "AnimationPlayState"] = "paused";
        }
    }
}

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
            scaleObj = scale;
            //scaleObj = {from: alice.percentage(scale.from), to: alice.percentage(scale.to)};
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
alice.plugins.caterpillar = function () {
    "use strict";

    //console.info("caterpillar", params);
    var core = {
        // Book elements
        pages: [],              // array of divs for pages
        NewPageClass: '',       // our generated page class

        // Page counters
        leftPage: 0,            // current left page
        rightPage: 1,           // current right page
        realPageCount: 0,       // real page count 
        pn: 1,                  // page number tracker
        
        // Page/Book size
        pageWidth: '',          // page width
        pageHeight: '',         // page height
        docWidth: function(){ var width = document.body.clientWidth; return width; },   // get the screen width
        docHeight: alice.docHeight(),                                                   // get the screen height
        
        // Book details
        speed: 0,               // speed of the page turns
        book: '',               // the parent div of the book
        timing: 'linear',       // timing (we have it linear because others make it sloppy)
        binding: '',            // the location of the binding > left|right|top|bottom
        paging: '',             // paging refers to single || double
        controlBoxStyle: '',    // grab the details of the parent div location in order to place the controller bars
        wrap: false,            // the wrap effect of the last page to first and first to last
        piggyBg: null,

        // Transform details
        transformOrigin: '',    // Sets the primary origin of the transform ex.0px 0px Top Left
        transformRotate: '',    // Sets the rotation axis ex. rotateY
        transformDegrees: [],   // Array of the required degrees for the transformations.
        
        // Transform degrees to be used in conjunction with: transformRotate ex. core.transformRotate+core._rot270
        _rot270: '(262deg)',    // Not exactly 270 in order to achieve more elegant flow.
        _rot180: '(180deg)',
        _rot90: '(90deg)',
        _rot0: '(0deg)',
        _rotNeg90: '(-90deg)',
        _rotNeg180: '(-180deg)',
        _rotNeg270: '(-262deg)',    // same offset here.
        originZero: '',             

        // Shadow details in order to add more depth to the transforms.
        shadowPattern0: '',
        shadowPattern50: '',
        shadowPattern100: '',
        shadowPatternRev50: '',
        shadowPatternRev100: '',

        // Events/ Status
        animationStart: '', 
        animationEnd: '',
        animationRunning: false,
        bookStart: '', 
        bookEnd: '',
        pageTrigger: '', 
        loadPage: '',
        jumper: null,
        pageToClear: '',
        pageNumber: '',
        randomizer: '',
        inPageControls: 0,
        keyControls: 0,
        lastPage: null,

        helpers: {},

        AnimGenerator: function(params){
            var abstrPageReTurnR, abstrPageReTurnF, abstrPageTurnR, abstrPageTurnF, oddPageTurnF, oddPageTurnR, evenPageTurnF, evenPageTurnR;
            // transforms
            var tranRot90 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot90+';';
            var tranRot270 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot270+';';
            var tranRotNeg270 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rotNeg270+';';
            var tranRotNeg90 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rotNeg90+';';
            var tranRot0 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot0+';';

            //transform-origins
            var originL = '\n\t'+alice.prefix+'transform-origin: '+core.originZero+';';
            var originM = '\n\t'+alice.prefix+'transform-origin: 50% 50%;';
            var originR = '\n\t'+alice.prefix+'transform-origin: '+core.transformOrigin+';';

            //Shadows
            var Szero = '\t0%{'+alice.prefix+'box-shadow:'+params.shadowPattern0+';';
            var Sfifty = '\t50%{'+alice.prefix+'box-shadow:'+params.shadowPattern50+';';
            var Shundred = '\t100%{'+alice.prefix+'box-shadow:'+params.shadowPattern100+';';
            var SfiftyRev = '50%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev50+';'+'\n';
            var ShundredRev = '100%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev100+';'+'\n';

            //Keyframe titles
            var oddPageF = '@'+alice.prefix+'keyframes oddPageTurnF{\n';                                    // odd page forward
            var oddPageR = '@'+alice.prefix+'keyframes oddPageTurnR{\n';                                    // odd page reverse
            var evenPageF = '@'+alice.prefix+'keyframes evenPageTurnF{\n';                                  // even page forward
            var evenPageR = '@'+alice.prefix+'keyframes evenPageTurnR{\n';                                  // even page reverse
            var abstrPageF = '@'+alice.prefix+'keyframes abstrPageTurnF{\n';                                // abstract page forward [ center || middle ]
            var abstrPageR = '@'+alice.prefix+'keyframes abstrPageTurnR{\n';                                // abstract page reverse [ center || middle ]
            var abstrPageReF = '@'+alice.prefix+'keyframes abstrPageReTurnF{\n';                        // abstract page forward [ top || left || right || bottom ]
            var abstrPageReR = '@'+alice.prefix+'keyframes abstrPageReTurnR{\n';                        // abstract page reverse [ top || left || right || bottom ]

            var closure = '}\n';
            
            // ensure that none of our keyframes exist!
            alice.keyframeDelete("oddPageTurnF");
            alice.keyframeDelete("oddPageTurnR");
            alice.keyframeDelete("evenPageTurnF");
            alice.keyframeDelete("evenPageTurnR");
            alice.keyframeDelete("abstrPageTurnF");
            alice.keyframeDelete("abstrPageTurnR");
            alice.keyframeDelete("abstrPageReTurnF");
            alice.keyframeDelete("abstrPageReTurnR");

            // For single paging
            if(core.paging === 'single'){
                if(core.binding === 'left'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'right'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'top'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'bottom'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                // Abstract bindings
                if(core.binding === 'center'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originM+tranRotNeg90+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originM+tranRot90+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'middle'){
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

            if(core.paging === 'double'){
                //vertical axis
                if(core.binding === 'left'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRot90+closure+'\n'+closure;
                }
                if(core.binding === 'right'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originL+tranRotNeg90+closure+'\n'+closure;
                }
                //horizontal axis
                if(core.binding === 'top'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRotNeg90+closure+'\n'+closure;
                }
                if(core.binding === 'bottom'){
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

        config: function(params){
            // Book details 
            core.speed = alice.duration(params.speed);                              // page turn duration
            core.book = document.getElementById(params.elems || alice.anima);       // the book
            core.timing = params.timing;                                            // the timing of the animation (always linear)
            core.binding = params.binding;                                          // the location of what would be the binding
            core.piggyBg = params.piggyBg;                                          // the background of a single page turn 
            core.controlsBg = params.controlsBg;                                    // the background of the controls
            core.originZero = '0 0';                                                // The default transform origin think top left
            core.pageClass = params.pageClass;                                      // Potential page class the author wants to add
            
            core.randomizer = params.randomize;

            console.log(core.randomizer)

            // Create the Book Events
            core.bookStart = document.createEvent("Event");             
            core.bookStart.initEvent("bookStart",true,true);                        // Book Start Event

            core.bookEnd = document.createEvent("Event");   
            core.bookEnd.initEvent("bookEnd",true,true);                            // Book End Event

            core.loadPage = document.createEvent("Event");
            core.loadPage.initEvent("loadPage",true,true);                          // Page Loading Effect

            core.pageTrigger = document.createEvent("Event");   
            core.pageTrigger.initEvent("pageTrigger",true,true);                    // page Trigger Event

            // Required to determine the book's attributes.
            function findCSSRule(selector) {
                var numOfSheets = document.styleSheets.length;      // Because we may have multiple stylesheets
                for(var s = 0; s < numOfSheets; s++){
                    var mySheet = document.styleSheets[s];          // Grab the specific sheet
                    if (mySheet.rules) {                            // Verify it has rules
                        var theRules = mySheet.rules;               // IE
                    } else {
                        var theRules = mySheet.cssRules;            // Everybody else
                    }
                    var theRules = mySheet.cssRules ? mySheet.cssRules : mySheet.rules;
                    for (var i=0; i<theRules.length; i++) {                     // Parse the set of rules
                        if (theRules[i].selectorText == selector) {             // If we have a match
                            var bW = theRules[i].style.width.toString();        // Get the book width
                            var bH = theRules[i].style.height.toString();       // Get the book height
                            return [bW, bH];                                    // Return the string values as an array
                            break;
                        } // endif theRules[i]
                    } // end for i  
                } // end for s
            } 

            var bWidth, bHeight;
            var bookSize = findCSSRule("#"+core.book.getAttribute('id'));       // If there is a rule
            if(bookSize){
                bWidth = bookSize[0];                                           // If there is the rule we have something to work with
                bHeight = bookSize[1];
            }else{
                bWidth = core.book.style.width;                                 // In case its inline css
                bHeight = core.book.style.height;
            }

            // redefine the page width in case of px|%|int
            var symW, pw, bw;   
            if(bWidth.indexOf("%") > 0){                                        // Parse the percentage and make a px value
                symW = "%";
                pw = '0.'+bWidth.substring(0, bWidth.indexOf(symW));
                pw = parseFloat(pw);
                bw = core.docWidth()*pw;
            }
            else if(bWidth.indexOf("px") > 0){                                 // Grab the raw pixel value from the string
                symW = "px";
                bw = bWidth.substring(0, bWidth.indexOf(symW));
            }
            else{   
                bw = bWidth;                                                   // If its a raw integer
            }
            core.pageWidth = bw;                                               // set the core width

            // redefine the height in case of px|%|int
            var symH, ph, bh;
            if(bHeight.indexOf("%") > 0){                                      // If percentage
                symH = "%";
                ph = '0.'+bHeight.substring(0, bHeight.indexOf(symH));
                ph = parseFloat(ph);
                bh = core.docHeight*ph;
            }
            else if(bHeight.indexOf("px") > 0){                                 // If px
                symH = "px";
                bh = bHeight.substring(0, bHeight.indexOf(symH));
            }
            else{
                bh = bHeight;                                                   // If integer
            }
            core.pageHeight = bh;                                               // Set the core height

            // Configure the perspective depth [ there was no science used in the formulating of this. ]
            var goggles = Math.floor(core.pageWidth*4);
            
            // Set the shadows
            core.shadowPattern0 = '';//'2px 0px 10px rgba(0, 0, 0, 0.1)';
            core.shadowPattern50 = '';//'2px 0px 10px rgba(0, 0, 0, 0.2)';
            core.shadowPattern100 = '';//'2px 0px 10px rgba(0, 0, 0, 0.1)';
            core.shadowPatternRev50 = '';//'2px 0px 10px rgba(0, 0, 0, 0.2)';
            core.shadowPatternRev100 = '';//'2px 0px 10px rgba(0, 0, 0, 0.1)';

            // Various book details
            core.wrap = params.wrap;                                            // The true/false wrap state
            core.paging = params.paging;                                        // single or double paging

            // create a new class
            core.NewPageClass = 'book'+ new Date().getTime();                   // The new class for the pages

            // Configure animation parts for silly Mozilla
            core.animationEnd = alice.prefixJS+'AnimationEnd';      // Works on Chrome, Safari, IE
            if(alice.prefixJS === 'Moz'){                           // Just specifically for Mozilla                
                core.animationEnd = 'animationstart';               // animation start
                core.animationEnd = 'animationend';                 // animation end
                // Here add details regarding the boxShadow
            }

            // Set the array of pages for the book
            var rawPages = core.book.childNodes;                                                // find me some raw contents!
            var rpn = 0;                                                                        // real page number
            for(var p = 0; p < rawPages.length; p++){
                if(rawPages[p].nodeType === 1){ 
                    if(rawPages[p].tagName === "DIV" || rawPages[p].tagName === "div"){         // Ensure that they are elements                        
                        core.pages[rpn] = rawPages[p];                                          // Add the div to the array
                        core.realPageCount = core.realPageCount+1;                              // set the page count
                        rpn++;                                                                  // real page number + 1
                    }
                    else{
                        console.error("Your pages must be all be the DIV tag element. Please place the contents inside.");  // At least give a reason for the malfunction
                        return false;                                                                                       // return nothing
                    }
                }
            }

            // Fashion me a book!
            core.book.style[alice.prefixJS+'Perspective'] = goggles+'px';           // Set the book perspective depth
            core.book.style.zIndex = '1000';                                        // Front and center soldier!
            core.book.style.position = 'relative';                                  // But dont be too intrusive
            core.binding = params.binding;                                          // Set the binding

            // set the transform axis
            if(params.binding === 'center' || params.binding === 'left' || params.binding === 'right'){         // For the Y axis
                core.transformRotate = 'rotateY';                                   
            }
            if(params.binding === 'middle' || params.binding === 'top' || params.binding === 'bottom'){         // For the X axis
                core.transformRotate = 'rotateX';
            }

            // If single paging we need a small book
            if(params.paging === 'single'){
                core.book.style.width = core.pageWidth+'px';                    // Set the book width
                core.book.style.height = core.pageHeight+'px';                  // Set the book height
            }
            //If double paging we need a big book
            else if(params.paging === 'double'){
                if(params.binding === 'left' || params.binding === 'right'){        // wide book with normal height
                    core.book.style.width = (core.pageWidth * 2)+'px';              // set width
                    core.book.style.height = core.pageHeight+'px';                  // set height
                }
                else if(params.binding === 'top' || params.binding === 'bottom'){   // tall book with normal width
                    core.book.style.width = core.pageWidth+'px';                    // set width
                    core.book.style.height = (core.pageHeight * 2)+'px';            // set height
                }
            }

            // Collect the style details of the book div for later
            core.controlBoxStyle = core.book;                                       // Get the style of the book                     

            // Set the details per binding
            if(core.paging === 'single'){
                core.transformDegrees = [core._rot0, core._rot0, core._rot0]; //0, 0, 0                     // Set the degrees needed for this animation set
                switch(params.binding){
                    case "center":
                        core.transformDegrees = [core._rot0, core._rot90, core._rotNeg90]; //0, 90, -90
                        core.transformOrigin = '50% 50%';
                        break;
                    case "middle":
                        core.transformDegrees = [core._rot0, core._rot90, core._rotNeg90]; //0, 90, -90
                        core.transformOrigin = '50% 50%';
                        break;
                    case "left":
                        core.transformOrigin = core.originZero;
                        break;
                    case "top":
                        core.transformOrigin = core.originZero;
                        break;
                    case "right":
                        core.transformOrigin = core.pageWidth+'px 0px';
                        break;
                    case "bottom":
                        core.transformDegrees = [core._rot0, core._rot0, core._rotNeg270]; //0, 0, 0
                        core.transformOrigin = '0px '+core.pageHeight+'px';
                        break;
                }
            }
            if(core.paging === 'double'){
                switch(params.binding){
                    case "left":
                        core.transformOrigin = core.pageWidth+'px 0px';
                        break;
                    case "right":
                        core.transformOrigin = core.pageWidth+'px 0px';
                        break;
                    case "top":
                        core.transformOrigin = '0px '+core.pageHeight+'px';
                        break;
                    case "bottom":
                        core.transformOrigin = '0px '+core.pageHeight+'px';
                        break;
                }
                core.transformDegrees = [core._rot0, core._rot0]; //0, 0, 0
            }
        },

        clearAnimation: function (id, dir) {
            var idNum = core.helper.getThisId(id);                                          // strip the id to the number value
            var _element = document.getElementById(id);                                     // Get that page element by its id

            if(document.getElementById("_piggy")){                                          // If piggyback page exists we need to destroy it!
                core.book.removeChild(document.getElementById("_piggy"));
            }

            // Simple blanks for replacing
            _element.style[alice.prefixJS + "Animation"] = '';                          // Set all of these animation attributes to nothing
            _element.style[alice.prefixJS + "AnimationDelay"] = "";
            _element.style[alice.prefixJS + "AnimationDuration"] = "";
            _element.style[alice.prefixJS + "AnimationTimingFunction"] = "";
            _element.style[alice.prefixJS + "AnimationIterationCount"] = "";
            _element.style[alice.prefixJS + "AnimationDirection"] = "";
            _element.style[alice.prefixJS + "AnimationPlayState"] = "";

            if(core.binding === 'center' || core.binding === 'middle'){                 // If we're using this binding
                if(idNum % 2 === 1){                                                    // odd pages
                    if(core.pn % 2 === 1){                                              // and the page flip count an odd number
                        _element.style.display = 'none';
                    }  
                }
                if(idNum % 2 === 0){                                                    // Even pages
                    if(core.pn % 2 === 1){                                              // odd number of clearAnimation action
                        _element.style.display = 'none';                                // This is weird, but it works, it has to do with the forward and reversal part.
                    }
                }
            }
            else if(core.binding === 'left' || core.binding === 'top' || core.binding === 'right' || core.binding === 'bottom'){
                _element.style.display = 'none';                                        // For the other bindings we need to hide everything
            }

            // Abtsract page changes
            if(core.paging === 'single'){
                var nextpage, prepage;
                prepage = document.getElementById('p'+(parseInt(idNum, 10)-1));             // Get the previous page
                nextpage = document.getElementById('p'+(parseInt(idNum, 10)+1));            // Get the next page

                if(idNum === core.realPageCount){                                           // if its the last page
                    nextpage = document.getElementById('p1');                               // go to the first page, only applicable if the wrap effect is true
                }

                // set this pages main attributes
                _element.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[0];     // Set the angular value of the div
                _element.style.zIndex = '0';                                                                    // know your place little one!
                
                if(idNum > 1 && dir === 'forwards'){                                                                                    // If we're moving forwards
                    if(core.jumper != null){
                        document.getElementById('p'+core.jumper).style.display = 'block';
                        _element.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];
                    }
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];                          // Set the angular value of the previous page
                    if(core.binding === 'left' || core.binding === 'right' || core.binding === 'top' || core.binding === 'bottom'){     
                        nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[0];                     // Set the next page to 0 angle 
                    }
                }
                if(idNum === 1 && dir === 'forwards'){                                                                                  // If its the first page its special
                    prepage = document.getElementById('p'+core.realPageCount);                                                          // set the previous page to the last page
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];                          // set the angle of the pre-page, just in case
                }
                if(idNum > 0 && dir === 'reverse'){                                                                                     // If we're going backwards
                    prepage = document.getElementById('p'+(idNum-1));   

                    if(core.jumper != null){
                        document.getElementById('p'+core.jumper).style.display = 'block';
                        _element.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];
                    }                                                                // gotta prepare ourselves                  

                    if(core.wrap === true){                                                                                             // In case we need a book that never ends!
                        if(idNum !== core.realPageCount){
                            nextpage = document.getElementById('p'+(parseInt(idNum, 10)+1));
                        }
                    }
                    //Basic transformations to set the page attributes
                    if(core.binding === 'left' || core.binding === 'top' || core.binding === 'right' || core.binding === 'bottom'){
                        nextpage.style.display = 'none';
                        _element.style.display = 'block';

                        if(core.jumper != null){
                            document.getElementById('p'+core.jumper).style.display = 'none';
                        }
                    }
                    nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];                         // Set another angle
                }
                // If its the first page.
                if(idNum === 1 && dir === 'reverse'){
                    prepage = document.getElementById('p'+core.realPageCount);            // Required for when the user goes forward but then goes backwards                                                 
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[2];              // Set the angle
                    nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];             // Set the angle
                }
            }
            core.pn++;                                                                                                      // This is always counting up
            core.jumper = null;
        },

        // This is for reseting double page 
        resetCSS: function(flipDirection, binding, id){
            var thisPage, idNum, nextPage, basicSettings, flipAngleOdd, flipAngleEven;
            // A set of options for resetting the style attributes of the different pages.
            thisPage = document.getElementById(id);
            idNum = core.helper.getThisId(id);
            nextPage = document.getElementById('p'+(parseInt(idNum, 10)+1));

            basicSettings = 'display: block; left: 0px; top: 0px;';                                                 // the most basic div settings

            if(idNum % 2 === 1 ){                                           
                thisPage.setAttribute('style', '');                                                                     
                if(flipDirection === 'forward'){
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;                                                                       
                    switch(core.binding){           
                        case "top":                                                                                     
                            flipAngleOdd = core.transformRotate + core._rot90;
                            thisPage.style.top = core.pageHeight+'px';                                                  
                            break;
                        case "right":                                                                                   
                            flipAngleOdd = core.transformRotate + core._rot90;
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin; 
                            break;
                        case "left":
                            flipAngleOdd = core.transformRotate + core._rotNeg90;
                            thisPage.style.left = core.pageWidth+'px';
                            break;
                        case "bottom":
                            flipAngleOdd = core.transformRotate + core._rotNeg90;
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = flipAngleOdd;
                }
                else if(flipDirection === 'reverse'){
                    thisPage.setAttribute('style', basicSettings);
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;
                    switch(core.binding){
                        case "top":
                            thisPage.style.top = core.pageHeight+'px'; 
                            break;
                        case "right":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin; 
                            break;
                        case "left":
                            thisPage.style.left = core.pageWidth+'px';
                            break;
                        case "bottom":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin; 
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
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;                                                                    
                    switch(core.binding){           
                        case "top":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin;                                                                                     
                            break;
                        case "right":                                                                                    
                            thisPage.style.left = core.pageWidth+'px';
                            break;
                        case "left":   
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin;   
                            thisPage.style.left = '0px';
                            break;
                        case "bottom":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;
                            thisPage.style.top = core.pageHeight+'px'; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = core.transformRotate + core._rot0;
                }
                else if(flipDirection === 'reverse'){
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;
                    switch(core.binding){
                        case "top":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin;
                            flipAngleEven = core.transformRotate + core._rotNeg90;    
                            break;
                        case "right":
                            flipAngleEven = core.transformRotate + core._rotNeg90; 
                            thisPage.style.left = core.pageWidth+'px';  
                            break;
                        case "bottom":
                            flipAngleEven = core.transformRotate + core._rot90; 
                            thisPage.style.top = core.pageHeight+'px';  
                            break;
                        case "left":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin;
                            flipAngleEven = core.transformRotate + core._rot90;   
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = flipAngleEven;  
                }                                       
            }

            // Regardless of the direction
            thisPage.style.border = "none";
            thisPage.style[alice.prefixJS+"boxShadow"] = core.shadowPattern0;
        },

        styleConfig: function(idNum){
            var page = document.getElementById('p'+idNum);
            if(core.paging === 'single'){
                if(core.binding === 'center' || core.binding === 'middle'){
                    page.setAttribute('style', 'display: none; '+
                        alice.prefix+'transform-origin: 50% 50%;'+
                        alice.prefix+'transform: '+ core.transformRotate + core._rot90 +';'+
                        alice.prefix+'box-shadow: '+ core.shadowPattern100 +';');
                }
                if(core.binding === 'left' || core.binding === 'top' || core.binding === 'bottom' || core.binding === 'right'){
                    page.setAttribute('style', 'display: none; '+ 
                        alice.prefix+'transform-origin:'+core.transformOrigin+';'+
                        alice.prefix+'transform: '+ core.transformRotate + core._rot0 +';'+
                        alice.prefix+'box-shadow: '+ core.shadowPattern100 +';');
                }
            }
            if(core.paging === 'double'){
                if(core.binding === 'left'){
                    if(idNum % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.originZero;
                        page.style.left = core.pageWidth+'px';
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.transformOrigin;
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot90;
                    }
                }
                if(core.binding === 'right'){
                    if(idNum % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.transformOrigin;
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.originZero;
                        page.style.left = core.pageWidth+'px';
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg90;
                    }
                }
                if(core.binding === 'top'){
                    if(idNum % 2 === 1){
                        page.style.top = core.pageHeight+'px';
                        page.style[alice.prefixJS+'TransformOrigin'] = core.originZero;
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.transformOrigin;
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg90;
                    }
                }
                if(core.binding === 'bottom'){
                    if(idNum % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.transformOrigin;
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.originZero;
                        page.style.top = core.pageHeight+'px';
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot90;
                    }
                }
            }
        },

        init: function(params){
            core.config(params);                                                    // Run the configuation of the book effect
            core.AnimGenerator(params);                                             // Set the animations/ Add to stylesheet

            // Report the book status
            if(core.binding !== 'center' || core.binding !== 'middle'){
                core.helper.bookStatus(core.rightPage-1);                           // Call the book status, this also sets of the book start event
            }else{
                core.helper.bookStatus(core.rightPage);
            }

            if(params.inPageControls === false){
                core.inPageControls = 1;
            }

            if(params.keyControls === false){
                core.keyControls = 1;
            }

            var genController = function(loc){                                      // Fabricate the controls
                var clickBox = document.createElement('div');
                clickBox.setAttribute('id', '_'+loc+'Controller');
                clickBox.style.width = '80px';
                clickBox.style.height = core.pageHeight+'px';
                clickBox.style.position = 'absolute';
                clickBox.style.background = core.controlsBg || '#999';
                clickBox.style.opacity = '0.3';
                clickBox.style.zIndex = '0';
                clickBox.style.top = core.controlBoxStyle.offsetTop+'px';
                var funcRef = 'alice.plugins.caterpillar';
                            
                if(loc === 'right'){
                    clickBox.style.left = (core.controlBoxStyle.offsetLeft + parseInt(core.pageWidth, 10))+'px';
                    clickBox.style.borderTopRightRadius = '100px';
                    clickBox.style.borderBottomRightRadius = '100px';
                    clickBox.setAttribute('onclick', funcRef+'.abPageTurn('+funcRef+'.rightPage)');
                }else{
                    clickBox.style.left = (core.controlBoxStyle.offsetLeft - parseInt(clickBox.style.width, 10))+'px';
                    clickBox.style.borderTopLeftRadius = '100px';
                    clickBox.style.borderBottomLeftRadius = '100px';
                    clickBox.setAttribute('onclick', funcRef+'.abPageTurnR('+funcRef+'.rightPage)');
                }
                document.body.appendChild(clickBox);                            // Add the controls to the page
            }; 
            
            // Only if they really want them
            if(params.controls === true && params.paging === "single"){         // Lets make sure we want controls, oh and single pages only
                genController('left');
                genController('right');

                //Required for page resizing 
                window.onresize = function(event) {
                    document.body.removeChild(document.getElementById("_leftController"));      // remove the original to make a new set
                    document.body.removeChild(document.getElementById("_rightController"));     // same thing here.
                    genController('left');
                    genController('right');
                }; 
            }

            // Regardless of the controls choice they get this
            function keyrelease(evt){   
                var dir = evt.keyCode;
                var newPageCount = core.realPageCount+1;
                if(dir === 39){
                    if(core.rightPage <= newPageCount){
                        if(core.paging === "single"){
                            core.abPageTurn(core.rightPage);
                        }
                        if(core.paging === "double"){
                            core.turnPage(core.rightPage);
                        }
                    }
                }
                
                if(dir === 37){ 
                    if(core.paging === "single"){
                        core.abPageTurnR(core.rightPage);
                    }
                    if(core.paging === "double"){
                        if(core.leftPage >= 1){
                            core.turnPage(core.leftPage);
                        }
                    }
                }
            }

            if(core.keyControls === 0){
                document.body.addEventListener("keyup", keyrelease, false);         // Add the keylistener
            }

            core.pageBuilder(params);

        },

        nxtPage: function(){
            var newPageCount = core.realPageCount+1;
            if(core.rightPage <= newPageCount){
                if(core.paging === "single"){
                    core.abPageTurn(core.rightPage);
                }
                if(core.paging === "double"){
                    core.turnPage(core.rightPage);
                }
            }
        },

        prePage: function(){
            var newPageCount = core.realPageCount+1;
            if(core.paging === "single"){
                core.abPageTurnR(core.rightPage);
            }
            if(core.paging === "double"){
                if(core.leftPage >= 1){
                    core.turnPage(core.leftPage);
                }
            }
        },

        pageBuilder: function(params){

            // Give the book some class
            var pageClassName = core.pages[0].getAttribute('class');                // Grab the original class value that the pages may have.
            var currentPageClass = pageClassName + ' ' + core.pageClass;
            
            var bookClass = '.'+core.NewPageClass+
                            '{ display: none; '+
                            alice.prefix+'box-shadow: '+ core.shadowPattern100 +';'+
                            alice.prefix+'backface-visibility: hidden;' +
                            'width: '+core.pageWidth+"px;"+
                            'height: '+core.pageHeight+"px;"+
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
            if(core.paging === 'single'){ 
                var f = 1;
                for(var b = 0; b < core.pages.length; b++){
                    core.pages[b].setAttribute('id', 'p'+f);
                    core.pages[b].setAttribute('class', currentPageClass + ' ' +core.NewPageClass);

                    core.pages[b].addEventListener(core.animationEnd, function(){
                        if(this.style[alice.prefixJS+'AnimationName'] === 'abstrPageTurnF'){
                            var pageId = this.getAttribute('id');
                            if(core.binding === 'center' || core.binding === 'middle'){
                                alice.plugins.caterpillar.abstrPageFlip(this.getAttribute('id'), 'forwards', core.jumper, 'forwards');
                            }else{
                                core.helper.bookStatus(core.helper.getThisId(pageId));
                            }
                            if(core.rightPage === core.realPageCount && core.wrap === true){
                                pageId = core.realPageCount;
                                core.rightPage = 0;
                            }
                            core.clearAnimation(this.getAttribute('id'), 'forwards');
                            core.rightPage++;
                            if(core.binding !== 'center' && core.binding !== 'middle'){
                                core.animationRunning = false;   
                            }
                        }
                        if(this.style[alice.prefixJS+'AnimationName'] === 'abstrPageReTurnF'){  // Set the animationEnd listener
                            if(core.binding === 'center' || core.binding === 'middle'){
                                alice.plugins.caterpillar.abstrPageFlip(this.getAttribute('id'), 'reverse', core.jumper, 'reverse');
                            }
                            core.clearAnimation(core.pageToClear, 'reverse');
                            core.rightPage--;
                            if(core.binding !== 'center' && core.binding !== 'middle'){
                                core.animationRunning = false;   
                            }
                        }
                     }, false);

                    if(params.controls !== true && core.inPageControls === 0){
                        core.pages[b].setAttribute('onclick', 'alice.plugins.caterpillar.abPageTurn('+f+')');     // Without controls we still need to move forward                               
                    }
                    
                    core.styleConfig(f);                                                                            // pretify the pages
                   
                    if(f === 1){                                                                                    // If its the first page we need to make it special
                        core.pages[b].style.display = 'block';
                        core.pages[b].setAttribute('style', 'display: block; z-index: 1;'+
                        alice.prefix+'transform-origin:'+core.transformOrigin+';'+
                        alice.prefix+'transform: '+ core.transformRotate + core._rot0 +';' +
                        alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                    }

                    f++;
                }
            }

            if(core.paging === 'double'){
                var n = 1; 
                for (var i = 0; i < core.pages.length; i++){
                    if(core.pages[i].nodeType === 1){
                        core.pages[i].setAttribute('id', 'p'+n);
                        core.pages[i].setAttribute('class', currentPageClass + ' ' +core.NewPageClass);

                        if(n === 1){                                                                                // make the first page visible
                            core.pages[i].style.display = 'block';
                            core.pages[i].style[alice.prefixJS+'BoxShadow'] = core.shadowPattern100+';';
                        }

                        core.styleConfig(n);                                                                        // Configure the remaining pages
                        
                        if(core.inPageControls === 0){
                            core.pages[i].setAttribute('onclick', 'alice.plugins.caterpillar.turnPage('+n+')');        // Empower the click action                              
                        }

                        core.pages[i].addEventListener(core.animationEnd, function(){                               // Set up the animation end listener
                            if(this.style[alice.prefixJS+'AnimationName'] === 'oddPageTurnF'){      // odd page forward flip
                                core.turnNextPage(this.getAttribute('id'), 'odd');                  // incured even page flip
                                core.resetCSS('forward', core.binding, this.getAttribute('id'));    // reset the css of the odd page
                            }   
                            if(this.style[alice.prefixJS+'AnimationName'] === 'oddPageTurnR'){      // odd page reverse flip incured by the even page reverse flip
                                core.resetCSS('reverse', core.binding, this.getAttribute('id'));    // reset the css of the odd page

                                var nxtId = core.helper.getThisId(this.getAttribute('id'));         // get the next page number
                                nxtId = parseInt(nxtId, 10)+2;                                          // go to the next next page
                                if(nxtId < core.realPageCount+1){                                   // make sure it exsits
                                    document.getElementById('p'+nxtId).style.display = 'none';      // hide it
                                }

                                core.animationRunning = false;                                      // set animationRunning state to false (prevent over running animations)
                            } 
                            if(this.style[alice.prefixJS+'AnimationName'] === 'evenPageTurnF'){     // even page forward flip (incured by the odd page flip)
                                core.resetCSS('forward', core.binding, this.getAttribute('id'));    // reset the css of the even page
                                core.animationRunning = false;                                      // set animationRunning state to false (prevents messy page flips)
                            }
                            if(this.style[alice.prefixJS+'AnimationName'] === 'evenPageTurnR'){     // even page reverse flip
                                core.turnNextPage(this.getAttribute('id'), 'even');                 // incur the odd page reverse flip
                                core.resetCSS('reverse', core.binding, this.getAttribute('id'));    // reset the css of the even page
                            }
                        }, false);

                        n++;    
                    }    
                }
            }         

            return core;                                                                                // return the core of alice.plugins.caterpillar
        },

        goToPage: function(id){
            if(core.paging === 'single'){
                core.abPageTurn(core.rightPage, id); 
            }
        },

        revToPage: function(id){ 
            if(core.paging === 'single'){   
                core.abPageTurnR(core.rightPage, id);    
            }
        },

        abstrPageFlip: function(id, dir, jumper, jumpDir){                                                   // Get the id and direction
            var idNum, ani;
            if(dir === 'forwards'){
                idNum = core.helper.getThisId(id)+1;
                ani = "abstrPageTurnR";
                if(idNum === core.realPageCount+1){                                                     // make sure it doesn't exceed the book
                    idNum = 1;                                                                          // reset the book to page one
                }
                if(jumper && jumpDir === 'forwards'){
                    idNum = jumper;
                    core.rightPage = jumper-1;
                }
            }                                                         
            else if(dir === 'reverse'){
                ani = "abstrPageReTurnR";
                idNum = core.helper.getThisId(id)-1;
                if(idNum === 0){
                    idNum = core.realPageCount;
                }
                if(jumper && jumpDir === 'reverse'){
                    idNum = jumper;
                    core.rightPage = jumper+1;
                }            
            }

            var pageId = core.book.querySelector('div:nth-child('+idNum+')').getAttribute('id');        // With the next id number we get the next page
            
            var page = document.getElementById(pageId);                                                 // Take the next page
                page.style[alice.prefixJS+'AnimationName'] = ani;                                       // Make it flip
                core.helper.setAnimDefaults(page);                                                      // Ensure the common details are set

            page.addEventListener(core.animationEnd, function(){                                        // When the animation ends
                if(page.style[alice.prefixJS+'AnimationName'] === ani){                                 // If its a particular animation
                    core.clearAnimation('p'+idNum, dir);                                                // Clear the animation from the CSS
                    core.animationRunning = false;                                                      // Set the animation Running state
                }
            }, false);

            if(jumper){
                core.helper.bookStatus(jumper);
            }else{
                core.helper.bookStatus(idNum);
            }
        },

        turnNextPage: function(id, type){                                                   // This is called for the backside page
            var pg, pgId, page, aniName;    
            pg = core.helper.getThisId(id);
            pg = (type === 'odd') ? (pg+1) : (pg-1);                                        // Control the page requested
            aniName = (type === 'even') ? "oddPageTurnR" : "evenPageTurnF";                 // Determine the required animation

            core.helper.bookStatus(pg);

            core.animationRunning = true;                                                   // Set the state of the animation
            
            pgId = core.book.querySelector('div:nth-child('+pg+')').getAttribute('id');     // Get the page
            
            page = document.getElementById(pgId);
            page.style.zIndex = 1; 
            if(type === 'odd'){
                page.style.display = 'block';
            }
            page.style[alice.prefixJS+'AnimationName'] = aniName;
            core.helper.setAnimDefaults(page); 
        },

        turnPage: function (pageId){
            core.helper.bookStatus(pageId);
            if(core.animationRunning === false){
                core.lastPage = pageId;
                var secondChild, thirdChild, ani, pageCounter;

                if(core.realPageCount % 2 === 0){
                    pageCounter = core.realPageCount+1;
                }else{
                    pageCounter = core.realPageCount;
                }

                if(core.leftPage < 0){
                    core.leftPage = 0;
                    core.rightPage = 1;
                }
                if(core.rightPage > core.realPageCount){
                    core.leftPage = core.realPageCount;
                    core.rightPage = core.realPageCount+1;
                }
                if(pageId % 2 === 1){                               // Regarding the odd pages
                    secondChild = pageId + 1;
                    thirdChild = pageId + 2;
                    ani = "oddPageTurnF";
                }else{                                              // Those leftover even pages
                    secondChild = pageId - 1;
                    thirdChild = pageId - 2;
                    ani = "evenPageTurnR";
                }
                if(pageId < pageCounter){
                    core.animationRunning = true;
                    
                    var nxtNxtPageId = core.book.querySelector('div:nth-child('+(thirdChild)+')');                      // Get the page after that  
                    
                    if(nxtNxtPageId){                                                                                   // If this page exists do the following
                        nxtNxtPageId = nxtNxtPageId.getAttribute('id');                                                 // After all it should be there. 
                        var nxtNxtPage = document.getElementById(nxtNxtPageId);
                        nxtNxtPage.style.zIndex = '0';
                        nxtNxtPage.style.display = 'block';
                    }

                    var page = document.getElementById('p'+pageId);                                                     // Animate this page
                        page.style.zIndex = '1';                                                                        // Bring it front row
                        page.style[alice.prefixJS+'AnimationName'] = ani;
                        core.helper.setAnimDefaults(page); 

                    if(pageId % 2 === 1){                                                                                // For the odd pages
                        if(core.rightPage < core.realPageCount+1){
                            core.rightPage += 2;
                            core.leftPage += 2;
                        }   
                    }else{                                                                                              // For the even pages
                        if(core.leftPage >= 1){
                            core.rightPage -= 2;
                            core.leftPage -= 2;
                        }
                    }
                }
            }
        },

        abPageTurn: function (pageId, jumper){
            core.lastPage = pageId;
            if(core.animationRunning === false){
                if(pageId >= core.realPageCount && core.wrap === true){
                    pageId = 0;
                }
                if(pageId === 0 && core.wrap === true){
                    if(core.binding === 'center' || core.binding === 'middle'){
                        pageId = core.realPageCount;
                        core.rightPage = core.realPageCount; 
                    }
                }

                var page = document.getElementById('p'+core.rightPage);
                
                if(!jumper){
                    try{
                        var nxtPageId = core.book.querySelector('div:nth-child('+(pageId + 1)+')').getAttribute('id');
                        var nxtPage = document.getElementById(nxtPageId);
                            nxtPage.style.display = 'block';
                    }catch(err){ 
                        if(core.wrap !== true){   
                            console.log("This is the end of the book!");                                                            // The end of the book
                            return false;                                                                                           // Deny the flip animation
                        }
                    }
                }else{
                    core.jumper = jumper;
                    var nxtPageId = core.book.querySelector('div:nth-child('+core.jumper+')').getAttribute('id');
                    var nxtPage = document.getElementById(nxtPageId);
                    nxtPage.style.display = 'block';
                    core.rightPage = (jumper-1);
                }

                page.style.zIndex = '100';
                page.style[alice.prefixJS+'AnimationName'] = "abstrPageTurnF";

                // Run animation run!
                core.animationRunning = true;                                   // Set the animation running (blocks another animation from running)
                core.helper.setAnimDefaults(page);                              // Set the defaults

                if(core.binding !== "center" && core.binding !== "middle" ){
                    core.helper.piggyback(pageId, "standard");                  // We call piggyback to hide the backface
                }
            }
        },

        abPageTurnR: function (pageId, jumper){  
            var page;
            core.lastPage = pageId;
            if(core.animationRunning === false){
                if(jumper > 0){
                    core.lastPage = jumper;
                }

                if(core.binding === 'center' || core.binding === 'middle'){   // Because its fundamentally different from the other bindings
                    if(pageId >= core.realPageCount){
                        pageId = core.realPageCount;                // Because we're adding to the core.rightPage on each turn we need this, after all we cant have more pages than the total pages
                        core.rightPage = core.realPageCount;        // Reset the core.rightPage so it matches the pageId
                    }
                    if(core.rightPage === 0 || pageId === 0){
                        core.rightPage = core.realPageCount;        // In the case of going backwards, page zero doesnt exist.
                        pageId = core.realPageCount;                // These identifiers need to be the same.
                    }
                    if(pageId !== 1){
                        core.helper.pageSetter(pageId);             // As long as its not the first page set the details of the page, the first was already set.
                    }
                    if(core.wrap === false){                        // In the case of no wrap effect we idetify the page as non existing.
                        if(pageId === 1){                           // if its the main page drop it to a page which cannot exist to stop the backwards motion! :)
                            pageId = -1;                            
                        }
                    }
                    if(pageId >= 0){                                // Also to make sure we're able to turn off the wrap effect.     
                        page = document.getElementById('p'+core.rightPage);                     // Get the right page
                        page.style[alice.prefixJS+'AnimationName'] = "abstrPageReTurnF";        // Animate it
                        core.pageToClear = page.getAttribute('id');                                  // Clear its animation qualities
                    }
                    if(jumper){
                        core.helper.pageSetter(jumper+1);  
                        core.jumper = jumper;
                    }
                }

                if(core.binding === 'left' || core.binding === 'right' || core.binding === 'top' || core.binding === 'bottom'){

                    if(jumper){
                        core.jumper = pageId;
                        pageId = (jumper+1);
                        core.rightPage = (jumper+1);
                    }

                    if(core.wrap === true){                         // If its wrappable
                        if((pageId - 1) === 0){                     // If its going backwards
                            pageId = core.realPageCount+1;          // Transform the page num and rightPage which loads the page
                            core.rightPage = core.realPageCount+1;  // This is because through the rest of this we are otherwise 
                        }                                          
                    }
                    if(core.wrap === false && pageId >= core.realPageCount){        // If wrap is false, and we're greater than the page count
                        pageId = core.realPageCount;                                // Reset us back to the max (need to because moving forward we're always adding 1)
                    }

                    page = document.getElementById('p'+(pageId-1));                 // Now deal with the real page
                    page.style.zIndex = '10';                                       // Bring it to the front

                    switch (core.binding){                                          // Make it nice
                        case "left":
                            page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg270;
                            break;
                        case "bottom":
                            page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg270;
                            break;
                        case "top":
                            page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot270;
                            break;
                        case "right": 
                            page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot270;
                            break;
                    }

                    page.style[alice.prefixJS+'AnimationName'] = "abstrPageReTurnF";        // Animate this puppy
                    core.pageToClear = 'p'+(pageId - 1);                                         // clear the real page
                    core.helper.bookStatus(pageId-2);                                       // display the page num of the page which is now revealed.
                }

                core.animationRunning = true;                                               // Ensure that nothing else can run at the same time!

                core.helper.setAnimDefaults(page);
                if(core.binding !== 'center' && core.binding !== 'middle'){
                    core.helper.piggyback(pageId-1, "advanced");      
                }


            }
        }, 

        loadMorePages: function(pageSource, book){
                var _caterpillar = alice.plugins.caterpillar, xmlhttp, source, _element, _pages, _elementParent, j, _originalPageCount;

                _caterpillar.animationRunning = false;

                xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", pageSource, true);
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4) {
                        source = xmlhttp.responseText;
                        _element = document.getElementById(book);
                        _pages = document.getElementById(book).childNodes;
                        _elementParent = _element.parentNode;
                        _originalPageCount = core.realPageCount;

                        var xBook = document.createElement('div');
                        xBook.setAttribute('id', '___xbook');

                        xBook.innerHTML = source;

                        var _rawPages = xBook.childNodes;                                           
                        var _rpn = 0; 
                        var _newPageArray = [];

                        for(var p = 0; p < _rawPages.length; p++){
                            if(_rawPages[p].nodeType === 1){ 
                                if(_rawPages[p].tagName === "DIV" || _rawPages[p].tagName === "div"){ 
                                    _newPageArray[_rpn] = _rawPages[p];                                    
                                    _caterpillar.realPageCount = _caterpillar.realPageCount+1;   
                                    _rpn++;                                                                                       
                                }
                            }
                        }

                        var currentClass = core.pages[1].getAttribute('class');
                        var currentStyleOdd = core.pages[1].getAttribute('style');
                        var currentStyleEven = core.pages[2].getAttribute('style');

                        var npn = 1;
                        
                        for(j = 0; j < _newPageArray.length; j++){
                            var truVal = (_originalPageCount + npn)
                            _newPageArray[j].setAttribute('class', currentClass);
                            _newPageArray[j].setAttribute('style', currentStyleOdd);
                            _newPageArray[j].setAttribute('id', 'p'+truVal);

                            _element.appendChild(_newPageArray[j]);

                            if(core.paging === 'single'){
                                if(core.inPageControls === true){
                                    _newPageArray[j].setAttribute('onclick', 'alice.plugins.caterpillar.abPageTurn('+truVal+')');
                                }
                                _newPageArray[j].addEventListener(core.animationEnd, function(){
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'abstrPageTurnF'){
                                        var pageId = this.getAttribute('id');
                                        if(core.binding === 'center' || core.binding === 'middle'){
                                            alice.plugins.caterpillar.abstrPageFlip(this.getAttribute('id'), 'forwards', core.jumper, 'forwards');
                                        }else{
                                            core.helper.bookStatus(core.helper.getThisId(pageId));
                                        }
                                        if(core.rightPage === core.realPageCount && core.wrap === true){
                                            pageId = core.realPageCount;
                                            core.rightPage = 0;
                                        }
                                        core.clearAnimation(this.getAttribute('id'), 'forwards');
                                        core.rightPage++;
                                        if(core.binding !== 'center' && core.binding !== 'middle'){
                                            core.animationRunning = false;   
                                        }
                                    }
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'abstrPageReTurnF'){  // Set the animationEnd listener
                                        if(core.binding === 'center' || core.binding === 'middle'){
                                            alice.plugins.caterpillar.abstrPageFlip(this.getAttribute('id'), 'reverse', core.jumper, 'reverse');
                                        }
                                        core.clearAnimation(core.pageToClear, 'reverse');
                                        core.rightPage--;
                                        if(core.binding !== 'center' && core.binding !== 'middle'){
                                            core.animationRunning = false;   
                                        }
                                    }
                                 }, false);
                            }
                            else if(core.paging === 'double'){
                                if(core.inPageControls === true){
                                    _newPageArray[j].setAttribute('onclick', 'alice.plugins.caterpillar.turnPage('+truVal+')');
                                }
                                _newPageArray[j].addEventListener(core.animationEnd, function(){                               // Set up the animation end listener
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'oddPageTurnF'){      // odd page forward flip
                                        core.turnNextPage(this.getAttribute('id'), 'odd');                  // incured even page flip
                                        core.resetCSS('forward', core.binding, this.getAttribute('id'));    // reset the css of the odd page
                                    }   
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'oddPageTurnR'){      // odd page reverse flip incured by the even page reverse flip
                                        core.resetCSS('reverse', core.binding, this.getAttribute('id'));    // reset the css of the odd page

                                        var nxtId = core.helper.getThisId(this.getAttribute('id'));         // get the next page number
                                        nxtId = parseInt(nxtId, 10)+2;                                          // go to the next next page
                                        if(nxtId < core.realPageCount+1){                                   // make sure it exsits
                                            document.getElementById('p'+nxtId).style.display = 'none';      // hide it
                                        }

                                        core.animationRunning = false;                                      // set animationRunning state to false (prevent over running animations)
                                    } 
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'evenPageTurnF'){     // even page forward flip (incured by the odd page flip)
                                        core.resetCSS('forward', core.binding, this.getAttribute('id'));    // reset the css of the even page
                                        core.animationRunning = false;                                      // set animationRunning state to false (prevents messy page flips)
                                    }
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'evenPageTurnR'){     // even page reverse flip
                                        core.turnNextPage(this.getAttribute('id'), 'even');                 // incur the odd page reverse flip
                                        core.resetCSS('reverse', core.binding, this.getAttribute('id'));    // reset the css of the even page
                                    }
                                }, false);
                            }

                            if(core.paging === 'double'){
                                core.styleConfig(_originalPageCount + npn);
                                document.getElementById('p'+truVal).style.display = 'none';
                            }

                            npn++;
                        }
                    }
                }

                xmlhttp.send(null)
            },

            loadNewBook: function(page, newbookfunc){
                var _caterpillar = alice.plugins.caterpillar, xmlhttp, source, _element, _pages, _elementParent, j;

                _caterpillar.animationRunning = false;

                xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", page, true);
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4) {
                    source = xmlhttp.responseText;
                    _element = document.getElementById("book");
                    _pages = document.getElementById("book").childNodes;
                    _elementParent = _element.parentNode;

                    if(document.getElementById("_leftController")){
                        document.body.removeChild(document.getElementById("_leftController"));      // remove the original to make a new set
                        document.body.removeChild(document.getElementById("_rightController")); 
                    }
                    var xBook = document.createElement('div');
                    xBook.setAttribute('id', '__xbook');

                    xBook.innerHTML = source;

                    var _rawPages = xBook.childNodes;                                           
                    var _rpn = 0; 
                    var _newPageArray = [];

                    for(var p = 0; p < _rawPages.length; p++){
                        if(_rawPages[p].nodeType === 1){ 
                            if(_rawPages[p].tagName === "DIV" || _rawPages[p].tagName === "div"){ 
                                _newPageArray[_rpn] = _rawPages[p];                                    
                                _caterpillar.realPageCount = _caterpillar.realPageCount+1;   
                                _rpn++;                                                                                       
                            }
                        }
                    }

                    _caterpillar.pages = '';
                    _element.innerHTML = '';
                    _caterpillar.realPageCount = 0;

                    var _pageArrayX = _newPageArray;

                    for(j = 0; j < _pageArrayX.length; j++){
                        _pageArrayX[j].removeAttribute('style');
                        _pageArrayX[j].removeAttribute('id');

                        _element.appendChild(_pageArrayX[j]);
                    }

                    _caterpillar.pages = _pageArrayX;
                    
                    alice.plugins.caterpillar.rightPage = 1;
                    alice.plugins.caterpillar.leftPage = 0;

                    new newbookfunc;

                    console.log(_caterpillar.realPageCount);

                    }
                }

                xmlhttp.send(null)
            } 
    };

    return core;

}();

var _caterpillar = alice.plugins.caterpillar;                                                                                      // we need this to shorten things

alice.plugins.caterpillar.helper = {

    bookStatus: function(id){
        "use strict";
        if(_caterpillar.binding === 'center' || _caterpillar.binding === 'middle'){
            if(id === 0){
                id = 1;
            }
        }
        if(_caterpillar.binding !== 'center' && _caterpillar.binding !== 'middle' && _caterpillar.paging !== 'double'){
            id = id+1;
        }
        var state = "page: " +id;
        _caterpillar.pageNumber = id;
        document.dispatchEvent(_caterpillar.pageTrigger);
        if(id === 1){
            state = "This is the first page";
            document.dispatchEvent(_caterpillar.bookStart);       // Event trigger for end of book
        }
        if(id === _caterpillar.realPageCount || id === 0){
            if(_caterpillar.paging === 'single'){
                state = "This is the end of the book";
            }else{
                state = "This is the first page";
            }
        }
        console.log(state);
        if(id === _caterpillar.realPageCount){
            document.dispatchEvent(_caterpillar.bookEnd);       // Event trigger for end of book
        }
    },

    getThisId: function(pageId){
    "use strict";
        var page = pageId.substring(1, 8);
            page = parseInt(page, 10);
            return page;
    },

    pageSetter: function(pageId){
    "use strict";
        if(pageId === 0){
            pageId = _caterpillar.realPageCount;
        }
        var prePageId = 'p'+ (pageId - 1);
        var prePage = document.getElementById(prePageId);
        prePage.style[alice.prefixJS+'Transform'] = _caterpillar.transformRotate+_caterpillar._rotNeg90;
    },

    setAnimDefaults: function(page, speed){
    "use strict";
        var mySpeed;
        if(speed){
            mySpeed = speed;                                                                        // This grabs the randomized speed from the page and gives it to the piggyback page
        }else{
            mySpeed = alice.randomize(_caterpillar.speed, _caterpillar.randomizer)+'ms';                              // This tool randomizes the speed
        }
        page.style[alice.prefixJS+'AnimationDuration'] = mySpeed;                                   // Set the animation duration
        page.style[alice.prefixJS+'AnimationFillMode'] = "forwards";                                // forwards means it will leave everything alone when done   
        page.style[alice.prefixJS+'AnimationPlayState'] = "running";                                // set to a running state
        page.style[alice.prefixJS+'AnimationDirection'] = 'normal';                                 // direction is always normal (alternating causes nightmares)
        page.style[alice.prefixJS+'AnimationTimingFunction'] = "linear";                            // Set the linear timing
        page.style.display = 'block';
    },

    piggyback: function(id, type){
    "use strict";
        if(id === 0){                                                                               // If its the last page going forward (wrapping)
            id = _caterpillar.realPageCount;                                                        // Switch it from 0 back to its true id (its 0 now because we add 1 for the next page to display)
        }
        var speed = document.getElementById('p'+id).style[alice.prefixJS+"AnimationDuration"];      // Get the speed of the main page that turns
        var aniName = (type === "standard") ? "abstrPageTurnF" : "abstrPageReTurnF";                // Set the animation name
        var numZ = "0";                                                                             // Set the z-index
        var piggy = document.createElement('div');                                                  // Create piggy (the backside of the page)
            piggy.setAttribute('id', '_piggy');                                                     // Set the id
            piggy.style.width = _caterpillar.pageWidth+'px';                                        // set width
            piggy.style.height = _caterpillar.pageHeight+'px';                                      // set height
            piggy.style.position = 'absolute';                                                      // absolute position
            piggy.style.background = _caterpillar.piggyBg || '#222';                                // background
            piggy.style.top = '0px';                                                                // top position
            piggy.style.left = '0px';                                                               // left positon
            if(type === "advanced"){                                                                // If its going backwards we have to set a start angle
                var rotAngle;
                switch (_caterpillar.binding){
                    case "left":
                        rotAngle = _caterpillar._rotNeg270;
                        break;
                    case "bottom":
                        rotAngle = _caterpillar._rotNeg270;
                        break;
                    case "top":
                        rotAngle = _caterpillar._rot270;
                        break;
                    case "right":
                        rotAngle = _caterpillar._rot270;
                        break;
                }
                piggy.style[alice.prefixJS+'Transform'] = _caterpillar.transformRotate+rotAngle;    // Set the angle
            }
            piggy.style.zIndex = numZ;                                                              // Set the z-index
            piggy.style[alice.prefixJS+'AnimationName'] = aniName;                                  // set the animation name
            piggy.style[alice.prefixJS+'TransformOrigin'] = _caterpillar.transformOrigin;           // Set the transform-origin
            _caterpillar.helper.setAnimDefaults(piggy, speed);                                      // Set teh defaults
            _caterpillar.book.appendChild(piggy);                                                   // Add the page to the document
    }

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
 * [book description]
 * @param  {[type]} elems     [description]
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
alice.plugins.book = function (params) {
    "use strict";
    console.info("book: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,
        pageClass: params.pageClass || '',     
        
        bookWidth: params.bookWidth || document.getElementById(params.elems || alice.anima).style.width,
        bookHeight: params.bookHeight || document.getElementById(params.elems || alice.anima).style.height,

        shadow: params.shadow || true,
        speed: params.speed || "500ms",

        inPageControls: params.inPageControls,
        keyControls: params.keyControls,

        randomize: params.randomize || '15%',

        binding: params.binding || "vertical",
        paging: params.paging || "single",
        wrap: params.wrap || false,
        controls: params.controls || false,
        piggyBg: params.pageBackground || '#222',
        controlsBg: params.controlBackground || '#999'
    };

    console.log(opts);

    alice.plugins.caterpillar.init(opts);
    return opts;
};

//----------------------------------------------------------------------------