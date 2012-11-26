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

alice.plugins.caterpillar = (function () {
    "use strict";

    var core = {
        
        docWidth: function(){ var width = document.body.clientWidth; return width; },   // get the screen width
        docHeight: alice.docHeight(),                                                   // get the screen height
        
        _rot270: '(262deg)',
        _rot180: '(180deg)',
        _rot90: '(90deg)',
        _rot0: '(0deg)',
        _rotNeg90: '(-90deg)',
        _rotNeg180: '(-180deg)',
        _rotNeg270: '(-262deg)',
        originZero: '',             

        onPageTrigger: '',

        helper: {

            getThisId: function(pageId){
            "use strict";
                var page = pageId.substring((pageId.indexOf('_')+1), pageId.length);
                    page = parseInt(page, 10);
                    return page;
            },

            setAnimationDefaults: function(page, mySpeed){
                page.style[alice.prefixJS+'AnimationDuration'] = mySpeed;  
                page.style[alice.prefixJS+'AnimationFillMode'] = "forwards";                                
                page.style[alice.prefixJS+'AnimationPlayState'] = "running";                                
                page.style[alice.prefixJS+'AnimationDirection'] = 'normal';                                 
                page.style[alice.prefixJS+'AnimationTimingFunction'] = "linear";                            
                page.style.display = 'block';
            },

            findCSSRule: function(selector) {
                var numOfSheets, s, mySheet, i, bW, bH, theRules;
                numOfSheets = document.styleSheets.length;
                for(s = 0; s < numOfSheets; s++){
                    mySheet = document.styleSheets[s]; 
                    if (mySheet.rules) {
                        theRules = mySheet.rules;
                    } else {
                        theRules = mySheet.cssRules;
                    }
                    theRules = mySheet.cssRules ? mySheet.cssRules : mySheet.rules;
                    for (i=0; i<theRules.length; i++) { 
                        if (theRules[i].selectorText == selector) { 
                            bW = theRules[i].style.width.toString(); 
                            bH = theRules[i].style.height.toString();
                            return [bW, bH];
                        }
                    }
                }
            }, 

            piggyback: function(id, type, pageName, book, speed, transformOrigin, binding, transformRotate, realPageCount, piggyBg){
            "use strict";
                if(id === 0){
                    id = realPageCount;
                }
                var mybook = document.getElementById(book),
                    myPageStyle = document.getElementById(pageName+id).style,
                    aniName = (type === "standard") ? pageName+"abstrPageTurnF" : pageName+"abstrPageReTurnF",
                    numZ = "0",
                    piggy = document.createElement('div'); 
                    
                    piggy.setAttribute("style", myPageStyle);
                    piggy.setAttribute('id', '_piggy');  
                    piggy.setAttribute('class', document.getElementById(pageName+id).getAttribute('class'));
                    piggy.style[alice.prefix+'backfaceVisibility'] = 'visible';
                    piggy.style.width = mybook.style.width;
                    piggy.style.height = mybook.style.height;
                    piggy.style.position = 'absolute';
                    piggy.style.background = piggyBg || '#222';
                    piggy.style.top = '0px';
                    piggy.style.left = '0px';
                    if(type === "advanced"){
                        var rotAngle;
                        rotAngle = core._rot270;
                        switch (binding){
                            case "left":
                                rotAngle = core._rotNeg270;
                                break;
                            case "bottom":
                                rotAngle = core._rotNeg270;
                                break;
                        }
                        piggy.style[alice.prefixJS+'Transform'] = transformRotate+rotAngle;
                    }
                    piggy.style.zIndex = numZ;
                    piggy.style[alice.prefixJS+'AnimationName'] = aniName;
                    piggy.style[alice.prefixJS+'TransformOrigin'] = transformOrigin;
                    piggy.style[alice.prefixJS+'AnimationDuration'] = speed;
                    piggy.style[alice.prefixJS+'AnimationFillMode'] = "forwards"; 
                    piggy.style[alice.prefixJS+'AnimationPlayState'] = "running";
                    piggy.style[alice.prefixJS+'AnimationDirection'] = 'normal';
                    piggy.style[alice.prefixJS+'AnimationTimingFunction'] = "linear";
                    piggy.style.display = 'block';
                    mybook.appendChild(piggy);
            }
        },

        AnimGenerator: function(params){
            var abstrPageReTurnR, abstrPageReTurnF, abstrPageTurnR, abstrPageTurnF, 
                oddPageTurnF, oddPageTurnR, evenPageTurnF, evenPageTurnR;
            var tranRot90, tranRot270, tranRotNeg270, tranRotNeg90, tranRot0, 
                originL, originM, originR, 
                Szero, Sfifty, Shundred, SfiftyRev, ShundredRev, 
                oddPageF, oddPageR, evenPageF, evenPageR, 
                abstrPageF, abstrPageR, abstrPageReF, abstrPageReR,
                closure;

            // transforms
            tranRot90 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rot90+';';
            tranRot270 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rot270+';';
            tranRotNeg270 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rotNeg270+';';
            tranRotNeg90 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rotNeg90+';';
            tranRot0 = '\n\t'+alice.prefix+'transform: '+params.transformRotate+core._rot0+';';

            //transform-origins
            originL = '\n\t'+alice.prefix+'transform-origin: '+params.originZero+';';
            originM = '\n\t'+alice.prefix+'transform-origin: 50% 50%;';
            originR = '\n\t'+alice.prefix+'transform-origin: '+params.transformOrigin+';';

            //Shadows
            Szero = '\t0%{'+alice.prefix+'box-shadow:'+params.shadowPattern0+';';
            Sfifty = '\t50%{'+alice.prefix+'box-shadow:'+params.shadowPattern50+';';
            Shundred = '\t100%{'+alice.prefix+'box-shadow:'+params.shadowPattern100+';';
            SfiftyRev = '50%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev50+';'+'\n';
            ShundredRev = '100%{'+alice.prefix+'box-shadow:'+params.shadowPatternRev100+';'+'\n';

            //Keyframe titles
            oddPageF = '@'+alice.prefix+'keyframes '+params.bookName+'p_oddPageTurnF{\n';
            oddPageR = '@'+alice.prefix+'keyframes '+params.bookName+'p_oddPageTurnR{\n';
            evenPageF = '@'+alice.prefix+'keyframes '+params.bookName+'p_evenPageTurnF{\n';
            evenPageR = '@'+alice.prefix+'keyframes '+params.bookName+'p_evenPageTurnR{\n';
            abstrPageF = '@'+alice.prefix+'keyframes '+params.bookName+'p_abstrPageTurnF{\n';
            abstrPageR = '@'+alice.prefix+'keyframes '+params.bookName+'p_abstrPageTurnR{\n';
            abstrPageReF = '@'+alice.prefix+'keyframes '+params.bookName+'p_abstrPageReTurnF{\n';
            abstrPageReR = '@'+alice.prefix+'keyframes '+params.bookName+'p_abstrPageReTurnR{\n';

            closure = '}\n';

            // For single paging
            if(params.paging === 'single'){
                if(params.binding === 'left'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(params.binding === 'right'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                if(params.binding === 'top'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                }
                if(params.binding === 'bottom'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRotNeg270+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                }
                // Abstract bindings
                if(params.binding === 'center'){
                    abstrPageTurnF = abstrPageF+Szero+closure+Sfifty+closure+Shundred+originM+tranRotNeg90+closure+'\n'+closure;
                    abstrPageTurnR = abstrPageR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                    abstrPageReTurnF = abstrPageReF+Szero+closure+Sfifty+closure+Shundred+originM+tranRot90+closure+'\n'+closure;
                    abstrPageReTurnR = abstrPageReR+Szero+closure+Sfifty+closure+Shundred+originM+tranRot0+closure+'\n'+closure;
                }
                if(params.binding === 'middle'){
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

            if(params.paging === 'double'){
                //vertical axis
                if(params.binding === 'left'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRotNeg90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRot90+closure+'\n'+closure;
                }
                if(params.binding === 'right'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originR+tranRot90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originL+tranRotNeg90+closure+'\n'+closure;
                }
                //horizontal axis
                if(params.binding === 'top'){
                    oddPageTurnF = oddPageF+Szero+closure+Sfifty+closure+Shundred+originL+tranRot90+closure+'\n'+closure;
                    oddPageTurnR = oddPageR+Szero+closure+Sfifty+closure+Shundred+originL+tranRot0+closure+'\n'+closure;
                    evenPageTurnF = evenPageF+SfiftyRev+closure+ShundredRev+originR+tranRot0+closure+'\n'+closure;
                    evenPageTurnR = evenPageR+SfiftyRev+closure+ShundredRev+originR+tranRotNeg90+closure+'\n'+closure;
                }
                if(params.binding === 'bottom'){
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

        clearSinglePages: function (id, dir, pageName, mybook, params, doNotHide) { 
            var nextpage, prepage, piggyPapa,
                idNum = core.helper.getThisId(id),
                page = document.getElementById(id);

            if(document.getElementById("_piggy")){
                piggyPapa = document.getElementById("_piggy").parentNode;
                piggyPapa.removeChild(document.getElementById("_piggy"));
                document.getElementById(params.bookName).setAttribute("data-state", "paused");
            }

            // Simple blanks for replacing
            page.style[alice.prefixJS + "Animation"] = '';
            page.style[alice.prefixJS + "AnimationDelay"] = "";
            page.style[alice.prefixJS + "AnimationDuration"] = "";
            page.style[alice.prefixJS + "AnimationTimingFunction"] = "";
            page.style[alice.prefixJS + "AnimationIterationCount"] = "";
            page.style[alice.prefixJS + "AnimationDirection"] = "";
            page.style[alice.prefixJS + "AnimationPlayState"] = "";

            // determine page display
            if(params.binding === 'center' || params.binding === 'middle'){
                if(!doNotHide){ page.style.display = 'none'; }
            }else if(params.binding === 'left' || params.binding === 'top' || params.binding === 'right' || params.binding === 'bottom'){
                page.style.display = 'none';
            }

            // First by default
            prepage = document.getElementById(pageName+(parseInt(idNum, 10)-1));
            nextpage = document.getElementById(pageName+(parseInt(idNum, 10)+1));
            if(idNum === params.realPageCount){ 
                nextpage = document.getElementById(pageName+'1'); 
            }
            page.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[0];
            page.style.zIndex = '0';
            
            if(dir === 'forwards'){
                 if(idNum === 1 ){
                    prepage = document.getElementById(pageName+params.realPageCount);
                }
                else if(idNum > 1){
                    if(params.binding === 'left' || params.binding === 'right' || params.binding === 'top' || params.binding === 'bottom'){     
                        nextpage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[0];
                    }
                }
                prepage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[1];
            }
            if(dir === 'reverse'){
                if(idNum > 0){ 
                    if(params.binding === "center" || params.binding === "middle"){   
                        if(params.wrap === true){
                            if(idNum === 1 ){
                                prepage = document.getElementById(pageName+params.realPageCount);
                            }else{
                                prepage = document.getElementById(pageName+(idNum-1));
                            }
                        }else{
                            if(idNum !== 1){
                                prepage = document.getElementById(pageName+(idNum-1)); 
                            }
                        }  
                        prepage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[2];
                    }
                    if(params.wrap === true){
                        if(idNum !== params.realPageCount){
                            nextpage = document.getElementById(pageName+(parseInt(idNum, 10)+1));
                        }
                    }
                    if(params.binding === 'left' || params.binding === 'top' || params.binding === 'right' || params.binding === 'bottom'){
                        nextpage.style.display = 'none';
                        page.style.display = 'block';
                    }

                    nextpage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[2]; 
                }

                if(idNum === 1){
                    prepage = document.getElementById(params.pageName+params.realPageCount);                                                
                    prepage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[2]; 
                    nextpage.style[alice.prefixJS+"Transform"] = params.transformRotate+params.transformDegrees[1];  
                }
            } 
        },

        clearDoublePages: function(flipDirection, binding, id, params){
            var flipAngleOdd, flipAngleEven,
                thisPage = document.getElementById(id),
                idNum = core.helper.getThisId(id),
                nextPage = document.getElementById(params.pageName+(parseInt(idNum, 10)+1)),
                basicSettings = 'display: block; left: 0px; top: 0px;'; 

            if(idNum % 2 === 1 ){                                           
                thisPage.setAttribute('style', '');                                                                     
                if(flipDirection === 'forward'){
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;                                                                       
                    flipAngleOdd = params.transformRotate + core._rot90;
                    switch(params.binding){           
                        case "top":                                                                                     
                            thisPage.style.top = params.pageHeight+'px';                                                  
                            break;
                        case "right":  
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin; 
                            break;
                        case "left":
                            flipAngleOdd = params.transformRotate + core._rotNeg90;
                            thisPage.style.left = params.pageWidth+'px';
                            break;
                        case "bottom":
                            flipAngleOdd = params.transformRotate + core._rotNeg90;
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = flipAngleOdd;
                }
                else if(flipDirection === 'reverse'){
                    thisPage.setAttribute('style', basicSettings);
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;
                    switch(params.binding){
                        case "top":
                            thisPage.style.top = params.pageHeight+'px'; 
                            break;
                        case "right":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin; 
                            break;
                        case "left":
                            thisPage.style.left = params.pageWidth+'px';
                            break;
                        case "bottom":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin; 
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
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;                                                                    
                    switch(params.binding){           
                        case "top":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin;                                                                                     
                            break;
                        case "right":                                                                                    
                            thisPage.style.left = params.pageWidth+'px';
                            break;
                        case "left":   
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin;   
                            thisPage.style.left = '0px';
                            break;
                        case "bottom":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;
                            thisPage.style.top = params.pageHeight+'px'; 
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = core.transformRotate + core._rot0;
                }
                else if(flipDirection === 'reverse'){
                    thisPage.style[alice.prefixJS+"TransformOrigin"] = params.originZero;
                    flipAngleEven = core.transformRotate + core._rotNeg90;
                    switch(params.binding){
                        case "top":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin;
                            break;
                        case "right": 
                            thisPage.style.left = params.pageWidth+'px';  
                            break;
                        case "bottom":
                            flipAngleEven = params.transformRotate + core._rot90; 
                            thisPage.style.top = params.pageHeight+'px';  
                            break;
                        case "left":
                            thisPage.style[alice.prefixJS+"TransformOrigin"] = params.transformOrigin;
                            flipAngleEven = params.transformRotate + core._rot90;   
                            break;
                    }
                    thisPage.style[alice.prefixJS+'Transform'] = flipAngleEven;  
                }                                       
            }
            thisPage.style[alice.prefixJS+"boxShadow"] = params.shadowPattern0;
        },

        styleConfig: function(params){
            var page = document.getElementById(params.pageName+params.pageId);
            if(params.paging === 'single'){
                if(params.binding === 'center' || params.binding === 'middle'){
                    page.setAttribute('style', 'display: none; '+
                        alice.prefix+'transform-origin: 50% 50%;'+
                        alice.prefix+'transform: '+ params.transformRotate + core._rot90 +';'+
                        alice.prefix+'box-shadow: '+ params.shadowPattern100 +';');
                }
                if(params.binding === 'left' || params.binding === 'top' || params.binding === 'bottom' || params.binding === 'right'){
                    page.setAttribute('style', 'display: none; '+ 
                        alice.prefix+'transform-origin:'+params.transformOrigin+';'+
                        alice.prefix+'transform: '+ params.transformRotate + core._rot0 +';'+
                        alice.prefix+'box-shadow: '+ params.shadowPattern100 +';');
                }
            }
            if(params.paging === 'double'){
                if(params.binding === 'left'){
                    if(params.pageId % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.originZero;
                        page.style.left = params.pageWidth+'px';
                    }
                    if(params.pageId % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.transformOrigin;
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot90;
                    }
                }
                if(params.binding === 'right'){
                    if(params.pageId % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.transformOrigin;
                    }
                    if(params.pageId % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.originZero;
                        page.style.left = params.pageWidth+'px';
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg90;
                    }
                }
                if(params.binding === 'top'){
                    if(params.pageId % 2 === 1){
                        page.style.top = params.pageHeight+'px';
                        page.style[alice.prefixJS+'TransformOrigin'] = params.originZero;
                    }
                    if(params.pageId % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.transformOrigin;
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg90;
                    }
                }
                if(params.binding === 'bottom'){
                    if(params.pageId % 2 === 1){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.transformOrigin;
                    }
                    if(params.pageId % 2 === 0){
                        page.style[alice.prefixJS+'TransformOrigin'] = params.originZero;
                        page.style.top = params.pageHeight+'px';
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot90;
                    }
                }
            }
        },

        init: function(params){
            var config = {}, bWidth, bHeight, symW, pw, bw, symH, ph, bh, rawPages, rpn, p, leatherCover;

            // Book details 
            config.pages = [];
            config.realPageCount = 0;
            config.speed = alice.duration(params.speed);                                // page turn duration
            config.book = document.getElementById(params.elems);                        // the book
            config.bookName = config.book.id;
            config.timing = core.timing;                                                // the timing of the animation (always linear)
            config.binding = params.binding;                                            // the location of what would be the binding
            config.piggyBg = params.piggyBg;                                            // the background of a single page turn 
            config.originZero = '0 0';                                                  // The default transform origin think top left
            config.pageClass = params.pageClass;                                        // Potential page class the author wants to add
            config.pageName = params.elems+'p_';
            config.paging = params.paging;
            config.randomize = params.randomize;
            config.wrap = params.wrap;
            config.shadow = params.shadow;

            // Configure the book itself
            config.book.setAttribute('data-state', 'paused');
            config.book.setAttribute('data-page-number', "1");
            config.bookSize = core.helper.findCSSRule("#"+config.book.getAttribute('id'));
            if(config.bookSize){
                bWidth = config.bookSize[0];
                bHeight = config.bookSize[1];
            }else{
                bWidth = config.book.style.width;
                bHeight = config.book.style.height;
            }

            if(bWidth.indexOf("%") > 0){                                    // redefine the page width in case of px|%|int 
                symW = "%";
                pw = '0.'+bWidth.substring(0, bWidth.indexOf(symW));
                pw = parseFloat(pw);
                bw = config.docWidth()*pw;
            }
            else if(bWidth.indexOf("px") > 0){
                symW = "px";
                bw = bWidth.substring(0, bWidth.indexOf(symW));
            }
            else{   
                bw = bWidth;
            }
            config.pageWidth = bw; 
            
            if(bHeight.indexOf("%") > 0){                                   // redefine the height in case of px|%|int
                symH = "%";
                ph = '0.'+bHeight.substring(0, bHeight.indexOf(symH));
                ph = parseFloat(ph);
                bh = config.docHeight*ph;
            }
            else if(bHeight.indexOf("px") > 0){ 
                symH = "px";
                bh = bHeight.substring(0, bHeight.indexOf(symH));
            }
            else{
                bh = bHeight;
            }
            config.pageHeight = bh;

            // Configure the perspective depth [ there was no science used in the formulating of this. ]
            config.goggles = Math.floor(config.pageWidth*4);
            
            //Set the shadows
            if(config.shadow === true){
                config.shadowPattern0 = '0px 0px 14px rgba(0, 0, 0, 0.1)';
                config.shadowPattern50 = '10px 0px 14px rgba(0, 0, 0, 0.3)';
                config.shadowPattern100 = '0px 0px 14px rgba(0, 0, 0, 0.3)';
                config.shadowPatternRev50 = '-10px 0px 14px rgba(0, 0, 0, 0.3)';
                config.shadowPatternRev100 = '0px 0px 14px rgba(0, 0, 0, 0.1)';
                if(config.binding === "center" || config.binding === "middle"){
                    config.shadowPattern50 = '0px 0px 14px rgba(0, 0, 0, 0.3)';
                }
            }else{
                config.shadowPattern0 = '0px 0px 0px rgba(0, 0, 0, 0)';
                config.shadowPattern50 = '0px 0px 0px rgba(0, 0, 0, 0)';
                config.shadowPattern100 = '0px 0px 0px rgba(0, 0, 0, 0)';
                config.shadowPatternRev50 = '0px 0px 0px rgba(0, 0, 0, 0)';
                config.shadowPatternRev100 = '0px 0px 0px rgba(0, 0, 0, 0)';
            }

            // create a new class
            config.NewPageClass = params.elems+ new Date().getTime();

            // Configure animation parts for silly Mozilla
            core.animationEnd = alice.prefixJS+'AnimationEnd';
            if(alice.prefixJS === 'Moz'){                         
                core.animationEnd = 'animationend';                
            }

            // Set the array of pages for the book
            rawPages = config.book.childNodes;  
            rpn = 0;  
            for(p = 0; p < rawPages.length; p++){
                if(rawPages[p].nodeType === 1){ 
                    if(rawPages[p].tagName === "DIV" || rawPages[p].tagName === "div"){                         
                        config.pages[rpn] = rawPages[p]; 
                        config.realPageCount = config.realPageCount+1; 
                        rpn++;   
                    }
                    else{
                        console.error("Your pages must be all be the DIV tag element. Please place the contents inside.");  
                        return false;  
                    }
                }
            }

            // Fashion me a book!
            config.book.style[alice.prefixJS+'Perspective'] = config.goggles+'px'; 
            config.book.style.zIndex = '1000';    
            config.book.style.position = 'relative';  
            config.binding = params.binding;   

            // set the transform axis
            if(params.binding === 'center' || params.binding === 'left' || params.binding === 'right'){         // For the Y axis
                config.transformRotate = 'rotateY';                                   
            }
            if(params.binding === 'middle' || params.binding === 'top' || params.binding === 'bottom'){         // For the X axis
                config.transformRotate = 'rotateX';
            }

            // If single paging we need a small book
            if(params.paging === 'single'){
                config.book.style.width = config.pageWidth+'px';  
                config.book.style.height = config.pageHeight+'px'; 
            }

            //If double paging we need a big book
            else if(params.paging === 'double'){
                if(params.binding === 'left' || params.binding === 'right'){        // wide book with normal height
                    config.book.style.width = (config.pageWidth * 2)+'px';              // set width
                    config.book.style.height = config.pageHeight+'px';                  // set height
                }
                else if(params.binding === 'top' || params.binding === 'bottom'){   // tall book with normal width
                    config.book.style.width = config.pageWidth+'px';                    // set width
                    config.book.style.height = (config.pageHeight * 2)+'px';            // set height
                }
            }  

            // Set the details per binding
            if(params.paging === 'single'){
                config.transformDegrees = [core._rot0, core._rot0, core._rot0]; //0, 0, 0
                switch(params.binding){
                    case "center":
                        config.transformDegrees = [core._rot0, core._rot90, core._rotNeg90]; //0, 90, -90
                        config.transformOrigin = '50% 50%';
                        break;
                    case "middle":
                        config.transformDegrees = [core._rot0, core._rot90, core._rotNeg90]; //0, 90, -90
                        config.transformOrigin = '50% 50%';
                        break;
                    case "left":
                        config.transformOrigin = config.originZero;
                        break;
                    case "top":
                        config.transformOrigin = config.originZero;
                        break;
                    case "right":
                        config.transformOrigin = config.pageWidth+'px 0px';
                        break;
                    case "bottom":
                        config.transformDegrees = [core._rot0, core._rot0, core._rotNeg270]; //0, 0, 0
                        config.transformOrigin = '0px '+pageHeight+'px';
                        break;
                }
            }

            if(config.paging === 'double'){
                switch(params.binding){
                    case "left":
                        config.transformOrigin = config.pageWidth+'px 0px';
                        break;
                    case "right":
                        config.transformOrigin = config.pageWidth+'px 0px';
                        break;
                    case "top":
                        config.transformOrigin = '0px '+config.pageHeight+'px';
                        break;
                    case "bottom":
                        config.transformOrigin = '0px '+config.pageHeight+'px';
                        break;
                }
                config.transformDegrees = [core._rot0, core._rot0]; //0, 0, 0
            }

            config.pageClass = config.pageClass;

            core.onPageTrigger = document.createEvent("Event");
            core.onPageTrigger.initEvent("onPageTrigger", true, true);

            core.AnimGenerator(config);  
            core.pageBuilder(config);

            leatherCover = {
                bookName: config.book.id,
                realPageCount: config.realPageCount,
                book: document.getElementById(config.bookName),
                pageNumber: (function(){ return parseInt(document.getElementById(config.bookName).getAttribute('data-page-number'), 10) }),
                nxtPage: function(){
                    var pageNum, dets, runState;
                    pageNum = this.pageNumber();

                    if(config.paging === "single"){
                        if(pageNum < 1){
                            pageNum = 1;
                        }
                    }
                    if(config.paging === "double"){
                        if(pageNum === 0){
                            document.getElementById(config.bookName).setAttribute('data-page-number', "1");
                            pageNum = this.pageNumber();
                        }
                        if(pageNum % 2 !== 1){
                            pageNum++;
                        }
                    }

                    dets = {    
                        pageId: pageNum,
                        pageName: config.pageName, 
                        bookName: config.bookName, 
                        binding: config.binding, 
                        wrap: config.wrap, 
                        speed: config.speed, 
                        randomizer: config.randomize, 
                        transformOrigin: config.transformOrigin, 
                        paging: config.paging, 
                        realPageCount: config.realPageCount,
                        piggyBg: config.piggyBg
                    };

                    runState = document.getElementById(config.bookName).getAttribute('data-state');

                    if(config.paging === "single"){
                        if(config.binding !== "center" && config.binding !== "middle"){    
                            if(pageNum === config.realPageCount && config.wrap === true){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurn(dets); 
                                    document.getElementById(config.bookName).setAttribute('data-page-number', "1");
                                }    
                            }
                            else if(pageNum < config.realPageCount){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurn(dets);
                                    document.getElementById(config.bookName).setAttribute('data-page-number', (pageNum+1)); 
                                }  
                            } 
                        }else{    
                            if(pageNum === config.realPageCount && config.wrap === true){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurn(dets); 
                                    document.getElementById(config.bookName).setAttribute('data-page-number', "1"); 
                                }
                            }
                            else if(pageNum < config.realPageCount){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurn(dets); 
                                    document.getElementById(config.bookName).setAttribute('data-page-number', (pageNum+1));
                                } 
                            }
                        }
                    }else{
                        if( document.getElementById(config.bookName).getAttribute('data-page-number') < config.realPageCount ){
                            if(runState === "paused"){ 
                                alice.plugins.caterpillar.turnPage(dets); 
                                document.getElementById(config.bookName).setAttribute('data-page-number', (pageNum+2)); 
                            }
                        } 
                        if( document.getElementById(config.bookName).getAttribute('data-page-number') >= config.realPageCount ){
                            document.getElementById(config.bookName).setAttribute('data-page-number', config.realPageCount);    
                        }
                    }
                    document.getElementById(config.bookName).dispatchEvent(core.onPageTrigger);
                },
                prePage: function(){
                    var pageNum, dets, runState;

                    if(config.paging === "single"){
                        pageNum = (this.pageNumber()-1);
                    }else{
                        pageNum = this.pageNumber();
                    }

                    if(config.paging === "double"){
                        if(pageNum % 2 !== 0 ){
                            pageNum--;
                        }
                    }

                    dets = {    
                        pageId: pageNum,
                        pageName: config.pageName, 
                        bookName: config.bookName, 
                        binding: config.binding, 
                        wrap: config.wrap, 
                        speed: config.speed, 
                        randomizer: config.randomize, 
                        transformOrigin: config.transformOrigin, 
                        paging: config.paging, 
                        realPageCount: config.realPageCount,
                        transformRotate: config.transformRotate,
                        originZero: config.originZero
                    };

                    runState = document.getElementById(config.bookName).getAttribute('data-state');

                    if(config.paging === "single"){
                        if(config.binding !== "center" && config.binding !== "middle"){
                            if(config.wrap === true){
                                if(pageNum === 0){
                                    if(runState === "paused"){     
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', config.realPageCount); 
                                    }
                                }else{
                                    if(runState === "paused"){     
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', pageNum); 
                                    } 
                                }
                            }else{
                                if(pageNum === 1){
                                    if(runState === "paused"){     
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', 1);
                                    }
                                }else{    
                                    if(runState === "paused"){   
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', pageNum); 
                                    } 
                                }
                            }
                        }else{
                            if(pageNum === 0 && config.wrap === true){
                                if(runState === "paused"){ 
                                    alice.plugins.caterpillar.abPageTurnR(dets);
                                    document.getElementById(config.bookName).setAttribute('data-page-number', config.realPageCount); 
                                }
                            }else{
                                if(pageNum > 1){
                                    if(runState === "paused"){ 
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', pageNum); 
                                    }
                                }else{
                                    if(runState === "paused"){ 
                                        alice.plugins.caterpillar.abPageTurnR(dets);
                                        document.getElementById(config.bookName).setAttribute('data-page-number', 1); 
                                    }
                                }
                            }
                        }
                    }else{
                        if(pageNum !== 0){
                            if(runState === "paused"){ 
                                alice.plugins.caterpillar.turnPage(dets); 
                                document.getElementById(config.bookName).setAttribute('data-page-number', (pageNum-=2));
                                if(pageNum === 0){
                                    document.getElementById(config.bookName).setAttribute('data-page-number', "1");    
                                } 
                            }   
                        }else{
                            document.getElementById(config.bookName).setAttribute('data-page-number', "1");
                        }
                    }
                    document.getElementById(config.bookName).dispatchEvent(core.onPageTrigger);
                },
                appendPages: function(divId){
                    var realBook = document.getElementById(config.bookName),
                        realBookPages = config.realPageCount,
                        paging = config.paging,
                        realPageOne = document.getElementById(config.bookName+"p_1"),
                        realPageTwo = document.getElementById(config.bookName+"p_2"),
                        xPages = document.getElementById(divId).childNodes,
                        _rpn = (config.realPageCount+1),
                        _newPageArray = [];

                    
                    for(var p = 0; p < xPages.length; p++){
                        if(xPages[p].nodeType === 1){ 
                            if(xPages[p].tagName === "DIV" || xPages[p].tagName === "div"){ 

                                // Odd Pages
                                if(_rpn % 2 === 1){
                                    var pageToCopy = (paging === "single")? realPageTwo : realPageOne;
                                    xPages[p].setAttribute("style", pageToCopy.getAttribute("style"));
                                }
                                //Even Pages
                                if(_rpn % 2 === 0){
                                    xPages[p].setAttribute("style", realPageTwo.getAttribute("style"));
                                }

                                xPages[p].style.display = "none";
                                xPages[p].setAttribute("class", realPageOne.getAttribute("class"));
                                xPages[p].setAttribute("id", config.pageName+_rpn);

                                core.eventListenerFunc(_rpn, config);

                                realBook.appendChild(xPages[p]);
                                 
                                config.realPageCount = config.realPageCount+1;   
                                _rpn++;                                                                                       
                            }
                        }
                    }
                }
            }
            return leatherCover;
        },

        eventListenerFunc: function(idNum, params){
            var page = document.getElementById(params.pageName+idNum);

            page.addEventListener(core.animationEnd, function(){

                // Single Paged
                if(params.paging === "single"){
                    var pageId = params.pageName+idNum;

                    if(this.style[alice.prefixJS+'AnimationName'] === params.pageName+'abstrPageTurnF'){
                        if(params.binding === 'center' || params.binding === 'middle'){
                            alice.plugins.caterpillar.abstrPageFlip(pageId, 'forwards', params.bookName, params);
                        }
                        core.clearSinglePages(pageId, 'forwards', params.pageName, params.bookName, params);
                    }
                    if(this.style[alice.prefixJS+'AnimationName'] === params.pageName+'abstrPageReTurnF'){ 
                        if(params.binding === 'center' || params.binding === 'middle'){
                            alice.plugins.caterpillar.abstrPageFlip(pageId, 'reverse', params.bookName, params);
                        }
                        core.clearSinglePages(pageId, 'reverse', params.pageName, params.bookName, params);
                    }
                }

                // Double Paged
                if(params.paging === "double"){
                    
                    if(this.style[alice.prefixJS+'AnimationName'] === params.bookName+'p_oddPageTurnF'){
                        core.turnNextPage(this.getAttribute('id'), 'odd', params.bookName, params);
                        core.clearDoublePages('forward', params.binding, this.getAttribute('id'), params);
                    }   
                    
                    if(this.style[alice.prefixJS+'AnimationName'] === params.bookName+'p_oddPageTurnR'){
                        core.clearDoublePages('reverse', core.binding, this.getAttribute('id'), params);
                        document.getElementById(params.bookName).setAttribute("data-state", "paused");  

                        var nxtId = core.helper.getThisId(this.getAttribute('id'));
                        nxtId = parseInt(nxtId, 10)+2;
                        if(nxtId < params.realPageCount+1){
                            document.getElementById(params.pageName+nxtId).style.display = 'none';    
                        }
                    } 
                    
                    if(this.style[alice.prefixJS+'AnimationName'] === params.bookName+'p_evenPageTurnF'){   
                        core.clearDoublePages('forward', params.binding, this.getAttribute('id'), params);
                        document.getElementById(params.bookName).setAttribute("data-state", "paused");    
                    }
                    
                    if(this.style[alice.prefixJS+'AnimationName'] === params.bookName+'p_evenPageTurnR'){    
                        core.turnNextPage(this.getAttribute('id'), 'even', params.bookName, params);
                        core.clearDoublePages('reverse', params.binding, this.getAttribute('id'), params);
                    }
                }

            }, false);
        },

        pageBuilder: function(params){
            var pageClassName = params.pages[0].getAttribute('class');
            var currentPageClass = pageClassName + ' ' + params.pageClass;
            
            var bookClass = '.'+params.NewPageClass+
                            '{ display: none; '+
                            alice.prefix+'box-shadow: '+ params.shadowPattern100 +';'+
                            alice.prefix+'backface-visibility: hidden;' +
                            'width: '+params.pageWidth+"px;"+
                            'height: '+params.pageHeight+"px;"+
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
            
            var f = 1, pageId, b;
            for(b = 0; b < params.pages.length; b++){
                params.pages[b].setAttribute('id', params.pageName+f);
                params.pages[b].setAttribute('class', currentPageClass + ' ' +params.NewPageClass);

                core.eventListenerFunc(f, params);
                
                core.styleConfig({ 
                        pageId: f, 
                        pageName: params.pageName, 
                        binding: params.binding, 
                        paging: params.paging, 
                        bookName: params.bookName,
                        pageWidth: params.pageWidth,
                        pageHeight: params.pageHeight, 
                        speed: params.speed, 
                        randomizer: params.randomize, 
                        transformOrigin: params.transformOrigin,
                        transformRotate: params.transformRotate,
                        originZero: params.originZero
                    });     


                if(params.paging === 'single'){ 
                    if(f === 1){
                        params.pages[b].style.display = 'block';
                        params.pages[b].setAttribute('style', 'display: block; z-index: 1;'+
                        alice.prefix+'transform-origin:'+params.transformOrigin+';'+
                        alice.prefix+'transform: '+ params.transformRotate + core._rot0 +';' +
                        alice.prefix+'box-shadow: '+ params.shadowPatternRev100 +';');
                    }
                }else if(params.paging === "double"){
                    if(f === 1){ 
                        params.pages[b].style.display = 'block';
                        params.pages[b].style[alice.prefixJS+'BoxShadow'] = params.shadowPattern100+';';
                    } 
                }

            f++;
            
            }

            return core;
        },

        abstrPageFlip: function(id, dir, bookName, params){    
            var idNum, ani, pageId, page, mySpeed;
            if(dir === 'forwards'){
                idNum = core.helper.getThisId(id)+1;
                ani = bookName+"p_abstrPageTurnR";
                
                if(idNum === params.realPageCount+1){   
                    idNum = 1; 
                }
            }                                                         
            else if(dir === 'reverse'){
                ani = bookName+"p_abstrPageReTurnR";
                idNum = core.helper.getThisId(id)-1;          
            }
            if(params.binding === "center" || params.binding === "middle"){
                if(idNum === 0){
                    idNum = params.realPageCount;
                }
            }

            pageId = params.book.querySelector('div:nth-child('+idNum+')').getAttribute('id');
            page = document.getElementById(pageId); 
            page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg90;

            core.styleConfig({ 
                pageId: idNum, 
                pageName: params.pageName, 
                binding: params.binding, 
                paging: params.paging, 
                bookName: params.bookName, 
                wrap: params.wrap, 
                animationRunning: true, 
                speed: params.speed, 
                randomizer: params.randomize , 
                transformOrigin: params.transformOrigin,
                transformRotate: params.transformRotate
            });   
                                                        
            page.style[alice.prefixJS+'AnimationName'] = ani; 
            mySpeed = alice.randomize(alice.duration(params.speed), params.randomize)+'ms';   
            core.helper.setAnimationDefaults(page, mySpeed);

            page.addEventListener(core.animationEnd, function(){  
                if(page.style[alice.prefixJS+'AnimationName'] === ani){  
                    core.clearSinglePages(pageId, dir, params.pageName, params.bookName, params, "doNotHide");
                    document.getElementById(params.bookName).setAttribute("data-state", "paused");
                }
            }, false);
        },

        abPageTurn: function (params){
            var dataPageNum, page, nxtPageId, nxtPage, mySpeed;
            dataPageNum = (params.pageId >= params.realPageCount)? 1 : (params.pageId+1);
            
            if(document.getElementById(params.bookName).getAttribute("data-state") === "paused"){
                
                if(params.pageId === 0 && params.wrap === true){
                    if(params.binding === 'center' || params.binding === 'middle'){
                        pageId = params.realPageCount;
                    }
                }

                page = document.getElementById(params.pageName+params.pageId), nxtPageId, nxtPage;

                try{
                    if(params.pageId >= params.realPageCount && params.wrap === true){
                        params.pageId = 0;
                    }
                    nxtPage = document.getElementById(params.bookName+"p_"+(params.pageId+1));
                    nxtPage.style.display = 'block'; 
                    if(params.binding === 'center' || params.binding === 'middle'){
                        nxtPage.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot90;   
                    }
                }catch(err){ 
                    if(params.wrap !== true){   
                        console.log("This is the end of the book!");
                        return false;  
                    }
                }

                page.style.zIndex = '100';
                page.style[alice.prefixJS+'AnimationName'] = params.pageName+"abstrPageTurnF";
                document.getElementById(params.bookName).setAttribute("data-state", "running");

                mySpeed = alice.randomize(alice.duration(params.speed), params.randomizer)+'ms';    
                core.helper.setAnimationDefaults(page, mySpeed);

                if(params.binding !== "center" && params.binding !== "middle" ){
                    core.helper.piggyback(params.pageId, "standard", params.pageName, params.bookName, mySpeed, params.transformOrigin, params.binding, params.transformRotate, params.realPageCount, params.piggyBg);
                }
            }
        },

        abPageTurnR: function (params){
            if(document.getElementById(params.bookName).getAttribute("data-state") === "paused"){

                var page, pageTwo, mySpeed;

                if(params.binding === 'center' || params.binding === 'middle'){
                    if(params.pageId !== 0){
                        pageTwo = document.getElementById(params.pageName+params.pageId);
                        pageTwo.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg90;
                        params.pageId++;
                    }
                }

                page = document.getElementById(params.pageName+params.pageId);
                if(params.binding !== "center" && params.binding !== "middle"){
                    if(params.pageId === 0 && params.wrap === true){
                        page = document.getElementById(params.pageName+params.realPageCount);
                        document.getElementById(params.bookName).setAttribute('data-page-number', params.realPageCount); 
                    }
                }else{
                    if(params.pageId === 0 && params.wrap === true){
                        page = document.getElementById(params.pageName+"1"); 
                    }
                }

                try{
                    page.style.zIndex = '10'; 
                }catch(err){
                   if(params.wrap !== true){   
                        console.log("This is the start of the book!");
                        return false; 
                    } 
                }

                switch (params.binding){ 
                    case "left":
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg270;
                        break;
                    case "bottom":
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rotNeg270;
                        break;
                    case "top":
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot270;
                        break;
                    case "right": 
                        page.style[alice.prefixJS+'Transform'] = params.transformRotate+core._rot270;
                        break;
                }

                page.style[alice.prefixJS+'AnimationName'] = params.pageName+"abstrPageReTurnF";
                document.getElementById(params.bookName).setAttribute("data-state", "running");

                mySpeed = alice.randomize(alice.duration(params.speed), params.randomizer)+'ms';                                      
                core.helper.setAnimationDefaults(page, mySpeed);

                if(params.binding !== "center" && params.binding !== "middle" ){
                    core.helper.piggyback(params.pageId, "advanced", params.pageName, params.bookName, mySpeed, params.transformOrigin, params.binding, params.transformRotate, params.realPageCount, params.piggyBg); 
                }
            }
        },

        turnNextPage: function(id, type, bookName, params){                                                  
            var pg, pgId, page, aniName, mySpeed;  

            pg = core.helper.getThisId(id);
            pg = (type === 'odd') ? (pg+1) : (pg-1);                                        
            aniName = (type === 'even') ? bookName+"p_oddPageTurnR" : bookName+"p_evenPageTurnF";     

            pgId = document.getElementById(bookName).querySelector('div:nth-child('+pg+')').getAttribute('id');  
            page = document.getElementById(pgId);
            page.style.zIndex = 1; 

            if(type === 'odd'){
                page.style.display = 'block';
            }
            
            page.style[alice.prefixJS+'AnimationName'] = aniName;
            mySpeed = alice.randomize(alice.duration(params.speed), params.randomize)+'ms';                                     
            core.helper.setAnimationDefaults(page, mySpeed);
        },

        turnPage: function (params){
            if(document.getElementById(params.bookName).getAttribute("data-state") === "paused"){

                var thirdChild, ani, page, pageCounter, nxtNxtPageId, nxtNxtPage, mySpeed;
                
                if(params.pageId % 2 === 1){                               
                    thirdChild = params.pageId + 2;
                    ani = params.bookName+"p_oddPageTurnF";
                }else{                                             
                    thirdChild = params.pageId - 2;
                    ani = params.bookName+"p_evenPageTurnR";
                }

                nxtNxtPageId = document.getElementById(params.bookName).querySelector('div:nth-child('+thirdChild+')');

                if(nxtNxtPageId){                                                                                   
                    nxtNxtPageId = nxtNxtPageId.getAttribute('id');                                                
                    nxtNxtPage = document.getElementById(nxtNxtPageId);
                    nxtNxtPage.style.zIndex = '0';
                    nxtNxtPage.style.display = 'block';
                }

                page = document.getElementById(params.pageName+params.pageId);                                                   
                    page.style.zIndex = '1';                                                                     
                    page.style[alice.prefixJS+'AnimationName'] = ani;
                    document.getElementById(params.bookName).setAttribute("data-state", "running");

                    mySpeed = alice.randomize(alice.duration(params.speed), params.randomizer)+'ms';                                     
                    core.helper.setAnimationDefaults(page, mySpeed);
            }
        }
    };

    return core;

})();

//---[ Shortcut Methods ]-----------------------------------------------------

/*
 * CSS Syntax:
 *     animation: name duration timing-function delay iteration-count direction;
 *
 * Parameter Syntax:
 *     elems, <options>, duration, timing, delay, iteration, direction, playstate
 */

alice.plugins.book = function (params) {
    "use strict";
    console.info("book: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,
        pageClass: params.pageClass || '',     
        
        bookWidth: params.bookWidth || document.getElementById(params.elems || alice.anima).style.width,
        bookHeight: params.bookHeight || document.getElementById(params.elems || alice.anima).style.height,

        shadow: params.shadow || false,
        speed: params.speed || "500ms",

        randomize: params.randomize || '15%',

        binding: params.binding || "left",
        paging: "double"
    };

    console.log(opts);
    return alice.plugins.caterpillar.init(opts);
};

alice.plugins.notebook = function (params) {
    "use strict";
    console.info("notebook: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,
        pageClass: params.pageClass || '',     
        
        bookWidth: params.bookWidth || document.getElementById(params.elems || alice.anima).style.width,
        bookHeight: params.bookHeight || document.getElementById(params.elems || alice.anima).style.height,

        shadow: params.shadow || false,
        speed: params.speed || "500ms",

        randomize: params.randomize || '15%',

        binding: params.binding || "top",
        paging: "single",
        wrap: params.wrap || false,
        piggyBg: params.pageBackground || '#222'
    };

    console.log(opts);
    return alice.plugins.caterpillar.init(opts);
};

alice.plugins.flipbook = function (params) {
    "use strict";
    console.info("flipbook: ", arguments);

    if(!params){ params = ''; }

    var opts = {
        elems: params.elems || alice.anima,
        pageClass: params.pageClass || '',     
        
        bookWidth: params.bookWidth || document.getElementById(params.elems || alice.anima).style.width,
        bookHeight: params.bookHeight || document.getElementById(params.elems || alice.anima).style.height,

        shadow: params.shadow || false,
        speed: params.speed || "500ms",

        randomize: params.randomize || '15%',

        binding: params.binding || "center",
        paging: "single",
        wrap: params.wrap || false,
    };

    console.log(opts);
    return alice.plugins.caterpillar.init(opts);
};

//----------------------------------------------------------------------------