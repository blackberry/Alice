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
 * [insertHTML description]
 * @param  {[type]} targetID [description]
 * @param  {[type]} params   [description]
 * @return {[type]}
 */
settings.insertHTML = function (targetID, params) {
    var html = '';

    html += '<div id="settings-button">';
    html += '    <button id="settings-button-toggle" role="button">Hide Settings</button>';
    html += '</div>';
    html += '<div id="settings-content">';
    html += '    <table border="0" cellpadding="5" cellspacing="0">';
    html += '    <tr>';
    html += '        <td valign="top">';
    html += '            <fieldset>';
    html += '                <legend>Animation Settings</legend>';
    html += '                <table border="0" cellpadding="5" cellspacing="0">';
    html += '                <tr>';
    html += '                    <td align="right">Delay:</td>';
    html += '                    <td><input type="text" id="delay-setting" value="' + params.delay + '" size="4" style="text-align: right;"></td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right">Duration:</td>';
    html += '                    <td><input type="text" id="duration-setting" value="' + params.duration + '" size="4" style="text-align: right;"></td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Timing Function:</td>';
    html += '                    <td>';
    html += '                        <select id="timing-setting">';
    html += settings.generateOptions(settings.timingOpts, params.timing);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right">Iteration Count:</td>';
    html += '                    <td><input type="text" id="iteration-setting" value="' + params.iteration + '" size="4" style="text-align: right;"></td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Direction:</td>';
    html += '                    <td>';
    html += '                        <select id="direction-setting">';
    html += settings.generateOptions(settings.directionOpts, params.direction);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                </table>';
    html += '            </fieldset>';
    html += '            <div style="text-align: center;">';
    html += '                <br>';
    html += '                <input type="button" id="settings-button-start" value="Start">';
    html += '                <input type="button" id="settings-button-stop" value="Stop">';
    html += '            </div>';
    html += '        </td>';
    html += '        <td valign="top">';
    html += '            <fieldset>';
    html += '                <legend>Effect Settings</legend>';
    html += '                <table border="0" cellpadding="5" cellspacing="0">';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Move:</td>';
    html += '                    <td>';
    html += '                        <select id="move-setting">';
    html += settings.generateOptions(settings.moveOpts, params.move);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Rotate:</td>';
    html += '                    <td>';
    html += '                        <select id="rotate-setting">';
    html += settings.generateOptions(settings.rotateOpts, params.rotate);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Flip:</td>';
    html += '                    <td>';
    html += '                        <select id="flip-setting">';
    html += settings.generateOptions(settings.flipOpts, params.flip);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Fade:</td>';
    html += '                    <td>';
    html += '                        <select id="fade-setting">';
    html += settings.generateOptions(settings.fadeOpts, params.fade);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Scale:</td>';
    html += '                    <td>';
    html += '                        <select id="scaleFrom-setting">';
    html += settings.generateOptions(settings.scaleOpts, params.scaleFrom);
    html += '                        </select>';
    html += '                        <span>to</span>';
    html += '                        <select id="scaleTo-setting">';
    html += settings.generateOptions(settings.scaleOpts, params.scaleTo);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Overshoot:</td>';
    html += '                    <td>';
    html += '                        <select id="overshoot-setting">';
    html += settings.generateOptions(settings.overshootOpts, params.overshoot);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Randomness:</td>';
    html += '                    <td>';
    html += '                        <select id="randomness-setting">';
    html += settings.generateOptions(settings.randomnessOpts, params.randomness);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                </table>';
    html += '            </fieldset>';
    html += '            <fieldset>';
    html += '                <legend>3D Settings</legend>';
    html += '                <table border="0" cellpadding="5" cellspacing="0">';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Perspective (px):</td>';
    html += '                    <td>';
    html += '                        <select id="perspective-setting">';
    html += settings.generateOptions(settings.perspectiveOpts, params.perspective);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Perspective Origin:</td>';
    html += '                    <td>';
    html += '                        <select id="perspectiveOrigin-setting">';
    html += settings.generateOptions(settings.perspectiveOriginOpts, params.perspectiveOrigin);
    html += '                        </select>';
    html += '                        <br>';
    html += '                        <input type="number" id="perspectiveOriginX-setting" step="50" min="-400" max="400" value="" size="2" placeholder="x%" style="display: none;">';
    html += '                        <input type="number" id="perspectiveOriginY-setting" step="50" min="-400" max="400" value="" size="2" placeholder="y%" style="display: none;">';
    html += '                    </td>';
    html += '                </tr>';
    html += '                <tr>';
    html += '                    <td align="right" valign="top">Backface Visibility:</td>';
    html += '                    <td>';
    html += '                        <select id="backfaceVisibility-setting">';
    html += settings.generateOptions(settings.backfaceVisibilityOpts, params.backfaceVisibility);
    html += '                        </select>';
    html += '                    </td>';
    html += '                </tr>';
    html += '                </table>';
    html += '            </fieldset>';
    html += '        </td>';
    html += '    </tr>';
    html += '    </table>';
    html += '</div>';

    //console.log(html);
    if (document.getElementById(targetID)) {
        document.getElementById(targetID).innerHTML = html;
    }
};
