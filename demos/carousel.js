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

/**
 * Carousel by David DeSandro
 * http://desandro.github.com/3dtransforms/docs/carousel.html
 */
function Carousel3D (el) {
    this.element = el;
    this.rotation = 0;
    this.panelCount = 0;
    this.totalPanelCount = this.element.children.length;
    this.theta = 0;
    this.isHorizontal = true;
    //this.backfaceWasVisible = true;
}

Carousel3D.prototype.modify = function () {
    var panel, angle, i;

    if (this.panelCount == 2) {
        // make this a flip
        this.element.toggleClassName('panels-backface-invisible');
    }
    else {
        this.element.removeClassName('panels-backface-invisible');
    }

    // add figure elements
    if (this.panelCount > this.element.children.length) {
        var numNeeded = parseInt(this.panelCount, 10) - parseInt(this.element.children.length, 10),
            numFigures = this.element.children.length,
            figureElem;

        for (var h = (numFigures + 1); h <= (numFigures + numNeeded); h++) {
            figureElem = document.createElement('figure');
            figureElem.innerHTML = h;
            this.element.appendChild(figureElem);
        }
        this.totalPanelCount += numNeeded;
    }

    this.panelSize = this.element[this.isHorizontal ? 'offsetWidth' : 'offsetHeight'];
    this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
    this.theta = 360 / this.panelCount;

    // do some trig to figure out how big the carousel is in 3D space
    this.radius = Math.round((this.panelSize / 2) / Math.tan(Math.PI / this.panelCount));

    var scalePatt = /scale\(.*\)/;

    for (i = 0; i < this.panelCount; i++) {
        panel = this.element.children[i];
        panel.id = 'carousel-' + i;

        panel.addEventListener('mouseover', function (e) {
            var wkt;
            if (this.style['-webkit-transform'].match(scalePatt)) {
                wkt = this.style['-webkit-transform'].replace(scalePatt, 'scale(1.3)');
            }
            else {
                wkt = this.style['-webkit-transform'] + ' scale(1.3)';
            }

            this.style['-webkit-transform'] = wkt;
            this.style['-webkit-box-shadow'] = '10px 10px 10px rgba(0,0,0,.6)';
            //this.style['z-index'] = '100';
        }, false);

        panel.addEventListener('mouseout', function (e) {
            var wkt = this.style['-webkit-transform'].replace(scalePatt, '');

            this.style['-webkit-transform'] = wkt;
            this.style['-webkit-box-shadow'] = '';
            //this.style['z-index'] = '0';
        }, false);

        angle = this.theta * i;
        panel.style.opacity = 1;
        panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
        // rotate panel, then push it out in 3D space
        panel.style.webkitTransform = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
    }

    // hide other panels
    for (; i < this.totalPanelCount; i++) {
        panel = this.element.children[i];
        panel.style.opacity = 0;
        panel.style.webkitTransform = 'none';
    }

    // adjust rotation so panels are always flat
    this.rotation = Math.round(this.rotation / this.theta) * this.theta;
    this.transform();
};

Carousel3D.prototype.transform = function () {
    // push the carousel back in 3D space, and rotate it
    this.element.style.webkitTransform = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
};

//----------------------------------------------------------------------------

function getStockQuote() {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            var html = '';
            html += '<table border="0" cellpadding="3" cellspacing="0">';
            html += '<tr><td colspan="2"><h3>Stock quote for ' + json.symbol + '</h3></td></tr>';
            html += '<tr><td>Last Trade:</td><td><strong>' + json.last_trade + '</strong></td></tr>';
            html += '<tr><td>Change:</td><td>' + json.change + '</td></tr>';
            html += '<tr><td>Prev. Close:</td><td>' + json.prev_close + '</td></tr>';
            html += '<tr><td>Low - High:</td><td>' + json.day_low + ' - ' + json.day_high + '</td></tr>';
            html += '<tr><td>Volume:</td><td>' + json.volume + '</td></tr>';
            html += '<tr><td>Updated:</td><td>' + json.update_date + ' ' + json.update_time + '</td></tr>';
            html += '</table>';
            document.getElementById('stocks').innerHTML = html;
        }
    }
    xhr.open("GET", "common/ajax/stocks.php?sym=RIM.TO", true);
    xhr.send();
}

