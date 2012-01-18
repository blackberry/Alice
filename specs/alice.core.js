/* Copyright 2011-2012 Research In Motion Limited.
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

describe('_duration', function () {
    var expected = {value: 1000, randomness: 0},
        expectedStr = JSON.stringify(expected);

    it('1000 returns ' + expectedStr, function () {
        expect(alice._duration(1000)).toEqual(expected);
    });
    it('"1000" returns ' + expectedStr, function () {
        expect(alice._duration('1000')).toEqual(expected);
    });
    it('"1000ms" returns ' + expectedStr, function () {
        expect(alice._duration('1000ms')).toEqual(expected);
    });
    it('"1s" returns ' + expectedStr, function () {
        expect(alice._duration('1s')).toEqual(expected);
    });
    it('{value: 1000} returns ' + expectedStr, function () {
        expect(alice._duration({value: 1000})).toEqual(expected);
    });
    it('{value: "1000"} returns ' + expectedStr, function () {
        expect(alice._duration({value: "1000"})).toEqual(expected);
    });
    it('{value: "1000ms"} returns ' + expectedStr, function () {
        expect(alice._duration({value: "1000ms"})).toEqual(expected);
    });
    it('{value: "1s"} returns ' + expectedStr, function () {
        expect(alice._duration({value: "1s"})).toEqual(expected);
    });
/*
    it('"" returns ' + expectedStr, function () {
        expect(alice._duration("")).toEqual(expected);
    });
*/
});

describe('_coords', function () {
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
            expect(alice._coords(p)).toEqual(params[p]);
        });
    }
*/
    it('"top-left" returns ' + JSON.stringify({x: "0%", y: "0%"}), function () {
        expect(alice._coords("top-left")).toEqual({x: "0%", y: "0%"});
    });
    it('"top-center" returns ' + JSON.stringify({x: "50%", y: "0%"}), function () {
        expect(alice._coords("top-center")).toEqual({x: "50%", y: "0%"});
    });
    it('"top-right" returns ' + JSON.stringify({x: "100%", y: "0%"}), function () {
        expect(alice._coords("top-right")).toEqual({x: "100%", y: "0%"});
    });
    it('"middle-left" returns ' + JSON.stringify({x: "0%", y: "50%"}), function () {
        expect(alice._coords("middle-left")).toEqual({x: "0%", y: "50%"});
    });
    it('"middle-center" returns ' + JSON.stringify({x: "50%", y: "50%"}), function () {
        expect(alice._coords("middle-center")).toEqual({x: "50%", y: "50%"});
    });
    it('"middle-right" returns ' + JSON.stringify({x: "100%", y: "50%"}), function () {
        expect(alice._coords("middle-right")).toEqual({x: "100%", y: "50%"});
    });
    it('"bottom-left" returns ' + JSON.stringify({x: "0%", y: "100%"}), function () {
        expect(alice._coords("bottom-left")).toEqual({x: "0%", y: "100%"});
    });
    it('"bottom-center" returns ' + JSON.stringify({x: "50%", y: "100%"}), function () {
        expect(alice._coords("bottom-center")).toEqual({x: "50%", y: "100%"});
    });
    it('"bottom-right" returns ' + JSON.stringify({x: "100%", y: "100%"}), function () {
        expect(alice._coords("bottom-right")).toEqual({x: "100%", y: "100%"});
    });

    it('"top" returns ' + JSON.stringify({x: "50%", y: "0%"}), function () {
        expect(alice._coords("top")).toEqual({x: "50%", y: "0%"});
    });
    it('"left" returns ' + JSON.stringify({x: "0%", y: "50%"}), function () {
        expect(alice._coords("left")).toEqual({x: "0%", y: "50%"});
    });
    it('"center" returns ' + JSON.stringify({x: "50%", y: "50%"}), function () {
        expect(alice._coords("center")).toEqual({x: "50%", y: "50%"});
    });
    it('"right" returns ' + JSON.stringify({x: "100%", y: "50%"}), function () {
        expect(alice._coords("right")).toEqual({x: "100%", y: "50%"});
    });
    it('"bottom" returns ' + JSON.stringify({x: "50%", y: "100%"}), function () {
        expect(alice._coords("bottom")).toEqual({x: "50%", y: "100%"});
    });

    it('"NW" returns ' + JSON.stringify({x: "0%", y: "0%"}), function () {
        expect(alice._coords("NW")).toEqual({x: "0%", y: "0%"});
    });
    it('"N" returns ' + JSON.stringify({x: "50%", y: "0%"}), function () {
        expect(alice._coords("N")).toEqual({x: "50%", y: "0%"});
    });
    it('"NE" returns ' + JSON.stringify({x: "100%", y: "0%"}), function () {
        expect(alice._coords("NE")).toEqual({x: "100%", y: "0%"});
    });
    it('"W" returns ' + JSON.stringify({x: "0%", y: "50%"}), function () {
        expect(alice._coords("W")).toEqual({x: "0%", y: "50%"});
    });
    it('"E" returns ' + JSON.stringify({x: "100%", y: "50%"}), function () {
        expect(alice._coords("E")).toEqual({x: "100%", y: "50%"});
    });
    it('"SW" returns ' + JSON.stringify({x: "0%", y: "100%"}), function () {
        expect(alice._coords("SW")).toEqual({x: "0%", y: "100%"});
    });
    it('"S" returns ' + JSON.stringify({x: "50%", y: "100%"}), function () {
        expect(alice._coords("S")).toEqual({x: "50%", y: "100%"});
    });
    it('"SE" returns ' + JSON.stringify({x: "100%", y: "100%"}), function () {
        expect(alice._coords("SE")).toEqual({x: "100%", y: "100%"});
    });

    it('"" returns ' + JSON.stringify({x: "50%", y: "50%"}), function () {
        expect(alice._coords("")).toEqual({x: "50%", y: "50%"});
    });
});

