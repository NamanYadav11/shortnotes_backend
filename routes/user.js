const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User,Todo} = require("../db");
const jwt = require('jsonwebtoken');
const 
{
    signup,
    signin,
    addTodo,
} = require('../zod');
const checkUserMiddleware = require("../middleware/checkuser");

const jwtSecret = process.env.REACT_APP_JWT_SECRET

router.post('/signup',checkUserMiddleware ,async(req, res) => {
    const createPayload = req.body;
    const parsePayload = signup.safeParse(createPayload)

    if(!parsePayload){
        res.status(411).json({
            msg:"You sent the wrong inputs"
        })
        return;
    }

    const username = createPayload.username;
    const password = createPayload.password;
    const name = createPayload.name;

    await User.create({
        name:name,
        username: username,
        password: password
    })

    const token = jwt.sign({username},jwtSecret)
    res.json({
        msg:"Registered successfully",
        token,
        name
    })
})

router.post('/signin', async (req, res) => {
    const createPayload = req.body;
    const parsePayload = signin.safeParse(createPayload)


    if(!parsePayload){
        res.status(411).json({
            msg:"You sent the wrong inputs"
        })
        return;
    }

    const username = createPayload.username;
    const password = createPayload.password;

    const user = await User.findOne({
        username: username,
        password: password
    })




    
    if(user){
        const name = user.name;
        const token = jwt.sign({username},jwtSecret)
        res.json({
            msg:"Registered successfully",
            token,
            name
        })
    }else{
        res.status(403).json({
            msg:'User not found. Please signup and try again'
        })
    }

    
})


router.post("/addtodo",userMiddleware,async(req, res) => {
    const createPayload = req.body;
    const parsePayload = addTodo.safeParse(createPayload)

    if(!parsePayload){
        res.status(411).json({
            msg:"You sent the wrong inputs"
        })
        return;
    }

    const title = createPayload.title;
    const description = createPayload.description;
    const done = false;
    const username = req.username;


    const todo = await Todo.create({
        title: title,
        description: description,
        done: done
    })



    const todoId = todo._id;



    const user = await User.updateOne({
        username: username,
    },{
        "$push":{
            allTodos:todoId
        }
    })



    res.json({
        todoId:todoId,
        msg:"Todo has been added successfully"
    })


})

router.get('/todos',userMiddleware ,async(req,res)=>{
    const username = req.username;

    const user = await User.findOne({ username: username})

    
    const todos = await Todo.find({
        _id:{
            "$in":user.allTodos
        }
    })

    res.json({
        todos: todos
    })

})

router.put("/complete",userMiddleware ,async(req,res)=>{

    const _id = req.body._id;

    const todoUpdate = await Todo.updateOne({
        _id: _id
    },{
        "$set": { 
            done: true,
        } 
    })

    res.json({
        msg:"Task done"
    })


})


router.put("/updateTodo",userMiddleware,async(req,res) => {
    const _id = req.body._id;
    const title = req.body.title;
    const description = req.body.description;

    const todoUpdate = await Todo.updateOne({
        _id: _id
    },{
        "$set": { 
            title:title,
            description:description
        } 
    })
    res.json({
        msg:"Todo updated successfully"
    })
})


router.delete("/deleteTodo/:_id",userMiddleware,async(req,res) => {
    const _id = req.params._id
    const username = req.username


    const todoDelete=await Todo.deleteOne({
        _id: _id,
    })

    await User.updateOne({username: username},{
        $pull:{
            allTodos: _id
        }
    })

    

    res.json({
        msg: "todo deleted",
    })
})



module.exports = router