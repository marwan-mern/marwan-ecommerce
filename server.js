const express = require('express');
const cors = require('cors');
// const path = require ('path')
const app = express();
const http = require('http');
require('dotenv').config();
const stripe = require('stripe')(`sk_test_51LlFvnIBhKfC20UoeDqV0Icgw4bhWhMC0FhBHCWae17ySelTUz0UcZT2cbcqfEnBenFec9IyfWjBStLsGpmHS4tj00CKwDyKor`);
const server = http.createServer(app);
const {Server} = require('socket.io');

const io = new Server(server, {
  // cors: 'http://localhost:3000',
  cors: 'https://marwan-ecommerce-mern-app.herokuapp.com/',
  methods: ['GET', 'POST', 'PATCH', "DELETE"]
})


const User = require('./models/User.js');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const imageRoutes = require('./routes/imageRoutes.js');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imageRoutes);


app.post('/create-payment', async(req, res)=> {
  const {amount} = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card']
    });
    res.status(200).json(paymentIntent)
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
   }
})

// if(process.env.NODE_ENV==="production"){
//   app.use(express.static('ecomern-frontend-main/build'));
//   app.get('*',(req,res)=>{
//       res.sendFile(path.resolve(__dirname,'ecomern-frontend-main','build','index.html'))
//   })
// }

const PORT = process.env.PORT || 8000;

server.listen(PORT, ()=> {
  console.log('server running at port', PORT)
})

const mongoose = require('mongoose');

const connectionStr = process.env.CONNECTION_URL;

mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})

app.set('socketio', io);
