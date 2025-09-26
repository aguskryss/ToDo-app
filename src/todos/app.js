import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderPending, renderTodos } from './use-cases';


const ElementIDs = {
    TodoList : '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompleted: '.clear-completed',
    TodoFilter: '.filtro',
    PendingCount: '#pending-count'
}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {
    
    const displayTodos = () =>{
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () =>{
        renderPending(ElementIDs.PendingCount);
    }
    //Cuando la funcion App() se llama
    (() =>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();



    //Referencias HTML

    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const todoListUl = document.querySelector(ElementIDs.TodoList);
    const clearCompleted = document.querySelector(ElementIDs.ClearCompleted);
    const filterUl = document.querySelectorAll(ElementIDs.TodoFilter);

    //Listeners
    newDescriptionInput.addEventListener('keyup', (event) => {

        if(event.keyCode != 13) return;
        if(event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
       
    });

    todoListUl.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        //localStorage.setItem('todoStore', todoStore);
        displayTodos();
    });

    todoListUl.addEventListener('click', (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');

        if(!element || !isDestroyElement) return;
        
        todoStore.deleteTodo(element.getAttribute('data-id'));
        //localStorage.setItem('todoStore', todoStore);
        displayTodos();
    });

    clearCompleted.addEventListener('click', ( event ) =>{
        todoStore.deleteCompleted();
        displayTodos();
    });
    
    filterUl.forEach(element =>{
        element.addEventListener('click', (element) => {
            filterUl.forEach(   el => el.classList.remove('selected'));
            element.target.classList.add('selected');
            switch(element.target.text){
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                break;
            }
            displayTodos();
        });
        
    });
}