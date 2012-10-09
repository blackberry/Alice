/* ===========================================================================
 * alice.core.js
 * ===========================================================================
 *
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License") you may not use this file except in compliance with the License.
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

describe('duration', function () {
    var expected = 1000,
        expectedStr = JSON.stringify(expected);

    it('1000 returns ' + expectedStr, function () {
        expect(alice.duration(1000)).toEqual(expected);
    });
    it('"1000" returns ' + expectedStr, function () {
        expect(alice.duration('1000')).toEqual(expected);
    });
    it('"1000ms" returns ' + expectedStr, function () {
        expect(alice.duration('1000ms')).toEqual(expected);
    });
    it('"1s" returns ' + expectedStr, function () {
        expect(alice.duration('1s')).toEqual(expected);
    });
    it('{value: 1000} returns ' + expectedStr, function () {
        expect(alice.duration({value: 1000})).toEqual(expected);
    });
    it('{value: "1000"} returns ' + expectedStr, function () {
        expect(alice.duration({value: "1000"})).toEqual(expected);
    });
    it('{value: "1000ms"} returns ' + expectedStr, function () {
        expect(alice.duration({value: "1000ms"})).toEqual(expected);
    });
    it('{value: "1s"} returns ' + expectedStr, function () {
        expect(alice.duration({value: "1s"})).toEqual(expected);
    });
/*
    it('"" returns ' + expectedStr, function () {
        expect(alice.duration("")).toEqual(expected);
    });
*/
});

describe('coords', function () {
/*
    params = {
        "top-left": {x: "0%", y: "0%"},
        "top-center": {x: "50%", y: "0%"},
        "top-right": {x: "100%", y: "0%"},
        "middle-lefty": {x: "0%", y: "50%"}
    };

    for (var p in params) {
        console.log(p, params[p]);
        it('"' + p + '" returns ' + JSON.stringify(params[p]), function () {
            expect(alice.coords(p)).toEqual(params[p]);
        });
    }
*/
    it('"top-left" returns ' + JSON.stringify({x: "0%", y: "0%"}), function () {
        expect(alice.coords("top-left")).toEqual({x: "0%", y: "0%"});
    });
    it('"top-center" returns ' + JSON.stringify({x: "50%", y: "0%"}), function () {
        expect(alice.coords("top-center")).toEqual({x: "50%", y: "0%"});
    });
    it('"top-right" returns ' + JSON.stringify({x: "100%", y: "0%"}), function () {
        expect(alice.coords("top-right")).toEqual({x: "100%", y: "0%"});
    });
    it('"middle-left" returns ' + JSON.stringify({x: "0%", y: "50%"}), function () {
        expect(alice.coords("middle-left")).toEqual({x: "0%", y: "50%"});
    });
    it('"middle-center" returns ' + JSON.stringify({x: "50%", y: "50%"}), function () {
        expect(alice.coords("middle-center")).toEqual({x: "50%", y: "50%"});
    });
    it('"middle-right" returns ' + JSON.stringify({x: "100%", y: "50%"}), function () {
        expect(alice.coords("middle-right")).toEqual({x: "100%", y: "50%"});
    });
    it('"bottom-left" returns ' + JSON.stringify({x: "0%", y: "100%"}), function () {
        expect(alice.coords("bottom-left")).toEqual({x: "0%", y: "100%"});
    });
    it('"bottom-center" returns ' + JSON.stringify({x: "50%", y: "100%"}), function () {
        expect(alice.coords("bottom-center")).toEqual({x: "50%", y: "100%"});
    });
    it('"bottom-right" returns ' + JSON.stringify({x: "100%", y: "100%"}), function () {
        expect(alice.coords("bottom-right")).toEqual({x: "100%", y: "100%"});
    });

    it('"top" returns ' + JSON.stringify({x: "50%", y: "0%"}), function () {
        expect(alice.coords("top")).toEqual({x: "50%", y: "0%"});
    });
    it('"left" returns ' + JSON.stringify({x: "0%", y: "50%"}), function () {
        expect(alice.coords("left")).toEqual({x: "0%", y: "50%"});
    });
    it('"center" returns ' + JSON.stringify({x: "50%", y: "50%"}), function () {
        expect(alice.coords("center")).toEqual({x: "50%", y: "50%"});
    });
    it('"right" returns ' + JSON.stringify({x: "100%", y: "50%"}), function () {
        expect(alice.coords("right")).toEqual({x: "100%", y: "50%"});
    });
    it('"bottom" returns ' + JSON.stringify({x: "50%", y: "100%"}), function () {
        expect(alice.coords("bottom")).toEqual({x: "50%", y: "100%"});
    });

    it('"NW" returns ' + JSON.stringify({x: "0%", y: "0%"}), function () {
        expect(alice.coords("NW")).toEqual({x: "0%", y: "0%"});
    });
    it('"N" returns ' + JSON.stringify({x: "50%", y: "0%"}), function () {
        expect(alice.coords("N")).toEqual({x: "50%", y: "0%"});
    });
    it('"NE" returns ' + JSON.stringify({x: "100%", y: "0%"}), function () {
        expect(alice.coords("NE")).toEqual({x: "100%", y: "0%"});
    });
    it('"W" returns ' + JSON.stringify({x: "0%", y: "50%"}), function () {
        expect(alice.coords("W")).toEqual({x: "0%", y: "50%"});
    });
    it('"E" returns ' + JSON.stringify({x: "100%", y: "50%"}), function () {
        expect(alice.coords("E")).toEqual({x: "100%", y: "50%"});
    });
    it('"SW" returns ' + JSON.stringify({x: "0%", y: "100%"}), function () {
        expect(alice.coords("SW")).toEqual({x: "0%", y: "100%"});
    });
    it('"S" returns ' + JSON.stringify({x: "50%", y: "100%"}), function () {
        expect(alice.coords("S")).toEqual({x: "50%", y: "100%"});
    });
    it('"SE" returns ' + JSON.stringify({x: "100%", y: "100%"}), function () {
        expect(alice.coords("SE")).toEqual({x: "100%", y: "100%"});
    });

    it('"" returns ' + JSON.stringify({x: "50%", y: "50%"}), function () {
        expect(alice.coords("")).toEqual({x: "50%", y: "50%"});
    });
});

