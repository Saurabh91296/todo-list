console.log("Is Script File Loading");
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID = "todos_list_div";
const NEW_TODO_INPUT_ID="new_todo_title_input";

var show_Complete=1;
var show_Deleted=1;


// IF you want to run a function everytime the page loads
// window.onload OR document.onload
// HW : Differences : Subtle difference when this method is called
// window.onload - more widely supported
//
window.onload = getTodosAJAX();

// addTodos
// id = "todos_list_div"
// todos_data_json =
// parent = div
function addTodoElements(todos_data_json){

    var todos = JSON.parse(todos_data_json);
    // HW : Figure out "encouraged" view of doing this
    var at_parent = document.getElementById("active_list_div");
    var ct_parent = document.getElementById("complete_list_div");
    var dt_parent = document.getElementById("deleted_list_div");
    at_parent.innerText="";
    ct_parent.innerText="";
    dt_parent.innerText="";
    document.getElementById("new_todo_title_input").value="";
    if (at_parent && ct_parent && dt_parent){

        // todos { id : {todo object}, id : {todo:object} ..}
        Object.keys(todos).forEach(
// method returns an array of a given object's own enumerable properties, in the same order as that provided by a for...in loop
            function(key) {
                var todo_element = createTodoElement(key, todos[key]);
                if(todos[key].status=="ACTIVE"){
                    at_parent.appendChild(todo_element);
                }
                if(todos[key].status=="COMPLETE" && show_Complete==1){
                    ct_parent.appendChild(todo_element);
                }
                if(todos[key].status=="DELETED" && show_Deleted==1){
                    dt_parent.appendChild(todo_element);
                }

            }
        )
    }
}
//crete complete button
function create_complete_button(id,todo_object){
    var complete_button=document.createElement("input");
    var state=0;
    complete_button.type="checkbox";
    if(todo_object.status=="COMPLETE"){
        state=1;
        complete_button.setAttribute("checked","true");
    }
    complete_button.innerText="Mark as Completed";
    complete_button.setAttribute("onchange","complete_todo("+id+","+state+")");
    complete_button.setAttribute("class","beradthHorizontal");
    complete_button.setAttribute("id","complete-checkbox");
    return complete_button;
}
//create delete button
function create_delete_button(id){
    var delete_button=document.createElement("button");
    delete_button.innerText="x";
    delete_button.setAttribute("onclick","delete_todo("+id+")");
    delete_button.setAttribute("class","breadthHorizontal");
    delete_button.setAttribute("id","delete-button");
    return delete_button;
}
// id : 1
// todo_object : {title: A Task, status : ACTIVE}
function createTodoElement(id, todo_object){

    var todo_element = document.createElement("div");
    if (todo_object.status == "ACTIVE" || todo_object.status=="COMPLETE"){
        todo_element.appendChild(create_complete_button(id,todo_object));
    }
    var span_element=document.createElement("span");
    span_element.innerText=todo_object.title;
    span_element.setAttribute("id","span_element");
    todo_element.appendChild(span_element);
    // todo_element.innerHTML = "<span>"+todo_object.title+"</span>";
    // // HW: Read custom data-* attributes
    // todo_element.setAttribute("data-id", id);

    if (todo_object.status!="DELETED") {
        todo_element.appendChild(create_delete_button(id));
    }

    todo_element.setAttribute("class", "classTodo"+todo_object.status+ " breadthVertical");
    return todo_element;

}
// Repo URL - https://github.com/malikankit/todo-august-28

function getTodosAJAX(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos", true);
    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE){

            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(xhr.responseText);
            }
        }
    }// end of callback

    xhr.send(data=null);

}

function add_todo_form_submit(){

    //getting the value from the input element
    var new_todo_title=document.getElementById("new_todo_title_input").value;
    //converting the data into the format send to the server

   // console.log(params);
    // xhr - JS object for making requests to server via JS
    var xhr = new XMLHttpRequest();
    //
    xhr.open("POST","/api/todos",true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    var body_data="todo_title="+encodeURI(new_todo_title);
    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE){

            if(xhr.status == STATUS_OK){
                addTodoElements(xhr.responseText);

            }
            else{
                console.log(xhr.responseText);
            }
        }
    }// end of callback
    //console.log(body_data);
    xhr.send(body_data);

}
function get_active_todos() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos/active", true);
    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE){

            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
        }
    }// end of callback

    xhr.send(data=null);
}
function delete_todo(id){
   // console.log(id);
   var xhr=new XMLHttpRequest();
   xhr.open("DELETE","/api/todos/"+id,true);
   xhr.onreadystatechange=function () {
       if(xhr.readyState==RESPONSE_DONE){
           if(xhr.status==STATUS_OK){
               addTodoElements(xhr.responseText);
           }
       }
   }
   xhr.send(data=null);
}

function complete_todo(id,state) {
    console.log(state);
    if(state==1){
       var data ="todo_status=ACTIVE";
    }
    if(state==0){
        var data="todo_status=COMPLETE"
    }
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


    xhr.onreadystatechange = function(){
        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK){
               addTodoElements(xhr.responseText)
            }
            else {console.log(xhr.responseText);}
        }
    }

    xhr.send(data);


}
function hideandshowComplete(id) {
    if(show_Complete==1){
        show_Complete=0;
        getTodosAJAX();
        document.getElementById(id).innerText="Show Completed Items";
    }
    else{
      show_Complete=1;
      getTodosAJAX();
      document.getElementById(id).innerText="Hide Completed Items";
    }

}
function hideandshowDeleted(id) {
    if(show_Deleted==1){
        show_Deleted=0;
        getTodosAJAX();
        document.getElementById(id).innerText="Show Deleted Items";
    }
    else{
        show_Deleted=1;
        getTodosAJAX();
        document.getElementById(id).innerText="Hide Deleted Items";
    }

}