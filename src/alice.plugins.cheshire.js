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
 * cheshire performs the actual build of the animation
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

        cleanUp = params.cleanUp || 'partial',

        // temporary variables
        calc = {}, container, elems, elem, i, animId, css, transformStart, transformOver, transformEnd, boxShadowStart, boxShadowEnd, dir, size, shadowSize;

    // needs to be an option in the fx elements
    if(params.cleanUp === 'partial'){
        alice.cleaner.removeAni(params.elems);
    }else if(params.cleanUp === 'total'){
        alice.cleaner.removeElems(params.elems);
    }

    // Set the elements using our means of grabbing elements
    elems = alice.elements(params.elems);

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

            // Configure movement settings
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
            // Animation @ 0%
            transformStart = "";
            transformStart += (flip) ? " rotate" + flip.axis + "(" + flip.start + "deg)" : " translate" + axis + "(" + posStart + "px)";
            transformStart += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateStart + "deg)" : "";
            transformStart += " scale(" + scaleFrom + ")";

            // Animation @ 85%
            transformOver = "";
            transformOver += (flip) ? " rotate" + flip.axis + "(" + Math.floor((1 + overshoot) * flip.end) + "deg)" : " translate" + axis + "(" + over + "px)";
            transformOver += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateOver + "deg)" : "";
            transformOver += (scaleTo > 1) ? " scale(" + scaleTo + ")" : "";
            transformOver += " scale(" + scaleTo + ")";

            // Animation @ 100%
            transformEnd = "";
            transformEnd += (flip) ? " rotate" + flip.axis + "(" + flip.end + "deg)" : " translate" + axis + "(" + posEnd + "px)";

            if (move === "" && direction === "alternate") {
                transformEnd += " rotate(" + (-(calc.rotateStart)) + "deg)";
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

            console.log(css);

            // Insert keyframe rule
            alice.keyframeInsert(css);

            // Apply perspective to parent container
            container.style[alice.prefixJS + "Perspective"] = perspective + "px";
            container.style[alice.prefixJS + "PerspectiveOrigin"] = alice.format.coords(perspectiveOrigin);

            // Apply properties to elements
            elem.style[alice.prefixJS + "BackfaceVisibility"] = backfaceVisibility;

            elem.style[alice.prefixJS + "AnimationName"] = animId;
            elem.style[alice.prefixJS + "AnimationDelay"] = calc.delay;
            elem.style[alice.prefixJS + "AnimationDuration"] = calc.duration;
            elem.style[alice.prefixJS + "AnimationTimingFunction"] = alice.format.easing(timing);
            elem.style[alice.prefixJS + "AnimationIterationCount"] = iteration;
            elem.style[alice.prefixJS + "AnimationDirection"] = direction;
            elem.style[alice.prefixJS + "AnimationPlayState"] = playstate;

            elem.style[alice.prefixJS + "AnimationFillMode"] = 'forwards';

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
alice.plugins.bounce = function (params) {
    "use strict";
    console.info("bounce: ", arguments);

    if(!params){ params = ''; }

    var scaleObj = {from: "100%", to: "150%"}; // default
    if (params.scale) {
        if (typeof params.scale === "object") {
            scaleObj = params.scale;
        }
        else {
            scaleObj.to = params.scale;
        }
    }

    var opts = {
        elems: params.elems || alice.anima,

        scale: scaleObj,
        shadow: params.shadow || true,

        duration: params.duration || "750ms",
        timing: params.timing || "easeOutSine",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate || "running"
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
alice.plugins.dance = function (params) {
    "use strict";
    console.info("dance: ", arguments);

     if(!params){ params = ''; }

    var opts = {

        elems: params.elems || alice.anima,

        rotate: params.rotate || 45,

        duration: params.duration || "750ms",
        timing: params.timing || "easeInOutBack",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate || "running"
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
alice.plugins.drain = function (params) {
    "use strict";
    console.info("drain: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        scale: (params.fade === "in") ? {from: "0%", to: "100%"} : {from: "100%", to: "0%"},

        elems: params.elems || alice.anima,

        //fade: params.fade || "out",
        rotate: params.rotate || -2880,

        duration: params.duration || "4500ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
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
alice.plugins.fade = function (params) {
    "use strict";
    console.info("fade: ", arguments);

    if(!params){ params = ''; }

    var opts = {

        elems: params.elems || alice.anima,

        fade: params.fade || "in",

        duration: params.duration || "4500ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
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
alice.plugins.hinge = function (params) {
    "use strict";
    console.info("hinge: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        perspectiveOrigin: "top-left",

        elems: params.elems || alice.anima,

        rotate: params.rotate || 25,
        overshoot: params.overshoot || 0,

        duration: params.duration || "1000ms",
        timing: params.timing || "linear",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate || "running"
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
alice.plugins.pageFlip = function (params) {
    "use strict";
    console.info("pageFlip: ", arguments);

    if(!params){ params = ''; }

    var perspectiveOrigin = "";

    switch (params.flipDirection) {
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
        perspectiveOrigin: perspectiveOrigin || 'left',

        elems: params.elems || alice.anima,

        flip: params.flipDirection || "left",
        turns: params.turns || 1,
        overshoot: params.overshoot || 0,

        duration: params.duration || "2000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 'infinite',
        direction: params.direction || 'normal',
        playstate: params.playstate || 'running'
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
alice.plugins.pendulum = function (params) {
    "use strict";
    console.info("pendulum: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        perspectiveOrigin: "top",

        elems: params.elems || alice.anima,

        rotate: params.rotate || 45,
        overshoot: params.overshoot || 0,

        duration: params.duration || "2000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate || "running"
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
alice.plugins.phantomZone = function (params) {
    "use strict";
    console.info("phantomZone: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        scale: (params.fade === "in") ? {from: "1%", to: "100%"} : {from: "100%", to: "1%"},

        elems: params.elems || alice.anima,

        //fade: params.fade || "out", //blocked this out due to a problem with Chrome 21
        rotate: params.rotate || -720,
        flip: params.flip || "left",

        duration: params.duration || "5000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
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
alice.plugins.raceFlag = function (params) {
    "use strict";
    console.info("raceFlag: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        flip: "down",

        elems: params.elems || alice.anima,

        rotate: params.rotate || -720,
        perspectiveOrigin: params.perspectiveOrigin || "top-right",

        duration: params.duration || "3000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
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
alice.plugins.slide = function (params) {
    "use strict";
    console.info("slide: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,

        move: params.move || 'left',
        overshoot: params.overshoot || '0',

        duration: params.duration || '4000ms',
        timing: params.timing || "ease-in-out",
        delay: params.delay || '0ms',
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
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
alice.plugins.spin = function (params) {
    "use strict";
    console.info("spin: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        perspectiveOrigin: "center",
        direction: "normal",

        elems: params.elems || alice.anima,

        flip: params.flip || "left",
        turns: params.turns || 1,
        overshoot: params.overshoot || 0,

        duration: params.duration || "1200ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        playstate: params.playstate || "running"
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
alice.plugins.toss = function (params) {
    "use strict";
    console.info("toss: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        rotate: (params.move === "left" || params.move === "down") ? 720 : -720,
        //fade: "in",

        elems: params.elems || alice.anima,

        move: params.move || "right",
        overshoot: params.overshoot || 0,
        perspectiveOrigin: params.perspectiveOrigin || "center",

        duration: params.duration || "2500ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
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
alice.plugins.twirl = function (params) {
    "use strict";
    console.info("twirl: ", arguments);

    if(!params){params = '';}

    var opts = {
        rotate: (params.flip === "left") ? -135 : 135,

        elems: params.elems || alice.anima,

        flip: params.flip || "left",

        duration: params.duration || "3000ms",
        timing: params.timing || "ease-in-out",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
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
alice.plugins.wobble = function (params) {
    "use strict";
    console.info("wobble: ", arguments);

    if(!params){params = '';}

    var opts = {
        elems: params.elems || alice.anima,

        rotate: params.rotate || 5,
        perspectiveOrigin: params.perspectiveOrigin || "center",

        duration: params.duration || "200ms",
        timing: params.timing || "linear",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: "alternate",
        playstate: params.playstate || "running"
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
alice.plugins.zoom = function (params) {
    "use strict";
    console.info("zoom: ", arguments);

    if(!params){params = '';}

    var scaleObj = {from: "1%", to: "125%"}; // default
    if (params.scale) {
        if (typeof params.scale === "object") {
            scaleObj = params.scale;
            //scaleObj = {from: alice.percentage(params.scale.from), to: alice.percentage(params.scale.to)};
        }
        else {
            scaleObj.to = scale;
        }
    }

    var opts = {
        elems: params.elems || alice.anima,

        scale: scaleObj,
        shadow: params.shadow || true,

        move: params.move || "none",

        duration: params.duration || "2000ms",
        timing: params.timing || "ease",
        delay: params.delay || "0ms",
        iteration: params.iteration || 1,
        direction: params.direction || "normal",
        playstate: params.playstate || "running"
    };

    alice.plugins.cheshire(opts);
    return opts;
};

//----------------------------------------------------------------------------

