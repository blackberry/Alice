/*jslint devel: true, browser: true, white: true, nomen: true */

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
        /**
         * private
         */
        _private = function () {
            console.info("_private");
        },

        // public
        core = {
            id: "alice",
            name: "AliceJS",
            description: "A Lightweight Independent CSS Engine",
            version: "0.2",

            prefix: "",
            prefixJS: "",

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
                else if (typeof params === "object") { // TODO: check for DOMElement
                    if (params.length === undefined) {
                        elems.push(params); // myElem1
                    }
/*
                    else if (params.length === 1) {
                        elems.push(document.getElementById(params[0])); // ["myId2"]
                    }
*/
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

                if (num && factor) {
                    if (typeof factor === "string" && factor.indexOf("%") > -1) {
                        f = parseInt(factor, 10) / 100;
                    }
                    else {
                        f = parseFloat(factor, 10);
                    }

                    r = num + num * ((Math.random() * 2 * f) - f);
                }

                return Math.floor(r);
            },

            /**
             * Returns duration in milliseconds
             */
            _duration: function (params) {
                //console.info("_duration", params, typeof params);
                var dur;

                if (typeof params === "number") {
                    dur = params; // 2000
                }
                else if (typeof params === "string") {
                    if (params.indexOf("ms") > -1) {
                        dur = parseInt(params, 10); // "2000ms"
                    }
                    else if (params.indexOf("s") > -1) {
                        dur = parseInt(params, 10) * 1000; // "2s"
                    }
                    else {
                        dur = parseInt(params, 10); // "2000"
                    }
                }
                else if (typeof params === "object") {
                    if (typeof params.value === "string") {
                        if (params.value.indexOf("ms") > -1) {
                           dur = parseInt(params.value, 10); // {value: "2000ms"}
                        }
                        else if (params.value.indexOf("s") > -1) {
                            dur = parseInt(params.value, 10) * 1000; // {value: "2s"}
                        }
                        else {
                            dur = parseInt(params.value, 10); // {value: "2000"}
                        }
                    }
                    else {
                        dur = parseInt(params.value, 10); // {value: 2000}
                    }

                    if (params.randomness) {
                        dur = this._randomize(dur, params.randomness);
                    }
                }

                dur += "ms";

                //console.log("dur=" + dur);
                return dur;
            },

            /**
             * Returns x and y coordinates as percentages
             */
            _coords: function (params) {
                //console.info("_coords", params);

                if (params === undefined || params === null) {
                    return "50% 50%"; // center
                }

                if (typeof params === "string") {
                    switch (params) {
                        case "top-left"     : return "0% 0%";
                        case "top-center"   : return "50% 0%";
                        case "top-right"    : return "100% 0%";
                        case "middle-left"  : return "0% 50%";
                        case "middle-center": return "50% 50%";
                        case "middle-right" : return "100% 50%";
                        case "bottom-left"  : return "0% 100%";
                        case "bottom-center": return "50% 100%";
                        case "bottom-right" : return "100% 100%";

                        // shortcuts
                        case "top"          : return "50% 0%";
                        case "left"         : return "0% 50%";
                        case "center"       : return "50% 50%";
                        case "right"        : return "100% 50%";
                        case "bottom"       : return "50% 100%";

                        case "NW"           : return "0% 0%";
                        case "N"            : return "50% 0%";
                        case "NE"           : return "100% 0%";
                        case "W"            : return "0% 50%";
                        case "E"            : return "100% 50%";
                        case "SW"           : return "0% 100%";
                        case "S"            : return "50% 100%";
                        case "SE"           : return "100% 100%";

                        default             : return "50% 50%"; // center
                    }
                }

                return params;
            },

            /**
             * Returns cubic bezier function
             */
            _easing: function (params) {
                var cb = "cubic-bezier";

                switch (params) {
                    // Standard
                    case "linear"        : return cb + "(0.250, 0.250, 0.750, 0.750)";
                    case "ease"          : return cb + "(0.250, 0.100, 0.250, 1.000)";
                    case "ease-in"       : return cb + "(0.420, 0.000, 1.000, 1.000)";
                    case "ease-out"      : return cb + "(0.000, 0.000, 0.580, 1.000)";
                    case "ease-in-out"   : return cb + "(0.420, 0.000, 0.580, 1.000)";

                    // Penner Equations (approximate)
                    case "easeInQuad"    : return cb + "(0.550, 0.085, 0.680, 0.530)";
                    case "easeInCubic"   : return cb + "(0.550, 0.055, 0.675, 0.190)";
                    case "easeInQuart"   : return cb + "(0.895, 0.030, 0.685, 0.220)";
                    case "easeInQuint"   : return cb + "(0.755, 0.050, 0.855, 0.060)";
                    case "easeInSine"    : return cb + "(0.470, 0.000, 0.745, 0.715)";
                    case "easeInExpo"    : return cb + "(0.950, 0.050, 0.795, 0.035)";
                    case "easeInCirc"    : return cb + "(0.600, 0.040, 0.980, 0.335)";
                    case "easeInBack"    : return cb + "(0.600, -0.280, 0.735, 0.045)";
                    case "easeOutQuad"   : return cb + "(0.250, 0.460, 0.450, 0.940)";
                    case "easeOutCubic"  : return cb + "(0.215, 0.610, 0.355, 1.000)";
                    case "easeOutQuart"  : return cb + "(0.165, 0.840, 0.440, 1.000)";
                    case "easeOutQuint"  : return cb + "(0.230, 1.000, 0.320, 1.000)";
                    case "easeOutSine"   : return cb + "(0.390, 0.575, 0.565, 1.000)";
                    case "easeOutExpo"   : return cb + "(0.190, 1.000, 0.220, 1.000)";
                    case "easeOutCirc"   : return cb + "(0.075, 0.820, 0.165, 1.000)";
                    case "easeOutBack"   : return cb + "(0.175, 0.885, 0.320, 1.275)";
                    case "easeInOutQuad" : return cb + "(0.455, 0.030, 0.515, 0.955)";
                    case "easeInOutCubic": return cb + "(0.645, 0.045, 0.355, 1.000)";
                    case "easeInOutQuart": return cb + "(0.770, 0.000, 0.175, 1.000)";
                    case "easeInOutQuint": return cb + "(0.860, 0.000, 0.070, 1.000)";
                    case "easeInOutSine" : return cb + "(0.445, 0.050, 0.550, 0.950)";
                    case "easeInOutExpo" : return cb + "(1.000, 0.000, 0.000, 1.000)";
                    case "easeInOutCirc" : return cb + "(0.785, 0.135, 0.150, 0.860)";
                    case "easeInOutBack" : return cb + "(0.680, -0.550, 0.265, 1.550)";

                    // Custom
                    case "bounce"        : return cb + "(0.000, 0.350, 0.500, 1.300)";

                    // Random (between 0 and 1)
                    case "random"        : return cb + "(" + Math.random().toPrecision(3) + ", " + Math.random().toPrecision(3) + ", " + Math.random().toPrecision(3) + ", " + Math.random().toPrecision(3) + ")";

                    default              : return cb + "(0.250, 0.100, 0.250, 1.000)"; // ease
                }

                return;
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
                        console.log("Deleted keyframe: " + ruleName);
                        break;
                    }
                }

                return;
            },

            /**
             * Set vendor prefix
             */
            _prefix: function () {
                var el = document.createElement("div");

                // Safari 4+, iOS Safari 3.2+, Chrome 2+, and Android 2.1+
                //if (el.style.hasOwnProperty("webkitAnimation")) {
                if ("webkitAnimation" in el.style) {
                    this.prefix = "-webkit-";
                    this.prefixJS = "webkit";
                }
                // Firefox 5+
                //else if (el.style.hasOwnProperty("MozAnimation")) {
                else if ("MozAnimation" in el.style) {
                    this.prefix = "-moz-";
                    this.prefixJS = "Moz";
                }
                // Internet Explorer 10+
                //else if (el.style.hasOwnProperty("MSAnimation")) {
                else if ("MSAnimation" in el.style) {
                    this.prefix = "-ms-";
                    this.prefixJS = "MS";
                }
                // Opera?
                //else if (el.style.hasOwnProperty("OAnimation")) {
                else if ("OAnimation" in el.style || "OTransform" in el.style) {
                    this.prefix = "-o-";
                    this.prefixJS = "O";
                }
                else {
                    this.prefix = "";
                    this.prefixJS = "";
                }

                console.log(this.prefix, this.prefixJS);
                return;
            },

            /**
             * Clear animation settings
             */
            _clearAnimation: function (evt) {
                //console.log("_clearAnimation", this, evt.srcElement.id, evt.animationName, evt.elapsedTime);

                this.style[this.prefixJS + "AnimationName"] = "";
                this.style[this.prefixJS + "AnimationDelay"] = "";
                this.style[this.prefixJS + "AnimationDuration"] = "";
                this.style[this.prefixJS + "AnimationTimingFunction"] = "";
                this.style[this.prefixJS + "AnimationIterationCount"] = "";
                this.style[this.prefixJS + "AnimationDirection"] = "";
                //this.style[this.prefixJS + "AnimationFillMode"] = "";
                this.style[this.prefixJS + "AnimationPlayState"] = "";

                alice._keyframeDelete(evt.animationName);

                return;
            },

            /**
             * Initialize
             */
            init: function () {
                console.info("Initializing " + this.name + " (" + this.description + ") " + this.version);

                this._prefix();
                _private();

                return;
            }
        };

    return core;
}());

