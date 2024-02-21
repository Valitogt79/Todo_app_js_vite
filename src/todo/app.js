import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store";
import { renderPending, renderTodos } from "./use-cases";


const ElementIDs = {
  TodoList: '.todo-list', 
  NewTodoInput: '#new-todo-input',
  ClearCompletedButton: '.clear-completed',
  Todofilters:'.filtro',
  PendingCountLabel: '#pending-count',
}

/**
 *
 * @param {String} elementId
 */
export const App = (elementId) => {

  const displayTodos = () => {
    
    const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
    renderTodos( ElementIDs.TodoList, todos);
    updatePendingCount();
  }

  const updatePendingCount = () => {
    renderPending(ElementIDs.PendingCountLabel);
  }

  // Cuando la funciona App() se llama
  (() => {
    const app = document.createElement("div");
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displayTodos();
  })();



  // Referencias HTML
  const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
  const todoListUL = document.querySelector(ElementIDs.TodoList);
  const clearCompletedButton = document.querySelector(ElementIDs.ClearCompletedButton);
  const filtersLIs = document.querySelectorAll(ElementIDs.Todofilters);


  //Listeners
  newDescriptionInput.addEventListener('keyup', (event) => {
    if (event.keyCode !== 13) return;  //verifica si se presiona Enter
    if (event.target.value.trim().length === 0) return; //verifica si esta vacio el campo

    todoStore.addTodo(event.target.value);
    displayTodos();
    event.target.value = '';
  });

  todoListUL.addEventListener('click', ( event ) =>{
    const element = event.target.closest('[data-id]' );
    todoStore.toggleTodo(element.getAttribute('data-id'));
    displayTodos();
  });
  
  todoListUL.addEventListener('click', ( event ) =>{
    const isDestroyElement = event.target.className ==='destroy';
    const element = event.target.closest('[data-id]' );
    if(!isDestroyElement || !element) return;
    todoStore.deleteTodo(element.getAttribute('data-id'));
    displayTodos(); /*  todoStore.toggleTodo(element.getAttribute('destroy')  displayTodos(); */
  });
  
  
  clearCompletedButton.addEventListener('click', () =>{
    todoStore.deleteCompleted(); 
    displayTodos();
  });
    /*
  displayTodos(); /*  todoStore.toggleTodo(element.getAttribute('destroy')  displayTodos(); */
 filtersLIs.forEach( element => {
  element.addEventListener('click', (element) => {
    filtersLIs.forEach( el => el.classList.remove('selected') );
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
  })
 });








};



