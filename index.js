var express=require('express');
var todos_db=require("./seed.js");
var app=express();
var bodyParser=require('body-parser');

app.use("/", bodyParser.urlencoded({extended:false}));

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

app.post("/api/todos", function(req, res){
    if (!req.body.todo_title){
        res.status(400).json({err: "Todo Title Missing"});

    }

    else {



        todo_title = req.body.todo_title;
        var new_todo_object = {
            title : todo_title,
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
    console.log(req.body);
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

       // console.log(todos_db.todos);
        res.json(todos_db.todos);
    }


});

app.delete("/api/todos/:id",function (req,res) {
    var del_id=req.params.id;
    var todo=todos_db.todos[del_id];
    if(!todo){
        res.status(400).json({err:"todo doesn't exist"});
    }
    else{
        todo.status=todos_db.StatusENUMS.DELETED;
        res.json(todos_db.todos);
    }
});

app.listen(4000);