describe('_easing', function () {
    // Standard
    it('"linear" returns ' + JSON.stringify({p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750}), function () {
        expect(alice._easing("linear")).toEqual({p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750});
    });
    it('"ease" returns ' + JSON.stringify({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000}), function () {
        expect(alice._easing("ease")).toEqual({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000});
    });
    it('"ease-in" returns ' + JSON.stringify({p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000}), function () {
        expect(alice._easing("ease-in")).toEqual({p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000});
    });
    it('"ease-out" returns ' + JSON.stringify({p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000}), function () {
        expect(alice._easing("ease-out")).toEqual({p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000});
    });
    it('"ease-in-out" returns ' + JSON.stringify({p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000}), function () {
        expect(alice._easing("ease-in-out")).toEqual({p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000});
    });

    // Penner
    it('"easeInQuad" returns ' + JSON.stringify({p1: 0.550, p2: 0.085, p3: 0.680, p4: 0.530}), function () {
        expect(alice._easing("easeInQuad")).toEqual({p1: 0.550, p2: 0.085, p3: 0.680, p4: 0.530});
    });
    it('"easeInCubic" returns ' + JSON.stringify({p1: 0.550, p2: 0.055, p3: 0.675, p4: 0.190}), function () {
        expect(alice._easing("easeInCubic")).toEqual({p1: 0.550, p2: 0.055, p3: 0.675, p4: 0.190});
    });
    it('"easeInQuart" returns ' + JSON.stringify({p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220}), function () {
        expect(alice._easing("easeInQuart")).toEqual({p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220});
    });
    it('"easeInQuint" returns ' + JSON.stringify({p1: 0.755, p2: 0.050, p3: 0.855, p4: 0.060}), function () {
        expect(alice._easing("easeInQuint")).toEqual({p1: 0.755, p2: 0.050, p3: 0.855, p4: 0.060});
    });
    it('"easeInSine" returns ' + JSON.stringify({p1: 0.470, p2: 0.000, p3: 0.745, p4: 0.715}), function () {
        expect(alice._easing("easeInSine")).toEqual({p1: 0.470, p2: 0.000, p3: 0.745, p4: 0.715});
    });
    it('"easeInExpo" returns ' + JSON.stringify({p1: 0.950, p2: 0.050, p3: 0.795, p4: 0.035}), function () {
        expect(alice._easing("easeInExpo")).toEqual({p1: 0.950, p2: 0.050, p3: 0.795, p4: 0.035});
    });
    it('"easeInCirc" returns ' + JSON.stringify({p1: 0.600, p2: 0.040, p3: 0.980, p4: 0.335}), function () {
        expect(alice._easing("easeInCirc")).toEqual({p1: 0.600, p2: 0.040, p3: 0.980, p4: 0.335});
    });
    it('"easeInBack" returns ' + JSON.stringify({p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045}), function () {
        expect(alice._easing("easeInBack")).toEqual({p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045});
    });
    it('"easeOutQuad" returns ' + JSON.stringify({p1: 0.250, p2: 0.460, p3: 0.450, p4: 0.940}), function () {
        expect(alice._easing("easeOutQuad")).toEqual({p1: 0.250, p2: 0.460, p3: 0.450, p4: 0.940});
    });
    it('"easeOutCubic" returns ' + JSON.stringify({p1: 0.215, p2: 0.610, p3: 0.355, p4: 1.000}), function () {
        expect(alice._easing("easeOutCubic")).toEqual({p1: 0.215, p2: 0.610, p3: 0.355, p4: 1.000});
    });
    it('"easeOutQuart" returns ' + JSON.stringify({p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000}), function () {
        expect(alice._easing("easeOutQuart")).toEqual({p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000});
    });
    it('"easeOutQuint" returns ' + JSON.stringify({p1: 0.230, p2: 1.000, p3: 0.320, p4: 1.000}), function () {
        expect(alice._easing("easeOutQuint")).toEqual({p1: 0.230, p2: 1.000, p3: 0.320, p4: 1.000});
    });
    it('"easeOutSine" returns ' + JSON.stringify({p1: 0.390, p2: 0.575, p3: 0.565, p4: 1.000}), function () {
        expect(alice._easing("easeOutSine")).toEqual({p1: 0.390, p2: 0.575, p3: 0.565, p4: 1.000});
    });
    it('"easeOutExpo" returns ' + JSON.stringify({p1: 0.190, p2: 1.000, p3: 0.220, p4: 1.000}), function () {
        expect(alice._easing("easeOutExpo")).toEqual({p1: 0.190, p2: 1.000, p3: 0.220, p4: 1.000});
    });
    it('"easeOutCirc" returns ' + JSON.stringify({p1: 0.075, p2: 0.820, p3: 0.165, p4: 1.000}), function () {
        expect(alice._easing("easeOutCirc")).toEqual({p1: 0.075, p2: 0.820, p3: 0.165, p4: 1.000});
    });
    it('"easeOutBack" returns ' + JSON.stringify({p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275}), function () {
        expect(alice._easing("easeOutBack")).toEqual({p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275});
    });
    it('"easeInOutQuad" returns ' + JSON.stringify({p1: 0.455, p2: 0.030, p3: 0.515, p4: 0.955}), function () {
        expect(alice._easing("easeInOutQuad")).toEqual({p1: 0.455, p2: 0.030, p3: 0.515, p4: 0.955});
    });
    it('"easeInOutCubic" returns ' + JSON.stringify({p1: 0.645, p2: 0.045, p3: 0.355, p4: 1.000}), function () {
        expect(alice._easing("easeInOutCubic")).toEqual({p1: 0.645, p2: 0.045, p3: 0.355, p4: 1.000});
    });
    it('"easeInOutQuart" returns ' + JSON.stringify({p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000}), function () {
        expect(alice._easing("easeInOutQuart")).toEqual({p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000});
    });
    it('"easeInOutQuint" returns ' + JSON.stringify({p1: 0.860, p2: 0.000, p3: 0.070, p4: 1.000}), function () {
        expect(alice._easing("easeInOutQuint")).toEqual({p1: 0.860, p2: 0.000, p3: 0.070, p4: 1.000});
    });
    it('"easeInOutSine" returns ' + JSON.stringify({p1: 0.445, p2: 0.050, p3: 0.550, p4: 0.950}), function () {
        expect(alice._easing("easeInOutSine")).toEqual({p1: 0.445, p2: 0.050, p3: 0.550, p4: 0.950});
    });
    it('"easeInOutExpo" returns ' + JSON.stringify({p1: 1.000, p2: 0.000, p3: 0.000, p4: 1.000}), function () {
        expect(alice._easing("easeInOutExpo")).toEqual({p1: 1.000, p2: 0.000, p3: 0.000, p4: 1.000});
    });
    it('"easeInOutCirc" returns ' + JSON.stringify({p1: 0.785, p2: 0.135, p3: 0.150, p4: 0.860}), function () {
        expect(alice._easing("easeInOutCirc")).toEqual({p1: 0.785, p2: 0.135, p3: 0.150, p4: 0.860});
    });
    it('"easeInOutBack" returns ' + JSON.stringify({p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550}), function () {
        expect(alice._easing("easeInOutBack")).toEqual({p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550});
    });

    // Custom
    it('"custom" returns ' + JSON.stringify({p1: 0.000, p2: 0.350, p3: 0.500, p4: 1.300}), function () {
        expect(alice._easing("custom")).toEqual({p1: 0.000, p2: 0.350, p3: 0.500, p4: 1.300});
    });

    // Random
    it('"random" does not return ' + JSON.stringify({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000}), function () {
        expect(alice._easing("random")).not.toEqual({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000});
    });

    // Default
    it('"" returns ' + JSON.stringify({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000}), function () {
        expect(alice._easing("")).toEqual({p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000});
    });
});