function getWeather() {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            var html = '';
            html += '<table border="0" cellpadding="3" cellspacing="0">';
            html += '<tr><td colspan="2"><h3>Weather for ' + json.CONTENT['@attributes'].name + '</h3></td></tr>';
            html += '<tr><td rowspan="2"></td><td><strong>' + json.Observation['@attributes'].temperature_c + '&deg;C</strong></td></tr>';
            html += '<tr><td>' + '' + '</td></tr>';
            html += '<tr><td>Rel. Humidity:</td><td>' + json.Observation['@attributes'].humidity_percent + '%</td></tr>';
            html += '<tr><td>Pressure:</td><td>' + json.Observation['@attributes'].pressure_kpa + ' kPa</td></tr>';
            html += '<tr><td>Visibility:</td><td>' + json.Observation['@attributes'].visibility_km + ' km</td></tr>';
            html += '<tr><td>Ceiling:</td><td>' + json.Observation['@attributes'].ceiling_f + ' ft</td></tr>';
            html += '</table>';
            document.getElementById('weather').innerHTML = html;
        }
    }
    xhr.open("GET", "common/ajax/weather.php?place_code=CAON0696", true);
    xhr.send();
}

var init = function () {
    var carousel = new Carousel3D(document.getElementById('carousel')),
        panelCountInput = document.getElementById('panel_count'),
        panelCountValue = document.getElementById('panel_count_val'),
        perspectiveInput = document.getElementById('perspective'),
        perspectiveValue = document.getElementById('perspective_val'),
        //axisButton = document.getElementById('toggle-axis'),
        navButtons = document.querySelectorAll('#navigation button'),
        onNavButtonClick = function (event) {
            var increment = parseInt(event.target.getAttribute('data-increment'));
            carousel.rotation += carousel.theta * increment * -1;
            carousel.transform();
        };

    // populate on startup
    carousel.panelCount = parseInt(panelCountInput.value, 10);
    panelCountValue.value = carousel.panelCount;

    carousel.modify();
/*
    axisButton.addEventListener('click', function () {
        carousel.isHorizontal = !carousel.isHorizontal;
        carousel.modify();
    }, false);
*/
    panelCountInput.addEventListener('change', function () {
        carousel.panelCount = event.target.value;
        panelCountValue.value = event.target.value;
        carousel.modify();
    }, false);

    panelCountValue.addEventListener('click', function () {
        if (carousel.panelCount != event.target.value) {
            carousel.panelCount = event.target.value;
            panelCountInput.value = event.target.value;
            carousel.modify();
        }
    }, false);

    panelCountValue.addEventListener('change', function () {
        var mn = parseInt(panelCountValue.min, 10),
            mx = parseInt(panelCountValue.max, 10),
            ev = parseInt(event.target.value, 10);

        if (carousel.panelCount != ev) {
            if (mn <= ev && ev <= mx) {
                carousel.panelCount = ev;
                panelCountInput.value = ev;
                carousel.modify();
            }
            else {
                // reset number if it's out of range
                panelCountValue.value = carousel.panelCount;
            }
        }
    }, false);

    perspectiveInput.addEventListener('change', function () {
        perspectiveValue.value = event.target.value;
        document.getElementById('container').style['-webkit-perspective'] = event.target.value;
    }, false);

    perspectiveValue.addEventListener('click', function () {
        if (perspectiveInput.value != event.target.value) {
            perspectiveInput.value = event.target.value
            document.getElementById('container').style['-webkit-perspective'] = event.target.value;
        }

    }, false);

    perspectiveValue.addEventListener('change', function () {
        var mn = parseInt(perspectiveValue.min, 10),
            mx = parseInt(perspectiveValue.max, 10),
            ev = parseInt(event.target.value, 10);

        if (perspectiveInput.value != ev) {
            if (mn <= ev && ev <= mx) {
                perspectiveInput.value = ev;
                document.getElementById('container').style['-webkit-perspective'] = ev;
            }
            else {
                perspectiveValue.value = perspectiveInput.value;
            }
        }

    }, false);

    for (var i = 0; i < 2; i++) {
        navButtons[i].addEventListener('click', onNavButtonClick, false);
    }

    document.getElementById('toggle-backface').addEventListener('click', function () {
        carousel.element.toggleClassName('panels-backface-invisible');
    }, false);

    setTimeout(function () {
        document.body.addClassName('ready');
    }, 0);

    //getStockQuote();
    //getWeather();
};

function handleKeys(e) {
    //console.log('key=' + e);
}

window.addEventListener('DOMContentLoaded', init, false);
window.addEventListener('keypress', handleKeys, false);
