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
 * ---[ Rotate ]--------------------------------------------------------------
 */

/**
 * @description
 *
 */
alice.rotate = function (id, angle, opts) {
    var x = {
        _elem         : document.getElementById(id),
        _angle        : angle, // degrees

        _angle_start  : 0,

        _origin       : (opts && opts.origin)      ? opts.origin      : 'center',
        _timing_rand  : (opts && opts.timing_rand) ? opts.timing_rand : '0', // ms
        _timing       : (opts && opts.timing)      ? opts.timing      : '0', // ms
        _iteration    : (opts && opts.iteration)   ? opts.iteration   : '1',
        _direction    : (opts && opts.direction)   ? opts.direction   : 'normal',
        _easing       : (opts && opts.easing)      ? opts.easing      : 'linear',

        setup         : alice._utils.setup2,

        _setupHelper  : function (i, s) {
            if (opts && opts.timing && opts.timing_rand) {
                this._timing = alice._utils.randomize(this._timing, this._timing_rand)
            }

            if (opts && opts.timing && opts.timing_offset) {
                this._timing = parseInt(this._timing, 10) + parseInt(opts.timing_offset, 10);
            }

            if (opts && opts.angle_offset) {
                this._angle = parseInt(this._angle, 10) + parseInt(opts.angle_offset, 10);
                //this._timing = parseInt(this._timing, 10) + (parseInt(opts.angle_offset, 10) * 100);
            }

            if (this._iteration === 'infinite' || this._iteration > 1) {
                this._angle_start = '-' + this._angle;
            }

            var css_rule = '';

            css_rule += '@-webkit-keyframes alice-rotate-' + id + ' {' + "\n";
            css_rule += '    0% {' + "\n";
            css_rule += '        -webkit-transform: rotate(' + this._angle_start + 'deg);' + "\n";
            css_rule += '    }' + "\n";
            css_rule += '    100% {' + "\n";
            css_rule += '        -webkit-transform: rotate(' + this._angle + 'deg);' + "\n";
            css_rule += '    }' + "\n";
            css_rule += '}' + "\n";
            //console.log(css_rule);

            alice._utils.insertCSSRule(css_rule); // regenerate by removing existing then add new one

            if (i !== null) {
                s.position = "absolute";
                s.left = "0";
                s.top = "0";
            }
            else {

            }

            s['-webkit-animation-name']            = 'alice-rotate-' + id;
            s['-webkit-animation-duration']        = this._timing + 'ms';
            s['-webkit-animation-iteration-count'] = this._iteration;
            s['-webkit-animation-direction']       = this._direction;
            s['-webkit-animation-timing-function'] = this._easing;

            s['-webkit-transform']                 = 'rotate(' + this._angle + 'deg)';
            s['-webkit-transform-origin']          = this._origin;
        }
    };

    return x.setup();
};
