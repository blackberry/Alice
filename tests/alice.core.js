module("core");

test("randomize", function() {
    equal(alice._randomize(1000, "0%"), 1000, '1000 randomized by 0%');

    notEqual(alice._randomize(1000, "10%"), 1000, '1000 randomized by 10%');
    notEqual(alice._randomize(1000, "10%"), 1000, '1000 randomized by 10%');
    notEqual(alice._randomize(1000, "10%"), 1000, '1000 randomized by 10%');

    notEqual(alice._randomize(1000, "50%"), 1000, '1000 randomized by 50%');
    notEqual(alice._randomize(1000, "50%"), 1000, '1000 randomized by 50%');
    notEqual(alice._randomize(1000, "50%"), 1000, '1000 randomized by 50%');

    notEqual(alice._randomize(1000, "100%"), 1000, '1000 randomized by 100%');
    notEqual(alice._randomize(1000, "100%"), 1000, '1000 randomized by 100%');
    notEqual(alice._randomize(1000, "100%"), 1000, '1000 randomized by 100%');
})

test("duration", function() {
    equal(alice._duration(1000), "1000ms", '1000 returns 1000ms');

    equal(alice._duration("1000"), "1000ms", '"1000" returns 1000ms');
    equal(alice._duration("1000ms"), "1000ms", '"1000ms" returns 1000ms');
    equal(alice._duration("1s"), "1000ms", '"1s" returns 1000ms');

    equal(alice._duration({value: 1000}), "1000ms", '{value: 1000} returns 1000ms');

    equal(alice._duration({value: "1000"}), "1000ms", '{value: "1000"} returns 1000ms');
    equal(alice._duration({value: "1000ms"}), "1000ms", '{value: "1000ms"} returns 1000ms');
    equal(alice._duration({value: "1s"}), "1000ms", '{value: "1s"} returns 1000ms');
})

test("coords", function() {
    equal(alice._coords("top-left"), "0% 0%", '"top-left" returns "0% 0%"');
    equal(alice._coords("top-center"), "50% 0%", '"top-center" returns "50% 0%"');
    equal(alice._coords("top-right"), "100% 0%", '"top-right" returns "100% 0%"');
    equal(alice._coords("middle-left"), "0% 50%", '"middle-left" returns "0% 50%"');
    equal(alice._coords("middle-center"), "50% 50%", '"middle-center" returns "50% 50%"');
    equal(alice._coords("middle-right"), "100% 50%", '"middle-right" returns "100% 50%"');
    equal(alice._coords("bottom-left"), "0% 100%", '"bottom-left" returns "0% 100%"');
    equal(alice._coords("bottom-center"), "50% 100%", '"bottom-center" returns "50% 100%"');
    equal(alice._coords("bottom-right"), "100% 100%", '"bottom-right" returns "100% 100%"');

    equal(alice._coords("top"), "50% 0%", '"top" returns "50% 0%"');
    equal(alice._coords("left"), "0% 50%", '"left" returns "0% 50%"');
    equal(alice._coords("center"), "50% 50%", '"center" returns "50% 50%"');
    equal(alice._coords("right"), "100% 50%", '"right" returns "100% 50%"');
    equal(alice._coords("bottom"), "50% 100%", '"bottom" returns "50% 100%"');

    equal(alice._coords("NW"), "0% 0%", '"NW" returns "0% 0%"');
    equal(alice._coords("N"), "50% 0%", '"N" returns "50% 0%"');
    equal(alice._coords("NE"), "100% 0%", '"NE" returns "100% 0%"');
    equal(alice._coords("W"), "0% 50%", '"W" returns "0% 50%"');
    equal(alice._coords("E"), "100% 50%", '"E" returns "100% 50%"');
    equal(alice._coords("SW"), "0% 100%", '"SW" returns "0% 100%"');
    equal(alice._coords("S"), "50% 100%", '"S" returns "50% 100%"');
    equal(alice._coords("SE"), "100% 100%", '"SE" returns "100% 100%"');

    equal(alice._coords(""), "50% 50%", 'nothing returns "50% 50%"');
})
