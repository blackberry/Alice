/* Copyright 2011 Research In Motion Limited.
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

/*
 * ---[ Wobble ]--------------------------------------------------------------
 */

alice._utils.insertCSSRule('@-webkit-keyframes alice-wobble { 0% { -webkit-transform: rotate(2deg); } 100% { top: -150px; -webkit-transform: rotate(-2deg); } }');

/**
 * @description
 * Wobble effect.
 */
alice.wobble = function (params) {
    // set default values
    var r = 0;
    var duration = (((Math.random() * 6) / 100) + 0.13) * 1000; // range between 130 and 190
    var timing = 'ease-in-out';
    var origin = '';

    if (document.getElementById(params.id)) {
        var elem = document.getElementById(params.id);

        var s = elem.style;

        if (params.random) {
            r = Math.random() * (params.random / 50) - params.random / 100;
        }

        if (params.duration) {
            duration = parseFloat(params.duration) + parseFloat(params.duration) * r;
        }

        if (params.timing) {
            timing = params.timing;
        }

        if (params.origin) {
            origin = params.origin;
        }

        s['-webkit-animation-name']            = 'alice-wobble';
        s['-webkit-animation-duration']        = duration + 'ms';
        s['-webkit-animation-iteration-count'] = 'infinite';
        s['-webkit-animation-direction']       = 'alternate';
        s['-webkit-animation-timing-function'] = timing;
        s['-webkit-transform-origin']          = origin;

        if (params.angle) {
            // calculate an angle
            var a = Math.round(parseFloat(params.angle / 2) + parseFloat(params.angle / 2) * r);

            // adjust angle
            var styleSheet, cssRule;
            for (var i = 0; i < document.styleSheets.length; i++) {
                styleSheet = document.styleSheets[i];
                for (var j = 0; j < styleSheet.cssRules.length; j++) {
                    cssRule = styleSheet.cssRules[j];
                    if (cssRule.type === window.CSSRule.WEBKIT_KEYFRAMES_RULE && cssRule.name == 'alice-wobble') {
                        cssRule.findRule('0%').style.webkitTransform = 'rotate(' + a + 'deg)';
                        cssRule.findRule('100%').style.webkitTransform = 'rotate(-' + a + 'deg)';
                        break;
                    }
                }
            }
        }
    }
    else {
        console.warn('Could not access ' + params.id);
    }

    return this;
};
