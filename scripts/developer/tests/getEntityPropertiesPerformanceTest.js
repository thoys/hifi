DEFAULT_TRACING_RULES = "" +
    "trace.*=true\n" +
    "*.detail=false\n" +
    "";
testTime_secs = 2;

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
var testName = "getEntityPropertiesPerformanceTest";
var traceFile = "traces/trace_" + testName + "_" + dateString + ".json.gz";


location = "file:///~/serverless/10k.json";


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
}

Script.setTimeout(function() {
    console.log("TRACE START");
    Test.startTracing(DEFAULT_TRACING_RULES);

    //Test.wait(testTime_secs * 1000);
    var ids = Entities.findEntities(MyAvatar.position, 10000);
    console.log('ENTITY COUNT -> ' + ids.length);

    PROFILE("getProperties", function () {
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var properties = Entities.getEntityProperties(id, ['name', 'type', 'locked',
                'visible', 'renderInfo', 'type', 'modelURL', 'materialURL', 'script']);

           
        }
    });

    PROFILE("getMultipleProperties", function() {
        var multipleProperties = Entities.getMultipleEntityProperties(ids, [
                'name', 'type', 'locked',
                'visible', 'renderInfo', 'type', 'modelURL', 'materialURL', 'script'
            ]);
    });


    /*Entities.getMultipleEntityProperties(Entities.findEntities(MyAvatar.position, 10000));
    Entities.getMultipleEntityProperties(Entities.findEntities(MyAvatar.position, 10000), ['position']);
    Entities.getMultipleEntityProperties(Entities.findEntities(MyAvatar.position, 10000), ['name', 'type', 'locked',
        'visible', 'renderInfo', 'type', 'modelURL', 'materialURL', 'script']);
        */
    Test.stopTracing(traceFile);
    console.log("TRACE END");
}, 30 * 1000);