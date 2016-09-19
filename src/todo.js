System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Todo;
    return {
        setters:[],
        execute: function() {
            class Todo {
                constructor(description) {
                    this.description = description;
                    this.done = false;
                }
            }
            exports_1("Todo", Todo);
        }
    }
});
//# sourceMappingURL=todo.js.map