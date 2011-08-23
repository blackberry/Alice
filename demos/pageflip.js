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

Element.prototype.hasClassName = function (a) {
    return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function (a) {
    if (!this.hasClassName(a)) {
        this.className = [this.className, a].join(" ");
    }
};

Element.prototype.removeClassName = function (b) {
    if (this.hasClassName(b)) {
        var a = this.className;
        this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
    }
};

Element.prototype.toggleClassName = function (a) {
    this[this.hasClassName(a) ? "removeClassName" : "addClassName"](a);
};

//----------------------------------------------------------------------------

var alice = {
    version: '0.1',
    addCSSRule: function (cssRule) {
        var lastSheet = document.styleSheets[document.styleSheets.length - 1];
        lastSheet.insertRule(cssRule, lastSheet.cssRules.length);
    },
    setCSS: function (cssname, cssprop, val) {
        for (var i = 0; i < document.styleSheets.length; i++) {
            styleSheet = document.styleSheets[i];
            for (var j = 0; j < styleSheet.cssRules.length; j++) {
                cssRule = styleSheet.cssRules[j];
                if (cssRule.selectorText == cssname) {
                    cssRule.style[cssprop] = val;
                    break;
                }
            }
        }
    }
};

alice.flip = {
    init: function (params) {
        if (params.id) {

            var pages = document.getElementById(params.id),
                duration = params.duration || 2,
                width = params.width || 480,
                height = params.height || 360,
                perspective = params.perspective || 1200,
                page;

            pages.addClassName('alice-flip-deck');

            alice.setCSS('.alice-flip-card', '-webkit-transition-duration', duration + 's');

            alice.setCSS('.alice-flip-deck', 'width', width + 'px');
            alice.setCSS('.alice-flip-deck', 'height', height + 'px');
            alice.setCSS('.alice-flip-deck', '-webkit-perspective', perspective);
            alice.setCSS('.alice-flip-card label', 'top', '-' + (height+3) + 'px');

            num_cards = pages.children.length;
            var cnt = 0;
            for (var i = pages.children.length; i--;) {
                cnt++;
                page = pages.children[i];

                page.id = 'card' + (i + 1);
                page.addClassName('alice-flip-card');
                page.style['z-index'] = cnt;
                page['data-order'] = cnt;
            }
            pages.children[0].style.display = 'block';
        }
    },
    start: function () {

    }
};

var idx = 0;
var num_cards;
var flip_direction = 'up';

function getDirection() {
    for (var i = 0; i < document.forms['options']['flip_direction'].length; i++) {
        if (document.forms['options']['flip_direction'][i].checked === true) {
            flip_direction = document.forms['options']['flip_direction'][i].value;
            break;
        }
    }
}

function reorder () {
    var card, zi, cur;
    for (var i = 1; i <= num_cards; i++) {
        card = document.getElementById('card'+i);

        if (i == idx) {
            zi = num_cards;
        }
        else if (i > idx) {
            zi = num_cards - i + 1;
        }
        else if (i < idx) {
            zi = num_cards - idx - (idx - i);
        }

        card.style['z-index'] = zi;
        cur = (i == idx) ? '-> ' : '   ';
    }
}

function previous () {
    getDirection();

    if (idx === 1) {
        document.getElementById('previous').disabled = true;
    }

    if (idx <= num_cards) {
        document.getElementById('next').disabled = false;
    }

    var elem1 = document.getElementById('card' + idx);
    var elem2 = document.getElementById('card' + (idx + 1));

    reorder();
/*
    if (elem2) {
        elem2.removeClassName('fade-in');
        setTimeout(function() {
            elem2.addClassName('fade-out');
        }, 100);
    }
*/
    if (elem1) {
        if (flip_direction == 'up') {
            elem1.removeClassName('alice-flip-up');
            elem1.addClassName('alice-flip-down');
        }
        else {
            elem1.removeClassName('alice-flip-left');
            elem1.addClassName('alice-flip-right');
        }
    }

    idx--;
}

function next () {
    getDirection();

    idx++;

    if (idx > 0) {
        document.getElementById('previous').disabled = false;
    }

    if (idx === num_cards) {
        document.getElementById('next').disabled = true;
    }

    var elem1 = document.getElementById('card' + idx);
    var elem2 = document.getElementById('card' + (idx + 1));

    reorder();

    if (elem1) {
        if (flip_direction == 'up') {
            elem1.removeClassName('alice-flip-down');
            elem1.addClassName('alice-flip-up');
        }
        else {
            elem1.removeClassName('alice-flip-right');
            elem1.addClassName('alice-flip-left');
        }
    }

    if (elem2) {
        elem2.removeClassName('fade-out');
        elem2.addClassName('fade-in');
    }
}
