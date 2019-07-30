import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './errors/not-found/not-found.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';


const routes: Routes = [
    {
        path: '',
        component: TodoListComponent
    },
    { 
        path: '**', 
        component: NotFoundComponent 
    }
];


@NgModule({
    imports: [ 
        RouterModule.forRoot(routes) 
    ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }