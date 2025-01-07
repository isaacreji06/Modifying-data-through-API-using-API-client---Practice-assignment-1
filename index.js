const express = require('express');
const moongose=require('mongoose')
const { resolve } = require('path');
require('dotenv').config();
const menu=require('./Schema.js')

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

const MONGO_DB_URL=process.env.MONGO_DB_URL;
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
moongose.connect(MONGO_DB_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>console.log("Connected to the database successfully"))
.catch((err)=>{
  console.log("an error occured",err)
})
app.post('/menu',(req,res)=>{
  const newMenu=new menu(req.body);
  newMenu.save()
  .then(()=>res.status(201).json({ message: "Menu item added successfully!" }))
  .catch((error)=>{
    res.status(500).json({ message: "An error occurred", error: error.message })
  })
})
app.get('/menu',(req,res)=>{
  menu.find()
  .then((items)=>{
    res.status(200).json(items)
  })
  .catch((err)=>{
    res.status(500).json({ message: "An error occurred", error: err.message })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
