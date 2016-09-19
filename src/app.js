System.register(['todo'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var todo_1;
    var App;
    return {
        setters:[
            function (todo_1_1) {
                todo_1 = todo_1_1;
            }],
        execute: function() {
            class App {
                constructor() {
                    this.heading = 'Todos';
                    this.todos = [];
                    this.todoDescription = '';
                }
                addTodo() {
                    if (this.todoDescription) {
                        this.todos.push(new todo_1.Todo(this.todoDescription));
                        this.todoDescription = '';
                    }
                }
                removeTodo(todo) {
                    let index = this.todos.indexOf(todo);
                    if (index !== -1) {
                        this.todos.splice(index, 1);
                    }
                }
            }
            exports_1("App", App);
        }
    }
});
//# sourceMappingURL=app.js.map