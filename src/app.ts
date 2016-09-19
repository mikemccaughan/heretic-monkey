import {Todo} from './todo';

export class App {
    public heading:string;
    public todos:Todo[];
    public todoDescription:string;
    constructor() {
        this.heading = 'Learning Aurelia: Todos';
        this.todos = [];
        this.todoDescription = '';
    }
    addTodo() {
        if (this.todoDescription) {
            this.todos.push(new Todo(this.todoDescription));
            this.todoDescription = '';
        }
    }
    removeTodo(todo:Todo) {
        let index = this.todos.indexOf(todo);
        if (index !== -1) {
            this.todos.splice(index,1);
        }
    }
}