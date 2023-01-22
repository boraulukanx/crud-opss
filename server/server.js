const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cors = require('cors')

const FoodModelCopy = require('./models/foodModel')

const connectDB = require('./config/db')
const { update } = require('./models/foodModel')

const port = process.env.PORT || 5000 

connectDB()

app.use(express.json())
app.use(cors())

app.post('/insert', async (req, res) => {

    const foodName = req.body.foodName
    const days = req.body.days

    const food = new FoodModelCopy({
        foodName: foodName, 
        daysSinceIAte: days
    })
    try {
        await food.save();
        res.send("inserted data")
    } catch (error) {
        console.log(error)
    }
})

//Get all food
app.get('/read', async (req, res) => {
        /* INSIDE THE BRACKETS OF AFTER FIND METHOD ! $where: {foodName: "Apple"} */ 
    FoodModelCopy.find({}, (err, result) => {
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
})

//Get food by ObjectID
app.get('/read/:id', (req, res) => {
    FoodModelCopy.findById(req.params.id)
    .then(data => res.json(data))
    .catch(error => res.json(error))
})

app.put('/update', async (req, res) => {

    const newFoodName = req.body.newFoodName
    const id = req.body.id

    try {

       await FoodModelCopy.findById(id, (err, updatedFood) => {
            updatedFood.foodName = newFoodName
            updatedFood.save()
            res.send('update completed')
        })
    } catch (error) {
        console.log(error)
    }

})

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    //res.send(id)
    await FoodModelCopy.findByIdAndRemove(id).exec()
    res.send('deleted')
})

app.listen(port, () => console.log("server is up and running"))