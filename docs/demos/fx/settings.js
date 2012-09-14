/*jslint devel: true, browser: true, white: true, nomen: true */

/* ===========================================================================
 * settings.js
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

var settings = {
    timingOpts: ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "easeInQuad", "easeInCubic", "easeInQuart", "easeInQuint", "easeInSine", "easeInExpo", "easeInCirc", "easeInBack", "easeOutQuad", "easeOutCubic", "easeOutQuart", "easeOutQuint", "easeOutSine", "easeOutExpo", "easeOutCirc", "easeOutBack", "easeInOutQuad", "easeInOutCubic", "easeInOutQuart", "easeInOutQuint", "easeInOutSine", "easeInOutExpo", "easeInOutCirc", "easeInOutBack", "custom", "random"],
    directionOpts: ["normal", "alternate"],
    moveOpts: ["", "left", "right", "up", "down"],
    rotateOpts: ["-2880", "-1440", "-720", "-675", "-630", "-585", "-540", "-495", "-450", "-405", "-360", "-315", "-270", "-225", "-180", "-135", "-90", "-45", "-20", "-10", "-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5", "10", "20", "45", "90", "135", "180", "225", "270", "315", "360", "405", "450", "495", "540", "585", "630", "675", "720", "1440", "2880"],
    flipOpts: ["", "left", "right", "up", "down"],
    fadeOpts: ["", "in", "out"],
    scaleOpts: ["1%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%", "110%", "120%", "130%", "140%", "150%", "160%", "170%", "180%", "190%", "200%"],
    overshootOpts: ["0%", "1%", "5%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
    randomnessOpts: ["0%", "1%", "5%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
    perspectiveOpts: ["none", "100", "250", "500", "750", "1000", "1500", "1750", "2000"],
    perspectiveOriginOpts: ["top-left", "top", "top-right", "left", "center", "right", "bottom-left", "bottom", "bottom-right", "custom"],
    backfaceVisibilityOpts: ["visible", "hidden"]
};

/**
 * [handleChange description]
 * @param  {[type]} elem [description]
 * @param  {[type]} ids  [description]
 * @return {[type]}
 */
settings.handleChange = function (elem, ids) {
    var state;
    for (var i = 0; i < ids.length; i++) {
        state = (elem.value === "custom") ? "block" : "none";
        document.getElementById(ids[i]).style.display = state;
    }
};

/**
 * [applyEffect description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
settings.applyEffect = function (elems, playstate) {
    "use strict";

    var p = {
        elems: elems,

        delay: {
            value: document.getElementById("delay-setting").value,
            randomness: document.getElementById("randomness-setting").value
        },
        duration: {
            value: document.getElementById("duration-setting").value,
            randomness: document.getElementById("randomness-setting").value
        },
        timing: document.getElementById("timing-setting").value,
        iteration: document.getElementById("iteration-setting").value,
        direction: document.getElementById("direction-setting").value,
        playstate: playstate,

        move: document.getElementById("move-setting").value,
        rotate: document.getElementById("rotate-setting").value,
        flip: document.getElementById("flip-setting").value,
        turns: document.getElementById("turns-setting").value,
        fade: document.getElementById("fade-setting").value,
        scale: {
            from: document.getElementById("scaleFrom-setting").value,
            to: document.getElementById("scaleTo-setting").value
        },
        shadow: document.getElementById("shadow-setting").checked,
        overshoot: document.getElementById("overshoot-setting").value,
        randomness: document.getElementById("randomness-setting").value,
        perspective: document.getElementById("perspective-setting").value,
        perspectiveOrigin: document.getElementById("perspectiveOrigin-setting").value,
        backfaceVisibility: document.getElementById("backfaceVisibility-setting").value
    };

    if (document.getElementById("perspectiveOrigin-setting").value === "custom" && document.getElementById("perspectiveOriginX-setting").value !== "" && document.getElementById("perspectiveOriginY-setting").value !== "") {
        p.perspectiveOrigin = {
            x: document.getElementById("perspectiveOriginX-setting").value + "%",
            y: document.getElementById("perspectiveOriginY-setting").value + "%"
        };
    }

    console.log(p);
    return p;
};

/**
 * [generateOptions description]
 * @param  {[type]} opts     [description]
 * @param  {[type]} selected [description]
 * @return {[type]}
 */
