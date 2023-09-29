const express = require('express');
const { connectToDb, getDb } = require('./db')

// init app & middleware
const app = express()

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
    let arr = []

    db.collection('cards')
        .find()
        .sort({ author: 1 })
        .forEach(element => arr.push(element))
        .then(() => {
            res.status(200).json(arr)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch the collection' })
        })
})