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
        book: (function(){

            var core = {

                leftPage: 0,
                pageWidth: '',
                pageHeight: '', 
                rightPage: 1, 
                realPageCount: 0,
                speed: 0,
                mybook: document.getElementById(alice.anima),
                timing: 'linear',
                binding: '',
                direction: '',
                
                TransformOrigin: '',
                transformRotate: '',

                shadowPattern0: '',
                shadowPattern50: '',
                shadowPattern100: '',
                shadowPatternRev50: '',
                shadowPatternRev100: '',
                margin: '', 

                cssgen: function(params){
                    //first we have to set our book up!
                    core.mybook.style[alice.prefixJS+'Perspective'] = '3000';
                    core.mybook.style.width = core.pageWidth+'px';
                    core.mybook.style.height = core.pageHeight+'px';
                    core.mybook.style.margin = "20px auto";
                    core.binding = params.binding;

                    if(params.binding === 'vertical'){
                        core.mybook.style.width = (core.pageWidth * 2)+'px';
                        core.transformRotate = 'rotateY';
                    }else if(params.binding === 'horizontal'){
                        core.mybook.style.height = (core.pageHeight * 2)+'px';
                        core.transformRotate = 'rotateX';
                    }

                    //transforms
                    var tranRot90 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+'(90deg);';
                    var tranRot180 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+'(180deg);';
                    var tranRotNeg90 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+'(-90deg);';
                    var tranRot0 = '\n\t'+alice.prefix+'transform: '+core.transformRotate+'(0deg);';

                    //transform-origins
                    var originL = '\n\t'+alice.prefix+'transform-origin: 1px 1px;';
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

                    var closure = '}\n';

                    //vertical axis
                    if(core.binding === 'vertical' && core.direction === 'left'){
                        var oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg90+closure+'\n'+closure;
                        var oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                        var evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                        var evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRot90+closure+'\n'+closure;
                    }

                    if(core.binding === 'vertical' && core.direction === 'right'){
                        var oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot90+closure+'\n'+closure;
                        var oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                        var evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originL+tranRot0+closure+'\n'+closure;
                        var evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originL+tranRotNeg90+closure+'\n'+closure;
                    }  

                    //horizontal axis
                    if(core.binding === 'horizontal' && core.direction === 'up'){
                        var oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot90+closure+'\n'+closure;
                        var oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                        var evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                        var evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRotNeg90+closure+'\n'+closure;
                    }
                    if(core.binding === 'horizontal' && core.direction === 'down'){
                        var oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRotNeg90+closure+'\n'+closure;
                        var oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                        var evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originL+tranRot0+closure+'\n'+closure;
                        var evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originL+tranRotNeg90+closure+'\n'+closure;
                    }
                    //insert the formulated CSS
                    alice.keyframeInsert(oddPageTurnF);
                    alice.keyframeInsert(oddPageTurnR);
                    alice.keyframeInsert(evenPageTurnF);
                    alice.keyframeInsert(evenPageTurnR);
                },

                init: function(params){

                    // Reset some core variables
                    core.speed = params.speed;
                    core.mybook = document.getElementById(alice.anima);
                    core.timing = params.timing;
                    core.direction = params.direction;

                    core.pageWidth = params.bookWidth;
                    core.pageHeight = params.bookHeight;
                    
                    core.shadowPattern0 = params.shadowPattern0;
                    core.shadowPattern50 = params.shadowPattern50;
                    core.shadowPattern100 = params.shadowPattern100;

                    core.shadowPatternRev50 = params.shadowPatternRev50;
                    core.shadowPatternRev100 = params.shadowPatternRev100;

                    if(params.binding === 'vertical'){
                        core.TransformOrigin = core.pageWidth+'px 1px';
                    }
                    if(params.binding === 'horizontal'){
                        core.TransformOrigin = '1px '+core.pageHeight+'px';
                    } 

                    // input the css into a stylesheet
                    this.cssgen(params);

                    //Acquired traits from params
                    var className = params.pageClassName,
                        bookEffect = alice.masterFx.caterpillar.book,
                        myBookWidth = params.bookWidth,
                        myBookHeight = params.bookHeight,
                        pages = core.mybook.childNodes, //find me some kids!
                        n = 1, // for page numbering

                        evenPageFlip = function(id){
                            var nxtId = id;
                                nxtId = nxtId.substring(1, 8);
                                nxtId = parseInt(nxtId);
                                nxtId = nxtId + 1;

                            var nxtPageId = core.mybook.querySelector('div:nth-child('+nxtId+')').getAttribute('id');

                            var nxtPage = document.getElementById(nxtPageId);
                                nxtPage.style.zIndex = 1;

                                nxtPage.style.display = 'block';
                                nxtPage.style.webkitAnimationName = "evenPageTurnF";
                                nxtPage.style.webkitAnimationDuration = core.speed;
                                nxtPage.style.webkitAnimationFillMode = "forwards";
                                nxtPage.style.webkitAnimationPlayState = "running";
                                nxtPage.style.webkitAnimationDirection = 'normal';
                                nxtPage.style.webkitAnimationTimingFunction = "linear";
                            
                            //console.log('evenPageTurn');
                        },
                        oddPageFlip = function(id){
                            var nxtId = id;
                                nxtId = nxtId.substring(1, 8);
                                nxtId = parseInt(nxtId);                                

                            var prvPageId = core.mybook.querySelector('div:nth-child('+(nxtId - 1)+')').getAttribute('id');

                            var prvPage = document.getElementById(prvPageId);
                                prvPage.style.zIndex = 1;

                                prvPage.style.display = 'block';
                                prvPage.style.webkitAnimationName = "oddPageTurnR";
                                prvPage.style.webkitAnimationDuration = core.speed;
                                prvPage.style.webkitAnimationFillMode = "forwards";
                                prvPage.style.webkitAnimationPlayState = "running";
                                prvPage.style.webkitAnimationDirection = "normal";
                                prvPage.style.webkitAnimationTimingFunction = "linear";
                                
                            //console.log('oddPageTurnR');
                        },
                        resetCSS = function(flipDirection, direction, binding, id){
                            
                            var thisPage = document.getElementById(id);
                            var idNum = id.substring(1, 8);
                            
                            var Angle90 = '(90deg);';
                            var Angle0 = '(0deg);';
                            var AngleNeg90 = '(-90deg);';

                            var basicSettings = 'display: block; left: 0px; top: 0px;';

                            if(core.binding === 'vertical'){
                                if(idNum % 2 === 1 ){
                                    if(flipDirection === 'forward' && core.direction === 'left'){
                                        thisPage.setAttribute('style',
                                            alice.prefix+'transform-origin: 1px 1px;'+
                                            alice.prefix+'transform: '+ core.transformRotate + AngleNeg90 +
                                            alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                                        thisPage.style.top = '0px';
                                        thisPage.style.left = core.pageWidth+'px'; 
                                    }
                                    if(flipDirection === 'reverse' && core.direction === 'left'){
                                        thisPage.setAttribute('style',
                                            basicSettings+
                                            alice.prefix+'transform-origin: 1px 1px;'+
                                            alice.prefix+'box-shadow:'+core.shadowPattern100+';');
                                        thisPage.style.top = '0px';
                                        thisPage.style.left = core.pageWidth+'px'; 
                                    }
                                    if(flipDirection === 'forward' && core.direction === 'right'){
                                        thisPage.setAttribute('style',
                                            alice.prefix+'transform-origin: 600px 1px;'+
                                            alice.prefix+'transform: '+ core.transformRotate + Angle90 +
                                            alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                                    }
                                    if(flipDirection === 'reverse' && core.direction === 'right'){
                                        thisPage.setAttribute('style',
                                            basicSettings+
                                            alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                            alice.prefix+'box-shadow:'+core.shadowPattern100+';');
                                    }
                                }else if(idNum % 2 === 0 ){
                                    if(flipDirection === 'forward' && core.direction === 'left'){
                                        thisPage.setAttribute('style',
                                            basicSettings+
                                            alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                            alice.prefix+'transform: '+core.transformRotate+ Angle0 +
                                            alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                                        if(core.binding === 'vertical'){
                                            this.style.marginLeft = '-'+myBookWidth;
                                        }
                                    }
                                    if(flipDirection === 'reverse' && core.direction === 'left'){
                                        thisPage.setAttribute('style', 
                                            alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                            alice.prefix+'transform: '+core.transformRotate+ Angle90 +
                                            alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');   
                                    }
                                    if(flipDirection === 'forward' && core.direction === 'right'){
                                        thisPage.setAttribute('style', 
                                            basicSettings+
                                            alice.prefix+'transform-origin: 1px 1px;'+
                                            alice.prefix+'transform: '+core.transformRotate+ Angle0 +
                                            alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                                        thisPage.style.top = '0px';
                                        thisPage.style.left = core.pageWidth+'px';     
                                    }
                                    if(flipDirection === 'reverse' && core.direction === 'right'){
                                        thisPage.setAttribute('style',+
                                            alice.prefix+'transform-origin: 1px 1px;'+
                                            alice.prefix+'transform: '+core.transformRotate+ AngleNeg90 +
                                            alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                                        thisPage.style.top = '0px';
                                        thisPage.style.left = core.pageWidth+'px';     
                                    }
                                }
                            }else if(core.binding === 'horizontal'){
                                if(idNum % 2 === 1 ){
                                    if(flipDirection === 'forward' && core.direction === 'down'){
                                        thisPage.setAttribute('style',
                                            alice.prefix+'transform-origin: 1px 1px;'+
                                            alice.prefix+'transform: '+ core.transformRotate + AngleNeg90 +
                                            alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                                        thisPage.style.top = '0px';
                                        
                                    }
                                    if(flipDirection === 'reverse' && core.direction === 'down'){
                                        thisPage.setAttribute('style',
                                            basicSettings+
                                            alice.prefix+'transform-origin: 1px 1px;'+
                                            alice.prefix+'box-shadow:'+core.shadowPattern100+';');
                                        thisPage.style.top = '0px';
                                    }
                                    if(flipDirection === 'forward' && core.direction === 'up'){
                                        thisPage.setAttribute('style',
                                            alice.prefix+'transform-origin: 600px 1px;'+
                                            alice.prefix+'transform: '+ core.transformRotate + Angle90 +
                                            alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                                    }
                                    if(flipDirection === 'reverse' && core.direction === 'up'){
                                        thisPage.setAttribute('style',
                                            basicSettings+
                                            alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                            alice.prefix+'box-shadow:'+core.shadowPattern100+';');
                                    }
                                }else if(idNum % 2 === 0 ){
                                    if(flipDirection === 'forward' && core.direction === 'down'){
                                        thisPage.setAttribute('style',
                                            basicSettings+
                                            alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                            alice.prefix+'transform: '+core.transformRotate+ AngleNeg90 +
                                            alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                                    }
                                    if(flipDirection === 'reverse' && core.direction === 'down'){
                                        thisPage.setAttribute('style', 
                                            alice.prefix+'transform-origin: '+ core.TransformOrigin +';'+
                                            alice.prefix+'transform: '+core.transformRotate+ Angle90 +
                                            alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');   
                                    }
                                    if(flipDirection === 'forward' && core.direction === 'up'){
                                        thisPage.setAttribute('style', 
                                            basicSettings+
                                            alice.prefix+'transform-origin: 1px 1px;'+
                                            alice.prefix+'transform: '+core.transformRotate+ Angle0 +
                                            alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                                        thisPage.style.top = '0px';
                                        thisPage.style.left = core.pageWidth+'px';     
                                    }
                                    if(flipDirection === 'reverse' && core.direction === 'up'){
                                        thisPage.setAttribute('style',+
                                            alice.prefix+'transform-origin: 1px 1px;'+
                                            alice.prefix+'transform: '+core.transformRotate+ AngleNeg90 +
                                            alice.prefix+'box-shadow: '+ bookEffect.shadowPatternRev100 +';');
                                        thisPage.style.top = '0px';
                                        thisPage.style.left = core.pageWidth+'px';     
                                    }
                                }
                            }
                        };

                    for(var p = 0; p < pages.length; p++){
                        if(pages[p].nodeType === 1){
                            core.realPageCount = core.realPageCount+1;
                        }
                    }

                    var pfex = alice.prefixJS; 

                    var NewPageClass = 'book'+ new Date().getTime();
                    var NewClass =  '.'+NewPageClass+
                                    '{display: none; '+
                                    alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';'+
                                    'width: '+core.pageWidth+'px;'+
                                    'height: '+core.pageHeight+'px;'+
                                    'position: absolute;'+
                                    'left: 0px;'+
                                    'top: 0px;'+ 
                                    'overflow: hidden;'+
                                    '}';

                            var altAngleOdd = '(-90deg);';
                            var altAngleEven = '(90deg);';
                            if(core.binding === 'horizontal'){
                                altAngleOdd = '(-90deg);';
                                altAngleEven = '(90deg);';
                            }

                    alice.keyframeInsert(NewClass);

                    for (var i = 0; i < pages.length; i++){
                        if(pages[i].nodeType === 1){
                            pages[i].setAttribute('id', 'p'+n);
                            pages[i].setAttribute('class', className + ' ' +NewPageClass);

                            //Need to make adjustments for the direction of page flips
                            if(core.binding === 'vertical' && core.direction === 'left'){
                                    pages[i].style.top = '0px';
                                    pages[i].style.left = core.pageWidth+'px';
                                }
                            if(core.binding === 'horizontal' && core.direction === 'up'){
                                    pages[i].style.top = core.pageHeight+'px';
                                    pages[i].style.left = '0px';
                                }
                            if(core.binding === 'vertical' && core.direction === 'right'){
                                    pages[i].style.top = '0px';
                                    pages[i].style.left = '0px';
                                }
                            if(core.binding === 'horizontal' && core.direction === 'down'){
                                    pages[i].style.top = '0px';
                                    pages[i].style.left = '0px';
                                }

                            pages[i].setAttribute('onclick', 'alice.masterFx.caterpillar.book.turnPage('+n+')');

                            if(n % 2 === 0){
                                //prep the even numbered elements for the animations
                                if(core.binding === 'vertical' && core.direction === 'left'){
                                    pages[i].setAttribute('style', 'display: none; '+
                                        alice.prefix+'transform-origin: '+ core.TransformOrigin+';'+
                                        alice.prefix+'transform: '+ core.transformRotate + altAngleEven +
                                        alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                                }
                                if(core.binding === 'vertical' && core.direction === 'right'){
                                   pages[i].setAttribute('style', 'display: none; '+
                                        'left: ' +core.pageWidth+ 'px;'+
                                        alice.prefix+'transform-origin: 1px 1px;'+
                                        alice.prefix+'transform: '+ core.transformRotate + altAngleOdd +
                                        alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';'); 
                                }
                                if(core.binding === 'horizontal' && core.direction === 'up'){
                                    pages[i].setAttribute('style', 'display: none; '+
                                        alice.prefix+'transform-origin: '+ core.TransformOrigin+';'+
                                        alice.prefix+'transform: '+ core.transformRotate + altAngleOdd +
                                        alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';');
                                }
                                if(core.binding === 'horizontal' && core.direction === 'down'){
                                   pages[i].setAttribute('style', 'display: none; '+
                                        'top: ' +core.pageHeight+ 'px;'+
                                        alice.prefix+'transform-origin: 1px 1px;'+
                                        alice.prefix+'transform: '+ core.transformRotate + altAngleEven +
                                        alice.prefix+'box-shadow: '+ core.shadowPatternRev100 +';'); 
                                }
                                
                            }

                            // make the first page visible
                            if(n === 1){
                                pages[i].style.display = 'block';
                                pages[i].style[pfex+'BoxShadow'] = core.shadowPattern100+';';
                            }

                            // For odd page events
                            if(n % 2 === 1){
                                pages[i].addEventListener('webkitAnimationEnd', function(){
                                    if(this.style.webkitAnimationName == 'oddPageTurnF'){
                                        //pageId
                                        evenPageFlip(this.getAttribute('id'));
                                        //direction, binding, pageId
                                        resetCSS('forward', core.direction, core.binding, this.getAttribute('id'));
                                    }   
                                    
                                    if(this.style.webkitAnimationName === 'oddPageTurnR'){

                                        resetCSS('reverse', core.direction, core.binding, this.getAttribute('id'));

                                        var nxtId = this.getAttribute('id');
                                        nxtId = nxtId.substring(1, 8);
                                        nxtId = parseInt(nxtId)+2;
                                        
                                        if(nxtId < core.realPageCount){
                                            document.getElementById('p'+nxtId).style.display = 'none';
                                        }
                                    } 
                                }, false);
                            }

                            // for even page events
                            if(n % 2 === 0){
                                pages[i].addEventListener('webkitAnimationEnd', function(){
                                    // for even pages moving forward
                                    if(this.style.webkitAnimationName === 'evenPageTurnF'){
                                        resetCSS('forward', core.direction, core.binding, this.getAttribute('id'));
                                    //console.log(bookEffect.shadowPattern0);
                                    }

                                    // for even pages moving backwards
                                    if(this.style.webkitAnimationName === 'evenPageTurnR'){
                                        this.style.display = 'none';
                                        oddPageFlip(this.getAttribute('id'));
                                        resetCSS('reverse', core.direction, core.binding, this.getAttribute('id'));

                                        var nxtId = this.getAttribute('id');
                                        nxtId = nxtId.substring(1, 8);
                                        nxtId = parseInt(nxtId)+1;

                                        if(nxtId < bookEffect.realPageCount){
                                            document.getElementById('p'+nxtId).style.zIndex = 0;
                                        }
                                    }
                                },false);
                            }
                        
                        n++;
                        
                        }
                    }

                    if(core.startPage !== 'first'){
                        //this.setFirstPage();
                    }

                    return params;
                },

                turnPage: function (pageId){

                    if(this.leftPage < 0){
                        this.leftPage = 0;
                        this.rightPage = 1;
                    }

                    if(this.rightPage > this.realPageCount){
                        this.leftPage = this.realPageCount;
                        this.rightPage = this.realPageCount+1;
                    }

                    if(pageId % 2 === 1){
                        this.leftPage += 1;

                        var nxtPageId = core.mybook.querySelector('div:nth-child('+(pageId + 1)+')').getAttribute('id');

                        var nxtNxtPageId = core.mybook.querySelector('div:nth-child('+(pageId + 2)+')');
                        if(nxtNxtPageId){
                            nxtNxtPageId = nxtNxtPageId.getAttribute('id');
                            var nxtNxtPage = document.getElementById(nxtNxtPageId);
                            nxtNxtPage.style.display = 'block';
                        }
                        
                        var page = document.getElementById('p'+pageId);
                            page.style.zIndex = 1;
                            page.style.webkitAnimationName = "oddPageTurnF";
                            page.style.webkitAnimationDuration = core.speed;
                            page.style.webkitAnimationFillMode = "forwards";
                            page.style.webkitAnimationTimingFunction = core.timing;
                            page.style.webkitAnimationPlayState = "running";
                            page.style.webkitAnimationDirection = 'normal';

                        if(this.rightPage < this.realPageCount+1){
                            this.rightPage += 2;
                            this.leftPage += 1;
                        }
                    }
                    if(pageId % 2 === 0){

                        var prvPageId = core.mybook.querySelector('div:nth-child('+(pageId - 1)+')').getAttribute('id');

                        var prvPrvPageElement = core.mybook.querySelector('div:nth-child('+(pageId - 2)+')');
                        
                        if(prvPrvPageElement){
                            var prvPrvPageId = prvPrvPageElement.getAttribute('id');
                            var prvPrvPage = document.getElementById(prvPrvPageId);
                            prvPrvPage.style.display = 'block';
                        }
                        
                        var page = document.getElementById('p'+pageId);
                            page.style.zIndex = 1;
                            
                            page.style.webkitAnimationName = "evenPageTurnR";
                            page.style.webkitAnimationDuration = core.speed;
                            page.style.webkitAnimationFillMode = "forwards";
                            page.style.webkitAnimationPlayState = "running";
                            page.style.webkitAnimationDirection = "normal";
                            page.style.webkitAnimationTimingFunction = core.timing;

                            page.style.marginLeft = '-'+core.myBookWidth+'px';
                    
                        if(this.leftPage >= 1){
                            this.rightPage -= 2;
                            this.leftPage -= 2;
                        }
                    }
                }
            }

            return core;
        }()),
    
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

        direction: params.direction || 'left'
    };

    console.log(opts);

    alice.masterFx.caterpillar.book.init(opts);
    return opts;
};

//----------------------------------------------------------------------------