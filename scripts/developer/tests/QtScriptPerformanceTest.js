return;
DEFAULT_TRACING_RULES = "" +
    "trace.*=true\n" +
    "*.detail=false\n" +
    "";
testTime_secs = 2;

var profileIndent = '';
PROFILE = function (name, fn, args) {
    console.log("PROFILE-Script " + profileIndent + "(" + name + ") Begin");
    var previousIndent = profileIndent;
    profileIndent += '  ';
    var before = Date.now();
    fn.apply(this, args);
    var delta = Date.now() - before;
    profileIndent = previousIndent;
    console.log("PROFILE-Script " + profileIndent + "(" + name + ") End " + delta + "ms");

    Test.wait(500);

    return delta;
}

// Creates a string of length 'size' from the number 'num'
// the resulting string is left-padded as needed with '0'
function pad(num, size) {
    var s = num + "";
    while (s.length < size) {
        s = "0" + s;
    }

    return s;
}

// Returns the current data and time as a string in the following format:
//    yyyymmdd_hhmm
function formatDate(date) {
    date = new Date();
    return date.getFullYear() + pad(date.getMonth() + 1, 2) + pad(date.getDate(), 2) + "_" +
        pad(date.getHours(), 2) + pad(date.getMinutes(), 2) + pad(date.getSeconds(), 2);
}



var dateString = formatDate();
var testName = "QtScriptPerformanceTest";


location = "file:///T:/serverless-domains/10k.json";
//location = "file:///T:/serverless-domains/25k.json";
var testTime = 30;

Script.setTimeout(function () {
    console.log(testName + " START");

    var ids = Entities.findEntities(MyAvatar.position, 10000);

    var propertiesToRequest = [
        'name', 'type', 'locked',
        'visible', 'renderInfo', 'type', 'modelURL', 'materialURL', 'script'
    ];

    console.log('ENTITY COUNT -> ' + ids.length);
    var resultDeltas = {};
    var addResult = function(key, delta) {
        if (resultDeltas[key] === undefined) {
            resultDeltas[key] = [];
        }
        resultDeltas[key].push(delta);
    }
    for (var testRun = 0; testRun < 10; testRun++) {
        console.log("TRACE START");
        var traceFile = "traces/QtScriptPerformanceTest/" + dateString + "/trace_" + testRun + ".json.gz";
        Test.startTracing(DEFAULT_TRACING_RULES);

        var NON_STRICT = 0;
        var STRICT = 1;
        for (var strictIndex = NON_STRICT; strictIndex <= STRICT; strictIndex++) {
            var strict = strictIndex === STRICT;
            Script.setStrictMode(strict);
            var strictPreFix = strict ? "STRICT" : "";
            addResult(strictPreFix + "getProperties",
                PROFILE(testRun + " getProperties",
                    function() {
                        for (var i = 0; i < ids.length; i++) {
                            var id = ids[i];
                            var properties = Entities.getEntityProperties(id, propertiesToRequest);
                        }
                    }));

            addResult(strictPreFix + "getMultipleProperties",
                PROFILE(testRun + " getMultipleProperties",
                    function() {
                        var multipleProperties = Entities.getMultipleEntityProperties(ids, propertiesToRequest);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesFinal",
                PROFILE(testRun + " getMultiplePropertiesFinal",
                    function () {
                        var multipleProperties = Entities.getMultipleEntityPropertiesFinal(ids, propertiesToRequest);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesFreeLock",
                PROFILE(testRun + " getMultiplePropertiesFreeLock",
                    function() {
                        var multipleProperties = Entities.getMultipleEntityPropertiesFreeLock(ids, propertiesToRequest);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesFreeLockAmount100",
                PROFILE(testRun + " getMultiplePropertiesFreeLockAmount100",
                    function() {
                        var multipleProperties =
                            Entities.getMultipleEntityPropertiesFreeLockAmount(ids, propertiesToRequest, 100);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesFreeLockAmount250",
                PROFILE(testRun + " getMultiplePropertiesFreeLockAmount250",
                    function() {
                        var multipleProperties =
                            Entities.getMultipleEntityPropertiesFreeLockAmount(ids, propertiesToRequest, 250);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesFreeLockAmount500",
                PROFILE(testRun + " getMultiplePropertiesFreeLockAmount500",
                    function() {
                        var multipleProperties =
                            Entities.getMultipleEntityPropertiesFreeLockAmount(ids, propertiesToRequest, 500);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesFreeLockAmount750",
                PROFILE(testRun + " getMultiplePropertiesFreeLockAmount750",
                    function() {
                        var multipleProperties =
                            Entities.getMultipleEntityPropertiesFreeLockAmount(ids, propertiesToRequest, 750);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesFreeLockAmount1000",
                PROFILE(testRun + " getMultiplePropertiesFreeLockAmount1000",
                    function() {
                        var multipleProperties =
                            Entities.getMultipleEntityPropertiesFreeLockAmount(ids, propertiesToRequest, 1000);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesConvertBeforeReturn",
                PROFILE(testRun + " getMultiplePropertiesConvertBeforeReturn",
                    function() {
                        var multipleProperties =
                            Entities.getMultipleEntityPropertiesConvertBeforeReturn(ids, propertiesToRequest);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesManual",
                PROFILE(testRun + " getMultiplePropertiesManual",
                    function() {
                        var multipleProperties = Entities.getMultipleEntityPropertiesManual(ids, propertiesToRequest);
                    }));

            addResult(strictPreFix + "getMultiplePropertiesManualConstants",
                PROFILE(testRun + " getMultiplePropertiesManualConstants",
                    function() {
                        var multipleProperties =
                            Entities.getMultipleEntityPropertiesManualConstants(ids, propertiesToRequest);
                    }));
        }
        Test.stopTracing(traceFile);
        console.log("TRACE END");
    }


    var getAverage = function(numbers) {
        var total = 0;
        numbers.forEach(function(number) {
            total += number;
        });
        return total / numbers.length;
    }

    Object.keys(resultDeltas).forEach(function (key) {
        var deltas = resultDeltas[key];
        console.log(key + " avg: " + getAverage(deltas) + "ms, min: " + Math.min.apply(Math, deltas) + "ms, max: " + Math.max.apply(Math, deltas) + "ms");
    });
    console.log(testName + " END");

}, testTime * 1000);


