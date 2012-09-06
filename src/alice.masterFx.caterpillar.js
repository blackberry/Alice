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
        piggyBg: null,

        // Transform details
        transformOrigin: '',    // Sets the primary origin of the transform ex.0px 0px Top Left
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

        originZero: '',             // We need this because of Mozilla

        // Shadow details in order to add more depth to the transforms.
        shadowPattern0: '',
        shadowPattern50: '',
        shadowPattern100: '',
        shadowPatternRev50: '',
        shadowPatternRev100: '',

        // Events/ Status
        animationStart: '', 
        animationEnd: '',
        animationRunning: false,
        bookStart: '', 
        bookEnd: '',
        loadPage: '',

        helpers: {},

        AnimGenerator: function(params){
            var abstrPageReTurnR, abstrPageReTurnF, abstrPageTurnR, abstrPageTurnF, oddPageTurnF, oddPageTurnR, evenPageTurnF, evenPageTurnR;
            // transforms
            var tranRot90 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot90+';';
            var tranRot270 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot270+';';
            var tranRotNeg270 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rotNeg270+';';
            var tranRotNeg90 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rotNeg90+';';
            var tranRot0 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+core._rot0+';';

            //transform-origins
            var originL = '\n\t'+alice.prefix+'transform-origin: '+core.originZero+';';
            var originM = '\n\t'+alice.prefix+'transform-origin: 50% 50%;';
            var originR = '\n\t'+alice.prefix+'transform-origin: '+core.transformOrigin+';';

            //Shadows
            var Szero = '\t0%{'+alice.prefix+'box-shadow:'+params.shadowPattern0+';';
            var Sfifty = '\t50%{'+alice.prefix+'box-shadow:'+params.shadowPattern50+';';
            var Shundred = '\t100%{'+alice.prefix+'box-shadow:'+params.shadowPattern100+';';
            var SfiftyRev = '50%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev50+';'+'\n';
            var ShundredRev = '100%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev100+';'+'\n';

            //Keyframe titles
            var oddPageF = '@'+alice.prefix+'keyframes oddPageTurnF{\n';                                    // odd page forward
            var oddPageR = '@'+alice.prefix+'keyframes oddPageTurnR{\n';                                    // odd page reverse
            var evenPageF = '@'+alice.prefix+'keyframes evenPageTurnF{\n';                                  // even page forward
            var evenPageR = '@'+alice.prefix+'keyframes evenPageTurnR{\n';                                  // even page reverse
            var abstrPageF = '@'+alice.prefix+'keyframes abstrPageTurnF{\n';                                // abstract page forward [ center || middle ]
            var abstrPageR = '@'+alice.prefix+'keyframes abstrPageTurnR{\n';                                // abstract page reverse [ center || middle ]
            var abstrPageReF = '@'+alice.prefix+'keyframes abstrPageReTurnF{\n';                        // abstract page forward [ top || left || right || bottom ]
            var abstrPageReR = '@'+alice.prefix+'keyframes abstrPageReTurnR{\n';                        // abstract page reverse [ top || left || right || bottom ]

            var closure = '}\n';
            
            // For single paging
            if(core.paging === 'single'){
                if(core.binding === 'left'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'right'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'top'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'bottom'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                // Abstract bindings
                if(core.binding === 'center'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originM+tranRotNeg90+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originM+tranRot90+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                }
                if(core.binding === 'middle'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originM+tranRotNeg90+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originM+tranRot90+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
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
            core.speed = params.speed;                                              // page turn duration
            core.book = document.getElementById(params.elems || alice.anima);       // the book
            core.timing = params.timing;                                            // the timing of the animation (always linear)
            core.binding = params.binding;                                          // the location of what would be the binding
            core.piggyBg = params.piggyBg;                                          // the background of a single page turn 
            core.controlsBg = params.controlsBg;                                    // the background of the controls
            core.originZero = '0 0';                                                // The default transform origin think top left

            // Create the Book Events
            core.bookStart = document.createEvent("Event");             
            core.bookStart.initEvent("bookStart",true,true);                        // Book Start Event

            core.bookEnd = document.createEvent("Event");   
            core.bookEnd.initEvent("bookEnd",true,true);                            // Book End Event

            core.loadPage = document.createEvent("Event");
            core.loadPage.initEvent("loadPage",true,true);                          // Page Loading Effect

            // Required to determine the book's attributes.
            function findCSSRule(selector) {
                var numOfSheets = document.styleSheets.length;      // Because we may have multiple stylesheets
                for(var s = 0; s < numOfSheets; s++){
                    var mySheet = document.styleSheets[s];          // Grab the specific sheet
                    if (mySheet.rules) {                            // Verify it has rules
                        var theRules = mySheet.rules;               // IE
                    } else {
                        var theRules = mySheet.cssRules;            // Everybody else
                    }
                    var theRules = mySheet.cssRules ? mySheet.cssRules : mySheet.rules;
                    for (var i=0; i<theRules.length; i++) {                     // Parse the set of rules
                        if (theRules[i].selectorText == selector) {             // If we have a match
                            var bW = theRules[i].style.width.toString();        // Get the book width
                            var bH = theRules[i].style.height.toString();       // Get the book height
                            return [bW, bH];                                    // Return the string values as an array
                            break;
                        } // endif theRules[i]
                    } // end for i  
                } // end for s
            } // end findCSSRule()

            var bWidth, bHeight;
            var bookSize = findCSSRule("#"+core.book.getAttribute('id'));       // If there is a rule
            if(bookSize){
                bWidth = bookSize[0];                                           // If there is the rule we have something to work with
                bHeight = bookSize[1];
            }else{
                bWidth = core.book.style.width;                                 // In case its inline css
                bHeight = core.book.style.height;
            }

            // redefine the page width in case of px|%|int
            var symW, pw, bw;   
            if(bWidth.indexOf("%") > 0){                                        // Parse the percentage and make a px value
                symW = "%";
                pw = '0.'+bWidth.substring(0, bWidth.indexOf(symW));
                pw = parseFloat(pw);
                bw = core.docWidth()*pw;
            }
            else if(bWidth.indexOf("px") > 0){                                 // Grab the raw pixel value from the string
                symW = "px";
                bw = bWidth.substring(0, bWidth.indexOf(symW));
            }
            else{   
                bw = bWidth;                                                   // If its a raw integer
            }
            core.pageWidth = bw;                                               // set the core width

            // redefine the height in case of px|%|int
            var symH, ph, bh;
            if(bHeight.indexOf("%") > 0){                                      // If percentage
                symH = "%";
                ph = '0.'+bHeight.substring(0, bHeight.indexOf(symH));
                ph = parseFloat(ph);
                bh = core.docHeight*ph;
            }
            else if(bHeight.indexOf("px") > 0){                                 // If px
                symH = "px";
                bh = bHeight.substring(0, bHeight.indexOf(symH));
            }
            else{
                bh = bHeight;                                                   // If integer
            }
            core.pageHeight = bh;                                               // Set the core height

            // Configure the perspective depth [ there was no science used in the formulating of this. ]
            var goggles = Math.floor(core.pageWidth*4);
            
            // Set the shadows
            core.shadowPattern0 = params.shadowPattern0;        
            core.shadowPattern50 = params.shadowPattern50;
            core.shadowPattern100 = params.shadowPattern100;
            core.shadowPatternRev50 = params.shadowPatternRev50;
            core.shadowPatternRev100 = params.shadowPatternRev100;

            // Various book details
            core.pageClassName = params.pageClassName;                          // This is the default class of the pages passed to the system.
            core.wrap = params.wrap;                                            // The true/false wrap state
            core.paging = params.paging;                                        // single or double paging

            // create a new class
            core.NewPageClass = 'book'+ new Date().getTime();                   // The new class for the pages

            // Configure animation parts for silly Mozilla
            core.animationEnd = alice.prefixJS+'AnimationEnd';      // Works on Chrome, Safari, IE
            if(alice.prefixJS === 'Moz'){                           // Just specifically for Mozilla                
                core.animationEnd = 'animationstart';               // animation start
                core.animationEnd = 'animationend';                 // animation end
                // Here add details regarding the boxShadow
            }

            // Set the array of pages for the book
            var rawPages = core.book.childNodes;                                                // find me some raw contents!
            var rpn = 0;                                                                        // real page number
            for(var p = 0; p < rawPages.length; p++){
                if(rawPages[p].nodeType === 1){ 
                    if(rawPages[p].tagName === "DIV" || rawPages[p].tagName === "div"){         // Ensure that they are elements                        
                        core.pages[rpn] = rawPages[p];                                          // Add the div to the array
                        core.realPageCount = core.realPageCount+1;                              // set the page count
                        rpn++;                                                                  // real page number + 1
                    }
                    else{
                        console.error("Your pages must be all be the DIV tag element. Please place the contents inside.");  // At least give a reason for the malfunction
                        return false;                                                                                       // return nothing
                    }
                }
            }

            // Fashion me a book!
            core.book.style[alice.prefixJS+'Perspective'] = goggles+'px';           // Set the book perspective depth
            core.book.style.zIndex = '1000';                                        // Front and center soldier!
            core.book.style.position = 'relative';                                  // But dont be too intrusive
            core.binding = params.binding;                                          // Set the binding

            // set the transform axis
            if(params.binding === 'center' || params.binding === 'left' || params.binding === 'right'){         // For the Y axis
                core.transformRotate = 'rotateY';                                   
            }
            if(params.binding === 'middle' || params.binding === 'top' || params.binding === 'bottom'){         // For the X axis
                core.transformRotate = 'rotateX';
            }

            // If single paging we need a small book
            if(params.paging === 'single'){
                core.book.style.width = core.pageWidth+'px';                    // Set the book width
                core.book.style.height = core.pageHeight+'px';                  // Set the book height
            }
            //If double paging we need a big book
            else if(params.paging === 'double'){
                if(params.binding === 'left' || params.binding === 'right'){        // wide book with normal height
                    core.book.style.width = (core.pageWidth * 2)+'px';              // set width
                    core.book.style.height = core.pageHeight+'px';                  // set height
                }
                else if(params.binding === 'top' || params.binding === 'bottom'){   // tall book with normal width
                    core.book.style.width = core.pageWidth+'px';                    // set width
                    core.book.style.height = (core.pageHeight * 2)+'px';            // set height
                }
            }

            // Collect the style details of the book div for later
            core.controlBoxStyle = core.book;                                       // Get the style of the book                     

            // Set the details per binding
            if(core.paging === 'single'){
                core.transformDegrees = [core._rot0, core._rot0, core._rot0]; //0, 0, 0                     // Set the degrees needed for this animation set
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
                        core.transformOrigin = core.originZero;
                        break;
                    case "top":
                        core.transformOrigin = core.originZero;
                        break;
                    case "right":
                        core.transformOrigin = core.pageWidth+'px 0px';
                        break;
                    case "bottom":
                        core.transformDegrees = [core._rot0, core._rot0, core._rotNeg270]; //0, 0, 0
                        core.transformOrigin = '0px '+core.pageHeight+'px';
                        break;
                }
            }
            if(core.paging === 'double'){
                switch(params.binding){
                    case "left":
                        core.transformOrigin = core.pageWidth+'px 0px';
                        break;
                    case "right":
                        core.transformOrigin = core.pageWidth+'px 0px';
                        break;
                    case "top":
                        core.transformOrigin = '0px '+core.pageHeight+'px';
                        break;
                    case "bottom":
                        core.transformOrigin = '0px '+core.pageHeight+'px';
                        break;
                }
                core.transformDegrees = [core._rot0, core._rot0]; //0, 0, 0
            }
        },

        clearAnimation: function (id, dir) {
            var idNum = core.helper.getThisId(id);                                          // strip the id to the number value
            var _element = document.getElementById(id);                                     // Get that page element by its id

            if(document.getElementById("_piggy")){                                          // If piggyback page exists we need to destroy it!
                core.book.removeChild(document.getElementById("_piggy"));
            }

            // Simple blanks for replacing
            _element.style[alice.prefixJS + "Animation"] = '';                          // Set all of these animation attributes to nothing
            _element.style[alice.prefixJS + "AnimationDelay"] = "";
            _element.style[alice.prefixJS + "AnimationDuration"] = "";
            _element.style[alice.prefixJS + "AnimationTimingFunction"] = "";
            _element.style[alice.prefixJS + "AnimationIterationCount"] = "";
            _element.style[alice.prefixJS + "AnimationDirection"] = "";
            _element.style[alice.prefixJS + "AnimationPlayState"] = "";

            if(core.binding === 'center' || core.binding === 'middle'){                 // If we're using this binding
                if(idNum % 2 === 1){                                                    // odd pages
                    if(core.pn % 2 === 1){                                              // and the page flip count an odd number
                        _element.style.display = 'none';
                    }  
                }
                if(idNum % 2 === 0){                                                    // Even pages
                    if(core.pn % 2 === 1){                                              // odd number of clearAnimation action
                        _element.style.display = 'none';                                // This is weird, but it works, it has to do with the forward and reversal part.
                    }
                }
            }
            else if(core.binding === 'left' || core.binding === 'top' || core.binding === 'right' || core.binding === 'bottom'){
                _element.style.display = 'none';                                        // For the other bindings we need to hide everything
            }

            // Abtsract page changes
            if(core.paging === 'single'){
                var nextpage, prepage;
                prepage = document.getElementById('p'+(parseInt(idNum, 10)-1));             // Get the previous page
                nextpage = document.getElementById('p'+(parseInt(idNum, 10)+1));            // Get the next page

                if(idNum === core.realPageCount){                                           // if its the last page
                    nextpage = document.getElementById('p1');                               // go to the first page, only applicable if the wrap effect is true
                }

                // set this pages main attributes
                _element.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[0];     // Set the angular value of the div
                _element.style.zIndex = '0';                                                                    // know your place little one!
                
                if(idNum > 1 && dir === 'forwards'){                                                                                    // If we're moving forwards
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];                          // Set the angular value of the previous page
                    if(core.binding === 'left' || core.binding === 'right' || core.binding === 'top' || core.binding === 'bottom'){     
                        nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[0];                     // Set the next page to 0 angle 
                    }
                }
                if(idNum === 1 && dir === 'forwards'){                                                                                  // If its the first page its special
                    prepage = document.getElementById('p'+core.realPageCount);                                                          // set the previous page to the last page
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];                          // set the angle of the pre-page, just in case
                }
                if(idNum > 0 && dir === 'reverse'){                                                                                     // If we're going backwards
                    prepage = document.getElementById('p'+(idNum-1));                                                                   // gotta prepare ourselves                  

                    if(core.wrap === true){                                                                                             // In case we need a book that never ends!
                        if(idNum !== core.realPageCount){
                            nextpage = document.getElementById('p'+(parseInt(idNum, 10)+1));
                        }
                    }

                    //Basic transformations to set the page attributes
                    if(core.binding === 'left' || core.binding === 'top' || core.binding === 'right' || core.binding === 'bottom'){
                        nextpage.style.display = 'none';
                        _element.style.display = 'block';
                    }
                    nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];                         // Set another angle
                }
                // If its the first page.
                if(idNum === 1 && dir === 'reverse'){
                    prepage = document.getElementById('p'+core.realPageCount);            // Required for when the user goes forward but then goes backwards                                                 
                    prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[2];              // Set the angle
                    nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];             // Set the angle
                }
            }
            core.pn++;                                                                                                      // This is always counting up
        },

        // This is for reseting double page 
        resetCSS: function(flipDirection, binding, id){
            var thisPage, idNum, nextPage, basicSettings, flipAngleOdd, flipAngleEven;
            // A set of options for resetting the style attributes of the different pages.
            thisPage = document.getElementById(id);
            idNum = core.helper.getThisId(id);
            nextPage = document.getElementById('p'+(parseInt(idNum, 10)+1));

            basicSettings = 'display: block; left: 0px; top: 0px;';                                                 // the most basic div settings

            if(idNum % 2 === 1 ){                                           
                thisPage.setAttribute('style', '');                                                                     
                if(flipDirection === 'forward'){
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;                                                                       
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
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;
                    switch(core.binding){
                        case "top":
                            thisPage.style.top = core.pageHeight+'px'; 
                            break;
                        case "right":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin; 
                            break;
                        case "left":
                            thisPage.style.left = core.pageWidth+'px';
                            break;
                        case "bottom":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.transformOrigin; 
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
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;                                                                    
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
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;
                            thisPage.style.top = core.pageHeight+'px'; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = core.transformRotate + core._rot0;
                }
                else if(flipDirection === 'reverse'){
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = core.originZero;
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
            thisPage.style.border = "none";
            thisPage.style[alice.prefixJS+"boxShadow"] = core.shadowPattern0;
        },

        styleConfig: function(idNum){
            var page = document.getElementById('p'+idNum);
            if(core.paging === 'single'){
                if(core.binding === 'center' || core.binding === 'middle'){
                    page.setAttribute('style', 'display: none; '+
                        alice.prefix+'transform-origin: 50% 50%;'+
                        alice.prefix+'transform: '+ core.transformRotate + core._rot90 +';'+
                        alice.prefix+'box-shadow: '+ core.shadowPattern100 +';');
                }
                if(core.binding === 'left' || core.binding === 'top' || core.binding === 'bottom' || core.binding === 'right'){
                    page.setAttribute('style', 'display: none; '+ 
                        alice.prefix+'transform-origin:'+core.transformOrigin+';'+
                        alice.prefix+'transform: '+ core.transformRotate + core._rot0 +';'+
                        alice.prefix+'box-shadow: '+ core.shadowPattern100 +';');
                }
            }
            if(core.paging === 'double'){
                if(core.binding === 'left'){
                    if(idNum % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.originZero;
                        page.style.left = core.pageWidth+'px';
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot90;
                    }
                }
                if(core.binding === 'right'){
                    if(idNum % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.transformOrigin;
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.originZero;
                        page.style.left = core.pageWidth+'px';
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg90;
                    }
                }
                if(core.binding === 'top'){
                    if(idNum % 2 === 1){
                        page.style.top = core.pageHeight+'px';
                        page.style[alice.prefixJS+'TransformOrigin'] = core.originZero;
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg90;
                    }
                }
                if(core.binding === 'bottom'){
                    if(idNum % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.transformOrigin;
                    }
                    if(idNum % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = core.originZero;
                        page.style.top = core.pageHeight+'px';
                        page.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rot90;
                    }
                }
            }
        },

        init: function(params){
            core.config(params);                                                    // Run the configuation of the book effect
            core.AnimGenerator(params);                                             // Set the animations/ Add to stylesheet

            // Report the book status
            if(core.binding !== 'center' || core.binding !== 'middle'){
                core.helper.bookStatus(core.rightPage-1);                           // Call the book status, this also sets of the book start event
            }else{
                core.helper.bookStatus(core.rightPage);
            }

            var genController = function(loc){                                      // Fabricate the controls
                var clickBox = document.createElement('div');
                clickBox.setAttribute('id', '_'+loc+'Controller');
                clickBox.style.width = '80px';
                clickBox.style.height = core.pageHeight+'px';
                clickBox.style.position = 'absolute';
                clickBox.style.background = core.controlsBg || '#999';
                clickBox.style.opacity = '0.3';
                clickBox.style.zIndex = '0';
                clickBox.style.top = core.controlBoxStyle.offsetTop+'px';
                var funcRef = 'alice.masterFx.caterpillar';
                            
                if(loc === 'right'){
                    clickBox.style.left = (core.controlBoxStyle.offsetLeft + parseInt(core.pageWidth, 10))+'px';
                    clickBox.style.borderTopRightRadius = '100px';
                    clickBox.style.borderBottomRightRadius = '100px';
                    clickBox.setAttribute('onclick', funcRef+'.abPageTurn('+funcRef+'.rightPage)');
                }else{
                    clickBox.style.left = (core.controlBoxStyle.offsetLeft - parseInt(clickBox.style.width, 10))+'px';
                    clickBox.style.borderTopLeftRadius = '100px';
                    clickBox.style.borderBottomLeftRadius = '100px';
                    clickBox.setAttribute('onclick', funcRef+'.abPageTurnR('+funcRef+'.rightPage)');
                }
                document.body.appendChild(clickBox);                            // Add the controls to the page
            }; 
            
            // Only if they really want them
            if(params.controls === true && params.paging === "single"){         // Lets make sure we want controls, oh and single pages only
                genController('left');
                genController('right');

                //Required for page resizing 
                window.onresize = function(event) {
                    document.body.removeChild(document.getElementById("_leftController"));      // remove the original to make a new set
                    document.body.removeChild(document.getElementById("_rightController"));     // same thing here.
                    genController('left');
                    genController('right');
                }; 
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
                
                if(dir === 37){ 
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
            var className = core.pageClassName;
            
            var bookClass = '.'+core.NewPageClass+
                            '{ display: none; '+
                            alice.prefix+'box-shadow: '+ core.shadowPattern100 +';'+
                            alice.prefix+'backface-visibility: hidden;' +
                            'width: '+core.pageWidth+"px;"+
                            'height: '+core.pageHeight+"px;"+
                            'position: absolute;'+
                            'border: none;' +
                            'left: 0px;'+
                            'top: 0px;'+
                            'z-index: 0;'+ 
                            'overflow: hidden;'+
                            '}';

            // insert the new class
            alice.keyframeInsert(bookClass);

            //==================================================================================
            // Initial Page Setup
            if(core.paging === 'single'){ 
                var f = 1;
                for(var b = 0; b < core.pages.length; b++){
                    core.pages[b].setAttribute('id', 'p'+f);
                    core.pages[b].setAttribute('class', className + ' ' +core.NewPageClass);

                    if(params.controls !== true){
                        core.pages[b].setAttribute('onclick', 'alice.masterFx.caterpillar.abPageTurn('+f+')');     // Without controls we still need to move forward                               
                    }
                    
                    core.styleConfig(f);                                                                            // pretify the pages
                   
                    if(f === 1){                                                                                    // If its the first page we need to make it special
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

                        if(n === 1){                                                                                // make the first page visible
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
                                nxtId = parseInt(nxtId, 10)+2;                                          // go to the next next page
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
                if(idNum === 0){
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
            aniName = (type === 'even') ? "oddPageTurnR" : "evenPageTurnF";                 // Determine the required animation

            core.helper.bookStatus(pg);

            core.animationRunning = true;                                                   // Set the state of the animation
            
            pgId = core.book.querySelector('div:nth-child('+pg+')').getAttribute('id');     // Get the page
            
            page = document.getElementById(pgId);
            page.style.zIndex = 1; 
            if(type === 'odd'){
                page.style.display = 'block';
            }
            page.style[alice.prefixJS+'AnimationName'] = aniName;
            core.helper.setAnimDefaults(page); 
        },

        turnPage: function (pageId){
            core.helper.bookStatus(pageId);
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

                    if(pageId % 2 === 1){                                                                                // For the odd pages
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
                if(pageId >= core.realPageCount && core.wrap === true){
                    pageId = 0;
                }
                if(pageId === 0 && core.wrap === true){
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
                    if(core.wrap !== true){   
                        console.log("This is the end of the book!");                                                            // The end of the book
                        return false;                                                                                           // Deny the flip animation
                    }
                }

                page.style.zIndex = '100';
                page.style[alice.prefixJS+'AnimationName'] = "abstrPageTurnF";

                page.addEventListener(core.animationEnd, function(){
                    if(page.style[alice.prefixJS+'AnimationName'] === 'abstrPageTurnF'){
                        if(core.binding === 'center' || core.binding === 'middle'){
                            alice.masterFx.caterpillar.abstrPageFlip(this.getAttribute('id'), 'forwards');
                        }else{
                            core.helper.bookStatus(pageId);
                        }
                        if(core.rightPage === core.realPageCount && core.wrap === true){
                            pageId = core.realPageCount;
                            core.rightPage = 0;
                        }
                        core.clearAnimation('p'+pageId, 'forwards');
                        core.rightPage++;
                        if(core.binding !== 'center' && core.binding !== 'middle'){
                            core.animationRunning = false;   
                        }
                    }
                 }, false);

                // Run animation run!
                core.animationRunning = true;                                   // Set the animation running (blocks another animation from running)
                core.helper.setAnimDefaults(page);                              // Set the defaults

                if(core.binding !== "center" && core.binding !== "middle" ){
                    core.helper.piggyback(pageId, "standard");                  // We call piggyback to hide the backface
                }
            }
        },

        abPageTurnR: function (pageId){  
            var page, pageToClear;
            if(core.animationRunning === false){
                if(core.binding === 'center' || core.binding === 'middle'){   // Because its fundamentally different from the other bindings
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
                        if(pageId === 1){                           // if its the main page drop it to a page which cannot exist to stop the backwards motion! :)
                            pageId = -1;                            
                        }
                    }
                    if(pageId >= 0){                                // Also to make sure we're able to turn off the wrap effect.     
                        page = document.getElementById('p'+core.rightPage);                     // Get the right page
                        page.style[alice.prefixJS+'AnimationName'] = "abstrPageReTurnF";        // Animate it
                        pageToClear = page.getAttribute('id');                                  // Clear its animation qualities
                    }
                }

                if(core.binding === 'left' || core.binding === 'right' || core.binding === 'top' || core.binding === 'bottom'){

                    if(core.wrap === true){                         // If its wrappable
                        if((pageId - 1) === 0){                     // If its going backwards
                            pageId = core.realPageCount+1;          // Transform the page num and rightPage which loads the page
                            core.rightPage = core.realPageCount+1;  // This is because through the rest of this we are otherwise 
                        }                                           // always running on the page number minus 1
                    }
                    if(core.wrap === false && pageId >= core.realPageCount){        // If wrap is false, and we're greater than the page count
                        pageId = core.realPageCount;                                // Reset us back to the max (need to because moving forward we're always adding 1)
                    }

                    page = document.getElementById('p'+(pageId-1));                 // Now deal with the real page
                    page.style.zIndex = '10';                                       // Bring it to the front

                    switch (core.binding){                                          // Make it nice
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

                    page.style[alice.prefixJS+'AnimationName'] = "abstrPageReTurnF";        // Animate this puppy
                    pageToClear = 'p'+(pageId - 1);                                         // clear the real page
                    core.helper.bookStatus(pageId-2);                                       // display the page num of the page which is now revealed.
                }

                core.animationRunning = true;                                               // Ensure that nothing else can run at the same time!

                page.addEventListener(core.animationEnd, function(){
                    if(page.style[alice.prefixJS+'AnimationName'] === 'abstrPageReTurnF'){  // Set the animationEnd listener
                        if(core.binding === 'center' || core.binding === 'middle'){
                            alice.masterFx.caterpillar.abstrPageFlip(this.getAttribute('id'), 'reverse');
                        }
                        core.clearAnimation(pageToClear, 'reverse');
                        core.rightPage--;
                        if(core.binding !== 'center' && core.binding !== 'middle'){
                            core.animationRunning = false;   
                        }
                    }
                 }, false);

                core.helper.setAnimDefaults(page);
                if(core.binding !== 'center' && core.binding !== 'middle'){
                    core.helper.piggyback(pageId-1, "advanced");      
                }
            }
        }
    };

    return core;

}();

var _caterpillar = alice.masterFx.caterpillar;                                                                                      // we need this to shorten things

alice.masterFx.caterpillar.helper = {

    bookStatus: function(id){
        "use strict";
        if(_caterpillar.binding === 'center' || _caterpillar.binding === 'middle'){
            if(id === 0){
                id = 1;
            }
        }
        if(_caterpillar.binding !== 'center' && _caterpillar.binding !== 'middle' && _caterpillar.paging !== 'double'){
            id = id+1;
        }
        var state = "page: " +id;
        if(id === 1){
            state = "This is the first page";
            document.dispatchEvent(_caterpillar.bookStart);       // Event trigger for end of book
        }
        if(id === _caterpillar.realPageCount || id === 0){
            state = "This is the end of the book";
        }
        console.log(state);
        if(id === _caterpillar.realPageCount){
            document.dispatchEvent(_caterpillar.bookEnd);       // Event trigger for end of book
        }
    },

    getThisId: function(pageId){
    "use strict";
        var page = pageId.substring(1, 8);
            page = parseInt(page, 10);
            return page;
    },

    pageSetter: function(pageId){
    "use strict";
        if(pageId === 0){
            pageId = _caterpillar.realPageCount;
        }
        var prePageId = 'p'+ (pageId - 1);
        var prePage = document.getElementById(prePageId);
        prePage.style[alice.prefixJS+'Transform'] = _caterpillar.transformRotate+_caterpillar._rotNeg90;
    },

    setAnimDefaults: function(page, speed){
    "use strict";
        var mySpeed;
        if(speed){
            mySpeed = speed;                                                                        // This grabs the randomized speed from the page and gives it to the piggyback page
        }else{
            mySpeed = alice.randomize(_caterpillar.speed, '15%')+'ms';                              // This tool randomizes the speed
        }
        page.style[alice.prefixJS+'AnimationDuration'] = mySpeed;                                   // Set the animation duration
        page.style[alice.prefixJS+'AnimationFillMode'] = "forwards";                                // forwards means it will leave everything alone when done (not even needed anymore because of the resetCSS)
        page.style[alice.prefixJS+'AnimationPlayState'] = "running";                                // set to a running state
        page.style[alice.prefixJS+'AnimationDirection'] = 'normal';                                 // direction is always normal (alternating causes nightmares)
        page.style[alice.prefixJS+'AnimationTimingFunction'] = "linear";                            // Set the linear timing
        page.style.display = 'block';
    },

    piggyback: function(id, type){
    "use strict";
        if(id === 0){                                                                               // If its the last page going forward (wrapping)
            id = _caterpillar.realPageCount;                                                        // Switch it from 0 back to its true id (its 0 now because we add 1 for the next page to display)
        }
        var speed = document.getElementById('p'+id).style[alice.prefixJS+"AnimationDuration"];      // Get the speed of the main page that turns
        var aniName = (type === "standard") ? "abstrPageTurnF" : "abstrPageReTurnF";                // Set the animation name
        var numZ = "0";                                                                             // Set the z-index
        var piggy = document.createElement('div');                                                  // Create piggy (the backside of the page)
            piggy.setAttribute('id', '_piggy');                                                     // Set the id
            piggy.style.width = _caterpillar.pageWidth+'px';                                        // set width
            piggy.style.height = _caterpillar.pageHeight+'px';                                      // set height
            piggy.style.position = 'absolute';                                                      // absolute position
            piggy.style.background = _caterpillar.piggyBg || '#222';                                // background
            piggy.style.top = '0px';                                                                // top position
            piggy.style.left = '0px';                                                               // left positon
            if(type === "advanced"){                                                                // If its going backwards we have to set a start angle
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
                piggy.style[alice.prefixJS+'Transform'] = _caterpillar.transformRotate+rotAngle;    // Set the angle
            }
            piggy.style.zIndex = numZ;                                                              // Set the z-index
            piggy.style[alice.prefixJS+'AnimationName'] = aniName;                                  // set the animation name
            piggy.style[alice.prefixJS+'TransformOrigin'] = _caterpillar.transformOrigin;           // Set the transform-origin
            _caterpillar.helper.setAnimDefaults(piggy, speed);                                      // Set teh defaults
            _caterpillar.book.appendChild(piggy);                                                   // Add the page to the document
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
        bookWidth: params.bookWidth || document.getElementById(params.elems || alice.anima).style.width,
        bookHeight: params.bookHeight || document.getElementById(params.elems || alice.anima).style.height,

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
        controls: params.controls || false,
        piggyBg: params.pageBackground || '#222',
        controlsBg: params.controlsBackground || '#999'
    };

    console.log(opts);

    alice.masterFx.caterpillar.init(opts);
    return opts;
};

//----------------------------------------------------------------------------