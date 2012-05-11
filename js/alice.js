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

    var core = {
            id: "alice",
            name: "AliceJS",
            description: "A Lightweight Independent CSS Engine",
            version: "0.2",
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
                if (params === undefined || params === null) {
                    return {x: "50%", y: "50%"}; // center
                }

                if (typeof params === "string") {
                    switch (params) {
                    // standard
                    case "top-left":
                        return {x: "0%", y: "0%"};
                    case "top-center":
                        return {x: "50%", y: "0%"};
                    case "top-right":
                        return {x: "100%", y: "0%"};
                    case "middle-left":
                        return {x: "0%", y: "50%"};
                    case "middle-center":
                        return {x: "50%", y: "50%"};
                    case "middle-right":
                        return {x: "100%", y: "50%"};
                    case "bottom-left":
                        return {x: "0%", y: "100%"};
                    case "bottom-center":
                        return {x: "50%", y: "100%"};
                    case "bottom-right":
                        return {x: "100%", y: "100%"};

                    // shortcuts
                    case "top":
                        return {x: "50%", y: "0%"};
                    case "left":
                        return {x: "0%", y: "50%"};
                    case "center":
                        return {x: "50%", y: "50%"};
                    case "right":
                        return {x: "100%", y: "50%"};
                    case "bottom":
                        return {x: "50%", y: "100%"};

                    // compass shortcuts
                    case "NW":
                        return {x: "0%", y: "0%"};
                    case "N":
                        return {x: "50%", y: "0%"};
                    case "NE":
                        return {x: "100%", y: "0%"};
                    case "W":
                        return {x: "0%", y: "50%"};
                    case "E":
                        return {x: "100%", y: "50%"};
                    case "SW":
                        return {x: "0%", y: "100%"};
                    case "S":
                        return {x: "50%", y: "100%"};
                    case "SE":
                        return {x: "100%", y: "100%"};

                    default:
                        return {x: "50%", y: "50%"}; // center
                    }
                }

                return params; // {x: 320, y: 240}
            },

            /**
             * Returns cubic bezier function
             */
            easing: function (params) {
                switch (params) {
                // Standard
                case "linear":
                    return {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750};
                case "ease":
                    return {p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000};
                case "ease-in":
                    return {p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000};
                case "ease-out":
                    return {p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000};
                case "ease-in-out":
                    return {p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000};

                // Penner Equations (approximate)
                case "easeInQuad":
                    return {p1: 0.550, p2: 0.085, p3: 0.680, p4: 0.530};
                case "easeInCubic":
                    return {p1: 0.550, p2: 0.055, p3: 0.675, p4: 0.190};
                case "easeInQuart":
                    return {p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220};
                case "easeInQuint":
                    return {p1: 0.755, p2: 0.050, p3: 0.855, p4: 0.060};
                case "easeInSine":
                    return {p1: 0.470, p2: 0.000, p3: 0.745, p4: 0.715};
                case "easeInExpo":
                    return {p1: 0.950, p2: 0.050, p3: 0.795, p4: 0.035};
                case "easeInCirc":
                    return {p1: 0.600, p2: 0.040, p3: 0.980, p4: 0.335};
                case "easeInBack":
                    return {p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045};
                case "easeOutQuad":
                    return {p1: 0.250, p2: 0.460, p3: 0.450, p4: 0.940};
                case "easeOutCubic":
                    return {p1: 0.215, p2: 0.610, p3: 0.355, p4: 1.000};
                case "easeOutQuart":
                    return {p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000};
                case "easeOutQuint":
                    return {p1: 0.230, p2: 1.000, p3: 0.320, p4: 1.000};
                case "easeOutSine":
                    return {p1: 0.390, p2: 0.575, p3: 0.565, p4: 1.000};
                case "easeOutExpo":
                    return {p1: 0.190, p2: 1.000, p3: 0.220, p4: 1.000};
                case "easeOutCirc":
                    return {p1: 0.075, p2: 0.820, p3: 0.165, p4: 1.000};
                case "easeOutBack":
                    return {p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275};
                case "easeInOutQuad":
                    return {p1: 0.455, p2: 0.030, p3: 0.515, p4: 0.955};
                case "easeInOutCubic":
                    return {p1: 0.645, p2: 0.045, p3: 0.355, p4: 1.000};
                case "easeInOutQuart":
                    return {p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000};
                case "easeInOutQuint":
                    return {p1: 0.860, p2: 0.000, p3: 0.070, p4: 1.000};
                case "easeInOutSine":
                    return {p1: 0.445, p2: 0.050, p3: 0.550, p4: 0.950};
                case "easeInOutExpo":
                    return {p1: 1.000, p2: 0.000, p3: 0.000, p4: 1.000};
                case "easeInOutCirc":
                    return {p1: 0.785, p2: 0.135, p3: 0.150, p4: 0.860};
                case "easeInOutBack":
                    return {p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550};

                // Custom
                case "custom":
                    return {p1: 0.000, p2: 0.350, p3: 0.500, p4: 1.300};

                // Random (between 0 and 1)
                case "random":
                    return {
                        p1: Math.random().toPrecision(3),
                        p2: Math.random().toPrecision(3),
                        p3: Math.random().toPrecision(3),
                        p4: Math.random().toPrecision(3)
                    };

                default:
                    return {p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000}; // ease
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
             *
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
                if (typeof jWorkflow !== "undefined") {
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
 *
 */
alice.format = {
    /**
     *
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
     *
     */
    coords: function (c) {
        "use strict";
        var cObj = alice.coords(c),
            cVal = cObj.x + " " + cObj.y;
        return cVal;
    },

    /**
     *
     */
    easing: function (e) {
        "use strict";
        var eObj = alice.easing(e),
            eVal = "cubic-bezier(" + eObj.p1 + ", " + eObj.p2 + ", " + eObj.p3 + ", " + eObj.p4 + ")";
        return eVal;
    },

    /**
     *
     */
    oppositeNumber: function (n) {
        "use strict";
        return -n;
    }
};

/**
 *
 */
alice.helper = {
    /**
     *
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
     *
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

//----------------------------------------------------------------------------

/*jslint devel: true, browser: true, white: true, nomen: true */
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

        // temporary variables
        calc = {},
        container, elems, elem, i, animId, css, transformStart, transformOver, transformEnd, boxShadowStart, boxShadowEnd, dir, size, shadowSize;

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

            // Configure settings
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
            transformStart = "";
            transformStart += (flip) ? " rotate" + flip.axis + "(" + flip.start + "deg)" : " translate" + axis + "(" + posStart + "px)";
            transformStart += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateStart + "deg)" : "";
            transformStart += " scale(" + scaleFrom + ")";

            transformOver = "";
            transformOver += (flip) ? " rotate" + flip.axis + "(" + Math.floor((1 + overshoot) * flip.end) + "deg)" : " translate" + axis + "(" + over + "px)";
            transformOver += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateOver + "deg)" : "";
            transformOver += (scaleTo > 1) ? " scale(" + scaleTo + ")" : "";
            transformOver += " scale(" + scaleTo + ")";

            transformEnd = "";
            transformEnd += (flip) ? " rotate" + flip.axis + "(" + flip.end + "deg)" : " translate" + axis + "(" + posEnd + "px)";

            if (move === "" && direction === "alternate") {
                transformEnd += " rotate(" + alice.format.oppositeNumber(calc.rotateStart) + "deg)";
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

            //console.log(css);

            // Insert keyframe rule
            alice.keyframeInsert(css);

            // Apply perspective to parent container
            container.style[alice.prefixJS + "Perspective"] = perspective + "px";
            container.style[alice.prefixJS + "PerspectiveOrigin"] = alice.format.coords(perspectiveOrigin); // alice.coords();

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
alice.plugins.bounce = function (elems, scale, shadow, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("bounce: ", arguments);

    var scaleObj = {from: "100%", to: "125%"}; // default
    if (scale) {
        if (typeof scale === "object") {
            scaleObj = scale;
        }
        else {
            scaleObj.to = scale;
        }
    }

    var opts = {
        elems: elems,

        //scale: scale || {from: "100%", to: "125%"},
        scale: scaleObj,
        shadow: shadow || false,

        duration: duration || "750ms",
        timing: timing || "easeOutSine",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
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
alice.plugins.dance = function (elems, rotate, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("dance: ", arguments);

    var opts = {
        elems: elems,

        rotate: rotate || 45,

        duration: duration || "750ms",
        timing: timing || "easeInOutBack",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
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
alice.plugins.drain = function (elems, fade, rotate, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("drain: ", arguments);

    var opts = {
        scale: (fade === "in") ? {from: "1%", to: "100%"} : {from: "100%", to: "1%"},

        elems: elems,

        fade: fade || "out",
        rotate: rotate || -2880,

        duration: duration || "4500ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
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
alice.plugins.fade = function (elems, fade, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("fade: ", arguments);

    var opts = {
        elems: elems,

        fade: fade || "in",

        duration: duration || "4500ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
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
alice.plugins.hinge = function (elems, rotate, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("hinge: ", arguments);

    var opts = {
        perspectiveOrigin: "top-left",

        elems: elems,

        rotate: rotate || 25,
        overshoot: overshoot || 0,

        duration: duration || "1000ms",
        timing: timing || "linear",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
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
alice.plugins.pageFlip = function (elems, flip, turns, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("pageFlip: ", arguments);

    var perspectiveOrigin = "left";

    switch (flip) {
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
        perspectiveOrigin: perspectiveOrigin,

        elems: elems,

        flip: flip || "left",
        turns: turns || 1,
        overshoot: overshoot || 0,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
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
alice.plugins.pendulum = function (elems, rotate, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("pendulum: ", arguments);

    var opts = {
        perspectiveOrigin: "top",

        elems: elems,

        rotate: rotate || 45,
        overshoot: overshoot || 0,

        duration: duration || "1000ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
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
alice.plugins.phantomZone = function (elems, fade, rotate, flip, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("phantomZone: ", arguments);

    var opts = {
        scale: (fade === "in") ? {from: "1%", to: "100%"} : {from: "100%", to: "1%"},

        elems: elems,

        fade: fade || "out",
        rotate: rotate || -720,
        flip: flip || "left",

        duration: duration || "5000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
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
alice.plugins.raceFlag = function (elems, rotate, perspectiveOrigin, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("raceFlag: ", arguments);

    var opts = {
        flip: "down",

        elems: elems,

        rotate: rotate || -720,
        perspectiveOrigin: perspectiveOrigin || "top-right",

        duration: duration || "3000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
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
alice.plugins.slide = function (elems, move, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("slide: ", arguments);

    var opts = {
        elems: elems,

        move: move,
        overshoot: overshoot,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
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
alice.plugins.spin = function (elems, flip, turns, overshoot, duration, timing, delay, iteration, playstate) {
    "use strict";
    console.info("spin: ", arguments);

    var opts = {
        perspectiveOrigin: "center",
        direction: "normal",

        elems: elems,

        flip: flip || "left",
        turns: turns || 1,
        overshoot: overshoot || 0,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        playstate: playstate
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
alice.plugins.toss = function (elems, move, overshoot, perspectiveOrigin, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("toss: ", arguments);

    var opts = {
        rotate: (move === "left" || move === "down") ? 720 : -720,
        fade: "in",

        elems: elems,

        move: move,
        overshoot: overshoot,
        perspectiveOrigin: perspectiveOrigin,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
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
alice.plugins.twirl = function (elems, flip, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("twirl: ", arguments);

    var opts = {
        rotate: (flip === "left") ? -135 : 135,

        elems: elems,

        flip: flip || "left",

        duration: duration || "3000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
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
alice.plugins.wobble = function (elems, rotate, perspectiveOrigin, duration, timing, delay, iteration, playstate) {
    "use strict";
    console.info("wobble: ", arguments);

    var opts = {
        elems: elems,

        rotate: rotate || 5,
        perspectiveOrigin: perspectiveOrigin || "center",

        duration: duration || "200ms",
        timing: timing || "linear",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: "alternate",
        playstate: playstate
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
alice.plugins.zoom = function (elems, scale, shadow, move, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("zoom: ", arguments);

    var scaleObj = {from: "100%", to: "125%"}; // default
    if (scale) {
        if (typeof scale === "object") {
            scaleObj = scale;
            //scaleObj = {from: alice.percentage(scale.from), to: alice.percentage(scale.to)};
        }
        else {
            scaleObj.to = scale;
        }
    }

    var opts = {
        elems: elems,

        scale: scaleObj,
        shadow: shadow || false,

        move: move || "none",

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

//----------------------------------------------------------------------------

