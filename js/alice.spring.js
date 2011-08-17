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
 * ---[ Spring ]--------------------------------------------------------------
 */

alice._utils.insertStyleSheet('alice-spring', '');

/**
 * @description
 * Spring effect.
 */
alice.spring = function (params) {
    if (document.getElementById(params.id)) {

        var iteration = 1;
        if (params.iteration) {
            iteration = params.iteration;
        }

        var elasticity = .50;

        var precision = 1; // 100 = 2 decimal places

        var height_val = (document.getElementById('height_val')) ? document.getElementById('height_val').innerHTML : params.drop_height;

        var floor_y = (height_val - parseInt(params.height) - 10);
        //console.debug('floor_y=' + floor_y);

        var h = floor_y;

        var cnt = 0;
        var css = '';

        css += "@-webkit-keyframes 'alice-spring-" + params.id + "' {" + "\n";

        // pre count
        num = 0;
        while (h > (1 / precision)) {
            num++;
            h = Math.round(h * params.elasticity * precision) / precision;
        }
        //console.debug('num=' + num);

        // reset
        h = floor_y;

        last_p = 0;
        p = 0;
        s = (Math.floor(100 / (num * 2)));

        for (var i = 0; i <= ((num * 2)); i++) {
            // calculate values for peak
            if (i % 2 === 0) {
                t = floor_y - h;
                h = Math.round(h * params.elasticity * precision) / precision;
                f = '';
                y = 1;
                x = 1;
                adj_y = '0%';
                e = 'ease-out';
            }
            // calculate values for trough
            else {
                f = Math.round(((h / floor_y) * params.elasticity * .98) * 10000) / 10000;
                t = floor_y;
                //y = 1 - (f/2);
                //x = 1 + (f/2);
                y = 1 - f;
                x = 1 + (f/4);
                adj_y = ((1 - y) * 100) + '%';
                e = 'ease-in';
            }

            last_p = p;

            // set t to floor_y if it's the last frame
            if (p === 100) {
                t = floor_y;
            }
            //t = floor_y;
            e = 'cubic-bezier(0.33333,0.6667,0.66667,1)';
            //y = 1;
            //x = 1;
            //console.debug(params.id + ', ' + p + '%, top=' + t + 'px, X=' + x + ', Y=' + y + ', f=' + f + ', h=' + h);

            css += '  '+ p + '% {' + "\n";
            css += '    top: ' + t + 'px;' + "\n";
            css += '    -webkit-transform: scaleY(' + y + ')  scaleX(' + x + ') translateY(' + adj_y + ');' + "\n";
            //css += '    -webkit-transform: scaleY(' + y + '); scaleX(' + x + '); translateY(-200px);' + "\n";
            css += '    -webkit-animation-timing-function: ' + e + ';' + "\n";
            css += '  }' + "\n";

            p = p + s;
        }

        //console.debug('last p=' + last_p);

        // add a final frame if it's missing
        if (last_p < 100) {
            css += '  100% {' + "\n";
            css += '    top: ' + floor_y + 'px;' + "\n";
            css += '  }' + "\n";
        }

        css += '}' + "\n";
        //console.debug(css);

        alice._utils.insertCSSRuleIn(css, 'alice-spring');

        var elem = document.getElementById(params.id);
        var s = elem.style;
        //console.debug(elem);

        s['position']                          = 'relative';
        s['float']                             = 'left';
        //s['width']                             = params.width + 'px';
        //s['height']                            = params.height + 'px';
        //s['margin']                            = '10px';
/*
        s['text-align']                        = 'center';
*/
        // adjust width and height of nested images
        if (elem.tagName != 'IMG' && elem.children.length > 0) {
            for (var i = 0; i < elem.children.length; i++) {
                if (elem.children[i].tagName == 'IMG') {
                    elem.children[i].style['width']  = params.width + 'px';
                    elem.children[i].style['height'] = params.height + 'px';
                    //elem.children[i].style['border-radius'] = '15px';
                }
            }
        }

        // set animation properties
        s['-webkit-animation-name']            = 'alice-spring-' + params.id;
        s['-webkit-animation-duration']        = (params.elasticity * 10) + 's';
        s['-webkit-animation-iteration-count'] = iteration;
        s['-webkit-animation-direction']       = 'normal';
        s['-webkit-animation-fill-mode']       = 'forwards';
        //s['-webkit-animation-timing-function'] = 'ease-in-out';
        //s['-webkit-animation-timing-function'] = 'cubic-bezier(0, 0.35, .5, 1.3)';
        //s['-webkit-animation-timing-function'] = params.timing_function;

        //console.debug(s);
    }
    else {
        console.warn('Could not access ' + params.id);
    }

    return this;
};
