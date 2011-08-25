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

/* ===========================================================================
 * alice.js
 *
 * @author Laurent Hasson
 * @author Jim Ing
 * ===========================================================================
 */

/**
 * @description
 * Alice is a CSS3 framework.
 */
var alice = {
    version: '0.1',
    build: '20110824-1200'
};

/**
 * @description
 *
 */
alice._utils = {};

alice._utils.getElems = function (ids) {
    var elems = new Array(ids.length);

    for (var i = 0; i < ids.length; ++i) {
        elems[i] = document.getElementById(ids[i]);
    }

    return elems;
};

/**
 * @params
 * factor is a number between 0 and 1
 */
alice._utils.randomize = function (val, factor) {
    var val_rand = (factor === undefined || factor === null) ? val : val + val * ((Math.random() * 2 * factor) - factor);
    //console.warn(val, factor, val_rand);

    return val_rand;
};

alice._utils.getPercentCoords = function (coords) {
    if (coords === undefined || coords === null) {
        return {x: 50, y: 50};
    }

    if (typeof coords == 'string') {
        switch (coords) {
            case "top-left"     : return {x:   0, y:   0};
            case "top-center"   : return {x:  50, y:   0};
            case "top-right"    : return {x: 100, y:   0};
            case "middle-left"  : return {x:   0, y:  50};
            case "middle-right" : return {x: 100, y:  50};
            case "bottom-left"  : return {x:   0, y: 100};
            case "bottom-center": return {x:  50, y: 100};
            case "bottom-right" : return {x: 100, y: 100};
            default             : return {x:  50, y:  50}; // center
        }
    }

    return coords;
};

/**
 * @description
 *
 */
alice._utils.hideAndRemoveEventListener = function (e) {
    this.style.visibility = "hidden";
    this.removeEventListener(e.type, arguments.callee, false);
};

/**
 * @description
 *
 */
alice._utils.setup = function () {
    var s;

    if (this._current === null) {
        this._current = 0;
    }

    if (this._elem.childNodes.length > 1) {
        for (var i = 0; i < this._elem.childNodes.length; i++) {
            var e = this._elem.childNodes[i];
            if (e.nodeName.toLowerCase() != "div") {
                this._elem.removeChild(e);
                --i;
                continue;
            }
            s = e.style;
            //s.position = "absolute";
            //s.left = "0";
            //s.top = "0";
            this._setupHelper(i, s);
        }
    }
    else {
        s = this._elem.style;
        this._setupHelper(null, s);
    }

    return this;
};

/**
 * @description
 *
 */
alice._utils.setup2 = function (params) {
    var e, s;

    if (this._elem.children.length > 1) {
        for (var i = 0; i < this._elem.children.length; i++) {
            e = this._elem.children[i];
            s = e.style;
            this._setupHelper(i, s);
        }
    }
    else {
        s = this._elem.style;
        this._setupHelper(null, s);
    }

    return this;
};

/**
 * @description
 *
 */
alice._utils.next = function () {
    this._animate(this._current + 1 === this._elem.childNodes.length ? 0 : this._current + 1);
};

/**
 * @description
 *
 */
alice._utils.prev = function () {
    this._animate(this._current === 0 ? this._elem.childNodes.length - 1 : this._current - 1);
};

/**
 * @description
 *
 */
alice._utils.setCurrent = function (index) {
    this._animate(index);
};

/**
 * @description
 *
 */
alice._utils.animate = function (current) {
    this._last = this._current;
    var e1 = this._elem.childNodes[this._last];
    this._current = current;
    var e2 = this._elem.childNodes[this._current];
    this._animateHelper(e1, e2);
};

/**
 * @description
 *
 */
alice._utils.setCSS = function (cssname, cssprop, val) {
    var cssrules = (document.all) ? 'rules' : 'cssRules';

    for (var i = 0; i < document.styleSheets[0][cssrules].length; i++) {
        if (document.styleSheets[0][cssrules][i].selectorText == cssname) {
            document.styleSheets[0][cssrules][i].style[cssprop] = val;
            break;
        }
    }
};

/**
 * @description
 *
 */
