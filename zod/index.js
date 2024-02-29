const zod = require('zod');

const signup = zod.object({
    username:zod.string().email(),
    password:zod.string().min(3)
})

const signin = zod.object({
    username:zod.string().email(),
    password:zod.string().min(3)
})

const addTodo = zod.object({
    title:zod.string(),
    description:zod.string(),
    
}) 

const updatetodos = zod.object({
    _id:zod.string(),
})


module.exports = {
    signin: signin,
    signup: signup,
    addTodo: addTodo,
    updatetodos: updatetodos
}