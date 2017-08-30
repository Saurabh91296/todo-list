console.log("Is script file loading ");
const RESPONSE_DONE=4;
const STATUS_OK=200;
const TODOS_LIST_ID="todos_list_div";
function add_todo_elements(id, todos_data_json){

    var parent = document.getElementById(id);
    parent.innerText = todos_data_json;
}
function getTodosAJAX() {
    //AJAX -xmlhttprequest object
    //make requests to the server
    //1.reloading the webpage
    //2.asynchronously
    var xhr=new XMLHttpRequest();
    xhr.open("GET","/api/todos",true);
    xhr.onreadystatechange=function () {
        //write code here that needs to be executed after response
        //has response received
        if(xhr.readyState==RESPONSE_DONE){

            if(xhr.status==STATUS_OK){
                console.log(xhr.responseText);
                add_todo_elements(TODOS_LIST_ID, xhr.responseText);
            }
        }
    }
    xhr.send(data=null);
}