alice._utils.insertCSSRule = function (cssRule) {
    var lastSheet = document.styleSheets[document.styleSheets.length - 1];

    //lastSheet.deleteRule(lastSheet.cssRules.length - 1)
    lastSheet.insertRule(cssRule, lastSheet.cssRules.length);

    //console.debug(lastSheet.cssRules);
};

/**
 * @description
 * Insert a CSS Rule into a stylesheet by title
 */
alice._utils.insertCSSRuleIn = function (cssRule, cssTitle) {
    var styleSheet;
    for (var i = 0; i < document.styleSheets.length; i++) {
        styleSheet = document.styleSheets[i];

        if (styleSheet.title == cssTitle) {
            styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
            break;
        }
    }
};

/**
 * @description
 *
 */
alice._utils.insertStyleSheet = function (styleTitle, styleText) {
    // check if style sheet exists
    var exists = false;
    var styleSheet;

    for (var i = 0; i < document.styleSheets.length; i++) {
        styleSheet = document.styleSheets[i];

        if (styleSheet.title == styleTitle) {
            exists = true;
            break;
        }
    }

    if (exists === false) {
        var styleElem = document.createElement('style');
        var styleRules = document.createTextNode(styleText);

        styleElem.title = styleTitle;
        styleElem.type = 'text/css';

        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = styleRules.nodeValue;
        }
        else {
            styleElem.appendChild(styleRules);
        }

        document.getElementsByTagName('head')[0].appendChild(styleElem);
    }
    else {
        //console.warn('The stylesheet "' + styleTitle + '" already exists!');
    }
};

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

/*
 * ---[ Cube ]----------------------------------------------------------------
 */

/**
 * @description
 *
 */
alice.cube = function (params) {
    var elem = document.getElementById(params.id);

    elem.className = 'alice-cube-view';

    // hide all the child elements
    for (var h = 0; h < elem.childNodes.length; h++) {
        if (elem.childNodes[h].style) {
            elem.childNodes[h].style.display = 'none';
        }
    }

    var imgs = elem.getElementsByTagName('img');

    var hslice;
    for (var i = 1; i <= params.hslice; i++) {
        // create horizontal slices
        hslice = document.createElement('div');

        hslice.id = 'alice-cube-hslice' + i;
        hslice.className = 'alice-cube-hslice';

        elem.appendChild(hslice);

        var sides = ['front', 'right', 'back', 'left'];
        var lids = ['top', 'bottom'];
        var side, lid;

        for (var j = 0; j < sides.length; j++) {
            // create sides
            side = document.createElement('div');

            side.className = 'alice-cube-face alice-cube-' + sides[j] + 'side alice-cube-s' + i;

            // set the CSS background property
            alice._utils.setCSS('.alice-cube-' + sides[j] + 'side', 'background', 'url("' + imgs[j].src + '")');

            hslice.appendChild(side);
        }

        for (var k = 0; k < lids.length; k++) {
            // create top and bottom lids
            lid = document.createElement('div');

            lid.className = 'alice-cube-lid alice-cube-' + lids[k] + 'side';

            hslice.appendChild(lid);
        }
    }

    return this;
};

/*
 * ---[ Fade ]----------------------------------------------------------------
 */

/**
 * @description
 *
 */
alice.fade = function (id, timingms, easing) {
    var x = {
        _elem         : document.getElementById(id),
        _timingms     : timingms,
        _easing       : easing,
        _current      : null,
        _last         : null,
        setup         : alice._utils.setup,

        _setupHelper  : function (i, s) {
            s.position = "absolute";
            s.left = "0";
            s.top = "0";

            if (i == this._current) {
                s.visibility = "visible";
                s.opacity = "1";
            }
            else {
                s.visibility = "hidden";
                s.opacity = "0";
            }
            s["-webkit-transition"] = "opacity " + this._timingms + "ms " + this._easing;
        },

        next          : alice._utils.next,
        prev          : alice._utils.prev,
        setCurrent    : alice._utils.setCurrent,
        _animate      : alice._utils.animate,

        _animateHelper: function (e1, e2) {
            e2.style.visibility = "visible";
            e2.style.opacity = "1";
            e1.addEventListener("webkitTransitionEnd", alice._utils.hideAndRemoveEventListener, false);
            e1.style.opacity = "0";
        }
    };

    return x.setup();
};