settings.generateOptions = function (opts, selected) {
    var html = '';
    for (var i = 0; i < opts.length; i++) {
        if (opts[i] == selected) {
            html += '                            <option value="' + opts[i] + '" selected>' + opts[i] + '</option>' + "\n";
        }
        else if (opts[i] === "") {
            html += '                            <option value="' + opts[i] + '">none</option>' + "\n";
        }
        else {
            html += '                            <option value="' + opts[i] + '">' + opts[i] + '</option>' + "\n";
        }
    }

    //console.log(html);
    return html;
};

/**
 * [animate description]
 * @return {[type]}
 */
settings.animate = function () {
    document.getElementById("settings-button-start").click();
};

/**
 * [updateValue description]
 * @param  {[type]} srcElem  [description]
 * @param  {[type]} targetID [description]
 * @param  {[type]} unit     [description]
 * @return {[type]}
 */
settings.updateValue = function (srcElem, targetID, unit) {
    var val = parseInt(srcElem.value, 10);
    val += (unit) ? unit : "";
    document.getElementById(targetID).value = val;
    this.animate();
};

/**
 * [createSettings description]
 * @param  {[type]} targetID [description]
 * @param  {[type]} params   [description]
 * @param  {[type]} show     [description]
 * @return {[type]}
 */
settings.createSettings = function (targetID, params, show) {
    var html = '',
        hidden = '';

    html += '<div id="settings-button">' + "\n";
    html += '    <button class="button" id="settings-button-toggle" role="button">Hide Settings</button>' + "\n";
    html += '</div>' + "\n";
    html += '<div id="settings-content">' + "\n";
    html += '    <table border="0" cellpadding="5" cellspacing="0">' + "\n";
    html += '    <tr>' + "\n";
    html += '        <td valign="top">' + "\n";
    html += '            <fieldset>' + "\n";
    html += '                <legend>Settings</legend>' + "\n";
    html += '                <table border="0" cellpadding="5" cellspacing="0">' + "\n";

    if (show.delay) {
        var delayUpdate = "settings.updateValue(this, 'delay-setting')";

        html += '                <tr>' + "\n";
        html += '                    <td align="right">Delay:</td>' + "\n";
        html += '                      <td>' + "\n";
        html += '                          <input type="range" id="delay-slider" min="' + params.delay.min + '" max="' + params.delay.max + '" value="' + parseInt(params.delay.value, 10) + '" step="' + params.delay.step + '" onchange="' + delayUpdate + '">' + "\n";
        html += '                          <input type="text" id="delay-setting" value="' + parseInt(params.delay.value, 10) + '" size="3">' + "\n";
        html += '                      </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="delay-setting" value="' + params.delay.value + '">' + "\n";
    }

    if (show.duration) {
        var durationUpdate = "settings.updateValue(this, 'duration-setting')";

        html += '                <tr>' + "\n";
        html += '                    <td align="right">Duration:</td>' + "\n";
        html += '                      <td>' + "\n";
        html += '                          <input type="range" id="duration-slider" min="' + params.duration.min + '" max="' + params.duration.max + '" value="' + parseInt(params.duration.value, 10) + '" step="' + params.duration.step + '" onchange="' + durationUpdate + '">' + "\n";
        html += '                          <input type="text" id="duration-setting" value="' + parseInt(params.duration.value, 10) + '" size="3">' + "\n";
        html += '                      </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="duration-setting" value="' + params.delay.value + '">' + "\n";
    }

    if (show.timing) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Timing Function:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="timing-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.timingOpts, params.timing);
        html += '                        </select>' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="timing-setting" value="' + params.timing + '">' + "\n";
    }

    if (show.iteration) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right">Iteration Count:</td>' + "\n";
        html += '                    <td><input type="text" id="iteration-setting" value="' + params.iteration + '" size="4" onchange="settings.animate();"></td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="iteration-setting" value="' + params.iteration + '">' + "\n";
    }

    if (show.direction) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Direction:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="direction-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.directionOpts, params.direction);
        html += '                        </select>' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="direction-setting" value="' + params.direction + '">' + "\n";
    }

    if (show.move) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Move:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="move-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.moveOpts, params.move);
        html += '                        </select>' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="move-setting" value="' + params.move + '">' + "\n";
    }

    if (show.rotate) {
        var rotateUpdate = "settings.updateValue(this, 'rotate-setting')";

        html += '                <tr>' + "\n";
        html += '                    <td align="right">Rotate:</td>' + "\n";
        html += '                      <td>' + "\n";
        html += '                          <input type="range" id="rotate-slider" min="' + params.rotate.min + '" max="' + params.rotate.max + '" value="' + parseInt(params.rotate.value, 10) + '" step="' + params.rotate.step + '" onchange="' + rotateUpdate + '">' + "\n";
        html += '                          <input type="text" id="rotate-setting" value="' + parseInt(params.rotate.value, 10) + '" size="3">' + "\n";
        html += '                      </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="rotate-setting" value="' + params.rotate.value + '">' + "\n";
    }

    if (show.flip) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Flip:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="flip-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.flipOpts, params.flip);
        html += '                        </select>' + "\n";
        html += '                        <input type="number" id="turns-setting" min="1" max="10" value="1" step="1" size="3" placeholder="turn(s)" onchange="settings.animate();" onclick="settings.animate();">' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="flip-setting" value="' + params.flip + '">' + "\n";
        hidden += '<input type="hidden" id="turns-setting" value="1">' + "\n";
    }

    if (show.fade) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Fade:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="fade-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.fadeOpts, params.fade);
        html += '                        </select>' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="fade-setting" value="' + params.fade + '">' + "\n";
    }

    if (show.scale) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Scale:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="scaleFrom-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.scaleOpts, params.scaleFrom);
        html += '                        </select>' + "\n";
        html += '                        <span>to</span>' + "\n";
        html += '                        <select id="scaleTo-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.scaleOpts, params.scaleTo);
        html += '                        </select>' + "\n";
        html += '                        <input type="checkbox" id="shadow-setting" alt="Shadow" title="Shadow" onchange="settings.animate();" checked>' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
