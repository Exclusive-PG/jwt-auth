require("dotenv").config();
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const moongose = require("mongoose")
const router = require("./router/index")

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api", router)

const startServer = async() =>{
    try{
        await moongose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        app.listen(PORT,()=>{
            console.log(`Server listening the port ${PORT}`)
        })
    }catch(err){
        console.log(err)
    }
}
startServer()
