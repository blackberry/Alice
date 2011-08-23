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