/*
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Shadow:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <input type="checkbox" id="shadow-setting" onchange="settings.animate();" checked>' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
*/
    }
    else {
        hidden += '<input type="hidden" id="scaleFrom-setting" value="' + params.scaleFrom + '">' + "\n";
        hidden += '<input type="hidden" id="scaleTo-setting" value="' + params.scaleTo + '">' + "\n";
        hidden += '<input type="hidden" id="shadow-setting" value="' + params.shadow + '">' + "\n";
    }

    if (show.overshoot) {
        var overshootUpdate = "settings.updateValue(this, 'overshoot-setting')";

        html += '                <tr>' + "\n";
        html += '                    <td align="right">Overshoot:</td>' + "\n";
        html += '                      <td>' + "\n";
        html += '                          <input type="range" id="overshoot-slider" min="' + params.overshoot.min + '" max="' + params.overshoot.max + '" value="' + parseInt(params.overshoot.value, 10) + '" step="' + params.overshoot.step + '" onchange="' + overshootUpdate + '">' + "\n";
        html += '                          <input type="text" id="overshoot-setting" value="' + parseInt(params.overshoot.value, 10) + '" size="3">' + "\n";
        html += '                      </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="overshoot-setting" value="' + params.overshoot.value + '">' + "\n";
    }

    if (show.randomness) {
        var randomnessUpdate = "settings.updateValue(this, 'randomness-setting')";

        html += '                <tr>' + "\n";
        html += '                    <td align="right">Randomness:</td>' + "\n";
        html += '                      <td>' + "\n";
        html += '                          <input type="range" id="randomness-slider" min="' + params.randomness.min + '" max="' + params.randomness.max + '" value="' + parseInt(params.randomness.value, 10) + '" step="' + params.randomness.step + '" onchange="' + randomnessUpdate + '">' + "\n";
        html += '                          <input type="text" id="randomness-setting" value="' + parseInt(params.randomness.value, 10) + '" size="3">' + "\n";
        html += '                      </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="randomness-setting" value="' + params.randomness.value + '">' + "\n";
    }

    if (show.perspective) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Perspective (px):</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="perspective-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.perspectiveOpts, params.perspective);
        html += '                        </select>' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="perspective-setting" value="' + params.perspective + '">' + "\n";
    }

    if (show.perspectiveOrigin) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Perspective Origin:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="perspectiveOrigin-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.perspectiveOriginOpts, params.perspectiveOrigin);
        html += '                        </select>' + "\n";
        html += '                        <br>' + "\n";
        html += '                        <input type="number" id="perspectiveOriginX-setting" min="-1000" max="1000" value="0" step="50" size="3" placeholder="x%" style="display: none;" onchange="settings.animate();" onclick="settings.animate();">' + "\n";
        html += '                        <input type="number" id="perspectiveOriginY-setting" min="-1000" max="1000" value="0" step="50" size="3" placeholder="y%" style="display: none;" onchange="settings.animate();" onclick="settings.animate();">' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="perspectiveOrigin-setting" value="' + params.perspectiveOrigin + '">' + "\n";
    }

    if (show.backfaceVisibility) {
        html += '                <tr>' + "\n";
        html += '                    <td align="right" valign="top">Backface Visibility:</td>' + "\n";
        html += '                    <td>' + "\n";
        html += '                        <select id="backfaceVisibility-setting" onchange="settings.animate();">' + "\n";
        html += settings.generateOptions(settings.backfaceVisibilityOpts, params.backfaceVisibility);
        html += '                        </select>' + "\n";
        html += '                    </td>' + "\n";
        html += '                </tr>' + "\n";
    }
    else {
        hidden += '<input type="hidden" id="backfaceVisibility-setting" value="' + params.backfaceVisibility + '">' + "\n";
    }

    html += '                <tr>' + "\n";
    html += '                    <td>&nbsp;</td>' + "\n";
    html += '                    <td>' + "\n";
    html += '                        <input class="button" type="button" id="settings-button-start" value="Start">' + "\n";
    html += '                        <input class="button" type="button" id="settings-button-stop" value="Stop">' + "\n";
    html += '                    </td>' + "\n";
    html += '                </tr>' + "\n";

    html += '                </table>' + "\n";
    html += '            </fieldset>' + "\n";
    html += '        </td>' + "\n";
    html += '    </tr>' + "\n";
    html += '    </table>' + "\n";
    html += '</div>' + "\n";

    html += hidden;

    //console.log(html);
    if (document.getElementById(targetID)) {
        document.getElementById(targetID).innerHTML = html;
    }
};

