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

var a = alice.init();

a.slideLeft({
    "elems": ["elem1", "elem2"],
    "duration": {
        "value": "1000ms",
        "randomness": "0%",
        "offset": "150ms"
    }
});

if (typeof jWorkflow !== "undefined") {
    a.start();
}

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

    var i, j, elem, container, perspective, transform, transformFunctions = ["rotate", "rotateX", "rotateY", "scale", "scaleX", "scaleY", "skew", "skewX", "skewY", "translate", "translateX", "translateY"];

    for (i = 1; i <= 2; i += 1) {
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

    for (i = 1; i <= 2; i += 1) {
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
            fade: document.getElementById("fade" + i).value,
            scale: document.getElementById("scale" + i).value,
            overshoot: document.getElementById("overshoot" + i).value,
            //randomness: document.getElementById("randomness" + i).value,
            perspective: document.getElementById("perspective" + i).value,
            perspectiveOrigin: document.getElementById("perspective_origin" + i).value,
            backfaceVisibility: document.getElementById("backface_visibility" + i).value
        };

        switch (param.value) {
        case "slideLeft":
            p.move = "left";
            ret = a.slideLeft(p);
            break;
        case "slideRight":
            p.move = "right";
            ret = a.slideRight(p);
            break;
        case "slideUp":
            p.move = "up";
            ret = a.slideUp(p);
            break;
        case "slideDown":
            p.move = "down";
            ret = a.slideDown(p);
            break;

        case "tossLeft":
            p.move = "left";
            p.rotate = 720;
            p.fade = "in";
            ret = a.tossLeft(p);
            break;
        case "tossRight":
            p.move = "right";
            p.rotate = -720;
            p.fade = "in";
            ret = a.tossRight(p);
            break;
        case "tossUp":
            p.move = "up";
            p.rotate = -720;
            p.fade = "in";
            ret = a.tossUp(p);
            break;
        case "tossDown":
            p.move = "down";
            p.rotate = 720;
            p.fade = "in";
            ret = a.tossDown(p);
            break;

        case "spinLeft":
            p.flip = "left";
            ret = a.spinLeft(p);
            break;
        case "spinRight":
            p.flip = "right";
            ret = a.spinRight(p);
            break;
        case "spinUp":
            p.flip = "up";
            ret = a.spinUp(p);
            break;
        case "spinDown":
            p.flip = "down";
            ret = a.spinDown(p);
            break;

        case "pushForward":
            p.scale = "150%";
            ret = a.pushForward(p);
            break;
        case "pushBackward":
            p.scale = "50%";
            ret = a.pushBackward(p);
            break;

        case "fadeIn":
            p.move = "none";
            p.fade = "in";
            ret = a.fadeIn(p);
            break;
        case "fadeOut":
            p.move = "none";
            p.fade = "out";
            ret = a.fadeOut(p);
            break;

        case "drain":
            p.move = "none";
            p.rotate = -720;
            p.fade = "out";
            p.scale = 1;
            ret = a.drain(p);
            break;

        case "phantomZone":
            p.move = "none";
            p.rotate = -720;
            p.flip = "left";
            p.fade = "out";
            p.scale = 1;
            ret = a.phantomZone(p);
            break;

        case "pageFlipLeft":
            p.flip = "left";
            p.perspectiveOrigin = "left";
            ret = a.pageFlipLeft(p);
            break;
        case "pageFlipRight":
            p.flip = "right";
            p.perspectiveOrigin = "right";
            ret = a.pageFlipRight(p);
            break;
        case "pageFlipUp":
            p.flip = "up";
            p.perspectiveOrigin = "top";
            ret = a.pageFlipUp(p);
            break;
        case "pageFlipDown":
            p.flip = "down";
            p.perspectiveOrigin = "bottom";
            ret = a.pageFlipDown(p);
            break;

        case "twirlFromLeft":
            p.move = "none";
            p.rotate = -135;
            p.flip = "left";
            p.perspectiveOrigin = "left";
            ret = a.twirlFromLeft(p);
            break;
        case "twirlFromRight":
            p.move = "none";
            p.rotate = 135;
            p.flip = "right";
            p.perspectiveOrigin = "right";
            ret = a.twirlFromRight(p);
            break;

        case "raceFlag":
            p.move = "up";
            p.rotate = -720;
            p.flip = "down";
            p.perspectiveOrigin = "top-right";
            ret = a.raceFlag(p);
            break;

        case "hinge":
            p.duration = "1000ms";
            p.timing = "linear";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.move = "none";
            p.rotate = 45;
            p.overshoot = 0;
            p.perspectiveOrigin = "top-left";
            ret = a.hinge(p);
            break;

        case "wobble":
            p.duration = "200ms";
            p.timing = "linear";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.move = "none";
            p.rotate = 5;
            p.overshoot = 0;
            p.perspectiveOrigin = "center";
            ret = a.wobble(p);
            break;

        case "dance":
            p.duration = "500ms";
            p.timing = "easeInOutBack";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.move = "none";
            p.rotate = 45;
            p.overshoot = 0;
            p.perspectiveOrigin = "center";
            ret = a.dance(p);
            break;

        case "pendulum":
            p.duration = "1000ms";
            p.timing = "ease-in-out";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.move = "none";
            p.rotate = 45;
            p.overshoot = 0;
            p.perspectiveOrigin = "top";
            ret = a.pendulum(p);
            break;

        case "bounce":
            p.scale = "125%";
            p.duration = "500ms";
            p.timing = "easeOutSine";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.move = "none";
            ret = a.bounce(p);
            break;

        default:
            ret = a.slide(p);
            break;
        }

        if (typeof jWorkflow !== "undefined") {
            a.start();
        }

        if (document.getElementById("json")) {
            //document.getElementById("json").innerHTML += JSON.stringify(ret) + "\n\n";
            document.getElementById("json").innerHTML += "alice.slide(" + this.serialize(ret) + ");" + "\n\n";
        }
    }
};
