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
 * ---[ Bounce ]--------------------------------------------------------------
 */

//alice._utils.insertCSSRule('@-webkit-keyframes alice-bounce { 0% { -webkit-transform: scale(.5); } 100% { top: -150px; -webkit-transform: scale(1); } }');
alice._utils.insertCSSRule('@-webkit-keyframes alice-bounce-shadow { 0% { -webkit-box-shadow: 1px 1px 1px rgba(0,0,0,.9); -webkit-transform: scale(.5); } 100% { top: -150px; -webkit-box-shadow: 30px 30px 30px rgba(0,0,0,.5); -webkit-transform: scale(1); } }');

/**
 * @description
 * Bounce effect.
 */
alice.bounce = function (params) {
    if (document.getElementById(params.id)) {

        // set default values
        var r = 0;
        var duration = 1;
        var timing = 'ease-out';
        var origin = '';
        //var shadow = false;

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
/*
        if (params.shadow == 'true' || params.shadow == true) {
            shadow = true;
        }
*/
        var elem = document.getElementById(params.id);
        var s = elem.style;
        //console.debug(elem);

        s['float']                             = 'left';
        s['width']                             = params.width;
        s['height']                            = params.height;
        s['padding']                           = '0px';
        s['text-align']                        = 'center';

        // adjust width and height of nested images
        if (elem.tagName != 'IMG' && elem.children.length > 0) {
            for (var i = 0; i < elem.children.length; i++) {
                if (elem.children[i].tagName == 'IMG') {
                    elem.children[i].style['width']  = params.width;
                    elem.children[i].style['height'] = params.height;
                }
            }
        }

        // set animation properties

        s['-webkit-animation-name']        = 'alice-bounce-shadow';
/*
        if (shadow === true) {
            s['-webkit-animation-name']        = 'alice-bounce-shadow';
        }
        else {
            s['-webkit-animation-name']        = 'alice-bounce';
        }
*/
        //s['-webkit-animation-duration']        = '1s';
        s['-webkit-animation-duration']        = duration + 's';
        s['-webkit-animation-iteration-count'] = 'infinite';
        s['-webkit-animation-direction']       = 'alternate';
        //s['-webkit-animation-timing-function'] = 'ease-out';
        s['-webkit-animation-timing-function'] = timing;
        s['-webkit-transform-origin']          = origin;
    }
    else {
        console.warn('Could not access ' + params.id);
    }

    return this;
};
