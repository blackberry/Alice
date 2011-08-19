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
 * app.js
 *
 * @author Jim Ing
 * ===========================================================================
 */

var evha = {
    increment: 180,

    timeStart: 0,
    timeEnd: 0,
    timeElapsed: 0,

    touchX1: 0,
    touchY1: 0,

    touchX2: 0,
    touchY2: 0,

    panX: 0,
    panY: 0,

    xAngle: 0,
    yAngle: 0,

    leftClick: false,

    mouseX1: 0,
    mouseY1: 0,

    mouseX2: 0,
    mouseY2: 0,

    mouseX: 0,
    mouseY: 0,

    ax: 0,
    ay: 0,

    factor: 1,
    fx1: 1,
    fy1: 1,
    fx2: 1,
    fy2: 1,

    pinch: false,
    keydown: false
};

/*
 * ---[ Gesture events ]------------------------------------------------------
 */

evha.gestureStart = function (e) {
    e.preventDefault();
}

evha.gestureChange = function (e) {
    e.preventDefault();

    scale = e.scale;
    rotation = e.rotation;
}

evha.gestureEnd = function (e) {
    e.preventDefault();

    var zoom_level;

    if (scale > 1) {

    }
    else {

    }
}

/*
 * ---[ Touch events ]--------------------------------------------------------
 */

evha.touchStart = function (e) {
    e.preventDefault();

    evha.timeStart = new Date();
    evha.touchX1 = e.targetTouches[0].pageX;
    evha.touchY1 = e.targetTouches[0].pageY;
    if (e.targetTouches.length === 2) {
        evha.fx1 = Math.abs(e.targetTouches[1].pageX - e.targetTouches[0].pageX);
        evha.fy1 = Math.abs(e.targetTouches[1].pageY - e.targetTouches[0].pageY);
    }
};

evha.touchMove = function (e) {
    e.preventDefault();

    if (e.targetTouches.length === 2) {
        //evha.pinch = true;

        evha.fx2 = Math.abs(e.targetTouches[1].pageX - e.targetTouches[0].pageX);
        evha.fy2 = Math.abs(e.targetTouches[1].pageY - e.targetTouches[0].pageY);
        evha.fx = evha.fx2 / evha.fx1;
        evha.fy = evha.fy2 / evha.fy1;

        //evha.scale(evha.fx);
    }
    else {
        //evha.pinch = false;
    }

    evha.touchX2 = e.targetTouches[0].pageX;
    evha.touchY2 = e.targetTouches[0].pageY;
};

evha.touchEnd = function (e) {
    e.preventDefault();
    evha.timeEnd = new Date();
    evha.timeElapsed = evha.timeEnd.getTime() - evha.timeStart.getTime();

    if (evha.pinch === false) {
        if (evha.touchX1 && evha.touchX2) {
            evha.panX = evha.touchX1 - evha.touchX2;
            evha.panY = evha.touchY1 - evha.touchY2;

            if (Math.abs(evha.panX) >= 5 || Math.abs(evha.panY) >= 5) {
                if (Math.abs(evha.panY) > Math.abs(evha.panX)) {
                    // up
                    if (evha.panY > 0) {
                        evha.xAngle += evha.increment;
                    }
                    // down
                    else {
                        evha.xAngle -= evha.increment;
                    }
                }
                else {
                    // right
                    if (evha.panX > 0) {
                        evha.yAngle -= evha.increment;
                    }
                    // left
                    else {
                        evha.yAngle += evha.increment;
                    }
                }
            }

            evha.animate(evha.xAngle, evha.yAngle, evha.timeElapsed);
        }
    }
    else {
        //evha.pinch = false;
    }
};

/*
 * ---[ Mouse events ]--------------------------------------------------------
 */

evha.mouseDown = function (e) {
    e.preventDefault();

    evha.timeStart = new Date();
    evha.leftClick = true;
    evha.mouseX1 = e.x;
    evha.mouseY1 = e.y;
};

evha.mouseMove = function (e) {
    e.preventDefault();
};