describe('easing', function () {
    // Standard
    it('"linear" returns ' + JSON.stringify({p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750}), function () {
        expect(alice.easing("linear")).toEqual({p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750});
    });
    it('"ease" returns ' + JSON.stringify({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000}), function () {
        expect(alice.easing("ease")).toEqual({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000});
    });
    it('"ease-in" returns ' + JSON.stringify({p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000}), function () {
        expect(alice.easing("ease-in")).toEqual({p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000});
    });
    it('"ease-out" returns ' + JSON.stringify({p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000}), function () {
        expect(alice.easing("ease-out")).toEqual({p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000});
    });
    it('"ease-in-out" returns ' + JSON.stringify({p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000}), function () {
        expect(alice.easing("ease-in-out")).toEqual({p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000});
    });

    // Penner
    it('"easeInQuad" returns ' + JSON.stringify({p1: 0.550, p2: 0.085, p3: 0.680, p4: 0.530}), function () {
        expect(alice.easing("easeInQuad")).toEqual({p1: 0.550, p2: 0.085, p3: 0.680, p4: 0.530});
    });
    it('"easeInCubic" returns ' + JSON.stringify({p1: 0.550, p2: 0.055, p3: 0.675, p4: 0.190}), function () {
        expect(alice.easing("easeInCubic")).toEqual({p1: 0.550, p2: 0.055, p3: 0.675, p4: 0.190});
    });
    it('"easeInQuart" returns ' + JSON.stringify({p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220}), function () {
        expect(alice.easing("easeInQuart")).toEqual({p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220});
    });
    it('"easeInQuint" returns ' + JSON.stringify({p1: 0.755, p2: 0.050, p3: 0.855, p4: 0.060}), function () {
        expect(alice.easing("easeInQuint")).toEqual({p1: 0.755, p2: 0.050, p3: 0.855, p4: 0.060});
    });
    it('"easeInSine" returns ' + JSON.stringify({p1: 0.470, p2: 0.000, p3: 0.745, p4: 0.715}), function () {
        expect(alice.easing("easeInSine")).toEqual({p1: 0.470, p2: 0.000, p3: 0.745, p4: 0.715});
    });
    it('"easeInExpo" returns ' + JSON.stringify({p1: 0.950, p2: 0.050, p3: 0.795, p4: 0.035}), function () {
        expect(alice.easing("easeInExpo")).toEqual({p1: 0.950, p2: 0.050, p3: 0.795, p4: 0.035});
    });
    it('"easeInCirc" returns ' + JSON.stringify({p1: 0.600, p2: 0.040, p3: 0.980, p4: 0.335}), function () {
        expect(alice.easing("easeInCirc")).toEqual({p1: 0.600, p2: 0.040, p3: 0.980, p4: 0.335});
    });
    it('"easeInBack" returns ' + JSON.stringify({p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045}), function () {
        expect(alice.easing("easeInBack")).toEqual({p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045});
    });
    it('"easeOutQuad" returns ' + JSON.stringify({p1: 0.250, p2: 0.460, p3: 0.450, p4: 0.940}), function () {
        expect(alice.easing("easeOutQuad")).toEqual({p1: 0.250, p2: 0.460, p3: 0.450, p4: 0.940});
    });
    it('"easeOutCubic" returns ' + JSON.stringify({p1: 0.215, p2: 0.610, p3: 0.355, p4: 1.000}), function () {
        expect(alice.easing("easeOutCubic")).toEqual({p1: 0.215, p2: 0.610, p3: 0.355, p4: 1.000});
    });
    it('"easeOutQuart" returns ' + JSON.stringify({p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000}), function () {
        expect(alice.easing("easeOutQuart")).toEqual({p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000});
    });
    it('"easeOutQuint" returns ' + JSON.stringify({p1: 0.230, p2: 1.000, p3: 0.320, p4: 1.000}), function () {
        expect(alice.easing("easeOutQuint")).toEqual({p1: 0.230, p2: 1.000, p3: 0.320, p4: 1.000});
    });
    it('"easeOutSine" returns ' + JSON.stringify({p1: 0.390, p2: 0.575, p3: 0.565, p4: 1.000}), function () {
        expect(alice.easing("easeOutSine")).toEqual({p1: 0.390, p2: 0.575, p3: 0.565, p4: 1.000});
    });
    it('"easeOutExpo" returns ' + JSON.stringify({p1: 0.190, p2: 1.000, p3: 0.220, p4: 1.000}), function () {
        expect(alice.easing("easeOutExpo")).toEqual({p1: 0.190, p2: 1.000, p3: 0.220, p4: 1.000});
    });
    it('"easeOutCirc" returns ' + JSON.stringify({p1: 0.075, p2: 0.820, p3: 0.165, p4: 1.000}), function () {
        expect(alice.easing("easeOutCirc")).toEqual({p1: 0.075, p2: 0.820, p3: 0.165, p4: 1.000});
    });
    it('"easeOutBack" returns ' + JSON.stringify({p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275}), function () {
        expect(alice.easing("easeOutBack")).toEqual({p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275});
    });
    it('"easeInOutQuad" returns ' + JSON.stringify({p1: 0.455, p2: 0.030, p3: 0.515, p4: 0.955}), function () {
        expect(alice.easing("easeInOutQuad")).toEqual({p1: 0.455, p2: 0.030, p3: 0.515, p4: 0.955});
    });
    it('"easeInOutCubic" returns ' + JSON.stringify({p1: 0.645, p2: 0.045, p3: 0.355, p4: 1.000}), function () {
        expect(alice.easing("easeInOutCubic")).toEqual({p1: 0.645, p2: 0.045, p3: 0.355, p4: 1.000});
    });
    it('"easeInOutQuart" returns ' + JSON.stringify({p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000}), function () {
        expect(alice.easing("easeInOutQuart")).toEqual({p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000});
    });
    it('"easeInOutQuint" returns ' + JSON.stringify({p1: 0.860, p2: 0.000, p3: 0.070, p4: 1.000}), function () {
        expect(alice.easing("easeInOutQuint")).toEqual({p1: 0.860, p2: 0.000, p3: 0.070, p4: 1.000});
    });
    it('"easeInOutSine" returns ' + JSON.stringify({p1: 0.445, p2: 0.050, p3: 0.550, p4: 0.950}), function () {
        expect(alice.easing("easeInOutSine")).toEqual({p1: 0.445, p2: 0.050, p3: 0.550, p4: 0.950});
    });
    it('"easeInOutExpo" returns ' + JSON.stringify({p1: 1.000, p2: 0.000, p3: 0.000, p4: 1.000}), function () {
        expect(alice.easing("easeInOutExpo")).toEqual({p1: 1.000, p2: 0.000, p3: 0.000, p4: 1.000});
    });
    it('"easeInOutCirc" returns ' + JSON.stringify({p1: 0.785, p2: 0.135, p3: 0.150, p4: 0.860}), function () {
        expect(alice.easing("easeInOutCirc")).toEqual({p1: 0.785, p2: 0.135, p3: 0.150, p4: 0.860});
    });
    it('"easeInOutBack" returns ' + JSON.stringify({p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550}), function () {
        expect(alice.easing("easeInOutBack")).toEqual({p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550});
    });

    // Custom
    it('"custom" returns ' + JSON.stringify({p1: 0.000, p2: 0.350, p3: 0.500, p4: 1.300}), function () {
        expect(alice.easing("custom")).toEqual({p1: 0.000, p2: 0.350, p3: 0.500, p4: 1.300});
    });

    // Random
    it('"random" does not return ' + JSON.stringify({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000}), function () {
        expect(alice.easing("random")).not.toEqual({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000});
    });

    // Default
    it('"" returns ' + JSON.stringify({p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000}), function () {
        expect(alice.easing("")).toEqual({p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000});
    });
});

