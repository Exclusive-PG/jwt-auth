const {Shema,model, Schema} = require("mongoose")

const TokenShema = new Shema({
    user:{type: Schema.Types.ObjectId, ref: "User"},
    refreshToken:{type: String, required: true},

})

module.exports = model("Token", TokenShema);