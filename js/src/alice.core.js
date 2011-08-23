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
    build: '20110823-1300'
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
