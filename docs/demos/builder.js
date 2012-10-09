/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

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
 * builder.js
 * ===========================================================================
 */

var a = alice.init();

a.slide({
    elems: "elem1",
    move: "left",
    duration: {
        "value": "1000ms",
        "randomness": "0%",
        "offset": "150ms"
    }
});

// if (typeof jWorkflow !== "undefined") {
//     a.start();
// }

//----------------------------------------------------------------------------

var app = {};

/**
 *
 */
app.serialize = function (obj) {
    "use strict";

    var val, vArr, vObj, i, attr;

    if (obj !== undefined) {
        switch (obj.constructor) {
        case "Array":
            vArr = "[";
            for (i = 0; i < obj.length; i += 1) {
                if (i > 0) {
                    vArr += ",";
                }
                vArr += this.serialize(obj[i]);
            }
            vArr += "]";
            return vArr;
        case "String":
            val = '"' + obj + '"';
            return val;
        case "Number":
            val = isFinite(obj) ? obj.toString() : null;
            return val;
        case "Date":
            val = "#" + obj + "#";
            return val;
        default:
            if (typeof obj === "object") {
                vObj = [];

                for (attr in obj) {
                    //console.log(attr, typeof obj[attr], obj[attr]);
                    if (obj.hasOwnProperty(attr)) {
                        if (attr === "elems") {
                            vObj.push('"' + attr + '": ["' + obj[attr].id + '"]');
                        }
                        else if (typeof obj[attr] !== "function") {
                            if (typeof obj[attr] === "object" || typeof obj[attr] === "number") {
                                vObj.push('"' + attr + '": ' + this.serialize(obj[attr]));
                            }
                            else {
                                vObj.push('"' + attr + '": "' + this.serialize(obj[attr]) + '"');
                            }
                        }
                    }
                }

                if (vObj.length > 0) {
                    return "{" + vObj.join(",") + "}";
                }
                else {
                    return "{}";
                }
            }
            else {
                return obj.toString();
            }
        }
    }

    return null;
};

/**
 *
 */
app.applyStyle = function () {
    "use strict";

    var i, j, elem, container, perspective, transform,
        transformFunctions = ["rotate", "rotateX", "rotateY", "scale", "scaleX", "scaleY", "skew", "skewX", "skewY", "translate", "translateX", "translateY"];

    for (i = 1; i <= 1; i += 1) {
        elem = document.getElementById("elem" + i);
        container = document.getElementById("container" + i);

        perspective = document.getElementById("transform_perspective" + i).value;

        transform = "";

        for (j = 0; j < transformFunctions.length; j += 1) {
            if (document.getElementById("transform_" + transformFunctions[j] + i)) {
                if (document.getElementById("transform_" + transformFunctions[j] + i).value !== "") {
                    transform += " " + transformFunctions[j] + "(" + document.getElementById("transform_" + transformFunctions[j] + i).value + ")";
                }
            }
            else {
                console.warn("Skipping " + "transform_" + transformFunctions[j] + i);
            }
        }

        if (a.debug) {
            console.log(elem.id + ": perspective=" + perspective + ", transform=" + transform);
        }

        if ("MozTransform" in elem.style) {
            container.style.MozPerspective = perspective;
            elem.style.MozTransform = transform;
        }
        else if (alice.prefix + "transform" in elem.style) {
            container.style[alice.prefix + "perspective"] = perspective;
            elem.style[alice.prefix + "transform"] = transform;
        }
        else {
            console.warn("Transform not supported in this browser.");
        }
    }
};

/**
 *
 */
