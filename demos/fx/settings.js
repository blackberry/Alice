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
        fade: document.getElementById("fade-setting").value,
        scale: {
            from: document.getElementById("scaleFrom-setting").value,
            to: document.getElementById("scaleTo-setting").value
        },
        overshoot: document.getElementById("overshoot-setting").value,
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

    //console.log(p);
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
            html += '<option value="' + opts[i] + '" selected>' + opts[i] + '</option>';
        }
        else if (opts[i] === "") {
            html += '<option value="' + opts[i] + '">none</option>';
        }
        else {
            html += '<option value="' + opts[i] + '">' + opts[i] + '</option>';
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
 * [insertHTML description]
 * @param  {[type]} targetID [description]
 * @param  {[type]} params   [description]
 * @param  {[type]} show     [description]
 * @return {[type]}
 */
settings.insertHTML = function (targetID, params, show) {
    var html = '',
        hidden = '';

    html += '<div id="settings-button">';
    html += '    <button id="settings-button-toggle" role="button">Hide Settings</button>';
    html += '</div>';
    html += '<div id="settings-content">';
    html += '    <table border="0" cellpadding="5" cellspacing="0">';
    html += '    <tr>';
    html += '        <td valign="top">';
    html += '            <fieldset>';
    html += '                <legend>Settings</legend>';
    html += '                <table border="0" cellpadding="5" cellspacing="0">';

    if (show.delay) {
        var delayUpdate = "settings.updateValue(this, 'delay-setting')";

        html += '                <tr>';
        html += '                    <td align="right">Delay:</td>';
        html += '                      <td>';
        html += '                          <input type="range" id="delay-slider" min="' + params.delay.min + '" max="' + params.delay.max + '" value="' + parseInt(params.delay.value, 10) + '" step="' + params.delay.step + '" onchange="' + delayUpdate + '">';
        html += '                          <input type="text" id="delay-setting" value="' + parseInt(params.delay.value, 10) + '" size="2">';
        html += '                      </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="delay-setting" value="' + params.delay.value + '">';
    }

    if (show.duration) {
        var durationUpdate = "settings.updateValue(this, 'duration-setting')";

        html += '                <tr>';
        html += '                    <td align="right">Duration:</td>';
        html += '                      <td>';
        html += '                          <input type="range" id="duration-slider" min="' + params.duration.min + '" max="' + params.duration.max + '" value="' + parseInt(params.duration.value, 10) + '" step="' + params.duration.step + '" onchange="' + durationUpdate + '">';
        html += '                          <input type="text" id="duration-setting" value="' + parseInt(params.duration.value, 10) + '" size="2">';
        html += '                      </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="duration-setting" value="' + params.delay.value + '">';
    }

    if (show.timing) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Timing Function:</td>';
        html += '                    <td>';
        html += '                        <select id="timing-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.timingOpts, params.timing);
        html += '                        </select>';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="timing-setting" value="' + params.timing + '">';
    }

    if (show.iteration) {
        html += '                <tr>';
        html += '                    <td align="right">Iteration Count:</td>';
        html += '                    <td><input type="text" id="iteration-setting" value="' + params.iteration + '" size="4" onchange="settings.animate();"></td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="iteration-setting" value="' + params.iteration + '">';
    }

    if (show.direction) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Direction:</td>';
        html += '                    <td>';
        html += '                        <select id="direction-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.directionOpts, params.direction);
        html += '                        </select>';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="direction-setting" value="' + params.direction + '">';
    }

    if (show.move) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Move:</td>';
        html += '                    <td>';
        html += '                        <select id="move-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.moveOpts, params.move);
        html += '                        </select>';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="move-setting" value="' + params.move + '">';
    }

    if (show.rotate) {
        var rotateUpdate = "settings.updateValue(this, 'rotate-setting')";

        html += '                <tr>';
        html += '                    <td align="right">Rotate:</td>';
        html += '                      <td>';
        html += '                          <input type="range" id="rotate-slider" min="' + params.rotate.min + '" max="' + params.rotate.max + '" value="' + parseInt(params.rotate.value, 10) + '" step="' + params.rotate.step + '" onchange="' + rotateUpdate + '">';
        html += '                          <input type="text" id="rotate-setting" value="' + parseInt(params.rotate.value, 10) + '" size="2">';
        html += '                      </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="rotate-setting" value="' + params.rotate.value + '">';
    }

    if (show.flip) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Flip:</td>';
        html += '                    <td>';
        html += '                        <select id="flip-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.flipOpts, params.flip);
        html += '                        </select>';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="flip-setting" value="' + params.flip + '">';
    }

    if (show.fade) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Fade:</td>';
        html += '                    <td>';
        html += '                        <select id="fade-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.fadeOpts, params.fade);
        html += '                        </select>';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="fade-setting" value="' + params.fade + '">';
    }

    if (show.scale) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Scale:</td>';
        html += '                    <td>';
        html += '                        <select id="scaleFrom-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.scaleOpts, params.scaleFrom);
        html += '                        </select>';
        html += '                        <span>to</span>';
        html += '                        <select id="scaleTo-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.scaleOpts, params.scaleTo);
        html += '                        </select>';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="scaleFrom-setting" value="' + params.scaleFrom + '"><input type="hidden" id="scaleTo-setting" value="' + params.scaleTo + '">';
    }

    if (show.overshoot) {
        var overshootUpdate = "settings.updateValue(this, 'overshoot-setting')";

        html += '                <tr>';
        html += '                    <td align="right">Overshoot:</td>';
        html += '                      <td>';
        html += '                          <input type="range" id="overshoot-slider" min="' + params.overshoot.min + '" max="' + params.overshoot.max + '" value="' + parseInt(params.overshoot.value, 10) + '" step="' + params.overshoot.step + '" onchange="' + overshootUpdate + '">';
        html += '                          <input type="text" id="overshoot-setting" value="' + parseInt(params.overshoot.value, 10) + '" size="2">';
        html += '                      </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="overshoot-setting" value="' + params.overshoot.value + '">';
    }

    if (show.randomness) {
        var randomnessUpdate = "settings.updateValue(this, 'randomness-setting')";

        html += '                <tr>';
        html += '                    <td align="right">Randomness:</td>';
        html += '                      <td>';
        html += '                          <input type="range" id="randomness-slider" min="' + params.randomness.min + '" max="' + params.randomness.max + '" value="' + parseInt(params.randomness.value, 10) + '" step="' + params.randomness.step + '" onchange="' + randomnessUpdate + '">';
        html += '                          <input type="text" id="randomness-setting" value="' + parseInt(params.randomness.value, 10) + '" size="2">';
        html += '                      </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="randomness-setting" value="' + params.randomness.value + '">';
    }

    if (show.perspective) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Perspective (px):</td>';
        html += '                    <td>';
        html += '                        <select id="perspective-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.perspectiveOpts, params.perspective);
        html += '                        </select>';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="perspective-setting" value="' + params.perspective + '">';
    }

    if (show.perspectiveOrigin) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Perspective Origin:</td>';
        html += '                    <td>';
        html += '                        <select id="perspectiveOrigin-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.perspectiveOriginOpts, params.perspectiveOrigin);
        html += '                        </select>';
        html += '                        <br>';
        html += '                        <input type="number" id="perspectiveOriginX-setting" min="-1000" max="1000" value="0" step="50" size="2" placeholder="x%" style="display: none;" onchange="settings.animate();" onclick="settings.animate();">';
        html += '                        <input type="number" id="perspectiveOriginY-setting" min="-1000" max="1000" value="0" step="50" size="2" placeholder="y%" style="display: none;" onchange="settings.animate();" onclick="settings.animate();">';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="perspectiveOrigin-setting" value="' + params.perspectiveOrigin + '">';
    }

    if (show.backfaceVisibility) {
        html += '                <tr>';
        html += '                    <td align="right" valign="top">Backface Visibility:</td>';
        html += '                    <td>';
        html += '                        <select id="backfaceVisibility-setting" onchange="settings.animate();">';
        html += settings.generateOptions(settings.backfaceVisibilityOpts, params.backfaceVisibility);
        html += '                        </select>';
        html += '                    </td>';
        html += '                </tr>';
    }
    else {
        hidden += '<input type="hidden" id="backfaceVisibility-setting" value="' + params.backfaceVisibility + '">';
    }

    html += '                <tr>';
    html += '                    <td>&nbsp;</td>';
    html += '                    <td>';
    html += '                        <input type="button" id="settings-button-start" value="Start">';
    html += '                        <input type="button" id="settings-button-stop" value="Stop">';
    html += '                    </td>';
    html += '                </tr>';

    html += '                </table>';
    html += '            </fieldset>';
    html += '        </td>';
    html += '    </tr>';
    html += '    </table>';
    html += '</div>';

    html += hidden;

    //console.log(html);
    if (document.getElementById(targetID)) {
        document.getElementById(targetID).innerHTML = html;
    }
};
