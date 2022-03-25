

const express  = require('express')
const { ObjectId } = require('mongodb')
const {connectToDb, getDb} = require('./db')

//init app & middleware

const app = express()
app.use(express.json())

//db connection
let db

connectToDb((err) => {
    if(!err) {
        app.listen(3000, ()=> {
            console.log('app listening on port 3000')
        })
       db = getDb();
    }
})

//routes - res = response , req = request
app.get('/books', (req,res) => {
    let books = []
    db.collection('novels')
    .find()
    .sort({author:1})
    .forEach(book => books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch(()=> {
        res.status(500).json({error: 'Could not fetch the documents'})
    })   
})

app.get('/book/:id', (req,res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('novels')
        .findOne({_id:ObjectId(req.params.id)})
        .then(book=>{
            res.status(200).json(book)
        })
        .catch(()=> {
            res.status(500).json({error: 'Could not fetch the documents'})
        })   
    }
    else {
        res.status(500).json({msg:'Invalid Object Id'})
    }
})

app.get('/read/:id/:page', (req,res) => {
    const pipelines = [
        [{$match:{_id:ObjectId("623c3fe7db65cd2e2b3c3105")}},{$unwind: "$content"},{$match:{"content.page":"1"}},{$project:{"content.content":1,"content.page":1}}]
    ]
    if(ObjectId.isValid(req.params.id)) {
        db.collection('novels')
        .aggregate( [{$match:{_id:ObjectId("623c3fe7db65cd2e2b3c3105")}},{$unwind: "$content"},{$match:{"content.page":"1"}},{$project:{"content.content":1,"content.page":1}}])
        .toArray()
        .then(page=>{
            res.status(200).json(page)
        })
        .catch(()=> {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
    }
    else {
        res.status(500).json({msg:'Invalid Object Id'})
    }
})

app.post('/newbook', (req,res) => {
    //issues to solve, the data should be verified before sent to db
    const book = req.body
    db.collection('novels')
    .insertOne(book)
    .then(result=>{
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

app.delete('/removebook/:id', (req,res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('novels')
        .findOne({_id:ObjectId(req.params.id)})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(()=> {
            res.status(500).json({error: 'Could not delete the documents'})
        })   
    }
    else {
        res.status(500).json({msg:'Invalid Object Id'})
    }
})