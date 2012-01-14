/*jslint devel: true, browser: true, white: true, nomen: true */

/* ===========================================================================
 * alice.plugins.slide.js
 * ===========================================================================
 */

/**
 *
 */
alice.plugins.slide = function (params) {
    "use strict";

    console.info("slide", params);

    var formatDuration = function (d) {
            var dObj = alice._duration(d),
                dVal = alice._randomize(dObj.value, dObj.randomness) + "ms";

            return dVal;
        },

        formatCoords = function (c) {
            var cObj = alice._coords(c),
                cVal = cObj.x + " " + cObj.y;

            return cVal;
        },

        formatEasing = function (e) {
            var eObj = alice._easing(e),
                eVal = "cubic-bezier(" + eObj.p1 + ", " + eObj.p2 + ", " + eObj.p3 + ", " + eObj.p4 + ")";

            return eVal;
        },

        oppositeNumber = function (n) {
            var oNum = (n > 0) ? -n : Math.abs(n);
            return oNum;
        },

        getValue = function (obj, val) {
            //console.log("typeof", obj, typeof obj);
            if (obj) {
                if (obj.value) {
                    return obj.value;
                }
                else {
                    return obj;
                }
            }
            else {
                return val;
            }
        },

/*
        setSize = function (elem) {
            console.info("setSize");
            if (elem.children[0]) {
                elem.children[0].onload = function (ev) {
                    if (alice.debug) {
                        console.log(ev, elem, alice, alice.width, alice.height);
                    }

                    elem.style.width = alice.width;
                    elem.style.height = alice.height;
                };
            }
        },
*/

        // Initialize variables
        delay = getValue(params.delay, 0),
        duration = getValue(params.duration, 2000),

        timing = params.timing || "ease",
        iteration = params.iteration || 1,
        direction = params.direction || "normal",
        playstate = params.playstate || "running",

        perspective = params.perspective || "1000",
        perspectiveOrigin = params.perspectiveOrigin || "center",
        backfaceVisibility = params.backfaceVisibility || "visible",

        overshoot = alice._percentage(params.overshoot) || 0,
        overShootPercent = 85,

        rotate = params.rotate || 0,
        rotateStart = alice._percentage(rotate) * 100,
        rotateOver = overshoot * 100,
        rotateEnd = 0,

        flip = params.flip || null,
        flipStart = 0,
        flipEnd = (flip && (flip === "right" || flip === "up")) ? 360 : -360,
        //flipEnd = (flip && (flip === "right" || flip === "up")) ? 180 : -180,
        flipOver = Math.floor((1 + overshoot) * flipEnd),
        flipAxis = (flip && (flip === "left" || flip === "right")) ? "Y" : "X",

        fade = (params.fade && params.fade !== "") ? params.fade : null,
        fadeStart = (fade && fade === "out") ? 1 : 0,
        fadeEnd = (fade && fade === "out") ? 0 : 1,

        scale = alice._percentage(params.scale) || 1,

        move = "",
        axis = "",
        sign = 1,
        posStart = 0,
        posEnd = params.posEnd || 0,
        over = posEnd + (sign * Math.floor(posEnd * overshoot)),

        container, elems, elem, i, animId, css, transformStart, transformOver, transformEnd, boxShadowStart, boxShadowEnd, dir, size, shadowSize;

    if (alice.elems !== null) {
        elems = alice.elems;
    }
    else if (params.elems) {
        elems = alice._elements(params.elems);
    }

    // Loop through elements
    if (elems && elems.length > 0) {
        for (i = 0; i < elems.length; i += 1) {
            elem = elems[i];
            container = elem.parentElement || elem.parentNode;

            //setSize(elem);

            if (params.delay && params.delay.offset) {
                //console.log(duration, params.duration.offset);
                delay = parseInt(delay, 10) + parseInt(params.delay.offset, 10);
                delay = delay + "ms";
            }

            if (params.duration && params.duration.offset) {
                //console.log(duration, params.duration.offset);
                duration = parseInt(duration, 10) + parseInt(params.duration.offset, 10);
                duration = duration + "ms";
            }

            if (alice.debug) {
                console.log("delay=" + delay, "duration=" + duration);
            }

            // Generate animation ID
            animId = alice.id + "-slide-" + (new Date()).getTime() + "-" + Math.floor(Math.random() * 1000000);

            if (alice.debug) {
                console.log(elem, elem.style, elem.clientWidth, elem.clientHeight);
            }

            // Configure settings
            if (params.move) {
                dir = params.move.direction || params.move;
                switch (dir) {
                case "left":
                    move = "Left";
                    axis = "X";
                    sign = -1;
                    size = window.innerWidth;
                    posStart = (params.move.start) ? alice._pixel(params.move.start, size) : size;
                    posEnd = (params.move.end) ? alice._pixel(params.move.end, size) : 0;
                    over = sign * Math.floor(posStart * overshoot);
                    break;
                case "right":
                    move = "Right";
                    axis = "X";
                    sign = 1;
                    size = document.body.offsetWidth - elem.clientWidth;
                    posStart = (params.move.start) ? alice._pixel(params.move.start, size) : 0;
                    posEnd = (params.move.end) ? alice._pixel(params.move.end, size) : size;
                    over = posEnd + (sign * Math.floor(posEnd * overshoot));
                    break;
                case "up":
                    move = "Up";
                    axis = "Y";
                    sign = -1;
                    size = window.innerHeight;
                    posStart = (params.move.start) ? alice._pixel(params.move.start, size) : size;
                    posEnd = (params.move.end) ? alice._pixel(params.move.end, size) : 0;
                    over = sign * Math.floor(posStart * overshoot);
                    break;
                case "down":
                    move = "Down";
                    axis = "Y";
                    sign = 1;
                    size = alice._docHeight() - (container.clientHeight * 3);
                    posStart = (params.move.start) ? alice._pixel(params.move.start, size) : 0;
                    posEnd = (params.move.end) ? alice._pixel(params.move.end, size) : size;
                    over = posEnd + (sign * Math.floor(posEnd * overshoot));

                    if (alice.debug) {
                        console.log(alice._docHeight(), window.innerHeight, window.pageYOffset, container.clientHeight);
                    }
                    break;
                }
            }

            // Generate transforms
            transformStart = "";
            transformStart += (flip) ? " rotate" + flipAxis + "(" + flipStart + "deg)" : " translate" + axis + "(" + posStart + "px)";
            transformStart += (rotate && rotate !== "0%") ? " rotate(" + rotateStart + "deg)" : "";
            transformStart += (scale) ? " scale(1)" : "";

            transformOver = "";
            transformOver += (flip) ? " rotate" + flipAxis + "(" + flipOver + "deg)" : " translate" + axis + "(" + over + "px)";
            transformOver += (rotate && rotate !== "0%") ? " rotate(" + rotateOver + "deg)" : "";
            transformOver += (scale) ? " scale(" + scale + ")" : "";

            transformEnd = "";
            transformEnd += (flip) ? " rotate" + flipAxis + "(" + flipEnd + "deg)" : " translate" + axis + "(" + posEnd + "px)";

            if (move === "" && direction === "alternate") {
                transformEnd += " rotate(" + oppositeNumber(rotateStart) + "deg)";
            }
            else {
                transformEnd += (rotate && rotate !== "0%") ? " rotate(" + rotateEnd + "deg)" : "";
            }

            transformEnd += (scale) ? " scale(" + scale + ")" : "";

            // Generate box shadow
            if (scale > 1) {
                shadowSize = Math.round(scale * 10);
                boxShadowStart = " 0px 0px 0px rgba(0, 0, 0, 1)";
                boxShadowEnd = " " + shadowSize + "px " + shadowSize + "px " + shadowSize + "px rgba(0, 0, 0, 0.5)";

                if (alice.debug) {
                    console.log("scale=" + scale, shadowSize);
                }
            }

            // Generate CSS for keyframe rule
            css = "";
            css += "@" + alice.prefix + "keyframes " + animId + " {\n";

            css += "\t" + "0% {" + "\n";
            css += "\t\t" + " " + alice.prefix + "transform:" + transformStart + ";" + "\n";
            css += "\t\t" + " " + alice.prefix + "transform-origin:" + formatCoords(perspectiveOrigin) + ";" + "\n";
            css += (fade) ? "\t\t" + "opacity: " + fadeStart + ";" + "\n" : "";
            css += (scale > 1) ? "\t\t" + alice.prefix + "box-shadow: " + boxShadowStart + ";" + "\n" : "";

            css += "\t" + "}" + "\n";

            if (overshoot !== 0) {
                css += "\t" + overShootPercent + "% {\n";
                css += "\t\t" + " " + alice.prefix + "transform:" + transformOver + ";" + "\n";
                css += "\t\t" + " " + alice.prefix + "transform-origin:" + formatCoords(perspectiveOrigin) + ";" + "\n";
                css += "\t" + "}" + "\n";
            }

            css += "\t" + "100% {" + "\n";
            css += "\t\t" + " " + alice.prefix + "transform:" + transformEnd + ";" + "\n";
            css += "\t\t" + " " + alice.prefix + "transform-origin:" + formatCoords(perspectiveOrigin) + ";" + "\n";
            css += (fade) ? "\t\t" + "opacity: " + fadeEnd + ";" + "\n" : "";
            css += (scale > 1) ? "\t\t" + alice.prefix + "box-shadow: " + boxShadowEnd + ";" + "\n" : "";

            css += "\t" + "}" + "\n";

            css += "}" + "\n";

            //console.log(css);

            // Insert keyframe rule
            alice._keyframeInsert(css);

            // Apply perspective to parent container
            container.style[alice.prefixJS + "Perspective"] = perspective;
            container.style[alice.prefixJS + "PerspectiveOrigin"] = formatCoords(perspectiveOrigin); // alice._coords();

            // Apply properties to elements
            elem.style[alice.prefixJS + "BackfaceVisibility"] = backfaceVisibility;

            elem.style[alice.prefixJS + "AnimationName"] = animId;
            elem.style[alice.prefixJS + "AnimationDelay"] = formatDuration(delay);
            elem.style[alice.prefixJS + "AnimationDuration"] = formatDuration(duration);
            elem.style[alice.prefixJS + "AnimationTimingFunction"] = formatEasing(timing);
            elem.style[alice.prefixJS + "AnimationIterationCount"] = iteration;
            elem.style[alice.prefixJS + "AnimationDirection"] = direction;
            elem.style[alice.prefixJS + "AnimationPlayState"] = playstate;

            // Apply styles from last key frame
            elem.style[alice.prefixJS + "Transform"] = transformEnd;
            elem.style.opacity = (fade) ? fadeEnd : "";
            elem.style[alice.prefixJS + "BoxShadow"] = (scale > 1) ? boxShadowEnd : "";

            // Add listener to clear animation after it's done
            if ("MozAnimation" in elem.style) {
                elem.addEventListener("animationend", alice._clearAnimation, false);
            }
            else {
                elem.addEventListener(alice.prefixJS + "AnimationEnd", alice._clearAnimation, false);
            }

            if (alice.debug) {
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

/**
 *
 */
alice.plugins.slideLeft = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "left";
    //console.info("slideLeft", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.slideRight = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "right";
    //console.info("slideRight", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.slideUp = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "up";
    //console.info("slideUp", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.slideDown = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "down";
    //console.info("slideDown", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.tossLeft = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "left";
    p.rotate = 720;
    p.fade = "in";
    //console.info("tossLeft", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.tossRight = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "right";
    p.rotate = -720;
    p.fade = "in";
    //console.info("tossRight", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.tossUp = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "up";
    p.rotate = -720;
    p.fade = "in";
    //console.info("tossUp", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.tossDown = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "down";
    p.rotate = 720;
    p.fade = "in";
    //console.info("tossDown", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.spinLeft = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "left";
    //console.info("spinLeft", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.spinRight = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "right";
    //console.info("spinRight", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.spinUp = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "up";
    //console.info("spinUp", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.spinDown = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "down";
    //console.info("spinDown", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.pushForward = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.scale = "150%";
    //console.info("pushForward", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.pushBackward = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.scale = "50%";
    //console.info("pushBackward", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.fadeIn = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "none";
    p.fade = "in";
    //console.info("fadeIn", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.fadeOut = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "none";
    p.fade = "out";
    //console.info("fadeOut", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.drain = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "none";
    p.rotate = -720;
    p.fade = "out";
    p.scale = 1;
    //console.info("drain", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.phantomZone = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "none";
    p.rotate = -720;
    p.flip = "left";
    p.fade = "out";
    p.scale = 1;
    //console.info("phantomZone", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.pageFlipLeft = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "left";
    p.perspectiveOrigin = "left";
    //console.info("pageFlipLeft", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.pageFlipRight = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "right";
    p.perspectiveOrigin = "right";
    //console.info("pageFlipRight", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.pageFlipUp = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "up";
    p.perspectiveOrigin = "top";
    //console.info("pageFlipUp", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.pageFlipDown = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "down";
    p.perspectiveOrigin = "bottom";
    //console.info("pageFlipDown", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.twirlFromLeft = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "none";
    p.rotate = -135;
    p.flip = "left";
    p.perspectiveOrigin = "left";
    //console.info("twirlFromLeft", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.twirlFromRight = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "none";
    p.rotate = 135;
    p.flip = "right";
    p.perspectiveOrigin = "right";
    //console.info("twirlFromRight", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.raceFlag = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "up";
    p.rotate = -720;
    p.flip = "down";
    p.perspectiveOrigin = "top-right";
    //console.info("raceFlag", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.hinge = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.duration = "1s";
    p.timing = "linear";
    p.iteration = "infinite";
    p.direction = "alternate";
    p.move = "none";
    p.rotate = 45;
    p.overshoot = 0;
    p.perspectiveOrigin = "top-left";
    //console.info("hinge", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.wobble = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.duration = "200ms";
    p.timing = "linear";
    p.iteration = "infinite";
    p.direction = "alternate";
    p.move = "none";
    p.rotate = 10;
    p.overshoot = 0;
    p.perspectiveOrigin = "center";
    //console.info("wobble", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.dance = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.duration = "500ms";
    p.timing = "easeInOutBack";
    p.iteration = "infinite";
    p.direction = "alternate";
    p.move = "none";
    p.rotate = 45;
    p.overshoot = 0;
    p.perspectiveOrigin = "center";
    //console.info("dance", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.pendulum = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.duration = "1s";
    p.timing = "ease-in-out";
    p.iteration = "infinite";
    p.direction = "alternate";
    p.move = "none";
    p.rotate = 45;
    p.overshoot = 0;
    p.perspectiveOrigin = "top";
    //console.info("hinge", p);
    alice.plugins.slide(p);
    return p;
};

/**
 *
 */
alice.plugins.bounce = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.scale = "125%";
    p.duration = "500ms";
    p.timing = "easeOutSine";
    p.iteration = "infinite";
    p.direction = "alternate";
    p.move = "none";
    //console.info("bounce", p);
    alice.plugins.slide(p);
    return p;
};

//----------------------------------------------------------------------------