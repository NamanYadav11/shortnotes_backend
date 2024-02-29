const { User } = require("../db")


async function checkUserMiddleware (req, res, next) {

    const username = req.body.username

    const user = await User.findOne({
        username: username
    })

    if(user){
        res.json({
            msg: "User already exists"
        })
    }
    else{
        next();
    }

}

module.exports = checkUserMiddleware