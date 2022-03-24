

const express  = require('express')
const res = require('express/lib/response')

//init app & middleware

const app = express()

app.listen (3000, ()=> {
    console.log('app listening on port 3000')
})

//routes - res = response , req = request
app.get('/books', (req,res)) {
    res.json({msg:"welcome to novel heroes"})
}