describe('percentage', function () {
    var positiveVal = 0.05,
        negativeVal = -0.05;

    it('"5%" returns ' + positiveVal, function () {
        expect(alice.percentage("5%")).toEqual(positiveVal);
    });
    it('"-5%" returns ' + negativeVal, function () {
        expect(alice.percentage("-5%")).toEqual(negativeVal);
    });
    it('"5" returns ' + positiveVal, function () {
        expect(alice.percentage("5")).toEqual(positiveVal);
    });
    it('"-5" returns ' + negativeVal, function () {
        expect(alice.percentage("-5")).toEqual(negativeVal);
    });
    it('"0.05" returns ' + positiveVal, function () {
        expect(alice.percentage("0.05")).toEqual(positiveVal);
    });
    it('"-0.05" returns ' + negativeVal, function () {
        expect(alice.percentage("-0.05")).toEqual(negativeVal);
    });
    it('5 returns ' + positiveVal, function () {
        expect(alice.percentage(5)).toEqual(positiveVal);
    });
    it('-5 returns ' + negativeVal, function () {
        expect(alice.percentage(-5)).toEqual(negativeVal);
    });
    it('0.05 returns ' + positiveVal, function () {
        expect(alice.percentage(0.05)).toEqual(positiveVal);
    });
    it('-0.05 returns ' + negativeVal, function () {
        expect(alice.percentage(-0.05)).toEqual(negativeVal);
    });
    it('"" returns ' + "NaN", function () {
        expect(alice.percentage("")).not.toEqual(isNaN());
    });
});

