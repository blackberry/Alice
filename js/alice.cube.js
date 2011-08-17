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
 * ---[ Cube ]----------------------------------------------------------------
 */

/**
 * @description
 *
 */
alice.cube = function (params) {
    //console.log(params);
    var elem = document.getElementById(params.id);

    elem.className = 'alice-cube-view';

    // hide all the child elements
    //console.debug(elem.childNodes.length);
    for (var i = 0; i < elem.childNodes.length; i++) {
        //console.debug(elem.childNodes[i]);
        if (elem.childNodes[i].style) {
            elem.childNodes[i].style.display = 'none';
        }
    }

    var imgs = elem.getElementsByTagName('img');

    for (var i = 1; i <= params.hslice; i++) {
        // create horizontal slices
        hslice = document.createElement('div');

        hslice.id = 'alice-cube-hslice' + i;
        hslice.className = 'alice-cube-hslice';

        elem.appendChild(hslice);

        var sides = ['front', 'right', 'back', 'left'];
        var lids = ['top', 'bottom'];

        for (var j = 0; j < sides.length; j++) {
            // create sides
            side = document.createElement('div');

            side.className = 'alice-cube-face alice-cube-' + sides[j] + 'side alice-cube-s' + i;

            // set the CSS background property
            //console.log(imgs[j].src);
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
