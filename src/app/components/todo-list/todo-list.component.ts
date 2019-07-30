import { Component, OnInit } from '@angular/core';
import { Todo } from '../../interfaces/todo';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  animations: [
    trigger('fade', [

      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(200, style({ opacity: 1, transform: 'translateY(0px)'}))
      ]),

      transition(':leave', [
        animate(200, style({ opacity: 0, transform: 'translateY(30px)' }))
      ]),

    ])
  ]
})
export class TodoListComponent implements OnInit {
  user: string;
  todos: Todo[];
  todosList: Todo[];
  todoTitle: string;
  idForTodo: number;
  beforeEditCache: string;
  filter: string;
  anyRemainingModel: boolean;
  showForm: boolean = false
  todoType: string;
  editItem: boolean = false;
  currentDate: Date;
  dateCreated: string;
  beforeEditCacheDate: string;
  beforeEditCacheContent: string;
  beforeEditCacheType: string;


  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.anyRemainingModel = true;
    this.filter = 'all';
    this.beforeEditCache = '';
    this.beforeEditCacheType = '';
    this.beforeEditCacheDate = '';
    this.beforeEditCacheContent = '';
    this.idForTodo = 3;
    this.todoTitle = '';
    this.todoType = '';
    this.currentDate = new Date();
    this.dateCreated = this.currentDate.getFullYear() +'/'+ (this.currentDate.getMonth()+1) +'/'+ this.currentDate.getDate();
    this.todosList = [
      {
        'uuid': 1,
        'type': 'work',
        'content': 'Some task',
        'done': false,
        'date_created': this.dateCreated,
        'open': false
      },
      {
        'uuid': 2,
        'type': 'shopping',
        'content': 'Some task 2',
        'done': true,
        'date_created': this.dateCreated,
        'open': false
      }
    ];

    if(!localStorage.getItem('todos')){
      localStorage.setItem('todos', JSON.stringify(this.todosList) );
    }

    this.todos = JSON.parse(localStorage.getItem('todos'));
  }

  verifyAuthentication(user: string){
    if(!user){
      this.router.navigateByUrl('/');
    }
  }

  addTodo(): void {
    if ((this.todoTitle.trim().length === 0) || (this.todoType.trim().length === 0)){
      return;
    }


    if (!(this.todoType === 'work' || this.todoType === 'shopping')){
      alert('The task type you provided is not supported. You can only use shopping or work.');
      return
    }
    
    this.todos.push({
      uuid: this.idForTodo,
      type: this.todoType,
      content: this.todoTitle,
      done: false,
      date_created: this.currentDate.getFullYear() +'/'+ (this.currentDate.getMonth()+1) +'/'+ this.currentDate.getDate(),
      open: false
    })

    localStorage.setItem('todos', JSON.stringify(this.todos) );
    console.log('Add TO-DO');
    console.log(this.todos);

    this.todoTitle = '';
    this.todoType = '';
    this.idForTodo++;
  }

  toggleShowForm (){
    this.showForm = !this.showForm
    return this.showForm;
  }

  infoTodo(todo: Todo): void {
    todo.open = !todo.open;
  }

  editTodo(todo: Todo): void {
    if(this.formValidator(todo)){
      this.editItem = !this.editItem;
      if(!this.editItem){
        todo.open = !todo.open;
      }
    }
  }

  doneEdit(todo: Todo): void {
    if(this.formValidator(todo)){
      localStorage.setItem('todos', JSON.stringify(this.todos) );
      console.log('Edit TO-DO');
      console.log(this.todos);
  
      this.anyRemainingModel = this.anyRemaining();
      todo.open = false;
    } 
  }

  formValidator(todo: Todo){
    this.beforeEditCacheContent = todo.content;
    this.beforeEditCacheType = todo.type;
    this.beforeEditCacheDate = todo.date_created;
    
    if (todo.content.trim().length === 0 || todo.type.trim().length === 0 || todo.date_created.trim().length === 0) {
      alert('Bad move! Try removing the task instead of deleting its content.');

      todo.content = this.beforeEditCacheContent;
      todo.type = this.beforeEditCacheType;
      todo.date_created = this.beforeEditCacheDate;

      return false
    }

    if (!(todo.type === 'work' || todo.type === 'shopping')){
      todo.type = this.beforeEditCacheType;
      alert('The task type you provided is not supported. You can only use shopping or work.');
      return false
    }

    return true
  }

  cancelEdit(todo: Todo): void {
    if(this.formValidator(todo)){
      todo.open = false;

      localStorage.setItem('todos', JSON.stringify(this.todos) );
    }
  }

  deleteTodo(uuid: number): void {
    let confirmDelete = confirm('Delete the task?');

    if(confirmDelete){
      this.todos = this.todos.filter(todo => todo.uuid !== uuid);
      localStorage.setItem('todos', JSON.stringify(this.todos) );
      console.log('Delete TO-DO');
      console.log(this.todos);
    }
  }

  remaining(): number {
    return this.todos.filter(todo => !todo.done).length;
  }

  atLeastOneCompleted(): boolean {
    return this.todos.filter(todo => todo.done).length > 0;
  }

  clearCompleted(): void {
    let confirmDelete = confirm('Are you sure?');

    if(confirmDelete){
      this.todos = this.todos.filter(todo => !todo.done);
      localStorage.setItem('todos', JSON.stringify(this.todos) );
      console.log('Delete all TO-DO Completed');
      console.log(this.todos);
    }
  }

  checkAllTodos(): void {
    this.todos.forEach(todo => todo.done = (<HTMLInputElement>event.target).checked)
    this.anyRemainingModel = this.anyRemaining();
  }

  anyRemaining(): boolean {
    return this.remaining() !== 0;
  }

  todosFiltered(): Todo[] {
    if (this.filter === 'all') {
      return this.todos;
    } else if (this.filter === 'active') {
      return this.todos.filter(todo => !todo.done);
    } else if (this.filter === 'completed') {
      return this.todos.filter(todo => todo.done);
    }

    return this.todos;
  }



}