/*
 * ---[ Fade 2 ]--------------------------------------------------------------
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

/*
 * ---[ Flip ]----------------------------------------------------------------
 */

/**
 * @description
 *
 */
alice.flip = function (id, timingms, easing, perspective, zindex, rotations) {
    var x = {
        _elem: document.getElementById(id),
        _timingms: timingms,
        _easing: easing,
        _perspective: perspective,
        _zindex: zindex,
        _current: null,
        _last: null,
        setup: alice._utils.setup,
        _setupHelper: function (i, s) {
            s.position = "absolute";
            s.left = "0";
            s.top = "0";

            this._elem.style["-webkit-perspective"] = this._perspective;
            if (i == this._current) {
                s.visibility = "visible";
                s["-webkit-transform"] = "rotateY(0deg)";
                s["z-index"] = this._zindex;
            }
            else {
                s["visibility"] = "hidden";
                s["-webkit-transform"] = "rotateY(-180deg)";
                s["z-index"] = this._zindex - 10;
            }
            s["-webkit-transform-style"] = "preserve-3d";
            s["-webkit-transition"] = "all " + this._timingms + "ms " + this._easing;
        },
        next: alice._utils.next,
        prev: alice._utils.prev,
        setCurrent: alice._utils.setCurrent,
        _animate: alice._utils.animate,
        _animateHelper: function (e1, e2) {
            e1.style["z-index"] = this._zindex - 10;
            e1.style["-webkit-transform"] = "rotateY(-180deg)";
            e1.addEventListener("webkitTransitionEnd", alice._utils.hideAndRemoveEventListener, false);

            e2.style.visibility = "visible";
            e2.style["z-index"] = this._zindex;
            e2.style["-webkit-transform"] = "rotateY(0deg)";
        }
    };
    return x.setup();
};

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
                this._timing = alice._utils.randomize(this._timing, this._timing_rand);
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

        var speed = 1;
        if (params.speed) {
            speed = params.speed;
        }

        var elasticity = 0.50;

        var precision = 1; // 100 = 2 decimal places

        var height_val = (document.getElementById('height_val')) ? document.getElementById('height_val').innerHTML : params.drop_height;

        var floor_y = (height_val - parseInt(params.height, 10) - 10);

        var h = floor_y;

        var cnt = 0;
        var css = '';

        css += "@-webkit-keyframes 'alice-spring-" + params.id + "' {" + "\n";

        // pre count
        var num = 0;
        while (h > (1 / precision)) {
            num++;
            h = Math.round(h * params.elasticity * precision) / precision;
        }

        // reset
        h = floor_y;

        var last_p = 0;
        var p = 0;
        var scale = (Math.floor(100 / (num * 2)));
        var t, f, y, x, adj_y, e;

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
                f = Math.round(((h / floor_y) * params.elasticity * 0.98) * 10000) / 10000;
                t = floor_y;
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
            e = 'cubic-bezier(0.33333,0.6667,0.66667,1)';

            css += '  '+ p + '% {' + "\n";
            css += '    top: ' + t + 'px;' + "\n";
            css += '    -webkit-transform: scaleY(' + y + ')  scaleX(' + x + ') translateY(' + adj_y + ');' + "\n";
            css += '    -webkit-animation-timing-function: ' + e + ';' + "\n";
            css += '  }' + "\n";

            p = p + scale;
        }

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

        s['position']                          = 'relative';
        s['float']                             = 'left';

        // adjust width and height of nested images
        if (elem.tagName != 'IMG' && elem.children.length > 0) {
            for (var m = 0; m < elem.children.length; m++) {
                if (elem.children[m].tagName == 'IMG') {
                    elem.children[m].style['width']  = params.width + 'px';
                    elem.children[m].style['height'] = params.height + 'px';
                    //elem.children[m].style['border-radius'] = '15px';
                }
            }
        }

        // set animation properties
        s['-webkit-animation-name']            = 'alice-spring-' + params.id;
        s['-webkit-animation-duration']        = (params.elasticity * speed * 10) + 's';
        s['-webkit-animation-iteration-count'] = iteration;
        s['-webkit-animation-direction']       = 'normal';
        s['-webkit-animation-fill-mode']       = 'forwards';
    }
    else {
        console.warn('Could not access ' + params.id);
    }

    return this;
};

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
