import { Todo } from "../todos/models/todo.model";

export const Filters = {
    All: 'all',
    Completed: 'Completed',
    Pending: 'Pending'
}

const state = {
    todos:[
        new Todo('Hacer el ABM de paises'),
        new Todo('Hacer el ABM de cargos')
    ],
    filter: Filters.All
}

const initStore = () =>{
    loadStore();
    console.log('InitStore');
}

const loadStore = () => {
    if(!localStorage.getItem('state')) return;

    const { todos = [], filter = Filters.All} = JSON.parse(localStorage.getItem('state'));
    state.todos = todos;
    state.filter = filter;
    
}

const saveStateToStorage = () =>{
    localStorage.setItem('state', JSON.stringify(state));
}

const getTodos = ( filter = Filters.All) => {
    const data = loadStore();
    switch( filter ){
        case Filters.All:
            return [...state.todos];
        case Filters.Completed:
            return state.todos.filter(todo => todo.done);
        case Filters.Pending:
            return state.todos.filter(todo => !todo.done);

        default:
            throw new Error(`Opción ${filter} no es valida.`);
    } 
}


/**
 * 
 * @param {String} description 
 */
const addTodo = (  description  ) => {
    if(!description) throw new Error('La descripción es obligatoria!');
    state.todos.push(new Todo(description));
    saveStateToStorage();
}

/**
 * 
 * @param {String} todoId 
 */
const toggleTodo = (  todoId  ) => {
    if(!todoId) throw new Error('El id es obligatorio');
    state.todos = state.todos.map(todo => {
        if(todo.id === todoId){
            todo.done = !todo.done;
        }
        return todo;
    });

    saveStateToStorage();
}

/**
 * 
 * @param {String} todoId 
 */
const deleteTodo = (  todoId  ) => {
    state.todos = state.todos.filter( todo => todo.id !== todoId);

    saveStateToStorage();
}

const deleteCompleted = () => {
    
    state.todos = state.todos.filter( todo => !todo.done);
    saveStateToStorage();
}

/**
 * 
 * @param {Filters} newFilter 
 */
const setFilter = ( newFilter = Filters.All) => {
    const validFilters = [Filters.All, Filters.Completed, Filters.Pending];

    if ( validFilters.includes(newFilter) ) {
        state.filter = newFilter;
    }

    saveStateToStorage();
}

const getCurrentFilter = () => {
    return state.filter;
}

export default{
    deleteCompleted,
    deleteTodo,
    getCurrentFilter,
    initStore,
    loadStore,
    setFilter,
    toggleTodo,
    getTodos,
    addTodo
}