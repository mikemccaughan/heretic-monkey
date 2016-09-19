System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia) {
        aurelia.use.basicConfiguration();
        aurelia.start().then(() => aurelia.setRoot());
    }
    exports_1("configure", configure);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=main.js.map