/**
 * [createTable description]
 * @param  {[type]} targetID [description]
 * @return {[type]}
 */
settings.createTable = function (targetID) {
    var html = '';

    html += '            <div id="cards" class="cards">' + "\n";
    html += '                <div id="mini-login" class="mini-login">' + "\n";
    html += '                    <table border="0" cellpadding="0" cellspacing="0">' + "\n";
    html += '                        <tr>' + "\n";
    html += '                            <td><label>Username:</label></td>' + "\n";
    html += '                            <td><input type="text" id="mini-login-username" name="username" value="" size="15"></td>' + "\n";
    html += '                        </tr>' + "\n";
    html += '                        <tr>' + "\n";
    html += '                            <td><label>Password:</label></td>' + "\n";
    html += '                            <td><input type="password" id="mini-login-password" name="password" value="" size="15"></td>' + "\n";
    html += '                        </tr>' + "\n";
    html += '                        <tr>' + "\n";
    html += '                            <td>&nbsp;</td>' + "\n";
    html += '                            <td><input class="button" type="button" id="mini-login-button" name="submit" value="Login"></td>' + "\n";
    html += '                        </tr>' + "\n";
    html += '                    </table>' + "\n";
    html += '                </div>' + "\n";

    html += '                <figure class="card"><img src="../common/images/cards/10_clubs.png"><figcaption>Ten of Clubs</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/10_diamonds.png"><figcaption>Ten of Diamonds</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/10_hearts.png"><figcaption>Ten of Hearts</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/10_spades.png"><figcaption>Ten of Spades</figcaption></figure>' + "\n";

    html += '                <figure class="card"><img src="../common/images/cards/jack_clubs.png"><figcaption>Jack of Clubs</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/jack_diamonds.png"><figcaption>Jack of Diamonds</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/jack_hearts.png"><figcaption>Jack of Hearts</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/jack_spades.png"><figcaption>Jack of Spades</figcaption></figure>' + "\n";

    html += '                <figure class="card"><img src="../common/images/cards/queen_clubs.png"><figcaption>Queen of Clubs</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/queen_diamonds.png"><figcaption>Queen of Diamonds</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/queen_hearts.png"><figcaption>Queen of Hearts</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/queen_spades.png"><figcaption>Queen of Spades</figcaption></figure>' + "\n";

    html += '                <figure class="card"><img src="../common/images/cards/king_clubs.png"><figcaption>King of Clubs</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/king_diamonds.png"><figcaption>King of Diamonds</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/king_hearts.png"><figcaption>King of Hearts</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/king_spades.png"><figcaption>King of Spades</figcaption></figure>' + "\n";

    html += '                <figure class="card"><img src="../common/images/cards/ace_clubs.png"><figcaption>Ace of Clubs</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/ace_diamonds.png"><figcaption>Ace of Diamonds</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/ace_hearts.png"><figcaption>Ace of Hearts</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/ace_spades.png"><figcaption>Ace of Spades</figcaption></figure>' + "\n";

    html += '                <figure class="card"><img src="../common/images/cards/joker_red.png"><figcaption>Red Joker</figcaption></figure>' + "\n";
    html += '                <figure class="card"><img src="../common/images/cards/joker_black.png"><figcaption>Black Joker</figcaption></figure>' + "\n";
    html += '            </div>' + "\n";

    //console.log(html);
    if (document.getElementById(targetID)) {
        document.getElementById(targetID).innerHTML = html;

        this.attachEvents();
    }
};