describe('_percentage', function () {
    var positiveVal = 0.05,
        negativeVal = -0.05;

    it('"5%" returns ' + positiveVal, function () {
        expect(alice._percentage("5%")).toEqual(positiveVal);
    });
    it('"-5%" returns ' + negativeVal, function () {
        expect(alice._percentage("-5%")).toEqual(negativeVal);
    });
    it('"5" returns ' + positiveVal, function () {
        expect(alice._percentage("5")).toEqual(positiveVal);
    });
    it('"-5" returns ' + negativeVal, function () {
        expect(alice._percentage("-5")).toEqual(negativeVal);
    });
    it('"0.05" returns ' + positiveVal, function () {
        expect(alice._percentage("0.05")).toEqual(positiveVal);
    });
    it('"-0.05" returns ' + negativeVal, function () {
        expect(alice._percentage("-0.05")).toEqual(negativeVal);
    });
    it('5 returns ' + positiveVal, function () {
        expect(alice._percentage(5)).toEqual(positiveVal);
    });
    it('-5 returns ' + negativeVal, function () {
        expect(alice._percentage(-5)).toEqual(negativeVal);
    });
    it('0.05 returns ' + positiveVal, function () {
        expect(alice._percentage(0.05)).toEqual(positiveVal);
    });
    it('-0.05 returns ' + negativeVal, function () {
        expect(alice._percentage(-0.05)).toEqual(negativeVal);
    });
    it('"" returns ' + "NaN", function () {
        expect(alice._percentage("")).not.toEqual(isNaN());
    });
});
