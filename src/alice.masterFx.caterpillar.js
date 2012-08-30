/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

/* ===========================================================================
 * alice.plugins.caterpillar.js
 * 
 * @author Matt Lantz @Mattylantz
 * ===========================================================================
 *
 * Copyright 2012 Research In Motion Limited.
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


/**
 * caterpillar performs the actual build of the animation
 * [caterpillar description]
 * @param  {[type]} params [description]
 * @return {[type]}
 */
alice.masterFx.caterpillar = function () {
    "use strict";

    //console.info("caterpillar", params);
    var core = {
        // Book elements
        pages: [],              // array of divs for pages
        NewPageClass: '',       // our generated page class

        // Page counters
        leftPage: 0,            // current left page
        rightPage: 1,           // current right page
        realPageCount: 0,       // real page count 
        pn: 1,                  // page number tracker
        
        // Page/Book size
        pageWidth: '',          // page width
        pageHeight: '',         // page height
        docWidth: function(){ var width = document.body.clientWidth; return width; },   // get the screen width
        docHeight: alice.docHeight(),                                                   // get the screen height
        
        // Book details
        speed: 0,               // speed of the page turns
        book: '',               // the parent div of the book
        timing: 'linear',       // timing (we have it linear because others make it sloppy)
        binding: '',            // the location of the binding > left|right|top|bottom
        paging: '',             // paging refers to single || double
        controlBoxStyle: '',    // grab the details of the parent div location in order to place the controller bars
        wrap: false,            // the wrap effect of the last page to first and first to last

        // Transform details
        transformOrigin: '',    // Sets the primary origin of the transform ex. 1px 1px or Top Left
        transformRotate: '',    // Sets the rotation axis ex. rotateY
        transformDegrees: [],   // Array of the required degrees for the transformations.
        
        // Transform degrees to be used in conjunction with: transformRotate ex. core.transformRotate+core._rot270
        _rot270: '(262deg)',    // Not exactly 270 in order to achieve more elegant flow.
        _rot180: '(180deg)',
        _rot90: '(90deg)',
        _rot0: '(0deg)',
        _rotNeg90: '(-90deg)',
        _rotNeg180: '(-180deg)',
        _rotNeg270: '(-262deg)',    // same offset here.

        // Shadow details in order to add more depth to the transforms.
        shadowPattern0: '',
        shadowPattern50: '',
        shadowPattern100: '',
        shadowPatternRev50: '',
        shadowPatternRev100: '',

        // Events/ Status
        animationStart: event, 
        animationEnd: event,
        animationRunning: false,
        bookStart: event, 
        bookEnd: event,

        helpers: {},

        AnimGenerator: function(params){
            var abstrPageReTurnR, abstrPageReTurnF, abstrPageTurnR, abstrPageTurnF, oddPageTurnF, oddPageTurnR, evenPageTurnF, evenPageTurnR;
            // transforms
            var tranRot90 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot90+';';
            var tranRot180 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot180+';';
            var tranRot270 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot270+';';
            var tranRotNeg180 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rotNeg180+';';
            var tranRotNeg270 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rotNeg270+';';
            var tranRotNeg90 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rotNeg90+';';
            var tranRot0 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot0+';';

            //transform-origins
            var originL = '\n\t'+alice.prefix+'transform-origin: 1px 1px;';
            var originM = '\n\t'+alice.prefix+'transform-origin: 50% 50%;';
            var originR = '\n\t'+alice.prefix+'transform-origin: '+core.transformOrigin+';';

            //Shadows
            var Szero = '\t0%{'+alice.prefix+'box-shadow:'+params.shadowPattern0+';';
            var Sfifty = '\t50%{'+alice.prefix+'box-shadow:'+params.shadowPattern50+';';
            var Shundred = '\t100%{'+alice.prefix+'box-shadow:'+params.shadowPattern100+';';
            var SfiftyRev = '50%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev50+';'+'\n';
            var ShundredRev = '100%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev100+';'+'\n';

            //Keyframe titles
            oddPageF = '@'+alice.prefix+'keyframes oddPageTurnF{\n';                                    // odd page forward
            oddPageR = '@'+alice.prefix+'keyframes oddPageTurnR{\n';                                    // odd page reverse
            evenPageF = '@'+alice.prefix+'keyframes evenPageTurnF{\n';                                  // even page forward
            evenPageR = '@'+alice.prefix+'keyframes evenPageTurnR{\n';                                  // even page reverse
            abstrPageF = '@'+alice.prefix+'keyframes abstrPageTurnF{\n';                                // abstract page forward [ center || middle ]
            abstrPageR = '@'+alice.prefix+'keyframes abstrPageTurnR{\n';                                // abstract page reverse [ center || middle ]
            abstrPageReTurnF = '@'+alice.prefix+'keyframes abstrPageReTurnF{\n';                        // abstract page forward [ top || left || right || bottom ]
            abstrPageReTurnR = '@'+alice.prefix+'keyframes abstrPageReTurnR{\n';                        // abstract page reverse [ top || left || right || bottom ]

            var closure = '}\n';
            
            // For single paging
            if(core.paging === 'single'){
                if(core.binding === 'left'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReTurnF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReTurnR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'right'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReTurnF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReTurnR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'top'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReTurnF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReTurnR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'bottom'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReTurnF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReTurnR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                // Abstract bindings
                if(core.binding === 'center'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originM+tranRotNeg90+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReTurnF+Szero+closure+Sfifty+closure+Shundred+originM+tranRot90+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReTurnR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'middle'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originM+tranRotNeg90+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReTurnF+Szero+closure+Sfifty+closure+Shundred+originM+tranRot90+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReTurnR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                }

                // Insert the keyframes!
                alice.keyframeInsert(abstrPageTurnF);
                alice.keyframeInsert(abstrPageTurnR);
                alice.keyframeInsert(abstrPageReTurnF);
                alice.keyframeInsert(abstrPageReTurnR);
            }

            

            if(core.paging === 'double'){
                //vertical axis
                if(core.binding === 'left'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRot90+closure+'\n'+closure;
                }
                if(core.binding === 'right'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originL+tranRotNeg90+closure+'\n'+closure;
                }
                //horizontal axis
                if(core.binding === 'top'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRotNeg90+closure+'\n'+closure;
                }
                if(core.binding === 'bottom'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRotNeg90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originL+tranRot90+closure+'\n'+closure;
                }
                
                //Insert the keyframes!
                alice.keyframeInsert(oddPageTurnF);
                alice.keyframeInsert(oddPageTurnR);
                alice.keyframeInsert(evenPageTurnF);
                alice.keyframeInsert(evenPageTurnR);
            }
        },

        config: function(params){
            // Book details
            core.speed = params.speed;
            core.book = document.getElementById(params.elems || alice.anima);
            core.timing = params.timing;
            core.binding = params.binding;

            // Page/Book Sizing
            var bWidth = params.bookWidth.toString();       // set to account for integers|strings
            var bHeight = params.bookHeight.toString();     // set to account for integers|strings

            // redefine the page width in case of px|%|int
            var symW, pw, bw;
            if(bWidth.indexOf("%") > 0){
                symW = "%";
                pw = '0.'+bWidth.substring(0, bWidth.indexOf(symW));
                pw = parseFloat(pw);
                bw = core.docWidth()*pw;
            }
            else if(bWidth.indexOf("px") > 0){
                symW = "px";
                bw = bWidth.substring(0, bWidth.indexOf(symW));
            }
            else{
                bw = bWidth;
            }

            //set the core width
            core.pageWidth = bw;

            // redefine the height in case of px|%|int
            var symH, ph, bh;
            if(bHeight.indexOf("%") > 0){
                symH = "%";
                ph = '0.'+bHeight.substring(0, bHeight.indexOf(symH));
                ph = parseFloat(ph);
                bh = core.docHeight*ph;
            }
            else if(bHeight.indexOf("px") > 0){
                symH = "px";
                bh = bHeight.substring(0, bHeight.indexOf(symH));
            }
            else{
                bh = bHeight;
            }
            //set the core height
            core.pageHeight = bh;

            // Configure the perspective depth [ there was no science used in the formulating of this. ]
            var goggles = Math.floor(core.pageWidth*4);
            
            // Set the shadows
            core.shadowPattern0 = params.shadowPattern0;
            core.shadowPattern50 = params.shadowPattern50;
            core.shadowPattern100 = params.shadowPattern100;
            core.shadowPatternRev50 = params.shadowPatternRev50;
            core.shadowPatternRev100 = params.shadowPatternRev100;

            // Various book details
            core.pageClassName = params.pageClassName;
            core.wrap = params.wrap;
            core.paging = params.paging; 

            // create a new class
            core.NewPageClass = 'book'+ new Date().getTime();

            // Configure animation start for silly Mozilla
            core.animationStart = alice.prefixJS+'AnimationStart';
            if(alice.prefixJS === 'Moz'){
                core.animationEnd = 'animationstart';
            }

            // Configure animation end for silly Mozilla
            core.animationEnd = alice.prefixJS+'AnimationEnd';
            if(alice.prefixJS === 'Moz'){
                core.animationEnd = 'animationend';
            }

            // Set the array of pages for the book
            var rawPages = core.book.childNodes;                                                // find me some raw contents!
            var rpn = 0;                                                                        // real page number
            for(var p = 0; p < rawPages.length; p++){
                if(rawPages[p].nodeType === 1){ 
                    if(rawPages[p].tagName === "DIV" || rawPages[p].tagName === "div"){         // Ensure that they are elements
                        core.pages[rpn] = rawPages[p];                                          // Add the div to the array
                        core.realPageCount = core.realPageCount+1;                              // set the page count
                        rpn++;
                    }
                    else{
                        console.error("Your pages must be all be the DIV tag element. Please place the contents inside."); // At least give a reason for the malfunction
                        return false;
                    }
                }
            }

            // Fashion me a book!
            core.book.style[alice.prefixJS+'Perspective'] = goggles+'px';
            core.book.style.zIndex = '1000';
            core.book.style.position = 'relative';
            core.binding = params.binding;

            // set the transform axis
            if(params.binding === 'center' || params.binding === 'left' || params.binding === 'right'){
                core.transformRotate = 'rotateY';
            }
            if(params.binding === 'middle' || params.binding === 'top' || params.binding === 'bottom'){
                core.transformRotate = 'rotateX';
            }

            // If single paging we need a small book
            if(params.paging === 'single'){
                core.book.style.width = core.pageWidth+'px';
                core.book.style.height = core.pageHeight+'px';
            }
            //If double paging we need a big book
            else if(params.paging === 'double'){
                if(params.binding === 'left' || params.binding === 'right'){
                    core.book.style.width = (core.pageWidth * 2)+'px';
                    core.book.style.height = core.pageHeight+'px';
                }
                else if(params.binding === 'top' || params.binding === 'bottom'){
                    core.book.style.width = core.pageWidth+'px';
                    core.book.style.height = (core.pageHeight * 2)+'px';
                }
            }

            // Collect the style details of the book div for later
            core.controlBoxStyle = core.book;

            // Set the details per binding
            if(core.paging === 'single'){
                core.transformDegrees = [core._rot0, core._rot0, core._rot0]; //0, 0, 0
                switch(params.binding){
                    case "center":
                        core.transformDegrees = [core._rot0, core._rot90, core._rotNeg90]; //0, 90, -90
                        core.transformOrigin = '50% 50%';
                        break;
                    case "middle":
                        core.transformDegrees = [core._rot0, core._rot90, core._rotNeg90]; //0, 90, -90
                        core.transformOrigin = '50% 50%';
                        break;
                    case "left":
                        core.transformOrigin = '1px 1px';
                        break;
                    case "top":
                        core.transformOrigin = '1px 1px';
                        break;
                    case "right":
                        core.transformOrigin = core.pageWidth+'px 1px';
                        break;
                    case "bottom":
                        core.transformDegrees = [core._rot0, core._rot0, core._rotNeg270]; //0, 0, 0
                        core.transformOrigin = '1px '+core.pageHeight+'px';
                        break;
                }
            }
            if(core.paging === 'double'){
                switch(params.binding){
                    case "left":
                        core.transformOrigin = core.pageWidth+'px 1px';
                        break;
                    case "right":
                        core.transformOrigin = core.pageWidth+'px 1px';
                        break;
                    case "top":
                        core.transformOrigin = '1px '+core.pageHeight+'px';
                        break;
                    case "bottom":
                        core.transformOrigin = '1px '+core.pageHeight+'px';
                        break;
                }
                core.transformDegrees = [core._rot0, core._rot0]; //0, 0, 0
            }
        },

        clearAnimation: function (id, dir) {
            var idNum = core.helper.getThisId(id);    
            var _element = document.getElementById(id);

            if(document.getElementById("_piggy")){
                core.book.removeChild(document.getElementById("_piggy"));
            }

            // Simple blanks for replacing
            _element.style[alice.prefixJS + "Animation"] = '';
            _element.style[alice.prefixJS + "AnimationDelay"] = "";
            _element.style[alice.prefixJS + "AnimationDuration"] = "";
            _element.style[alice.prefixJS + "AnimationTimingFunction"] = "";
            _element.style[alice.prefixJS + "AnimationIterationCount"] = "";
            _element.style[alice.prefixJS + "AnimationDirection"] = "";
            _element.style[alice.prefixJS + "AnimationPlayState"] = "";

            if(core.binding === 'center' || core.binding === 'middle'){
                if(idNum % 2 === 1){
                    if(core.pn % 2 === 1){
                        _element.style.display = 'none';
                    }
                    if(core.pn === 1){
                        _element.style.display = 'none';
                    }
                }
                if(idNum % 2 === 0){
                    if(core.pn % 2 === 1){
                        _element.style.display = 'none';
                    }
                }
            }
            else if(core.binding === 'left' || core.binding === 'top' || core.binding === 'right' || core.binding === 'bottom'){
                _element.style.display = 'none';
            }

            // Abtsract page changes
            if(core.paging === 'single'){
                var prepage = document.getElementById('p'+(parseInt(idNum)-1, 10)); 
                var nextpage = document.getElementById('p'+(parseInt(idNum)+1, 10));

                if(idNum === core.realPageCount){                                //if its the last page
                    var nextpage = document.getElementById('p1'); 
                }

                // set this pages main attributes
                _element.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[0];
                _element.style.zIndex = '0';
                
                if(idNum > 1 && dir === 'forwards'){
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];
                    if(core.binding == 'left' || core.binding == 'right' || core.binding == 'top' || core.binding == 'bottom'){    
                        nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[0];
                    }
                }
                if(idNum == 1 && dir == 'forwards'){
                    var prepage = document.getElementById('p'+core.realPageCount); 
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];
                }
                if(idNum > 0 && dir == 'reverse'){
                    var prepage = document.getElementById('p'+(idNum-1));           // gotta prepare ourselves

                    if(core.wrap === true){                                         //In case we need a book that never ends!
                        if(idNum == 1){                                             // For all those special pages
                            var prepage = document.getElementById('p'+core.realPageCount); 
                        }
                        if(idNum != core.realPageCount){
                            var nextpage = document.getElementById('p'+(parseInt(idNum)+1));
                        }
                    }

                    //Basic transformations to set the page attributes
                    if(core.binding == 'left' || core.binding == 'top' || core.binding == 'right' || core.binding == 'bottom'){
                        nextpage.style.display = 'none';
                        _element.style.display = 'block';
                    }
                    nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];
                }
                // If its the first page.
                if(idNum == 1 && dir == 'reverse'){
                    var prepage = document.getElementById('p'+core.realPageCount); 
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[2];
                    nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];
                }
            }
            core.pn++;
        },

        resetCSS: function(flipDirection, binding, id){
            // A set of options for resetting the style attributes of the different pages.
            var thisPage = document.getElementById(id);
            var idNum = core.helper.getThisId(id);
            var nextPage = document.getElementById('p'+(parseInt(idNum)+1));

            var basicSettings = 'display: block; left: 0px; top: 0px;';                                                 // the most basic div settings

            if(idNum % 2 === 1 ){
                thisPage.setAttribute('style', '');                                                                     
                if(flipDirection === 'forward'){
                    var flipAngleOdd;
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = "1px 1px";                                                                       
                    switch(core.binding){           
                        case "top":                                                                                     
                            flipAngleOdd = core.transformRotate + core._rot90;
                            thisPage.style.top = core.pageHeight+'px';                                                  
                            break;
                        case "right":                                                                                   
                            flipAngleOdd = core.transformRotate + core._rot90;
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin; 
                            break;
                        case "left":
                            flipAngleOdd = core.transformRotate + core._rotNeg90;
                            thisPage.style.left = core.pageWidth+'px';
                            break;
                        case "bottom":
                            flipAngleOdd = core.transformRotate + core._rotNeg90;
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = flipAngleOdd;
                }
                else if(flipDirection === 'reverse'){
                    thisPage.setAttribute('style', basicSettings);
                    switch(core.binding){
                        case "top":
                            thisPage.style.top = core.pageHeight+'px'; 
                            break;
                        case "left":
                            thisPage.style.left = core.pageWidth+'px';
                            break;
                        default:
                            thisPage.style.top = '0px'; 
                            break;
                    }
                }                                  
            } 
            if(idNum % 2 === 0 ){
                thisPage.setAttribute('style', '');                                                                     
                if(flipDirection === 'forward'){  
                    thisPage.setAttribute('style', basicSettings);                                                                      
                    switch(core.binding){           
                        case "top":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin;                                                                                     
                            break;
                        case "right":                                                                                   
                            thisPage.style.left = core.pageWidth+'px';
                            break;
                        case "left":   
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin;   
                            thisPage.style.left = '0px';
                            break;
                        case "bottom":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = '1px 1px';
                            thisPage.style.top = core.pageHeight+'px'; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = core.transformRotate + core._rot0;
                }
                else if(flipDirection === 'reverse'){
                    var flipAngleEven;
                    switch(core.binding){
                        case "top":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin;
                            flipAngleEven = core.transformRotate + core._rotNeg90;    
                            break;
                        case "right":
                            flipAngleEven = core.transformRotate + core._rotNeg90; 
                            thisPage.style.left = core.pageWidth+'px';  
                            break;
                        case "bottom":
                            flipAngleEven = core.transformRotate + core._rot90; 
                            thisPage.style.top = core.pageHeight+'px';  
                            break;
                        case "left":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin;
                            flipAngleEven = core.transformRotate + core._rot90;   
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = flipAngleEven;  
                }                                       
            }

            // Regardless of the direction
            thisPage.style[alice.prefixJS+"boxShadow"] = core.shadowPattern0;
        },

        styleConfig: function(idNum){
            var page = document.getElementById('p'+idNum);
            if(core.paging == 'single'){
                if(core.binding == 'center' || core.binding == 'middle'){
                    page.setAttribute('style', 'display: none; '+
                        alice.prefix+'transform-origin: 50% 50%;'+
                        alice.prefix+'transform: '+ core.transformRotate + core._rot90 +';'+
                        alice.prefix+'box-shadow: '+ core.shadowPattern100 +';');
                }
                if(core.binding == 'left' || core.binding == 'top' || core.binding == 'bottom' || core.binding == 'right'){
                    page.setAttribute('style', 'display: none; '+ 
                        alice.prefix+'transform-origin:'+core.transformOrigin+';'+
                        alice.prefix+'transform: '+ core.transformRotate + core._rot0 +';'+
                        alice.prefix+'box-shadow: '+ core.shadowPattern100 +';');
                }
            }
            if(core.paging == 'double'){
                if(core.binding == 'left'){
                    if(idNum % 2 === 1){
                        page.style.left = core.pageWidth+'px';
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot90;
                    }
                }
                if(core.binding == 'right'){
                    if(idNum % 2 === 0){
                        page.style.left = core.pageWidth+'px';
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg90;
                    }
                }
                if(core.binding == 'top'){
                    if(idNum % 2 === 1){
                        page.style.top = core.pageHeight+'px';
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg90;
                    }
                }
                if(core.binding == 'bottom'){
                    if(idNum % 2 === 0){
                        page.style.top = core.pageHeight+'px';
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot90;
                    }
                }
            }
        },

        init: function(params){
            //run the configuation of the book effect
            core.config(params);

            // Set the animations/ Add to stylesheet
            core.AnimGenerator(params);

            // Report the book status
            if(core.binding != 'center' || core.binding != 'middle'){
                core.helper.bookStatus(core.rightPage-1);
            }else{
                core.helper.bookStatus(core.rightPage);
            }

            // Interactivity!
            var genController = function(loc){
                var clickBox = document.createElement('div');
                clickBox.setAttribute('id', '_'+loc+'Controller');
                clickBox.style.width = '80px';
                clickBox.style.height = core.pageHeight+'px';
                clickBox.style.position = 'absolute';
                clickBox.style.background = '#999';
                clickBox.style.opacity = '0.3';
                clickBox.style.zIndex = '0';

                clickBox.style.top = core.controlBoxStyle.offsetTop+'px';

                var pageRef = 'alice.masterFx.caterpillar';

                if(loc === 'right'){
                    clickBox.style.left = (core.controlBoxStyle.offsetLeft + parseInt(core.pageWidth))+'px';
                    clickBox.style.borderTopRightRadius = '100px';
                    clickBox.style.borderBottomRightRadius = '100px';
                    clickBox.setAttribute('onclick', pageRef+'.abPageTurn('+pageRef+'.rightPage)');
                }else{
                    clickBox.style.left = (core.controlBoxStyle.offsetLeft - parseInt(clickBox.style.width))+'px';
                    clickBox.style.borderTopLeftRadius = '100px';
                    clickBox.style.borderBottomLeftRadius = '100px';
                    clickBox.setAttribute('onclick', pageRef+'.abPageTurnR('+pageRef+'.rightPage)');
                }
                document.body.appendChild(clickBox);
            }; 
            
            // Only if they really want them
            if(params.controls === true && params.paging === "single"){    
                genController('left');
                genController('right');

                //Required for page resizing 
                window.onresize = function(event) {
                    document.body.removeChild(document.getElementById("_leftController"));      // remove the original to make a new
                    document.body.removeChild(document.getElementById("_rightController"));     // same thing here.
                    genController('left');
                    genController('right');
                }   
            }

            // Regardless of the controls choice they get this
            function keyrelease(evt){
                var dir = evt.keyCode;
                var newPageCount = core.realPageCount+1;
                if(dir === 39){
                    if(core.rightPage <= newPageCount){
                        if(core.paging === "single"){
                            core.abPageTurn(core.rightPage);
                        }
                        if(core.paging === "double"){
                            core.turnPage(core.rightPage);
                        }
                    }
                }
                
                if(dir == 37){ 
                    if(core.paging === "single"){
                        core.abPageTurnR(core.rightPage);
                    }
                    if(core.paging === "double"){
                        if(core.leftPage >= 1){
                            core.turnPage(core.leftPage);
                        }
                    }
                }
            }

            // Add the keylistener
            document.body.addEventListener("keyup", keyrelease, false);

            // Give the book some class
            var className = core.pageClassName,
                bookEffect = alice.masterFx.caterpillar;
            
            var NewClass =  '.'+core.NewPageClass+
                            '{ display: none; '+
                            alice.prefix+'box-shadow: '+ core.shadowPattern100 +';'+
                            alice.prefix+'backface-visibility: hidden;' +
                            'width: '+core.pageWidth+"px;"+
                            'height: '+core.pageHeight+"px;"+
                            'position: absolute;'+
                            'left: 0px;'+
                            'top: 0px;'+
                            'z-index: 0;'+ 
                            'overflow: hidden;'+
                            '}';

            // insert the new class
            alice.keyframeInsert(NewClass);

            //==================================================================================
            // Initial Page Setup
            if(core.paging === 'single'){ 
                var f = 1;
                for(var b = 0; b < core.pages.length; b++){
                    core.pages[b].setAttribute('id', 'p'+f);
                    core.pages[b].setAttribute('class', className + ' ' +core.NewPageClass);

                    if(params.controls !== true){
                        // Without controls we still need to move forward  
                        core.pages[b].setAttribute('onclick', 'alice.masterFx.caterpillar.abPageTurn('+f+')');                                
                    }

                    // pretify the pages
                    core.styleConfig(f);

                    // If its the first page we need to make it special
                    if(f === 1){
                        core.pages[b].style.display = 'block';
                        core.pages[b].setAttribute('style', 'display: block; z-index: 1;'+
                        alice.prefix+'transform-origin:'+core.transformOrigin+';'+
                        alice.prefix+'transform: '+ core.transformRotate + core._rot0 +';' +
                        alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                    }
                    f++;
                }
            }

            if(core.paging === 'double'){
                var n = 1; 
                for (var i = 0; i < core.pages.length; i++){
                    if(core.pages[i].nodeType === 1){
                        core.pages[i].setAttribute('id', 'p'+n);
                        core.pages[i].setAttribute('class', className + ' ' +core.NewPageClass);

                        // make the first page visible
                        if(n === 1){
                            core.pages[i].style.display = 'block';
                            core.pages[i].style[alice.prefixJS+'BoxShadow'] = core.shadowPattern100+';';
                        }

                        core.styleConfig(n);                                                                        // Configure the remaining pages
                        
                        core.pages[i].setAttribute('onclick', 'alice.masterFx.caterpillar.turnPage('+n+')');        // Empower the click action                              
                        
                        core.pages[i].addEventListener(core.animationEnd, function(){                               // Set up the animation end listener
                            if(this.style[alice.prefixJS+'AnimationName'] === 'oddPageTurnF'){      // odd page forward flip
                                core.turnNextPage(this.getAttribute('id'), 'odd');                         // incured even page flip
                                core.resetCSS('forward', core.binding, this.getAttribute('id'));    // reset the css of the odd page
                            }   
                            if(this.style[alice.prefixJS+'AnimationName'] === 'oddPageTurnR'){      // odd page reverse flip incured by the even page reverse flip
                                core.resetCSS('reverse', core.binding, this.getAttribute('id'));    // reset the css of the odd page

                                var nxtId = core.helper.getThisId(this.getAttribute('id'));         // get the next page number
                                nxtId = parseInt(nxtId)+2;                                          // go to the next next page
                                if(nxtId < core.realPageCount+1){                                   // make sure it exsits
                                    document.getElementById('p'+nxtId).style.display = 'none';      // hide it
                                }

                                core.animationRunning = false;                                      // set animationRunning state to false (prevent over running animations)
                            } 
                            if(this.style[alice.prefixJS+'AnimationName'] === 'evenPageTurnF'){     // even page forward flip (incured by the odd page flip)
                                core.resetCSS('forward', core.binding, this.getAttribute('id'));    // reset the css of the even page
                                core.animationRunning = false;                                      // set animationRunning state to false (prevents messy page flips)
                            }
                            if(this.style[alice.prefixJS+'AnimationName'] === 'evenPageTurnR'){     // even page reverse flip
                                core.turnNextPage(this.getAttribute('id'), 'even');                          // incur the odd page reverse flip
                                core.resetCSS('reverse', core.binding, this.getAttribute('id'));    // reset the css of the even page
                            }
                        }, false);

                        n++;    
                    }    
                }
            }         

            return core;                                                                                // return the core of alice.masterFx.caterpillar
        },

        abstrPageFlip: function(id, dir){                                                               // Get the id and direction
            var idNum, ani;
            if(dir === 'forwards'){
                idNum = core.helper.getThisId(id)+1;
                ani = "abstrPageTurnR";
                if(idNum === core.realPageCount+1){                                                     // make sure it doesn't exceed the book
                    idNum = 1;                                                                          // reset the book to page one
                }
            }                                                         
            else if(dir === 'reverse'){
                ani = "abstrPageReTurnR";
                idNum = core.helper.getThisId(id)-1;
                if(idNum == 0){
                    idNum = core.realPageCount;
                }
            }

            var pageId = core.book.querySelector('div:nth-child('+idNum+')').getAttribute('id');        // With the next id number we get the next page
            
            var page = document.getElementById(pageId);                                                 // Take the next page
                page.style[alice.prefixJS+'AnimationName'] = ani;                                       // Make it flip
                core.helper.setAnimDefaults(page);                                                      // Ensure the common details are set

            page.addEventListener(core.animationEnd, function(){                                        // When the animation ends
                if(page.style[alice.prefixJS+'AnimationName'] === ani){                                 // If its a particular animation
                    core.clearAnimation('p'+idNum, dir);                                                // Clear the animation from the CSS
                    core.animationRunning = false;                                                      // Set the animation Running state
                }
            }, false);

            core.helper.bookStatus(idNum);
        },

        turnNextPage: function(id, type){                                                   // This is called for the backside page
            var pg, pgId, page, aniName;    
            pg = core.helper.getThisId(id);
            pg = (type === 'odd') ? (pg+1) : (pg-1);                                        // Control the page requested
            console.log("page: "+pg);
            aniName = (type === 'even') ? "oddPageTurnR" : "evenPageTurnF";                 // Determine the required animation

            core.animationRunning = true;                                                   // Set the state of the animation
            
            pgId = core.book.querySelector('div:nth-child('+pg+')').getAttribute('id');     // Get the page
            
            var page = document.getElementById(pgId);
                page.style.zIndex = 1; 
                if(type === 'odd'){
                    page.style.display = 'block';
                }
                page.style[alice.prefixJS+'AnimationName'] = aniName;
                core.helper.setAnimDefaults(page); 
        },

        turnPage: function (pageId){
            console.log("page: "+pageId);
            if(core.animationRunning === false){
                var secondChild, thirdChild, ani;

                if(core.leftPage < 0){
                    core.leftPage = 0;
                    core.rightPage = 1;
                }
                if(core.rightPage > core.realPageCount){
                    core.leftPage = core.realPageCount;
                    core.rightPage = core.realPageCount+1;
                }
                if(pageId % 2 === 1){                               // Regarding the odd pages
                    secondChild = pageId + 1;
                    thirdChild = pageId + 2;
                    ani = "oddPageTurnF";
                }else{                                              // Those leftover even pages
                    secondChild = pageId - 1;
                    thirdChild = pageId - 2;
                    ani = "evenPageTurnR";
                }

                if(pageId < core.realPageCount){
                    core.animationRunning = true;
                    
                    var nxtPageId = core.book.querySelector('div:nth-child('+(secondChild)+')').getAttribute('id');     // Get the next page
                    var nxtNxtPageId = core.book.querySelector('div:nth-child('+(thirdChild)+')');                      // Get the page after that  
                    
                    if(nxtNxtPageId){                                                                                   // If this page exists do the following
                        nxtNxtPageId = nxtNxtPageId.getAttribute('id');                                                 // After all it should be there. 
                        var nxtNxtPage = document.getElementById(nxtNxtPageId);
                        nxtNxtPage.style.zIndex = '0';
                        nxtNxtPage.style.display = 'block';
                    }

                    var page = document.getElementById('p'+pageId);                                                     // Animate this page
                        page.style.zIndex = '1';                                                                        // Bring it front row
                        page.style[alice.prefixJS+'AnimationName'] = ani;
                        core.helper.setAnimDefaults(page); 

                    if(pageId % 2 == 1){                                                                                // For the odd pages
                        if(core.rightPage < core.realPageCount+1){
                            core.rightPage += 2;
                            core.leftPage += 2;
                        }   
                    }else{                                                                                              // For the even pages
                        if(core.leftPage >= 1){
                            core.rightPage -= 2;
                            core.leftPage -= 2;
                        }
                    }
                }
            }
        },

        abPageTurn: function (pageId){
            if(core.animationRunning === false){
                if(pageId >= core.realPageCount && core.wrap == true){
                    pageId = 0;
                }
                if(pageId === 0 && core.wrap == true){
                    if(core.binding === 'center' || core.binding === 'middle'){
                        pageId = core.realPageCount;
                        core.rightPage = core.realPageCount; 
                    }
                }

                var page = document.getElementById('p'+core.rightPage);
                
                try{
                    var nxtPageId = core.book.querySelector('div:nth-child('+(pageId + 1)+')').getAttribute('id');
                    var nxtPage = document.getElementById(nxtPageId);
                        nxtPage.style.display = 'block';
                }catch(err){ 
                    if(core.wrap != true){   
                        console.log("This is the end of the book!");                                                            // The end of the book
                        return false;                                                                                           // Deny the flip animation
                    }
                }

                page.style.zIndex = '100';
                page.style[alice.prefixJS+'AnimationName'] = "abstrPageTurnF";

                page.addEventListener(core.animationEnd, function(){
                    if(page.style[alice.prefixJS+'AnimationName'] === 'abstrPageTurnF'){
                        if(core.binding == 'center' || core.binding == 'middle'){
                            alice.masterFx.caterpillar.abstrPageFlip(this.getAttribute('id'), 'forwards');
                        }else{
                            core.helper.bookStatus(pageId);
                        }
                        if(core.rightPage == core.realPageCount && core.wrap == true){
                            pageId = core.realPageCount;
                            core.rightPage = 0;
                        }
                        core.clearAnimation('p'+pageId, 'forwards');
                        core.rightPage++;
                        if(core.binding != 'center' && core.binding != 'middle'){
                            core.animationRunning = false;   
                        }
                    }
                 }, false);

                // Run animation run!
                core.animationRunning = true;
                core.helper.setAnimDefaults(page);

                if(core.binding != "center" && core.binding != "middle" ){
                    core.helper.piggyback(pageId, "standard");                  // We call piggyback to hide the backface
                }
            }
        },

        abPageTurnR: function (pageId){  
            var page, pageToClear;
            if(core.animationRunning === false){
                if(core.binding == 'center' || core.binding == 'middle'){   // Because its fundamentally different from the other bindings
                    if(pageId >= core.realPageCount){
                        pageId = core.realPageCount;                // Because we're adding to the core.rightPage on each turn we need this, after all we cant have more pages than the total pages
                        core.rightPage = core.realPageCount;        // Reset the core.rightPage so it matches the pageId
                    }
                    if(core.rightPage === 0 || pageId === 0){
                        core.rightPage = core.realPageCount;        // In the case of going backwards, page zero doesnt exist.
                        pageId = core.realPageCount;                // These identifiers need to be the same.
                    }
                    if(pageId !== 1){
                        core.helper.pageSetter(pageId);             // As long as its not the first page set the details of the page, the first was already set.
                    }
                    if(core.wrap === false){                        // In the case of no wrap effect we idetify the page as non existing.
                        if(pageId === 1){                       
                            pageId = -1;                            
                        }
                    }

                    if(pageId >= 0){                                // Also to make sure we're able to turn off the wrap effect.     
                        var page = document.getElementById('p'+core.rightPage);
                        page.style[alice.prefixJS+'AnimationName'] = "abstrPageReTurnF";
                        pageToClear = page.getAttribute('id');
                    }
                }

                if(core.binding == 'left' || core.binding == 'right' || core.binding == 'top' || core.binding == 'bottom'){

                    core.helper.piggyback(pageId, "advanced");

                    if(core.wrap == true){
                        if((pageId-1) == 0){
                            pageId = core.realPageCount+1;
                            core.rightPage = core.realPageCount+1;
                        }
                    }
                    if(core.wrap === false && pageId >= core.realPageCount){
                        pageId = core.realPageCount;
                    }

                    page = document.getElementById('p'+(pageId-1));
                    page.style.zIndex = '10';

                    switch (core.binding){
                        case "left":
                            page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg270;
                            break;
                        case "bottom":
                            page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg270;
                            break;
                        case "top":
                            page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot270;
                            break;
                        case "right": 
                            page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot270;
                            break;
                    }

                    page.style[alice.prefixJS+'AnimationName'] = "abstrPageReTurnF";
                    pageToClear = 'p'+(pageId - 1);
                    core.helper.bookStatus(pageId-2);
                }

                core.animationRunning = true;                                                                                       // The common event listener

                page.addEventListener(core.animationEnd, function(){
                    if(page.style[alice.prefixJS+'AnimationName'] === 'abstrPageReTurnF'){
                        if(core.binding === 'center' || core.binding === 'middle'){
                            alice.masterFx.caterpillar.abstrPageFlip(this.getAttribute('id'), 'reverse');
                        }
                        core.clearAnimation(pageToClear, 'reverse');
                        core.rightPage--;
                        if(core.binding != 'center' && core.binding != 'middle'){
                            core.animationRunning = false;   
                        }
                    }
                 }, false);

                core.helper.setAnimDefaults(page);                                                                                  // Set the defaults to make it go!
            }
        }
    }

    return core;

}();

var _caterpillar = alice.masterFx.caterpillar;                                                                                      // we need this to shorten things

alice.masterFx.caterpillar.helper = {

    bookStatus: function(id){
        if(_caterpillar.binding != 'center' && _caterpillar.binding != 'middle'){
            id = id+1;
        }
        var state = "page: " +id;
        if(id === 1){
            state = "This is the first page";
        }
        if(id === _caterpillar.realPageCount || id === 0){
            state = "This is the end of the book";
        }
        console.log(state);
    },

    getThisId: function(pageId){
        var page = pageId.substring(1, 8);
            page = parseInt(page);
            return page;
    },

    pageSetter: function(pageId){
        if(pageId === 0){
            pageId = _caterpillar.realPageCount;
        }
        var prePageId = 'p'+ (pageId - 1);
        var prePage = document.getElementById(prePageId);
        prePage.style[alice.prefixJS+'Transform'] = _caterpillar.transformRotate+_caterpillar._rotNeg90;
    },

    setAnimDefaults: function(page){
        page.style[alice.prefixJS+'AnimationDuration'] = _caterpillar.speed;
        page.style[alice.prefixJS+'AnimationFillMode'] = "forwards";
        page.style[alice.prefixJS+'AnimationPlayState'] = "running";
        page.style[alice.prefixJS+'AnimationDirection'] = 'normal';
        page.style[alice.prefixJS+'AnimationTimingFunction'] = "linear";
        page.style.display = 'block';
    },

    piggyback: function(id, type){
        var aniName = (type === "standard") ? "abstrPageTurnF" : "abstrPageReTurnF";
        var numZ = (type === "standard") ? "10" : "0";
        var piggy = document.createElement('div');
            piggy.setAttribute('id', '_piggy');
            piggy.style.width = _caterpillar.pageWidth+'px';
            piggy.style.height = _caterpillar.pageHeight+'px';
            piggy.style.position = 'absolute';

            if(type === "advanced"){
                var rotAngle;
                switch (_caterpillar.binding){
                    case "left":
                        rotAngle = _caterpillar._rotNeg270;
                        break;
                    case "bottom":
                        rotAngle = _caterpillar._rotNeg270;
                        break;
                    case "top":
                        rotAngle = _caterpillar._rot270;
                        break;
                    case "right":
                        rotAngle = _caterpillar._rot270;
                        break;
                    
                }
                piggy.style[alice.prefixJS+'Transform'] = _caterpillar.transformRotate+rotAngle;
            }

            piggy.style.zIndex = numZ;
            piggy.style[alice.prefixJS+'AnimationName'] = aniName;
            piggy.style[alice.prefixJS+'transformOrigin'] = _caterpillar.transformOrigin;
            _caterpillar.helper.setAnimDefaults(piggy); 
            _caterpillar.book.appendChild(piggy);           
    }

};

//---[ Shortcut Methods ]-----------------------------------------------------

/*
 * CSS Syntax:
 *     animation: name duration timing-function delay iteration-count direction;
 *
 * Parameter Syntax:
 *     elems, <options>, duration, timing, delay, iteration, direction, playstate
 */

/**
 * [book description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} scale     [description]
 * @param  {[type]} shadow    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.fx.book = function (params) {
    "use strict";
    console.info("book: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,
        
        pageClassName: params.pageClassName || "page",
        bookWidth: params.bookWidth || '400px',
        bookHeight: params.bookHeight || '700px',

        shadowPattern0: params.shadowPattern0 || '2px 0px 10px rgba(0, 0, 0, 0.1)',
        shadowPattern50: params.shadowPattern50 || '2px 0px 10px rgba(0, 0, 0, 0.2)',
        shadowPattern100: params.shadowPattern100 || '2px 0px 10px rgba(0, 0, 0, 0.1)',

        shadowPatternRev50: params.shadowPatternRev50 || '-2px 0px 10px rgba(0, 0, 0, 0.2)',
        shadowPatternRev100: params.shadowPatternRev100 || '-2px 0px 10px rgba(0, 0, 0, 0.1)',

        shadow: params.shadow || true,
        speed: params.speed || "500ms",
        timing: params.timing || "linear",

        binding: params.binding || "vertical",

        paging: params.paging || "single",

        wrap: params.wrap || false,

        controls: params.controls || false
    };

    //console.log(opts);

    alice.masterFx.caterpillar.init(opts);
    return opts;
};

//----------------------------------------------------------------------------