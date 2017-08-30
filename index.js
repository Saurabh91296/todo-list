var express=require('express');
var todos_db=require("./seed.js");
var app=express();


app.use("/", function(req, res, next){
    console.log("Request");
    console.log(req.url);
    console.log(req.method);

    next();
});

//serve static assets in public directory
app.use('/',express.static(__dirname+"/public"));


//return json object of all these todos
app.get("/api/todos",function (req,res) {
    res.json(todos_db.todos);
});

//return active object of all these todos
app.get("/api/todos/active",function (req,res) {
    var todos=todos_db.todos;
    var todos_active={};
    for(var i in todos){
        if(todos[i].status===todos_db.StatusENUMS.ACTIVE){
            todos_active[i]=todos[i];
        }
    }
    res.json(todos_active);
});
//return complete object of all these todos
app.get("/api/todos/complete",function (req,res) {
    var todos=todos_db.todos;
    var todos_complete={};
    for(var i in todos){
        if(todos[i].status===todos_db.StatusENUMS.COMPLETE){
            todos_complete[i]=todos[i];
        }
    }
    res.json(todos_complete);
});
//return deleted object of all these todos
app.get("/api/todos/deleted",function (req,res) {
    var todos=todos_db.todos;
    var todos_deleted={};
    for(var i in todos){
        if(todos[i].status===todos_db.StatusENUMS.DELETED){
            todos_deleted[i]=todos[i];
        }
    }
    res.json(todos_deleted);
});

app.delete("/api/todos/:id",function (req,res) {
   var del_id=req.params.id;
   var todo=todos_db.todos[del_id];
   if(!todo){
       res.status(400).json({err:"todo doesn't exist"});
   }
   else{
       todo.status=todos_db.StatusENUMS.DELETED;
       res.json(todos_db);
   }
});


app.post("/api/todos", function(req, res){

    // Expect a title in the body of the request
    // in the x-www-form-urlencoded format
    // in the style
    //todo_title=<the new title>

    var todo = req.body.todo_title;

    // if you don't send a todo_title

    if (!todo || todo == "" || todo.trim() == ""){
        res.status(400).json({error : "Todo Title Can't Be Empty"});
    }

    else {

        var new_todo_object = {
            title : req.body.todo_title,
            status : todos_db.StatusENUMS.ACTIVE
        }

        todos_db.todos[todos_db.next_todo_id++] = new_todo_object;

        res.json(todos_db.todos);

    }

})





// 4. complete a todo - that's like modifying
// http://localhost:4000/todos/:id PUT


app.put("/api/todos/:id", function(req, res) {


    // todos_db
    // todos_db.data = {id : {title:, status:} , id : {title:, status:}

    var mod_id = req.params.id;
    var todo = todos_db.todos[mod_id];
    // if this todo doesn't exist
    // then send appropriate response to consumer
    if (!todo) {
        res.status(400).json({error: "Can't modify a todo that doesnt exist"});
    }
    else {

        // Modify it if parameters present

        var todo_title = req.body.todo_title;

        if(todo_title && todo_title!="" && todo_title.trim()!=""){
            todo.title = todo_title;

        }

        var todo_status = req.body.todo_status;

        if(todo_status &&
            (todo_status == todos_db.StatusENUMS.ACTIVE ||
                todo_status== todos_db.StatusENUMS.COMPLETE )
        ) {
            todo.status = todo_status;
        }

        res.json(todos_db.todos);
    }


});


app.listen(4001);