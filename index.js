const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
// username: ahmedsaadaf
// password: $aad#af 
const app = express()
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const uri = "mongodb+srv://ahmedsaadaf:<password>@cluster0.bm8cn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const uri = "mongodb+srv://shadin:shadin1234@cluster0.17hrv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = "mongodb://localhost/27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
  const productCollection = client.db("admin").collection("saadafData");

app.get('/product', (req,res) => {
 productCollection.find({})
 .toArray((err,documents) =>{
   res.send(documents);
 })
})


app.get('/product/:id', (req,res) => {
  productCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err,documents) =>{
    res.send(documents[0]);
  })

})

app.post('/addProduct', (req, res) =>{
  const product= req.body;
  productCollection.insertOne(product)
  .then(result => {
    console.log('Product added successfully');
    res.redirect('/')
   }) 
})



app.patch('/update/:id',(req, res) => {
  console.log(req.body.price);
  productCollection.updateOne({_id: ObjectId(req.params.id)},
  {
    $set:{price: req.body.price, quantity: req.body.quantity}
  })
  .then(result => {
  //  console.log(result);
   res.send(result.modifiedCount > 0);
   
  })            
})


app.delete('/delete/:id',(req, res) => {
  productCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result=>{
    // console.log(result);
    res.send(result.deletedCount > 0);
    
  })
})

});


app.listen(4000);