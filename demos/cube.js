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

var app = {
    version: '0.1',

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
    ay: 0
};

/*
 * ---[ Touch events ]--------------------------------------------------------
 */

app.touchStart = function (e) {
    e.preventDefault();

    app.touchX1 = e.targetTouches[0].pageX;
    app.touchY1 = e.targetTouches[0].pageY;
};

app.touchMove = function (e) {
    e.preventDefault();

    app.touchX2 = e.targetTouches[0].pageX;
    app.touchY2 = e.targetTouches[0].pageY;
};

app.touchEnd = function (e) {
    e.preventDefault();
    //console.debug('touchEnd: ' + e.targetTouches[ 0 ].pageX + ',' + e.targetTouches[ 0 ].pageY);
    if (app.touchX1 && app.touchX2) {
        app.panX = app.touchX1 - app.touchX2;
        app.panY = app.touchY1 - app.touchY2;
        //console.debug('(' + app.touchX1 + ',' + app.touchY1 + ') => (' + app.touchX2 + ',' + app.touchY2 + ') = (' + app.panX + ',' + app.panY + ')');
        if (Math.abs(app.panY) > Math.abs(app.panX)) {
            // up
            if (app.panY > 0) {
                //app.xAngle += (app.panY / 1600) * 100;
                app.xAngle += 45;
            }
            // down
            else {
                //app.xAngle -= (Math.abs(app.panY) / 1600) * 100;
                app.xAngle -= 45;
            }
        }
        else {
            // right
            if (app.panX > 0) {
                //app.yAngle -= (app.panX / 1600) * 100;
                app.yAngle -= 90;
            }
            // left
            else {
                //app.yAngle += (Math.abs(app.panX) / 1600) * 100;
                app.yAngle += 90;
            }
        }
        //console.debug(app.xAngle + ',' + app.yAngle);
        app.animate(app.xAngle, app.yAngle);
    }
};

/*
 * ---[ Mouse events ]--------------------------------------------------------
 */

app.mouseDown = function (e) {
    e.preventDefault();
    //console.debug('mouseDown: ' + e.x + ',' + e.y);
    app.leftClick = true;
    app.mouseX1 = e.x;
    app.mouseY1 = e.y;
};

app.mouseMove = function (e) {
    e.preventDefault();
};

app.mouseUp = function (e) {
    e.preventDefault();

    if (app.leftClick === true) {
        //console.debug('mouseMove: ' + e.x + ',' + e.y);
        app.mouseX2 = e.x;
        app.mouseY2 = e.y;

        app.mouseX = app.mouseX1 - app.mouseX2;
        app.mouseY = app.mouseY1 - app.mouseY2;

        if (Math.abs(app.mouseY) > Math.abs(app.mouseX)) {
            // up
            if (app.mouseY > 0) {
                //app.xAngle += (app.mouseY / 1600) * 100;
                app.xAngle += 45;
            }
            // down
            else {
                //app.xAngle -= (Math.abs(app.mouseY) / 1600) * 100;
                app.xAngle -= 45;
            }
        }
        else {
            // left
            if (app.mouseX > 0) {
                //app.yAngle -= (app.mouseX / 1600) * 100;
                app.yAngle -= 90;
            }
            // right
            else {
                //app.yAngle += (Math.abs(app.mouseX) / 1600) * 100;
                app.yAngle += 90;
            }
        }
        //console.debug(app.xAngle + ',' + app.yAngle);
        app.animate(app.xAngle, app.yAngle);
    }

    app.leftClick = false;
};

/*
 * ---[ Keyboard events ]-----------------------------------------------------
 */

app.keyDown = function (e) {
    //console.debug(e.keyCode);
    switch (e.keyCode) {
    case 37:
        // left arrow
        app.yAngle -= 90;
        break;

    case 38:
        // up arrow
        app.xAngle += 45;
        break;

    case 39:
        // right arrow
        app.yAngle += 90;
        break;

    case 40:
        // down arrow
        app.xAngle -= 45;
        break;

    case 65:
        // A = left
        app.yAngle -= 90;
        break;

    case 68:
        // D = right
        app.yAngle += 90;
        break;

    case 83:
        // S = down
        app.xAngle -= 45;
        break;

    case 87:
        // W = up
        app.xAngle += 45;
        break;
    };

    app.animate(app.xAngle, app.yAngle);
};

/*
 * ---[ Motion events ]-------------------------------------------------------
 */

app.deviceMotion = function (e) {
    app.ax = e.accelerationIncludingGravity.x * 10;
    app.ay = e.accelerationIncludingGravity.y * 10;
    //console.debug(app.ax + ',' + app.ay);
    if (document.getElementById('statusbar')) {
        document.getElementById('statusbar').innerHTML = 'devicemotion (ax, ay) = ' + app.ax + ', ' + app.ay;
    }

    if (document.getElementById('tilt') && document.getElementById('tilt').checked === true && (Math.abs(app.ay) > 40 || Math.abs(app.ax) > 40)) {
        if (Math.abs(app.ay) > Math.abs(app.ax)) {
            // up
            if (app.ay > 0) {
                app.xAngle += 45;
            }
            // down
            else {
                app.xAngle -= 45;
            }
        }
        else {
            // left
            if (app.ax > 0) {
                app.yAngle += 90;
            }
            // right
            else {
                app.yAngle -= 90;
            }
        }
        //console.debug(app.xAngle + ',' + app.yAngle);
        app.animate(app.xAngle, app.yAngle);
    }
};

/*
 * ---------------------------------------------------------------------------
 */

app.animate = function (x, y) {
    for (var i = 1; i <= 8; i++) {
        //document.getElementById('alice-cube-hslice' + i).style.webkitAnimation = "alice-overspin 1." + i + "s 1 normal ease-out";
        document.getElementById('alice-cube-hslice' + i).style.webkitTransform = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    }
};
