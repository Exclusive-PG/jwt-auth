const {Shema,model} = require("mongoose")

const UserShema = new Shema({
    email:{type: String, unique: true, required: true},
    password:{type: String, required: true},
    isActivated:{type: Boolean, required: true},
    activationLink:{type: String}
})

module.exports = model("User", UserShema);