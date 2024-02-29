const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://naman198323:oguDwKp42wj9RVSY@cluster0.w4k9ulc.mongodb.net/todo_app');

const UserSchema = new mongoose.Schema({
    name:String,
    username:String,
    password:String,
    allTodos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Todo"
    }]

})

const TodoSchema = new mongoose.Schema({
    title:String,
    description:String,
    done:Boolean
})

const User = mongoose.model("User",UserSchema);
const Todo = mongoose.model("Todo",TodoSchema);

module.exports = {
    User,
    Todo
}