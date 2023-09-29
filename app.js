const express = require('express');
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

// init app & middleware
const app = express()
app.use(express.json())

// db connection
let db;

connectToDb((err) => {
    if (err) return;
    app.listen(3000, () => {
        console.log("app is listening on port 3000")
    })
    db = getDb()
})


// routes
app.get('/cards', (req, res) => {
    const page = req.query.p || 0
    const elementsPerPage = 3

    let arr = []

    db.collection('cards')
        .find()
        .sort({ author: 1 })
        .skip(page * elementsPerPage)
        .limit(elementsPerPage)
        .forEach(element => arr.push(element))
        .then(() => {
            res.status(200).json(arr)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch the collection' })
        })
})

app.get('/cards/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(500).json({ error: 'Invalid document ID' })
        return;
    }

    db.collection('cards')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch the document' })
        })
})

app.post('/cards', (req, res) => {
    const element = req.body

    db.collection('cards')
        .insertOne(element)
        .then(result => {
            res.status(201).json(element)
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not add new element' })
        })
})

app.delete('/cards/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(500).json({ error: 'Invalid document ID' })
        return;
    }

    db.collection('cards')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not delete the document' })
        })
})

app.patch('/cards/:id', (req, res) => {
    const updates = req.body

    if (!ObjectId.isValid(req.params.id)) {
        res.status(500).json({ error: 'Invalid document ID' })
        return;
    }

    db.collection('cards')
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not update the document' })
        })
})