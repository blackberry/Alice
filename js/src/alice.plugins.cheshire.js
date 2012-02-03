/*jslint devel: true, browser: true, white: true, nomen: true */

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
        rotateStart = alice.percentage(rotate) * 100,
        rotateOver = overshoot * 100,
        rotateEnd = 0,

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

            calc.delay = alice.helper.duration(params.delay, calc.delay, delay);
            calc.duration = alice.helper.duration(params.duration, calc.duration, duration);

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
            transformStart += (rotate && parseInt(rotate, 10) !== 0) ? " rotate(" + rotateStart + "deg)" : "";
            transformStart += " scale(" + scaleFrom + ")";

            transformOver = "";
            transformOver += (flip) ? " rotate" + flip.axis + "(" + Math.floor((1 + overshoot) * flip.end) + "deg)" : " translate" + axis + "(" + over + "px)";
            transformOver += (rotate && parseInt(rotate, 10) !== 0) ? " rotate(" + rotateOver + "deg)" : "";
            transformOver += (scaleTo > 1) ? " scale(" + scaleTo + ")" : "";
            transformOver += " scale(" + scaleTo + ")";

            transformEnd = "";
            transformEnd += (flip) ? " rotate" + flip.axis + "(" + flip.end + "deg)" : " translate" + axis + "(" + posEnd + "px)";

            if (move === "" && direction === "alternate") {
                transformEnd += " rotate(" + alice.format.oppositeNumber(rotateStart) + "deg)";
            }
            else {
                transformEnd += (rotate && parseInt(rotate, 10) !== 0) ? " rotate(" + rotateEnd + "deg)" : "";
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
                //console.log(container.style);
                //console.log(elem.id, alice.prefixJS, elem.style, elem.style.cssText, elem.style[alice.prefixJS + "AnimationDuration"], elem.style[alice.prefixJS + "AnimationTimingFunction"]);
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

    switch(flip) {
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

