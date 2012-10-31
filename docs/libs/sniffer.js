/* ===========================================================================
 * sniffer.js
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

var sniffer = {
    properties: {
        // Animation
        'animation': false,
        'animation-delay': false,
        'animation-direction': false,
        'animation-duration': false,
        'animation-iteration-count': false,
        'animation-name': false,
        'animation-play-state': false,
        'animation-timing-function': false,

        // Border
        'border-radius': false,
        'border-top-left-radius': false,
        'border-top-right-radius': false,
        'border-bottom-left-radius': false,
        'border-bottom-right-radius': false,

        // Box
/*
        'box-align': false,
        'box-direction': false,
        'box-flex': false,
        'box-flex-group': false,
        'box-lines': false,
        'box-ordinal-group': false,
        'box-orient': false,
        'box-pack': false,
        'box-reflect': false,
        'box-shadow': false,
        'box-sizing': false,
*/

        // Color
        'opacity': false,

        // Text
/*
        'text-shadow': false,
        'text-stroke': false,
*/

        // 2D/3D Transform
        'backface-visibility': false,
        'perspective': false,
        'perspective-origin': false,
        'transform': false,
        'transform-origin': false,
        'transform-style': false,

        // Transition
        'transition': false,
        'transition-delay': false,
        'transition-duration': false,
        'transition-property': false,
        'transition-timing-function': false
    },

    pass: 0,
    fail: 0,
    total: 0,
    score: 0,

    init: function () {
        this.checkProperty();
        this.calcScore();

        var div, s;

        if (this.score !== 1) {
            div = document.createElement('div');
            div.innerHTML     = '';
            div.innerHTML    += 'It appears your browser does not support <b>' + this.fail + '</b> of the CSS3 properties used by AliceJS. Please use a <b>WebKit-based</b> browser like Chrome, Safari or the PlayBook Browser.';
            //div.innerHTML    += ' (' + this.pass + '/' + this.total + ' properties)';
            //div.innerHTML    += ' (Your browser has ' + (this.score * 100).toFixed(0) + '% support)';

            s = div.style;
            s.position        = 'absolute';
            s.width           = '50%';
            s.top             = '0';
            s.left            = '25%';
            s.padding         = '5px';
            s.textAlign       = 'center';
            s.backgroundColor = '#FF9999';
            s.color           = '#000000';
            //s.opacity         = '0.9';
            s.font            = 'normal 8pt "Lucida Console", "Courier New", sans-serif';

            document.body.appendChild(div);
        }
    },

    // change property to JavaSript string, skip first string for W3C properties (true)
    convertString: function (string, bool) {
        var subStr = string.split("-"),
            bucket = [],
            i, firstStr, tempStr, newStr;

        for (i = 0; i < subStr.length; i++) {
            if (bool) {
                firstStr = subStr[0];
                bucket.push(firstStr);
                bool = false;
            }
            else {
                tempStr = subStr[i].charAt(0).toUpperCase() + subStr[i].slice(1);
                bucket.push(tempStr);
            }
        }

        newStr = bucket.join("");
        return newStr;
    },

    // confirm if property exists
    checkProperty: function () {
        var el = document.createElement('div'),
            prop, w3c, moz, webkit;

        for (prop in this.properties) {
            w3c = sniffer.convertString(prop, true); // boxFlex
            moz = 'Moz' + sniffer.convertString(prop); // MozBoxFlex
            webkit = 'webkit' + sniffer.convertString(prop); // webkitBoxFlex

            if (typeof (el.style[w3c]) === 'string') { // too verbose
                this.properties[prop] = true;
            }
            else if (typeof (el.style[moz]) === 'string') {
                this.properties[prop] = true;
            }
            else if (typeof (el.style[webkit]) === 'string') {
                this.properties[prop] = true;
            }
            else {
                continue;
            }
        }
    },

    // tally score
    calcScore: function () {
        this.total = 0;
        this.pass = 0;
        this.fail = 0;

        var prop, bool;

        for (prop in this.properties) {
            if (this.properties[prop] === false) {
                console.warn('The "' + prop + '" property is not supported');
            }
            bool = (this.properties[prop] === true) ? this.pass++ : this.fail++;
            this.total++;
        }
        this.score = this.pass / this.total;
        //console.log(this.score);
    }
};
