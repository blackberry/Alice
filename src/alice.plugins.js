/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

/* ===========================================================================
 * alice.plugins.js
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

    alice.cheshire(opts);
    return opts;
};

//delete later
alice.plugins.bounce2 = function (params) {
    "use strict";
    console.info("bounce:2 ", arguments);

    var scaleObj = {from: "100%", to: "125%"}; // default
    
    if (params.scale) {
        if (typeof scale === "object") {
            scaleObj = params.scale;
        }
        else {
            scaleObj.to = params.scale;
        }
    }

    var opts = {
        elems: params.elems,

        //scale: scale || {from: "100%", to: "125%"},
        scale: scaleObj,
        shadow: params.shadow || false,

        duration: params.duration || "750ms",
        timing: params.timing || "easeOutSine",
        delay: params.delay || "0ms",
        iteration: params.iteration || "infinite",
        direction: params.direction || "alternate",
        playstate: params.playstate
    };

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    switch (flip) {
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
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

    alice.cheshire(opts);
    return opts;
};

//----------------------------------------------------------------------------

