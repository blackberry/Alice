/* ===========================================================================
 * alice.slide.js
 * ===========================================================================
 */

/**
 *
 */
alice.slide = function (params) {
    "use strict";
    console.info("slide", params);

    // Initialize variables
    var elems = this._elements(params.elems),

        delay = params.delay || 0,
        duration = params.duration || 2000,
        timing = params.timing || "ease",
        iteration = params.iteration || 1,
        direction = params.direction || "normal",
        playstate = params.playstate || "running",

        perspective = params.perspective || "1000",
        perspectiveOrigin = params.perspectiveOrigin || "center",
        backfaceVisibility = params.backfaceVisibility || "visible",

        overshoot = this._percentage(params.overshoot) || 0,
        //overShootPercent = 100 - overshoot * 100,
        overShootPercent = 85,

        rotate = params.rotate || 0,
        rotateStart = this._percentage(rotate) * 100,
        rotateOver = overshoot * 100,
        rotateEnd = 0,

        flip = params.flip || null,
        flipStart = 0,
        flipEnd = (flip && (flip === "right" || flip === "up")) ? 360: -360,
        flipOver = Math.floor((1 + overshoot) * flipEnd),
        flipAxis = (flip && (flip === "left" || flip === "right")) ? "Y" : "X",

        fade = (params.fade && params.fade !== "") ? params.fade : null,
        fadeStart = (fade && fade === "out") ? 1 : 0,
        fadeEnd = (fade && fade === "out") ? 0 : 1,

        scale = this._percentage(params.scale) || 1,

        move = "",
        axis = "",
        sign = 1,
        posStart = 0,
        posEnd = 0,
        over = posEnd + (sign * Math.floor(posEnd * overshoot)),

        container, elem, i, animId, css, transformStart, transformOver, transformEnd, boxShadowStart, boxShadowEnd;

    // Loop through elements
    if (elems && elems.length > 0) {
        for (i = 0; i < elems.length; i += 1) {
            elem = elems[i];
            container = elem.parentElement || elem.parentNode;

            // Generate animation ID
            animId = this.id + "-slide-" + (new Date()).getTime() + "-" + Math.floor(Math.random() * 1000000);

            //console.log(elem, elem.style, elem.clientWidth, elem.clientHeight);

            // Configure settings
            if (params.move) {
                switch (params.move) {
                    case "left":
                        move = "Left";
                        axis = "X";
                        sign = -1;
                        posStart = window.innerWidth;
                        posEnd = 0;
                        over = sign * Math.floor(posStart * overshoot);
                        break;
                    case "right":
                        move = "Right";
                        axis = "X";
                        sign = 1;
                        posStart = 0;
                        posEnd = document.body.offsetWidth - elem.clientWidth;
                        over = posEnd + (sign * Math.floor(posEnd * overshoot));
                        break;
                    case "up":
                        move = "Up";
                        axis = "Y";
                        sign = -1;
                        posStart = window.innerHeight;
                        posEnd = 0;
                        over = sign * Math.floor(posStart * overshoot);
                        break;
                    case "down":
                        move = "Down";
                        axis = "Y";
                        sign = 1;
                        posStart = 0;
                        posEnd = window.innerHeight - window.pageYOffset - (container.clientHeight * 3);
                        over = posEnd + (sign * Math.floor(posEnd * overshoot));
                        break;
                }
            }

            // Generate transforms
            transformStart  = "";
            transformStart += (flip) ? "rotate" + flipAxis + "(" + flipStart + "deg)" : " translate" + axis + "(" + posStart + "px)";
            transformStart += (rotate && rotate !== "0%") ? " rotate(" + rotateStart + "deg)" : "";
            transformStart += (scale) ? " scale(1)" : "";

            transformOver  = "";
            transformOver += (flip) ? " rotate" + flipAxis + "(" + flipOver + "deg)" : " translate" + axis + "(" + over + "px)";
            transformOver += (rotate && rotate !== "0%") ? " rotate(" + rotateOver + "deg)" : "";
            transformOver += (scale) ? " scale(" + scale + ")" : "";

            transformEnd  = "";
            transformEnd += (flip) ? " rotate" + flipAxis + "(" + flipEnd + "deg)" : " translate" + axis + "(" + posEnd + "px)";
            transformEnd += (rotate && rotate !== "0%") ? " rotate(" + rotateEnd + "deg)": "";
            transformEnd += (scale) ? " scale(" + scale + ")" : "";

            // Generate box shadow
            if (scale > 1) {
                boxShadowStart = " 0px 0px 0px rgba(0, 0, 0, 1)";
                boxShadowEnd = " 30px 30px 30px rgba(0, 0, 0, 0.5)";
            }

            // Generate CSS for keyframe rule
            css  = "";
            css += "@" + this.prefix + "keyframes " + animId + " {\n";

            css += "\t" + "0% {" + "\n";
            css += "\t\t" + " " + this.prefix + "transform:" + transformStart + ";" + "\n";
            css += (fade) ? "\t\t" + "opacity: " + fadeStart + ";" + "\n" : "";
            css += (scale > 1) ? "\t\t" + this.prefix + "box-shadow: " + boxShadowStart + ";" + "\n" : "";

            css += "\t" + "}" + "\n";

            if (overshoot !== 0) {
                css += "\t" + overShootPercent + "% {\n";
                css += "\t\t" + " " + this.prefix + "transform:" + transformOver + ";" + "\n";
                css += "\t" + "}" + "\n";
            }

            css += "\t" + "100% {" + "\n";
            css += "\t\t" + " " + this.prefix + "transform:" + transformEnd + ";" + "\n";
            css += (fade) ? "\t\t" + "opacity: " + fadeEnd + ";" + "\n" : "";
            css += (scale > 1) ? "\t\t" + this.prefix + "box-shadow: " + boxShadowEnd + ";" + "\n" : "";

            css += "\t" + "}" + "\n";

            css += "}" + "\n";

            console.log(css);

            // Insert keyframe rule
            this._keyframeInsert(css);

            // Add listener to clear animation after it's done
            if ("MozAnimation" in elem.style) {
                elem.addEventListener("animationend", this._clearAnimation, false);
            }
            else {
                elem.addEventListener(this.prefixJS + "AnimationEnd", this._clearAnimation, false);
            }

            // Apply perspective to parent container
            container.style[this.prefixJS + "Perspective"] = perspective;
            container.style[this.prefixJS + "PerspectiveOrigin"] = this._coords(perspectiveOrigin);

            // Apply properties to elements
            elem.style[this.prefixJS + "BackfaceVisibility"] = backfaceVisibility;

            elem.style[this.prefixJS + "AnimationName"] = animId;
            elem.style[this.prefixJS + "AnimationDelay"] = this._duration(delay);
            elem.style[this.prefixJS + "AnimationDuration"] = this._duration(duration);
            elem.style[this.prefixJS + "AnimationTimingFunction"] = this._easing(timing);
            elem.style[this.prefixJS + "AnimationIterationCount"] = iteration;
            elem.style[this.prefixJS + "AnimationDirection"] = direction;
            elem.style[this.prefixJS + "AnimationPlayState"] = playstate;

            // Apply styles from last key frame
            elem.style[this.prefixJS + "Transform"] = transformEnd;
            elem.style.opacity = (fade) ? fadeEnd : "";
            elem.style[this.prefixJS + "BoxShadow"] = (scale > 1) ? boxShadowEnd : "";

            //console.log(elem.id + ": " + elem.style.cssText);
            console.log(elem.id, elem.style[this.prefixJS + "AnimationDuration"], elem.style[this.prefixJS + "AnimationTimingFunction"]);
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
alice.slideLeft = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "left";
    //console.info("slideLeft", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.slideRight = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "right";
    //console.info("slideRight", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.slideUp = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "up";
    //console.info("slideUp", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.slideDown = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "down";
    //console.info("slideDown", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.tossLeft = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "left";
    p.rotate = 720;
    p.fade = "in";
    //console.info("tossLeft", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.tossRight = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "right";
    p.rotate = -720;
    p.fade = "in";
    //console.info("tossRight", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.tossUp = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "up";
    p.rotate = -720;
    p.fade = "in";
    //console.info("tossUp", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.tossDown = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.move = "down";
    p.rotate = 720;
    p.fade = "in";
    //console.info("tossDown", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.flipLeft = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "left";
    //console.info("flipLeft", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.flipRight = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "right";
    //console.info("flipRight", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.flipUp = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "up";
    //console.info("flipUp", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.flipDown = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.flip = "down";
    //console.info("flipDown", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.pushForward = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.scale = "150%";
    //console.info("pushForward", p);

    alice.slide(p);
    return p;
};

/**
 *
 */
alice.pushBackward = function (params) {
    "use strict";
    var p = params;

    // Set presets
    p.scale = "50%";
    //console.info("pushBackward", p);

    alice.slide(p);
    return p;
};

