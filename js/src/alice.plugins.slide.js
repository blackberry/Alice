/*jslint devel: true, browser: true, white: true, nomen: true */

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
    var opts = alice._mergeOptions({
        move: "left"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.slideRight = function (params) {
    var opts = alice._mergeOptions({
        move: "right"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.slideUp = function (params) {
    var opts = alice._mergeOptions({
        move: "up"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.slideDown = function (params) {
    var opts = alice._mergeOptions({
        move: "down"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.tossLeft = function (params) {
    var opts = alice._mergeOptions({
        move: "left",
        rotate: 720,
        fade: "in"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.tossRight = function (params) {
    var opts = alice._mergeOptions({
        move: "right",
        rotate: -720,
        fade: "in"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.tossUp = function (params) {
    var opts = alice._mergeOptions({
        move: "up",
        rotate: -720,
        fade: "in"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.tossDown = function (params) {
    var opts = alice._mergeOptions({
        move: "down",
        rotate: 720,
        fade: "in"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.spinLeft = function (params) {
    var opts = alice._mergeOptions({
        flip: "left"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.spinRight = function (params) {
    var opts = alice._mergeOptions({
        flip: "right"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.spinUp = function (params) {
    var opts = alice._mergeOptions({
        flip: "up"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.spinDown = function (params) {
    var opts = alice._mergeOptions({
        flip: "down"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.pushForward = function (params) {
    var opts = alice._mergeOptions({
        scale: "150%"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.pushBackward = function (params) {
    var opts = alice._mergeOptions({
        scale: "50%"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.fadeIn = function (params) {
    var opts = alice._mergeOptions({
        move: "none",
        fade: "in"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.fadeOut = function (params) {
    var opts = alice._mergeOptions({
        move: "none",
        fade: "out"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.drain = function (params) {
    var opts = alice._mergeOptions({
        move: "none",
        rotate: -720,
        fade: "out",
        scale: 1
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.phantomZone = function (params) {
    var opts = alice._mergeOptions({
        move: "none",
        rotate: -720,
        flip: "left",
        fade: "out",
        scale: 1
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.pageFlipLeft = function (params) {
    var opts = alice._mergeOptions({
        flip: "left",
        perspectiveOrigin: "left"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.pageFlipRight = function (params) {
    var opts = alice._mergeOptions({
        flip: "right",
        perspectiveOrigin: "right"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.pageFlipUp = function (params) {
    var opts = alice._mergeOptions({
        flip: "up",
        perspectiveOrigin: "top"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.pageFlipDown = function (params) {
    var opts = alice._mergeOptions({
        flip: "down",
        perspectiveOrigin: "bottom"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.twirlFromLeft = function (params) {
    var opts = alice._mergeOptions({
        move: "none",
        rotate: -135,
        flip: "left",
        perspectiveOrigin: "left"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.twirlFromRight = function (params) {
    var opts = alice._mergeOptions({
        move: "none",
        rotate: 135,
        flip: "right",
        perspectiveOrigin: "right"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.raceFlag = function (params) {
    var opts = alice._mergeOptions({
        move: "up",
        rotate: -720,
        flip: "down",
        perspectiveOrigin: "top-right"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.hinge = function (params) {
    var opts = alice._mergeOptions({
        duration: "1s",
        timing: "linear",
        iteration: "infinite",
        direction: "alternate",
        move: "none",
        rotate: 45,
        overshoot: 0,
        perspectiveOrigin: "top-left"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.wobble = function (params) {
    var opts = alice._mergeOptions({
        duration: "200ms",
        timing: "linear",
        iteration: "infinite",
        direction: "alternate",
        move: "none",
        rotate: 5,
        overshoot: 0,
        perspectiveOrigin: "center"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.dance = function (params) {
    var opts = alice._mergeOptions({
        duration: "500ms",
        timing: "easeInOutBack",
        iteration: "infinite",
        direction: "alternate",
        move: "none",
        rotate: 45,
        overshoot: 0,
        perspectiveOrigin: "center"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.pendulum = function (params) {
    var opts = alice._mergeOptions({
        duration: "1000ms",
        timing: "ease-in-out",
        iteration: "infinite",
        direction: "alternate",
        move: "none",
        rotate: 45,
        overshoot: 0,
        perspectiveOrigin: "top"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

/**
 *
 */
alice.plugins.bounce = function (params) {
    var opts = alice._mergeOptions({
        scale: "125%",
        duration: "500ms",
        timing: "easeOutSine",
        iteration: "infinite",
        direction: "alternate",
        move: "none"
    }, params);

    alice.plugins.slide(opts);
    return opts;
};

//----------------------------------------------------------------------------