describe('oppositeNumber', function () {
    it('5 returns -5', function () {
        expect(alice.format.oppositeNumber(5)).toEqual(-5);
    });
    it('05 returns -5', function () {
        expect(alice.format.oppositeNumber(05)).toEqual(-5);
    });
    it('5.0 returns -5', function () {
        expect(alice.format.oppositeNumber(5.0)).toEqual(-5);
    });
    it('+5 returns -5', function () {
        expect(alice.format.oppositeNumber(+5)).toEqual(-5);
    });
    it('-5 returns 5', function () {
        expect(alice.format.oppositeNumber(-5)).toEqual(5);
    });
    it('-05 returns 5', function () {
        expect(alice.format.oppositeNumber(-05)).toEqual(5);
    });
    it('-5.0 returns 5', function () {
        expect(alice.format.oppositeNumber(-5.0)).toEqual(5);
    });
    it('0 returns 0', function () {
        expect(alice.format.oppositeNumber(0)).toEqual(0);
    });
    it('+0 returns 0', function () {
        expect(alice.format.oppositeNumber(+0)).toEqual(0);
    });
    it('-0 returns 0', function () {
        expect(alice.format.oppositeNumber(-0)).toEqual(0);
    });
});

describe("selecting elements", function () {
    var sandbox;
    beforeEach(function () {
        sandbox = document.createElement("div");
        sandbox.id = "sandbox";

        document.body.appendChild(sandbox);
    });

    afterEach(function () {
        document.body.removeChild(sandbox);
    });

    describe("by id", function () {
        it("can find an element by passing in the id", function () {
            var result = alice.elements('sandbox');
            expect(result[0]).toBe(sandbox);
        });

        it("returns an empty array when the id doesn't exist", function () {
            var result = alice.elements('bob');
            expect(result).toEqual([]);
        });
    });

    describe("by query selector", function () {
        it("can find an elment by the id", function () {
            var a = document.createElement("div");
            a.id = "hippo";

            sandbox.appendChild(a);
            var result = alice.elements("#hippo");

            expect(result).toEqual([a]);
        });
    });

    describe("by element", function () {
        it("returns the element passed in", function () {
            var el = document.createElement('div');
            var result = alice.elements(el);
            expect(result[0]).toBe(el);
        });
    });

    describe("when passing in an array", function () {
        it("finds a collection of id's", function () {
            var a = document.createElement("div");
                b = document.createElement("div"),
                c = document.createElement("div");

            a.id = "a";
            b.id = "b";
            c.id = "c";

            sandbox.appendChild(a);
            sandbox.appendChild(b);
            sandbox.appendChild(c);

            var result = alice.elements(["a", "b", "c"]);

            expect(result).toEqual([a, b, c]);
        });

        it("finds a collection of query selectors", function () {
            var a = document.createElement("div");
                b = document.createElement("div"),
                c = document.createElement("div");

            a.id = "a";
            b.id = "b";
            c.id = "c";

            sandbox.appendChild(a);
            sandbox.appendChild(b);
            sandbox.appendChild(c);

            var result = alice.elements(["#a", "div#b", "#c"]);

            expect(result).toEqual([a, b, c]);
        });

        it("returns the element for a list containing a single id", function () {
            var a = document.createElement("div");
            a.id = "astroturf";
            sandbox.appendChild(a);

            var result = alice.elements(["astroturf"]);
            expect(result).toEqual([a]);
        });

        it("returns the element for a list containing a single query selector", function () {
            var a = document.createElement("div");
            a.id = "scoobysnacks";
            sandbox.appendChild(a);

            var result = alice.elements(["#scoobysnacks"]);
            expect(result).toEqual([a]);
        });

        it("filters out the text elements for a list of elements", function () {
            var a = {nodeType: 1},
                b = {nodeType: 3},
                c = {nodeType: 1},
                d = {nodeType: 3},
                result = alice.elements([a, b, c, d]);

            expect(result).toEqual([a,c]);
        });

        it("works with an actual list of elements", function () {
            var a = document.createElement('div'),
                b = document.createElement('div'),
                c = document.createElement('div');
            
            sandbox.appendChild(a);
            sandbox.appendChild(b);
            sandbox.appendChild(c);

            var result = alice.elements(sandbox.querySelectorAll('div'));

            expect(result).toEqual([a, b, c]);
        });
    });
});
