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
 * ---[ Fade ]----------------------------------------------------------------
 */

alice._utils.insertCSSRule('@-webkit-keyframes alice-fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }');
alice._utils.insertCSSRule('@-webkit-keyframes alice-fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }');

/**
 * @description
 * Fade effect.
 */
alice.fade2 = function (params) {
    // set default values
    var r = 0;
    var duration = 1;
    var iteration = 1;
    var timing = 'ease-out';

    if (document.getElementById(params.id)) {
        var elem = document.getElementById(params.id);
        var s = elem.style;

        if (params.random) {
            r = Math.random() * (params.random / 50) - params.random / 100;
        }

        if (params.duration) {
            duration = parseFloat(params.duration) + parseFloat(params.duration) * r;
            duration = Math.round(duration * 1000) / 1000;
        }

        if (params.iteration) {
            iteration = params.iteration;
        }

        if (params.timing) {
            timing = params.timing;
        }

        s['-webkit-animation-name']            = 'alice-fade-out';
        s['-webkit-animation-duration']        = duration + 's';
        s['-webkit-animation-iteration-count'] = iteration;
        s['-webkit-animation-direction']       = 'alternate';
        s['-webkit-animation-timing-function'] = timing;
        s['opacity']                           = 0;
    }
    else {
        console.warn('Could not access ' + params.id);
    }

    return this;
};