evha.mouseUp = function (e) {
    e.preventDefault();

    evha.timeEnd = new Date();
    evha.timeElapsed = evha.timeEnd.getTime() - evha.timeStart.getTime();

    if (evha.leftClick === true) {
        evha.mouseX2 = e.x;
        evha.mouseY2 = e.y;

        evha.mouseX = evha.mouseX1 - evha.mouseX2;
        evha.mouseY = evha.mouseY1 - evha.mouseY2;

        if (evha.mouseX !== 0 || evha.mouseY !== 0) {
            if (Math.abs(evha.mouseY) > Math.abs(evha.mouseX)) {
                // up
                if (evha.mouseY > 0) {
                    evha.xAngle += evha.increment;
                }
                // down
                else {
                    evha.xAngle -= evha.increment;
                }
            }
            else {
                // left
                if (evha.mouseX > 0) {
                    evha.yAngle -= evha.increment;
                }
                // right
                else {
                    evha.yAngle += evha.increment;
                }
            }

            evha.animate(evha.xAngle, evha.yAngle, evha.timeElapsed);
        }
    }

    evha.leftClick = false;
};

evha.mouseWheel = function (e) {
    e.preventDefault();

    // up
    if (e.wheelDeltaY > 0) {
        //evha.xAngle += 45;
        evha.factor += 0.5;
    }
    // down
    else if (e.wheelDeltaY < 0) {
        //evha.xAngle -= 45;
        evha.factor -= 0.5;
    }
    // left
    else if (e.wheelDeltaX < 0) {
        //evha.yAngle -= 45;
    }
    // right
    else if (e.wheelDeltaX > 0) {
        //evha.yAngle += 45;
    }

    //evha.animate(evha.xAngle, evha.yAngle);
    evha.scale(evha.factor);
};

/*
 * ---[ Keyboard events ]-----------------------------------------------------
 */

evha.keyDown = function (e) {
    if (evha.keydown === false) {
        evha.timeStart = new Date();
    }

    evha.keydown = true;
};

evha.keyUp = function (e) {

    evha.keydown = false;

    evha.timeEnd = new Date();
    evha.timeElapsed = (evha.timeEnd.getTime() - evha.timeStart.getTime()) * 2;

    if (e.keyCode == 90 || e.keyCode == 88) {
        switch (e.keyCode) {
            // z = zoom in
            case 90:
                evha.factor += 0.5;
                break;
            // x = zoom out
            case 88:
                evha.factor -= 0.5;
                break;
        };

        evha.scale(evha.factor);
    }
    else {
        switch (e.keyCode) {
            case 37:
                // left arrow
                evha.yAngle -= evha.increment;
                break;

            case 38:
                // up arrow
                evha.xAngle += evha.increment;
                break;

            case 39:
                // right arrow
                evha.yAngle += evha.increment;
                break;

            case 40:
                // down arrow
                evha.xAngle -= evha.increment;
                break;

            case 65:
                // A = left
                evha.yAngle -= evha.increment;
                break;

            case 68:
                // D = right
                evha.yAngle += evha.increment;
                break;

            case 83:
                // S = down
                evha.xAngle -= evha.increment;
                break;

            case 87:
                // W = up
                evha.xAngle += evha.increment;
                break;
        };

        evha.animate(evha.xAngle, evha.yAngle, evha.timeElapsed);
    }
};

/*
 * ---[ Motion events ]-------------------------------------------------------
 */

evha.deviceMotion = function (e) {
    if (document.getElementById('tilt').checked === true) {
        evha.ax = e.accelerationIncludingGravity.x * 10;
        evha.ay = e.accelerationIncludingGravity.y * 10;
/*
        if (document.getElementById('statusbar')) {
            document.getElementById('statusbar').innerHTML = 'devicemotion (ax, ay) = ' + evha.ax + ', ' + evha.ay;
        }
*/
        //if (document.getElementById('tilt') && document.getElementById('tilt').checked === true && (Math.abs(evha.ay) > 40 || Math.abs(evha.ax) > 40)) {
            if (Math.abs(evha.ay) > Math.abs(evha.ax)) {
                // up
                if (evha.ay > 0) {
                    evha.xAngle += evha.increment;
                }
                // down
                else {
                    evha.xAngle -= evha.increment;
                }
            }
            else {
                // left
                if (evha.ax > 0) {
                    evha.yAngle += evha.increment;
                }
                // right
                else {
                    evha.yAngle -= evha.increment;
                }
            }
            evha.animate(evha.xAngle, evha.yAngle);
        //}
    }
};

/*
 * These are stubs and should be overrided
 */

evha.animate = function (x, y) {
    //document.getElementById('your_id').style.webkitTransform = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
};

evha.scale = function (f) {
    //document.getElementById('your_id').style.webkitTransform = "scale(" + f + ")";
};
