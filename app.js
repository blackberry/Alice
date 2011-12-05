/*jslint devel: true, browser: true, white: true, nomen: true */

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
    var i, j, elem, container, perspective, transform,
        transformFunctions = [
            "rotate", "rotateX", "rotateY",
            "scale", "scaleX", "scaleY",
            "skew", "skewX", "skewY",
            "translate", "translateX", "translateY"
        ];

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

        console.log(elem.id + ": perspective=" + perspective + ", transform=" + transform);

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
    console.log("Applying " + param.value);

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
                ret = alice.slideLeft(p);
                break;
            case "slideRight":
                ret = alice.slideRight(p);
                break;
            case "slideUp":
                ret = alice.slideUp(p);
                break;
            case "slideDown":
                ret = alice.slideDown(p);
                break;
            case "tossLeft":
                ret = alice.tossLeft(p);
                break;
            case "tossRight":
                ret = alice.tossRight(p);
                break;
            case "tossUp":
                ret = alice.tossUp(p);
                break;
            case "tossDown":
                ret = alice.tossDown(p);
                break;
            case "flipLeft":
                ret = alice.flipLeft(p);
                break;
            case "flipRight":
                ret = alice.flipRight(p);
                break;
            case "flipUp":
                ret = alice.flipUp(p);
                break;
            case "flipDown":
                ret = alice.flipDown(p);
                break;
            case "pushForward":
                ret = alice.pushForward(p);
                break;
            case "pushBackward":
                ret = alice.pushBackward(p);
                break;
            default:
                ret = alice.slide(p);
                break;
        }

        //console.warn(ret, this.serialize(ret));

        if (document.getElementById("json")) {
            //document.getElementById("json").innerHTML += JSON.stringify(ret) + "\n\n";
            document.getElementById("json").innerHTML += this.serialize(ret) + "\n\n";
        }
    }
};
