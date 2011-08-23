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
 * ---[ Toss ]----------------------------------------------------------------
 */

alice._utils.insertCSSRule('@-webkit-keyframes alice-toss { 0% { -webkit-transform: translateY(350px) rotate(-360deg); opacity: 0; } 70% { -webkit-transform: translateY(-20px) rotate(5deg); } 100% { opacity: 1; } }');

/**
 * @description
 * Toss effect.
 */
alice.toss = function (params) {
    // set default values
    var r = 0;
    var duration = 1;
    var iteration = 1;
    var timing = 'ease-out';
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

        if (params.iteration) {
            iteration = params.iteration;
        }

        if (params.timing) {
            timing = params.timing;
        }

        if (params.origin) {
            origin = params.origin;
        }

        s['-webkit-animation-name']            = 'alice-toss';
        s['-webkit-animation-duration']        = duration + 'ms';
        s['-webkit-animation-iteration-count'] = iteration;
        s['-webkit-animation-direction']       = 'alternate';
        s['-webkit-animation-timing-function'] = timing;
        s['-webkit-transform-origin']          = origin;
    }
    else {
        console.warn('Could not access ' + params.id);
    }

    return this;
};
