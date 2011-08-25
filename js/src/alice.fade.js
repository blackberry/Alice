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
