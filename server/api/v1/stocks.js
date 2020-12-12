const axios = require('axios');
const Router = require("express").Router();
const { Stock, BigStockData } = require("../../models")

Router.post("/all-data", async (req, res) => {
    try {
    //  const { data } = await axios.get('http://localhost:8000/all-symbols')   
     const new_stocks = await BigStockData.bulkCreate(req.body)
     return res.json({ created: "True" });
    } catch (err) {
        console.log(err);
      return res.status(400).json({
        error: "error occured",
      });
    }
  });

Router.get('/all', async (req, res) => {
  try{
    const data = await BigStockData.findAll()
    res.json(data)
  } catch(err){
    console.log(err);
  }  
    
})  

module.exports = Router;