app.applyEffect = function (param) {
    "use strict";

    //console.info("applyEffect " + param.value, param);

    if (document.getElementById("json")) {
        document.getElementById("json").innerHTML = "";
    }

    var i, p, ret;

    for (i = 1; i <= 1; i += 1) {
        p = {
            elems: document.getElementById("elem" + i),

            delay: {
                value: document.getElementById("delay" + i).value,
                randomness: document.getElementById("randomness" + i).value
            },
            duration: {
                value: document.getElementById("duration" + i).value,
                randomness: document.getElementById("randomness" + i).value
            },
            timing: document.getElementById("timing" + i).value,
            iteration: document.getElementById("iteration" + i).value,
            direction: document.getElementById("direction" + i).value,
            playstate: document.getElementById("playstate" + i).value,

            move: document.getElementById("move" + i).value,
            rotate: document.getElementById("rotate" + i).value,
            flip: document.getElementById("flip" + i).value,
            turns: document.getElementById("turns" + i).value,
            fade: document.getElementById("fade" + i).value,
            scale: {
                from: document.getElementById("scaleFrom" + i).value,
                to: document.getElementById("scaleTo" + i).value
            },
            shadow: document.getElementById("shadow" + i).checked,
            overshoot: document.getElementById("overshoot" + i).value,
            perspective: document.getElementById("perspective" + i).value,
            perspectiveOrigin: document.getElementById("perspective_origin" + i).value,
            backfaceVisibility: document.getElementById("backface_visibility" + i).value
        };

        switch (param.value) {
        case "drain (in)":
            p.fade = "in";
            p.rotate = 720;
            ret = a.drain({elems: p.elems, fade: p.fade, rotate: p.rotate, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "drain (out)":
            p.fade = "out";
            p.rotate = -720;
            ret = a.drain({elems: p.elems, fade: p.fade, rotate: p.rotate, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "fade (in)":
            p.fade = "in";
            ret = a.fade({elems: p.elems, fade: p.fade, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "fade (out)":
            p.fade = "out";
            ret = a.fade({elems: p.elems, fade: p.fade, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "pageFlip (left)":
            p.flip = "left";
            ret = a.pageFlip({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "pageFlip (right)":
            p.flip = "right";
            ret = a.pageFlip({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "pageFlip (up)":
            p.flip = "up";
            ret = a.pageFlip({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "pageFlip (down)":
            p.flip = "down";
            ret = a.pageFlip({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "phantomZone (in)":
            p.fade = "in";
            p.rotate = 720;
            p.flip = "right";
            ret = a.phantomZone({elems: p.elems, fade: p.fade, rotate: p.rotate, flip: p.flip, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "phantomZone (out)":
            p.fade = "out";
            p.rotate = -720;
            p.flip = "left";
            ret = a.phantomZone({elems: p.elems, fade: p.fade, rotate: p.rotate, flip: p.flip, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "raceFlag":
            p.rotate = -720;
            p.perspectiveOrigin = "top-right";
            ret = a.raceFlag({elems: p.elems, rotate: p.rotate, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "slide (left)":
            p.move = "left";
            ret = a.slide({elems: p.elems, move: p.move, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "slide (right)":
            p.move = "right";
            ret = a.slide({elems: p.elems, move: p.move, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "slide (up)":
            p.move = "up";
            ret = a.slide({elems: p.elems, move: p.move, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "slide (down)":
            p.move = "down";
            ret = a.slide({elems: p.elems, move: p.move, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "spin (left)":
            p.flip = "left";
            ret = a.spin({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, playstate: p.playstate});
            break;
        case "spin (right)":
            p.flip = "right";
            ret = a.spin({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, playstate: p.playstate});
            break;
        case "spin (up)":
            p.flip = "up";
            ret = a.spin({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, playstate: p.playstate});
            break;
        case "spin (down)":
            p.flip = "down";
            ret = a.spin({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, playstate: p.playstate});
            break;

        case "toss (left)":
            p.move = "left";
            ret = a.toss({elems: p.elems, move: p.move, overshoot: p.overshoot, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "toss (right)":
            p.move = "right";
            ret = a.toss({elems: p.elems, move: p.move, overshoot: p.overshoot, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "toss (up)":
            p.move = "up";
            ret = a.toss({elems: p.elems, move: p.move, overshoot: p.overshoot, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "toss (down)":
            p.move = "down";
            ret = a.toss({elems: p.elems, move: p.move, overshoot: p.overshoot, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "twirl (from left)":
            p.flip = "left";
            ret = a.twirl({elems: p.elems, flip: p.flip, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "twirl (from right)":
            p.flip = "right";
            ret = a.twirl({elems: p.elems, flip: p.flip, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "zoom (125%)":
            p.scale = {from: "100%", to: "125%"};
            p.shadow = true;
            p.move = "left";
            ret = a.zoom({elems: p.elems, scale: p.scale, shadow: p.shadow, move: p.move, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "zoom (75%)":
            p.scale = {from: "100%", to: "75%"};
            p.shadow = false;
            p.move = "left";
            ret = a.zoom({elems: p.elems, scale: p.scale, shadow: p.shadow, move: p.move, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "bounce":
            p.scale = {from: "100%", to: "125%"};
            p.shadow = true;
            p.duration = "500ms";
            p.timing = "easeOutSine";
            p.iteration = "infinite";
            p.direction = "alternate";
            ret = a.bounce({elems: p.elems, scale: p.scale, shadow: p.shadow, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "dance":
            p.duration = "500ms";
            p.timing = "easeInOutBack";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.rotate = 45;
            ret = a.dance({elems: p.elems, rotate: p.rotate, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "hinge":
            p.duration = "1000ms";
            p.timing = "linear";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.rotate = 45;
            p.overshoot = 0;
            ret = a.hinge({elems: p.elems, rotate: p.rotate, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "pendulum":
            p.duration = "1000ms";
            p.timing = "ease-in-out";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.rotate = 45;
            p.overshoot = 0;
            ret = a.pendulum({elems: p.elems, rotate: p.rotate, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "wobble":
            p.duration = "200ms";
            p.timing = "linear";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.rotate = 5;
            p.perspectiveOrigin = "center";
            ret = a.wobble({elems: p.elems, rotate: p.rotate, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        default:
            ret = a.cheshire(p);
            break;
        }

        // if (typeof jWorkflow !== "undefined") {
        //     a.start();
        // }

        if (document.getElementById("json")) {
            //document.getElementById("json").innerHTML += JSON.stringify(ret) + "\n\n";
            document.getElementById("json").innerHTML += "alice.cheshire(" + this.serialize(ret) + ");" + "\n\n";
        }
    }
};

/**
 *
 */
app.handleChange = function (elem, ids) {
    var state;
    for (var i = 0; i < ids.length; i++) {
        state = (elem.value === "custom") ? "block" : "none";
        document.getElementById(ids[i]).style.display = state;
    }
};
