// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;
const offerSchema = new Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  repeat: Array,
  price: Number,
  offerType: String,
  brand: String,
  model: String,
  offerOnBrand: Boolean,
  offerOnModel: Boolean,
  offerValue: Number,
  newPrice: Number
});

const offers = mongoose.model('offers', offerSchema);

app.post('/offers', async (req, res) => {
  try {
    console.log(req.body);
    const { name, startDate, endDate, repeat, price, offerType, brand, model, offerOnBrand, offerOnModel, offerValue, newPrice } = req.body;
    const newOffer = new offers({
      name,
      startDate,
      endDate,
      repeat,
      price,
      offerType,
      brand,
      model,
      offerOnBrand,
      offerOnModel,
      offerValue,
      newPrice
    });
    const offerList = await newOffer.save();
    res.status(201).json(offerList);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'An error occurred while fetching offers' });
  }
});

app.get('/getOffers', async (req, res) => {
  try {
    console.log(req.query);
    const { startDate, endDate } = req.query;
    const offerList = await offers.find({
      startDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    res.json(offerList);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'An error occurred while fetching offers.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