/**
 * [attachEvents description]
 * @return {[type]}
 */
settings.attachEvents = function () {
    var p,
        fn = function () {
            var p = settings.applyEffect(this, "running");
            alicejs.cheshire(p);
        };

    document.getElementById("settings-button-toggle").addEventListener("click", function () {
        var settingsContent = document.getElementById("settings-content").style,
            button = document.getElementById("settings-button-toggle");

        if (settingsContent.display == "none") {
            button.innerHTML = "Hide Settings";
            settingsContent.display = "block";
            alicejs.slide("settings-content", "left", "5%", "1000ms");
        }
        else {
            button.innerHTML = "Show Settings";
            //a.slide("settings-content", "right");
            settingsContent.display = "none";
        }
    }, false);

    document.getElementById("perspectiveOrigin-setting").addEventListener("change", function () {
        settings.handleChange(this, ['perspectiveOriginX-setting', 'perspectiveOriginY-setting']);
    }, false);

    document.getElementById("settings-button-start").addEventListener("click", function () {
        var p = settings.applyEffect(document.getElementById("cards").children, "running");
        alicejs.cheshire(p);
    }, false);

    document.getElementById("settings-button-stop").addEventListener("click", function () {
        var p = settings.applyEffect(document.getElementById("cards").children, "paused");
        alicejs.cheshire(p);
    }, false);

    for (var i = 0; i < document.getElementById("cards").children.length; i++) {
        document.getElementById("cards").children[i].addEventListener("dblclick", fn, false);
    }

    document.getElementById("mini-login-button").addEventListener("click", function () {
        if (document.getElementById("mini-login-username").value === "" || document.getElementById("mini-login-password").value === "") {
            document.getElementById("mini-login").style["background-color"] = "#70000F";
            p = settings.applyEffect(["mini-login"], "running");
            alicejs.cheshire(p);
        }
        else {
            document.getElementById("mini-login").style["background-color"] = "#104100";
            p = settings.applyEffect(["mini-login"], "paused");
            alicejs.cheshire(p);
        }
    }, false);
};
