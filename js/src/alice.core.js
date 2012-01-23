/*jslint devel: true, browser: true, white: true, nomen: true */
/*global jWorkflow: false */

/* Copyright 2011-2012 Research In Motion Limited.
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

/* ===========================================================================
 * AliceJS
 *
 * @description
 * A Lightweight Independent CSS Engine
 *
 * @author Laurent Hasson (@ldhasson)
 * @author Jim Ing (@jim_ing)
 * ===========================================================================
 */

/**
 * @description
 *
 */
var alice = (function () {
    "use strict";

    var
/*
        _private = function () {
            //console.info("_private"); // TODO: future use?
        },
*/
        core = {
            id: "alice",
            name: "AliceJS",
            description: "A Lightweight Independent CSS Engine",
            version: "0.2",
            build: "20120123-1600",

            prefix: "",
            prefixJS: "",

            elems: null,

            format: {},
            plugins: {},

            debug: false,

            /**
             * Returns array of elements
             */
            _elements: function (params) {
                //console.info("_elements", params, typeof params);
                var elems = [],
                    i;

                if (typeof params === "string") {
                    elems.push(document.getElementById(params)); // "myId1"
                }
                else if (typeof params === "object") { // TODO: check for DOMElement?
                    if (params.length === undefined) {
                        elems.push(params); // myElem1
                    }
                    else if (params.length === 1) {
                        elems.push(document.getElementById(params[0])); // ["myId2"]
                    }
                    else if (params.length > 0) {
                        for (i = 0; i < params.length; i += 1) {
                            if (document.getElementById(params[i])) {
                                elems.push(document.getElementById(params[i])); // ["myId3-1", "myId3-2", "myId3-3"]
                            }
                            // Chrome NodeList
                            else {
                                // ignore Text
                                if (params[i].nodeType !== 3) {
                                    elems.push(params[i]); // myElem4.childNodes
                                }
                            }
                        }
                    }
                }
                // Safari NodeList
                else if (typeof params === "function") {
                    if (params.length > 0) {
                        for (i = 0; i < params.length; i += 1) {
                            // ignore Text
                            if (params[i].nodeType !== 3) {
                                elems.push(params[i]); // myElem4.childNodes
                            }
                        }
                    }
                }

                //console.log(elems);
                return elems;
            },

            /**
             * Returns random number +/- the factor
             */
            _randomize: function (num, factor) {
                var f, r;

                if (typeof factor === "string" && factor.indexOf("%") > -1) {
                    f = parseInt(factor, 10) / 100;
                }
                else {
                    f = parseFloat(factor, 10);
                }

                r = num + num * ((Math.random() * 2 * f) - f);

                return Math.floor(r);
            },

            /**
             * Returns duration in milliseconds
             */
            _duration: function (params) {
                //console.info("_duration", params, typeof params);
                var dur,
                    rnd = params.randomness || 0,

                    parseDurStr = function (d) {
                        var pd;
                        if (d.indexOf("ms") > -1) {
                            pd = parseInt(d, 10); // "2000ms"
                        }
                        else if (d.indexOf("s") > -1) {
                            pd = parseFloat(d, 10) * 1000; // "2s", "1.5s"
                        }
                        else {
                            pd = parseInt(d, 10); // "2000"
                        }
                        return pd;
                    };

                if (typeof params === "number") {
                    dur = params; // 2000
                }
                else if (typeof params === "string") {
                    dur = parseDurStr(params);
                }
                else if (typeof params === "object") {
                    if (typeof params.value === "string") {
                        dur = parseDurStr(params.value);
                    }
                    else {
                        dur = parseInt(params.value, 10); // {value: 2000}
                    }
                }

                //console.log("dur=" + dur);
                return {
                    value: dur,
                    randomness: rnd
                };
            },

            /**
             * Returns x and y coordinates as percentages
             */
            _coords: function (params) {
                //console.info("_coords", params);
                if (params === undefined || params === null) {
                    return {
                        x: "50%",
                        y: "50%"
                    }; // center
                }

                if (typeof params === "string") {
                    switch (params) {
                    case "top-left":
                        return {
                            x: "0%",
                            y: "0%"
                        };
                    case "top-center":
                        return {
                            x: "50%",
                            y: "0%"
                        };
                    case "top-right":
                        return {
                            x: "100%",
                            y: "0%"
                        };
                    case "middle-left":
                        return {
                            x: "0%",
                            y: "50%"
                        };
                    case "middle-center":
                        return {
                            x: "50%",
                            y: "50%"
                        };
                    case "middle-right":
                        return {
                            x: "100%",
                            y: "50%"
                        };
                    case "bottom-left":
                        return {
                            x: "0%",
                            y: "100%"
                        };
                    case "bottom-center":
                        return {
                            x: "50%",
                            y: "100%"
                        };
                    case "bottom-right":
                        return {
                            x: "100%",
                            y: "100%"
                        };

                    // shortcuts
                    case "top":
                        return {
                            x: "50%",
                            y: "0%"
                        };
                    case "left":
                        return {
                            x: "0%",
                            y: "50%"
                        };
                    case "center":
                        return {
                            x: "50%",
                            y: "50%"
                        };
                    case "right":
                        return {
                            x: "100%",
                            y: "50%"
                        };
                    case "bottom":
                        return {
                            x: "50%",
                            y: "100%"
                        };

                    // compass shortcuts
                    case "NW":
                        return {
                            x: "0%",
                            y: "0%"
                        };
                    case "N":
                        return {
                            x: "50%",
                            y: "0%"
                        };
                    case "NE":
                        return {
                            x: "100%",
                            y: "0%"
                        };
                    case "W":
                        return {
                            x: "0%",
                            y: "50%"
                        };
                    case "E":
                        return {
                            x: "100%",
                            y: "50%"
                        };
                    case "SW":
                        return {
                            x: "0%",
                            y: "100%"
                        };
                    case "S":
                        return {
                            x: "50%",
                            y: "100%"
                        };
                    case "SE":
                        return {
                            x: "100%",
                            y: "100%"
                        };

                    default:
                        return {
                            x: "50%",
                            y: "50%"
                        }; // center
                    }
                }

                return params; // {x: 320, y: 240}
            },

            /**
             * Returns cubic bezier function
             */
            _easing: function (params) {
                switch (params) {
                // Standard
                case "linear":
                    return {
                        p1: 0.250,
                        p2: 0.250,
                        p3: 0.750,
                        p4: 0.750
                    };
                case "ease":
                    return {
                        p1: 0.250,
                        p2: 0.100,
                        p3: 0.250,
                        p4: 1.000
                    };
                case "ease-in":
                    return {
                        p1: 0.420,
                        p2: 0.000,
                        p3: 1.000,
                        p4: 1.000
                    };
                case "ease-out":
                    return {
                        p1: 0.000,
                        p2: 0.000,
                        p3: 0.580,
                        p4: 1.000
                    };
                case "ease-in-out":
                    return {
                        p1: 0.420,
                        p2: 0.000,
                        p3: 0.580,
                        p4: 1.000
                    };

                // Penner Equations (approximate)
                case "easeInQuad":
                    return {
                        p1: 0.550,
                        p2: 0.085,
                        p3: 0.680,
                        p4: 0.530
                    };
                case "easeInCubic":
                    return {
                        p1: 0.550,
                        p2: 0.055,
                        p3: 0.675,
                        p4: 0.190
                    };
                case "easeInQuart":
                    return {
                        p1: 0.895,
                        p2: 0.030,
                        p3: 0.685,
                        p4: 0.220
                    };
                case "easeInQuint":
                    return {
                        p1: 0.755,
                        p2: 0.050,
                        p3: 0.855,
                        p4: 0.060
                    };
                case "easeInSine":
                    return {
                        p1: 0.470,
                        p2: 0.000,
                        p3: 0.745,
                        p4: 0.715
                    };
                case "easeInExpo":
                    return {
                        p1: 0.950,
                        p2: 0.050,
                        p3: 0.795,
                        p4: 0.035
                    };
                case "easeInCirc":
                    return {
                        p1: 0.600,
                        p2: 0.040,
                        p3: 0.980,
                        p4: 0.335
                    };
                case "easeInBack":
                    return {
                        p1: 0.600,
                        p2: -0.280,
                        p3: 0.735,
                        p4: 0.045
                    };
                case "easeOutQuad":
                    return {
                        p1: 0.250,
                        p2: 0.460,
                        p3: 0.450,
                        p4: 0.940
                    };
                case "easeOutCubic":
                    return {
                        p1: 0.215,
                        p2: 0.610,
                        p3: 0.355,
                        p4: 1.000
                    };
                case "easeOutQuart":
                    return {
                        p1: 0.165,
                        p2: 0.840,
                        p3: 0.440,
                        p4: 1.000
                    };
                case "easeOutQuint":
                    return {
                        p1: 0.230,
                        p2: 1.000,
                        p3: 0.320,
                        p4: 1.000
                    };
                case "easeOutSine":
                    return {
                        p1: 0.390,
                        p2: 0.575,
                        p3: 0.565,
                        p4: 1.000
                    };
                case "easeOutExpo":
                    return {
                        p1: 0.190,
                        p2: 1.000,
                        p3: 0.220,
                        p4: 1.000
                    };
                case "easeOutCirc":
                    return {
                        p1: 0.075,
                        p2: 0.820,
                        p3: 0.165,
                        p4: 1.000
                    };
                case "easeOutBack":
                    return {
                        p1: 0.175,
                        p2: 0.885,
                        p3: 0.320,
                        p4: 1.275
                    };
                case "easeInOutQuad":
                    return {
                        p1: 0.455,
                        p2: 0.030,
                        p3: 0.515,
                        p4: 0.955
                    };
                case "easeInOutCubic":
                    return {
                        p1: 0.645,
                        p2: 0.045,
                        p3: 0.355,
                        p4: 1.000
                    };
                case "easeInOutQuart":
                    return {
                        p1: 0.770,
                        p2: 0.000,
                        p3: 0.175,
                        p4: 1.000
                    };
                case "easeInOutQuint":
                    return {
                        p1: 0.860,
                        p2: 0.000,
                        p3: 0.070,
                        p4: 1.000
                    };
                case "easeInOutSine":
                    return {
                        p1: 0.445,
                        p2: 0.050,
                        p3: 0.550,
                        p4: 0.950
                    };
                case "easeInOutExpo":
                    return {
                        p1: 1.000,
                        p2: 0.000,
                        p3: 0.000,
                        p4: 1.000
                    };
                case "easeInOutCirc":
                    return {
                        p1: 0.785,
                        p2: 0.135,
                        p3: 0.150,
                        p4: 0.860
                    };
                case "easeInOutBack":
                    return {
                        p1: 0.680,
                        p2: -0.550,
                        p3: 0.265,
                        p4: 1.550
                    };

                // Custom
                case "custom":
                    return {
                        p1: 0.000,
                        p2: 0.350,
                        p3: 0.500,
                        p4: 1.300
                    };

                // Random (between 0 and 1)
                case "random":
                    return {
                        p1: Math.random().toPrecision(3),
                        p2: Math.random().toPrecision(3),
                        p3: Math.random().toPrecision(3),
                        p4: Math.random().toPrecision(3)
                    };

                default:
                    return {
                        p1: 0.250,
                        p2: 0.100,
                        p3: 0.250,
                        p4: 1.000
                    }; // ease
                }
            },

            /**
             * Returns percentage in decimal form
             */
            _percentage: function (params) {
                //console.info("_percentage", params);
                var pct;

                if (typeof params === "string") {
                    if (params.indexOf("%") > -1) {
                        pct = parseInt(params, 10) / 100; // "5%"
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

                //console.log("pct=" + pct);
                return pct;
            },

            /**
             * Set vendor prefix
             */
            _prefix: function () {
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
            _docHeight: function () {
                var D = document;

                return Math.max(
                Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
            },

            /**
             *
             */
            _pixel: function (p, w) {
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
            _keyframeInsert: function (rule) {
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
            _keyframeDelete: function (ruleName) {
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
            _clearAnimation: function (evt) {
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
                alice._keyframeDelete(evt.animationName);

                return;
            },

            /**
             * Merge options
             */
/*
            _mergeOptions: function (defaults, options) {
                //console.info("_mergeOptions", defaults, options);
                if (options) {
                    var name;
                    for (name in defaults) {
                        if (!options.hasOwnProperty(name)) {
                            options[name] = defaults[name];
                        }
                    }
                }
                else {
                    options = defaults;
                }
                //console.warn(options);

                return options;
            },
*/

            /**
             * Initialize
             */
            init: function (params) {
                console.info("Initializing " + this.name + " (" + this.description + ") " + this.version);

                //_private();

                this._prefix();

                if (params && params.elems) {
                    this.elems = this._elements(params.elems);
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

alice.format = {
    /**
     *
     */
    duration: function (d) {
        "use strict";
        var dObj = alice._duration(d),
            dVal = alice._randomize(dObj.value, dObj.randomness) + "ms";
        return dVal;
    },

    /**
     *
     */
    coords: function (c) {
        "use strict";
        var cObj = alice._coords(c),
            cVal = cObj.x + " " + cObj.y;
        return cVal;
    },

    /**
     *
     */
    easing: function (e) {
        "use strict";
        var eObj = alice._easing(e),
            eVal = "cubic-bezier(" + eObj.p1 + ", " + eObj.p2 + ", " + eObj.p3 + ", " + eObj.p4 + ")";
        return eVal;
    },

    /**
     *
     */
    oppositeNumber: function (n) {
        "use strict";
        return -n;
    },

    /**
     *
     */
    getValue: function (obj, val) {
        "use strict";
        return obj && obj.value ? obj.value : obj ? obj : val;
    }
};

//----------------------------------------------------------------------------

