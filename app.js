/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

var a = alice.init();

a.slideLeft({
    "elems": ["elem1", "elem2"],
    "duration": {
        "value": "1000ms",
        "randomness": "0%",
        "offset": "150ms"
    }
});

if (typeof jWorkflow != "undefined") {
    a.start();
}

var app = {

};

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
                    //console.warn(attr, typeof obj[attr], obj[attr]);
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
            ret = a.slideLeft(p);
            break;
        case "slideRight":
            ret = a.slideRight(p);
            break;
        case "slideUp":
            ret = a.slideUp(p);
            break;
        case "slideDown":
            ret = a.slideDown(p);
            break;
        case "tossLeft":
            ret = a.tossLeft(p);
            break;
        case "tossRight":
            ret = a.tossRight(p);
            break;
        case "tossUp":
            ret = a.tossUp(p);
            break;
        case "tossDown":
            ret = a.tossDown(p);
            break;
        case "spinLeft":
            ret = a.spinLeft(p);
            break;
        case "spinRight":
            ret = a.spinRight(p);
            break;
        case "spinUp":
            ret = a.spinUp(p);
            break;
        case "spinDown":
            ret = a.spinDown(p);
            break;
        case "pushForward":
            ret = a.pushForward(p);
            break;
        case "pushBackward":
            ret = a.pushBackward(p);
            break;
        case "fadeIn":
            ret = a.fadeIn(p);
            break;
        case "fadeOut":
            ret = a.fadeOut(p);
            break;
        case "drain":
            ret = a.drain(p);
            break;
        case "phantomZone":
            ret = a.phantomZone(p);
            break;
        case "pageFlipLeft":
            ret = a.pageFlipLeft(p);
            break;
        case "pageFlipRight":
            ret = a.pageFlipRight(p);
            break;
        case "pageFlipUp":
            ret = a.pageFlipUp(p);
            break;
        case "pageFlipDown":
            ret = a.pageFlipDown(p);
            break;
        case "twirlFromLeft":
            ret = a.twirlFromLeft(p);
            break;
        case "twirlFromRight":
            ret = a.twirlFromRight(p);
            break;
        case "raceFlag":
            ret = a.raceFlag(p);
            break;
        case "hinge":
            ret = a.hinge(p);
            break;
        case "wobble":
            ret = a.wobble(p);
            break;
        case "dance":
            ret = a.dance(p);
            break;
        case "pendulum":
            ret = a.pendulum(p);
            break;
        case "bounce":
            ret = a.bounce(p);
            break;
        default:
            ret = a.slide(p);
            break;
        }

        if (typeof jWorkflow != "undefined") {
            a.start();
        }

        //console.warn(ret, this.serialize(ret));
        if (document.getElementById("json")) {
            //document.getElementById("json").innerHTML += JSON.stringify(ret) + "\n\n";
            document.getElementById("json").innerHTML += "alice.slide(" + this.serialize(ret) + ");" + "\n\n";
        }
    }
};
