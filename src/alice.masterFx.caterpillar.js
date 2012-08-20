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
alice.masterFx.caterpillar = function (params) {
    "use strict";

    //console.info("caterpillar", params);

    var CatCore = {
        // The book effect
        book: function(){

            var core = {
                // Book elements
                pages: [],

                // Page counters
                leftPage: 0,
                rightPage: 1,
                realPageCount: 0,
                pn: 1,                  //page number
                
                // Page/Book size
                pageWidth: '',
                pageHeight: '', 
                docWidth: function(){ var width = document.body.clientWidth; return width; },
                docHeight: alice.docHeight(),
                
                // Book details
                speed: 0,
                book: '',
                timing: 'linear',
                binding: '',
                paging: '',
                flip: '',
                margin: '',
                controlBoxStyle: '',
                wrap: false,

                // Transform details
                transformOrigin: '',
                transformRotate: '',
                transformDegrees: [],
                
                // Transform degrees
                _rot270: '(262deg)',
                _rot180: '(180deg)',
                _rot90: '(90deg)',
                _rot0: '(0deg)',
                _rotNeg90: '(-90deg)',
                _rotNeg180: '(-180deg)',
                _rotNeg270: '(-262deg)',

                // Shadow details
                shadowPattern0: '',
                shadowPattern50: '',
                shadowPattern100: '',
                shadowPatternRev50: '',
                shadowPatternRev100: '',

                // Browser details
                animationend: '',

                AnimGenerator: function(params){
                    

// SWAP FOR A SWITCH CASE *************************************************** /

                    //transforms
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
                    var originR = '\n\t'+alice.prefix+'transform-origin: '+core.TransformOrigin+';';

                    //Shadows
                    var Szero = '\t0%{'+alice.prefix+'box-shadow:'+params.shadowPattern0+';';
                    var Sfifty = '\t50%{'+alice.prefix+'box-shadow:'+params.shadowPattern50+';';
                    var Shundred = '\t100%{'+alice.prefix+'box-shadow:'+params.shadowPattern100+';';

                    //var zeroRev = '0%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev0+'}\n';
                    var SfiftyRev = '50%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev50+';'+'\n';
                    var ShundredRev = '100%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev100+';'+'\n';

                    //Keyframe titles
                    var oddPageF = '@'+alice.prefix+'keyframes oddPageTurnF{\n';
                    var oddPageR = '@'+alice.prefix+'keyframes oddPageTurnR{\n';
                    var evenPageF = '@'+alice.prefix+'keyframes evenPageTurnF{\n';
                    var evenPageR = '@'+alice.prefix+'keyframes evenPageTurnR{\n';
                    var abstrPageF = '@'+alice.prefix+'keyframes abstrPageTurnF{\n';
                    var abstrPageR = '@'+alice.prefix+'keyframes abstrPageTurnR{\n';
                    var abstrPageReTurnF = '@'+alice.prefix+'keyframes abstrPageReTurnF{\n';
                    var abstrPageReTurnR = '@'+alice.prefix+'keyframes abstrPageReTurnR{\n';

                    var closure = '}\n';

                    var abstrPageReTurnR, abstrPageReTurnF, abstrPageTurnR, abstrPageTurnF;
                    
                    //abstract axis
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

                    var oddPageTurnF, oddPageTurnR, evenPageTurnF, evenPageTurnR;

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
                    // config some core variables
                    core.speed = params.speed;
                    core.book = document.getElementById(params.elems || alice.anima);
                    core.timing = params.timing;
                    core.binding = params.binding;

                    core.pageWidth = params.bookWidth;
                    core.pageHeight = params.bookHeight;
                    
                    core.shadowPattern0 = params.shadowPattern0;
                    core.shadowPattern50 = params.shadowPattern50;
                    core.shadowPattern100 = params.shadowPattern100;

                    core.shadowPatternRev50 = params.shadowPatternRev50;
                    core.shadowPatternRev100 = params.shadowPatternRev100;

                    core.wrap = params.wrap;

                    core.paging = params.paging; 

                    // Fashion me a book!
                    core.book.style[alice.prefixJS+'Perspective'] = '3000px';
                    core.book.style.zIndex = '1000';
                    core.binding = params.binding;

                    if(params.paging == 'single'){
                        core.book.style.width = core.pageWidth+'px';
                        core.book.style.height = core.pageHeight+'px';
                        if(params.binding === 'center' || params.binding === 'left' || params.binding === 'right'){
                            core.transformRotate = 'rotateY';
                        }
                        if(params.binding === 'middle' || params.binding === 'top' || params.binding === 'bottom'){
                            core.transformRotate = 'rotateX';
                        }
                    }
                    else if(params.paging == 'double'){
                        if(params.binding == 'left' || params.binding == 'right'){
                            core.book.style.width = (core.pageWidth * 2)+'px';
                            core.book.style.height = core.pageHeight+'px';
                            core.transformRotate = 'rotateY';
                        }
                        else if(params.binding === 'top' || params.binding === 'bottom'){
                            core.book.style.width = core.pageWidth+'px';
                            core.book.style.height = (core.pageHeight * 2)+'px';
                            core.transformRotate = 'rotateX';
                        }
                    }

                    // Set the Animation End element
                    core.animationend = alice.prefixJS+'AnimationEnd';
                    if(alice.prefixJS === 'Moz'){
                        core.animationend = 'animationend';
                    }

                    core.pages = core.book.childNodes; //find me some kids!

                    // Set the real page count.
                    for(var p = 0; p < core.pages.length; p++){
                        if(core.pages[p].nodeType === 1){
                            core.realPageCount = core.realPageCount+1;
                        }
                    }

                    // Collect the style details of the book div
                    core.controlBoxStyle = document.getElementById(alice.anima);

                    // Set the details per binding
                    if(core.paging == 'single'){
                        switch(params.binding){
                            case "center":
                                core.transformDegrees = [core._rot0, core._rot90, core._rotNeg90];
                                core.TransformOrigin = '50% 50%';
                                break;
                            case "middle":
                                core.transformDegrees = [core._rot0, core._rot90, core._rotNeg90];
                                core.TransformOrigin = '50% 50%';
                                break;
                            case "left":
                                core.transformDegrees = [core._rot0, core._rot0, core._rot0];
                                core.TransformOrigin = '1px 1px';
                                break;
                            case "right":
                                core.transformDegrees = [core._rot0, core._rot0, core._rot0];
                                core.TransformOrigin = core.pageWidth+'px 1px';
                                break;
                            case "top":
                                core.transformDegrees = [core._rot0, core._rot0, core._rot0];
                                core.TransformOrigin = '1px 1px';
                                break;
                            case "bottom":
                                core.transformDegrees = [core._rot0, core._rot0, core._rot0];
                                core.TransformOrigin = '1px '+core.pageHeight+'px';
                                break;
                        }
                    }
                    if(core.paging == 'double'){
                        switch(params.binding){
                            case "left":
                                core.transformDegrees = [core._rot0, core._rot0];
                                core.TransformOrigin = core.pageWidth+'px 1px';
                                break;
                            case "right":
                                core.transformDegrees = [core._rot0, core._rot0];
                                core.TransformOrigin = core.pageWidth+'px 1px';
                                break;
                            case "top":
                                core.transformDegrees = [core._rot0, core._rot0];
                                core.TransformOrigin = '1px '+core.pageHeight+'px';
                                break;
                            case "bottom":
                                core.transformDegrees = [core._rot0, core._rot0];
                                core.TransformOrigin = '1px '+core.pageHeight+'px';
                                break;
                        }
                    }   
                },

                clearAnimation: function (id, dir) {
                    var idNum = id.substring(1, 8);    
                    var _element = document.getElementById(id);

                    console.warn('clear animation of: '+idNum+' with a pn of: '+core.pn);

                    // Simple blanks for replacing
                    _element.style[alice.prefixJS + "Animation"] = '';
                    _element.style[alice.prefixJS + "AnimationDelay"] = "";
                    _element.style[alice.prefixJS + "AnimationDuration"] = "";
                    _element.style[alice.prefixJS + "AnimationTimingFunction"] = "";
                    _element.style[alice.prefixJS + "AnimationIterationCount"] = "";
                    _element.style[alice.prefixJS + "AnimationDirection"] = "";
                    _element.style[alice.prefixJS + "AnimationPlayState"] = "";

                    if(core.binding == 'center' || core.binding == 'middle'){
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
                    else if(core.binding == 'left' || core.binding == 'top' || core.binding == 'right' || core.binding == 'bottom'){
                        _element.style.display = 'none';
                        console.log(_element);
                    }

                    // Abtsract page changes
                    if(core.paging == 'single'){
                        // get other pages
                        var prepage = document.getElementById('p'+(parseInt(idNum)-1)); 
                        var nextpage = document.getElementById('p'+(parseInt(idNum)+1));

                        //if its the last page
                        if(idNum == core.realPageCount){
                            var nextpage = document.getElementById('p1'); 
                        }

                        // set this pages main attributes
                        _element.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[0];
                        _element.style.zIndex = '0';
                        
                        if(idNum > 1 && dir == 'forwards'){
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
                            
                            // gotta prepare ourselves
                            var prepage = document.getElementById('p'+(idNum-1)); 

                            //In case we need a book that never ends!
                            if(core.wrap === true){
                                // For all those special pages
                                if(idNum == 1){
                                    var prepage = document.getElementById('p'+core.realPageCount); 
                                }
                                if(idNum != core.realPageCount){
                                    var nextpage = document.getElementById('p'+(parseInt(idNum)+1));
                                }
                            }

                            if(core.wrap === false){
                                if(idNum === 1){
                                    idNum = 1;
                                    core.rightPage = 1;
                                }
                            }

                            if(core.binding == 'left' || core.binding == 'top' || core.binding == 'right' || core.binding == 'bottom'){
                                nextpage.style.display = 'none';
                                _element.style.display = 'block';
                            }
                            if(core.wrap === true && idNum > 1){
                                prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[2];
                            }
                                nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];
                        }
                        if(idNum == 1 && dir == 'reverse'){
                            var prepage = document.getElementById('p'+core.realPageCount); 
                            prepage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[2];
                            nextpage.style[alice.prefixJS+"Transform"] = core.transformRotate+core.transformDegrees[1];
                        }
                    }
                    
                    core.pn++;
                },

                resetCSS: function(flipDirection, binding, id){
                    var bookEffect = alice.masterFx.caterpillar.book;

                    // A set of options for resetting the style attributes of the different pages.
                    var thisPage = document.getElementById(id);
                    var idNum = id.substring(1, 8);
                    var nextPage = document.getElementById('p'+(parseInt(idNum)+1));

                    console.log('p'+(parseInt(idNum)+1));

                    var Angle90 = '(90deg);';
                    var Angle0 = '(0deg);';
                    var AngleNeg90 = '(-90deg);';

                    var basicSettings = 'display: block; left: 0px; top: 0px;';

                    if(idNum % 2 === 1 ){
                        if(flipDirection === 'forward' && core.binding === 'left'){
                            thisPage.setAttribute('style',
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'transform: '+ core.transformRotate + AngleNeg90 +
                                alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                            thisPage.style.top = '0px';
                            thisPage.style.left = core.pageWidth+'px'; 
                        }
                        if(flipDirection === 'reverse' && core.binding === 'left'){
                            thisPage.setAttribute('style',
                                basicSettings+
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'box-shadow:'+core.shadowPattern100+';');
                            thisPage.style.top = '0px';
                            thisPage.style.left = core.pageWidth+'px'; 
                        }
                        

                        if(flipDirection === 'forward' && core.binding === 'right'){
                            thisPage.setAttribute('style',
                                alice.prefix+'transform-origin: 600px 1px;'+
                                alice.prefix+'transform: '+ core.transformRotate + Angle90 +
                                alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                        }
                        if(flipDirection === 'reverse' && core.binding === 'right'){
                            thisPage.setAttribute('style',
                                basicSettings+
                                alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                alice.prefix+'box-shadow:'+core.shadowPattern100+';');
                        }
                        

                        if(flipDirection === 'forward' && core.binding === 'bottom'){
                            thisPage.setAttribute('style',
                                alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                alice.prefix+'transform: '+ core.transformRotate + AngleNeg90 +
                                alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                        }
                        if(flipDirection === 'reverse' && core.binding === 'bottom'){
                            thisPage.setAttribute('style',
                                basicSettings+
                                alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                alice.prefix+'box-shadow:'+core.shadowPattern100+';');
                            thisPage.style.top = '0px';
                        }
                        

                        if(flipDirection === 'forward' && core.binding === 'top'){
                            thisPage.setAttribute('style',
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'transform: '+ core.transformRotate + Angle90 +
                                alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                            thisPage.style.top = core.pageHeight+'px';
                        }
                        if(flipDirection === 'reverse' && core.binding === 'top'){
                            thisPage.setAttribute('style',
                                basicSettings+
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'box-shadow:'+core.shadowPattern100+';');
                            thisPage.style.top = core.pageHeight+'px';
                        }
                        


                    } 


                    if(idNum % 2 === 0 ){
                        
                        if(flipDirection === 'forward' && core.binding === 'left'){
                            thisPage.setAttribute('style',
                                basicSettings+
                                alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                alice.prefix+'transform: '+core.transformRotate+ Angle0 +
                                alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                        }
                        if(flipDirection === 'reverse' && core.binding === 'left'){
                            thisPage.setAttribute('style', 
                                alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                alice.prefix+'transform: '+core.transformRotate+ Angle90 +
                                alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                        }
                        

                        if(flipDirection === 'forward' && core.binding === 'right'){
                            thisPage.setAttribute('style', 
                                basicSettings+
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'transform: '+core.transformRotate+ Angle0 +
                                alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                            thisPage.style.top = '0px';
                            thisPage.style.left = core.pageWidth+'px';     
                        }
                        if(flipDirection === 'reverse' && core.binding === 'right'){
                            thisPage.setAttribute('style',+
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'transform: '+core.transformRotate+ AngleNeg90 +
                                alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                            thisPage.style.top = '0px';
                            thisPage.style.left = core.pageWidth+'px';     
                        }
                        

                        if(flipDirection === 'forward' && core.binding === 'bottom'){
                            thisPage.setAttribute('style',
                                basicSettings+
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'transform: '+core.transformRotate+ Angle0 +
                                alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                            thisPage.style.top = core.pageHeight+'px';
                        }
                        if(flipDirection === 'reverse' && core.binding === 'bottom'){
                            thisPage.setAttribute('style', 
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'transform: '+core.transformRotate+ Angle90 +
                                alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');   
                            thisPage.style.top = core.pageHeight+'px';
                        }
                        

                        if(flipDirection === 'forward' && core.binding === 'top'){
                            thisPage.setAttribute('style', 
                                basicSettings+
                                alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                alice.prefix+'transform: '+core.transformRotate+ Angle0 +
                                alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                            thisPage.style.top = '0px';    
                        }
                        if(flipDirection === 'reverse' && core.binding === 'top'){
                            thisPage.setAttribute('style',+
                                alice.prefix+'transform-origin: 1px 1px;'+
                                alice.prefix+'transform: '+core.transformRotate+ AngleNeg90 +
                                alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                            thisPage.style.top = '0px'; 
                        }                            
                    }
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
                                alice.prefix+'transform-origin:'+core.TransformOrigin+';'+
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

                    var genController = function(loc){
                        var clickBox = document.createElement('div');
                        clickBox.setAttribute('id', '_'+loc+'Controller');
                        clickBox.style.width = (core.pageWidth/4)+'px';
                        clickBox.style.height = core.pageHeight+'px';
                        clickBox.style.position = 'absolute';
                        clickBox.style.background = '#999';
                        clickBox.style.zIndex = '0';

                        clickBox.style.top = core.controlBoxStyle.offsetTop+'px';

                        var pageRef = 'alice.masterFx.caterpillar.book';

                        if(loc === 'right'){
                            clickBox.style.left = (core.controlBoxStyle.offsetLeft + core.pageWidth)+'px';
                            clickBox.setAttribute('onclick', pageRef+'._AbstractPageTurn('+pageRef+'.rightPage)');
                        }else{
                            clickBox.style.left = (core.controlBoxStyle.offsetLeft-parseInt(clickBox.style.width))+'px';
                            clickBox.setAttribute('onclick', pageRef+'._AbstractPageTurnR('+pageRef+'.rightPage)');
                        }
                        //document.getElementById('_controlBox').appendChild(clickBox);
                        document.body.appendChild(clickBox);
                    };
                      
                    if(params.controls === true){    
                        genController('left');
                        genController('right');   
                    }

                    function keyrelease(evt){
                        var dir = evt.keyCode;
                        var newPageCount = core.realPageCount+1;
                            if(dir == 39){
                                if(core.rightPage < newPageCount){
                                    core.turnPage(core.rightPage);
                                }
                            }
                            else if(dir == 37){
                                if(core.leftPage >= 1){
                                    core.turnPage(core.leftPage);
                                }
                            }
                    }

                    // Add the keylistener
                    document.body.addEventListener("keyup", keyrelease, false);

                    //Acquired traits from params
                    var className = params.pageClassName,
                        bookEffect = alice.masterFx.caterpillar.book,
                        n = 1;
                    
                    // get the vendor prefix
                    var pfex = alice.prefixJS; 
                    
                    // generate a new class
                    var NewPageClass = 'book'+ new Date().getTime();
                    var NewClass =  '.'+NewPageClass+
                                    '{ display: none; '+
                                    alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';'+
                                    'width: '+core.pageWidth+'px;'+
                                    'height: '+core.pageHeight+'px;'+
                                    'position: absolute;'+
                                    'left: 0px;'+
                                    'top: 0px;'+
                                    'z-index: 0;'+ 
                                    'overflow: hidden;'+
                                    '}';

                    // insert the new class
                    alice.keyframeInsert(NewClass);
 
                    //This is key generating the doubles required for this binding.
                    if(core.paging === 'single'){ 
                        
                        var f = 1;
                        //var newPages = document.getElementById(alice.anima).childNodes;
                        for(var b = 0; b < core.pages.length; b++){
                            if(core.pages[b].nodeType === 1){
                                core.pages[b].setAttribute('id', 'p'+f);
                                core.pages[b].setAttribute('class', className + ' ' +NewPageClass);

                                if(params.controls !== true){  
                                    core.pages[b].setAttribute('onclick', 'alice.masterFx.caterpillar.book._AbstractPageTurn('+f+')');                                
                                }

                                core.styleConfig(f);

                                if(f === 1){
                                    core.pages[b].style.display = 'block';
                                    core.pages[b].setAttribute('style', 'display: block; z-index: 1;'+
                                    alice.prefix+'transform-origin:'+core.TransformOrigin+';'+
                                    alice.prefix+'transform: '+ core.transformRotate + core._rot0 +';' +
                                    alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                                }

                                f++;
                            }
                        }
                    }

                    if(core.paging === 'double'){
                        // Initial page setup
                        //==================================================================================
                        for (var i = 0; i < core.pages.length; i++){
                            if(core.pages[i].nodeType === 1){
                                core.pages[i].setAttribute('id', 'p'+n);
                                core.pages[i].setAttribute('class', className + ' ' +NewPageClass);

                                // make the first page visible
                                if(n === 1){
                                    core.pages[i].style.display = 'block';
                                    core.pages[i].style[pfex+'BoxShadow'] = core.shadowPattern100+';';
                                }

                                core.styleConfig(n);

                                core.pages[i].setAttribute('onclick', 'alice.masterFx.caterpillar.book.turnPage('+n+')');                                

                                core.pages[i].addEventListener(core.animationend, function(){
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'oddPageTurnF'){
                                        // even page flip
                                        core.evenPageFlip(this.getAttribute('id'));
                                        // reset the CSS
                                        core.resetCSS('forward', core.binding, this.getAttribute('id'));
                                    }   
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'oddPageTurnR'){
                                        // reset the CSS
                                        core.resetCSS('reverse', core.binding, this.getAttribute('id'));

                                        var nxtId = this.getAttribute('id');
                                        nxtId = nxtId.substring(1, 8);
                                        nxtId = parseInt(nxtId)+2;

                                        console.log(nxtId);
                                        
                                        if(nxtId < core.realPageCount+1){
                                            document.getElementById('p'+nxtId).style.display = 'none';
                                        }
                                    } 
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'evenPageTurnF'){
                                        core.resetCSS('forward', core.binding, this.getAttribute('id'));
                                    }
                                    // for even pages moving backwards
                                    if(this.style[alice.prefixJS+'AnimationName'] === 'evenPageTurnR'){
                                        // odd page flip
                                        core.oddPageFlip(this.getAttribute('id'));
                                        // reset the CSS of the page
                                        core.resetCSS('reverse', core.binding, this.getAttribute('id'));

                                        var nxtId = this.getAttribute('id');
                                        nxtId = nxtId.substring(1, 8);
                                        nxtId = parseInt(nxtId)+1;

                                        if(nxtId < bookEffect.realPageCount){
                                            //document.getElementById('p'+nxtId).style.zIndex = 0;
                                        }
                                    }
                                }, false);

                                //This is needed for the generation of the required double pages
                                if(core.binding === 'center'){
                                    var papier = core.mybook.removeChild(document.getElementById('p'+n));
                                    papiers.push(papier);
                                }

                                n++;    
                            }    
                        }
                    }                

                    return core;
                },

                getThisId: function(pageId){
                    var page = pageId.substring(1, 8);
                        page = parseInt(page);
                        return page;
                },

                pageSetter: function(pageId){
                    if(pageId == 0){
                        pageId = core.realPageCount;
                    }
                    var prePageId = 'p'+ (pageId - 1);
                    var prePage = document.getElementById(prePageId);
                    prePage.style[alice.prefixJS+'Transform'] = core.transformRotate+core._rotNeg90;
                },

                setAnimDefaults: function(page){
                    page.style[alice.prefixJS+'AnimationDuration'] = core.speed;
                    page.style[alice.prefixJS+'AnimationFillMode'] = "forwards";
                    page.style[alice.prefixJS+'AnimationPlayState'] = "running";
                    page.style[alice.prefixJS+'AnimationDirection'] = 'normal';
                    page.style[alice.prefixJS+'AnimationTimingFunction'] = "linear";
                    page.style.display = 'block';
                },

                abstrPageFlip: function(id){
                    var nxtId = core.getThisId(id)+1;
                    
                    if(nxtId === core.realPageCount+1){
                        nxtId = 1;
                    }

                    var nxtPageId = core.book.querySelector('div:nth-child('+nxtId+')').getAttribute('id');
                    
                    var nxtPage = document.getElementById(nxtPageId);
                        nxtPage.style[alice.prefixJS+'AnimationName'] = "abstrPageTurnR";
                        core.setAnimDefaults(nxtPage); 

                    nxtPage.addEventListener(core.animationend, function(){
                        if(nxtPage.style[alice.prefixJS+'AnimationName'] === 'abstrPageTurnR'){    
                            core.clearAnimation(this.getAttribute('id'), 'forwards');
                        }
                    }, false);
                },

                abstrPageReFlip: function(id){
                    var preId = core.getThisId(id)-1;

                    if(preId == 0){
                        preId = core.realPageCount;
                    }

                    var prePageId = core.book.querySelector('div:nth-child('+preId+')').getAttribute('id');
                    
                    var prePage = document.getElementById(prePageId);
                        prePage.style[alice.prefixJS+'AnimationName'] = "abstrPageReTurnR";
                        core.setAnimDefaults(prePage); 

                    prePage.addEventListener(core.animationend, function(){
                        if(prePage.style[alice.prefixJS+'AnimationName'] === 'abstrPageReTurnR'){    
                            core.clearAnimation(this.getAttribute('id'), 'reverse');
                        }
                    }, false);
                },

                evenPageFlip: function(id){
                    var nxtId = id;
                        nxtId = nxtId.substring(1, 8);
                        nxtId = parseInt(nxtId);
                        nxtId = nxtId + 1;
                    
                    var nxtPageId = core.book.querySelector('div:nth-child('+nxtId+')').getAttribute('id');
                    
                    var nxtPage = document.getElementById(nxtPageId);
                        nxtPage.style.zIndex = 1;
                        nxtPage.style[alice.prefixJS+'AnimationName'] = "evenPageTurnF";
                        core.setAnimDefaults(nxtPage); 
                },

                oddPageFlip: function(id){
                    var preId = id;
                        preId = preId.substring(1, 8);
                        preId = parseInt(preId);                                

                    var prePageId = core.book.querySelector('div:nth-child('+(preId - 1)+')').getAttribute('id');

                    var prePage = document.getElementById(prePageId);
                        prePage.style.zIndex = 1;
                        prePage.style.display = 'block';
                        prePage.style[alice.prefixJS+'AnimationName'] = "oddPageTurnR";
                        core.setAnimDefaults(prePage); 
                },

                turnPage: function (pageId){

                    console.log('turn page: '+pageId);

                    if(core.leftPage < 0){
                        core.leftPage = 0;
                        core.rightPage = 1;
                    }
                    if(core.rightPage > core.realPageCount){
                        core.leftPage = core.realPageCount;
                        core.rightPage = core.realPageCount+1;
                    }

                    if(pageId % 2 === 1){

                        var nxtPageId = core.book.querySelector('div:nth-child('+(pageId + 1)+')').getAttribute('id');

                        var nxtNxtPageId = core.book.querySelector('div:nth-child('+(pageId + 2)+')');
                        if(nxtNxtPageId){
                            nxtNxtPageId = nxtNxtPageId.getAttribute('id');
                            var nxtNxtPage = document.getElementById(nxtNxtPageId);
                            nxtNxtPage.style.zIndex = '0';
                            nxtNxtPage.style.display = 'block';
                        }
                        
                        var page = document.getElementById('p'+pageId);
                            page.style.zIndex = '1';
                            page.style[alice.prefixJS+'AnimationName'] = "oddPageTurnF";
                            core.setAnimDefaults(page); 

                        if(core.rightPage < core.realPageCount+1){
                            core.rightPage += 2;
                            core.leftPage += 2;
                        }
                    }
                    if(pageId % 2 === 0){

                        var prvPageId = core.book.querySelector('div:nth-child('+(pageId - 1)+')').getAttribute('id');

                        var prvPrvPageElement = core.book.querySelector('div:nth-child('+(pageId - 2)+')');
                        
                        if(prvPrvPageElement){
                            var prvPrvPageId = prvPrvPageElement.getAttribute('id');
                            var prvPrvPage = document.getElementById(prvPrvPageId);
                            prvPrvPage.style.display = 'block';
                        }
                        
                        var page = document.getElementById('p'+pageId);
                            page.style.zIndex = '1';
                            
                            page.style[alice.prefixJS+'AnimationName'] = "evenPageTurnR";
                            core.setAnimDefaults(page); 
                    
                        if(core.leftPage >= 1){
                            core.rightPage -= 2;
                            core.leftPage -= 2;
                        }
                    }
                },
                //This creates a page turn and then sets the event listener for that single turn event.
                _AbstractPageTurn: function (pageId){  
                    if(core.wrap === true){
                        if(core.rightPage === core.realPageCount){
                            core.rightPage = 0;
                        }
                    }else{
                        if(core.binding === 'center' || core.binding === 'middle'){
                            if(core.rightPage >= core.realPageCount){
                                core.rightPage = core.realPageCount;
                            }
                        }
                    }

                    
                    var page = document.getElementById('p'+pageId);

                    if(core.wrap === false){
                        if(pageId != core.realPageCount){
                            page.style.zIndex = '100';
                            page.style[alice.prefixJS+'AnimationName'] = "abstrPageTurnF";
                        }
                    }else{
                        page.style.zIndex = '100';
                        page.style[alice.prefixJS+'AnimationName'] = "abstrPageTurnF";
                    }

                    // In case we want the wrapAround effect
                    if(pageId == core.realPageCount){
                        if(core.wrap === true){      
                            pageId = 0; // This is only applicable to the left, right, top, bottom.
                        }else{
                            if(core.binding === 'center' || core.binding === 'middle'){
                                pageId = core.realPageCount+1;
                                core.rightPage = core.realPageCount+1;
                                var page = document.getElementById('p'+pageId);
                            }
                        }
                    }  

                    console.log('Turning page: '+core.rightPage + ' ' + pageId);
                    if(core.rightPage != core.realPageCount && pageId != core.realPageCount && core.wrap == false){
                        //page.style.zIndex = '100'; 
                        page.style[alice.prefixJS+'AnimationName'] = "abstrPageTurnF";
                    }

                    // Make sure we have the next page visible!
                    if(core.binding == 'left' || core.binding == 'top' || core.binding == 'right' || core.binding == 'bottom'){
                        var nxtPageId = core.book.querySelector('div:nth-child('+(pageId + 1)+')').getAttribute('id');
                        var nxtPage = document.getElementById(nxtPageId);
                        nxtPage.style.display = 'block';
                    }

                    page.addEventListener(core.animationend, function(){
                        if(page.style[alice.prefixJS+'AnimationName'] === 'abstrPageTurnF'){
                            if(core.binding == 'center' || core.binding == 'middle'){
                                alice.masterFx.caterpillar.book.abstrPageFlip(this.getAttribute('id'));
                            }
                            core.clearAnimation(this.getAttribute('id'), 'forwards');
                            core.rightPage++;
                        }
                     }, false);

                    core.setAnimDefaults(page); 
                },

                _AbstractPageTurnR: function (pageId){  
                    if(core.binding == 'center' || core.binding == 'middle'){

                        if(pageId >= core.realPageCount){
                            pageId = core.realPageCount;
                            core.rightPage = core.realPageCount;
                        }
                        
                        console.log('reversing page: '+core.rightPage)
                        
                        if(core.rightPage === 0){
                        core.rightPage = core.realPageCount;
                        }
                        if(pageId !== 1){
                        core.pageSetter(pageId);
                        }
                        if(pageId === 0){
                            pageId = core.realPageCount;
                        }
                        // We have to throw a curve ball to stop the function from working.
                        if(core.wrap === false){
                            if(pageId === 1){
                                pageId = -1;
                            }
                        }

                        var page = document.getElementById('p'+pageId);
                        page.style[alice.prefixJS+'AnimationName'] = "abstrPageReTurnF";

                        page.addEventListener(core.animationend, function(){
                            if(page.style[alice.prefixJS+'AnimationName'] === 'abstrPageReTurnF'){
                                alice.masterFx.caterpillar.book.abstrPageReFlip(this.getAttribute('id'));
                                core.clearAnimation(this.getAttribute('id'), 'reverse');
                                core.rightPage--;
                            }
                         }, false);

                        core.setAnimDefaults(page);
                    }

                    if(core.binding == 'left' || core.binding == 'right' || core.binding == 'top' || core.binding == 'bottom'){

                        if(core.wrap == true){
                            if((pageId-1) == 0){
                                pageId = core.realPageCount+1;
                                core.rightPage = core.realPageCount+1;
                            }
                        }
                        if(core.wrap === false && pageId >= core.realPageCount){
                            pageId = core.realPageCount;
                        }

                            console.log(pageId-1);

                            if(core.wrap === true){
                                if((pageId-1) === 0){

                                    console.log("I need to get this first page to not move.")
                                    // pageId = core.realPageCount+1;
                                    // core.rightPage = core.realPageCount+1;
                                }
                            }

                            //for 1 I need to change the rightpage, and id, and ensure the animation doesnt roll

                            var page = document.getElementById('p'+(pageId-1));

                            page.style.zIndex = '10';

                            switch (core.binding){
                                case "left" || "bottom":
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
                        
                            page.addEventListener(core.animationend, function(){
                                if(page.style[alice.prefixJS+'AnimationName'] === 'abstrPageReTurnF'){
                                    core.clearAnimation('p'+(pageId-1), 'reverse');
                                    core.rightPage--;  
                                }
                             }, false);

                            core.setAnimDefaults(page);

                        
                    }
                }
            }

            return core;
        }(),
    
        polygon: function(){

        },

        cube: function(){
            console.log('cubit');
        }
    }

    return CatCore;

}();

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

    alice.masterFx.caterpillar.book.init(opts);
    return opts;
};

//----------------------------------------------------------------------------