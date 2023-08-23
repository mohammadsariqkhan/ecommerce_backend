const express = require('express')
const server = express();
const mongoose = require('mongoose')
const productRouter = require('./routes/Products')
const categoriesRouter = require('./routes/Categories')
const brandsRouter = require('./routes/Brands')
const cors = require('cors')
const {createProduct} = require("./controller/Product");
const userRouter = require('./routes/User')
const authRouter = require('./routes/Auth')

server.use(cors(
    {
        exposedHeaders: ['X-Total-Count']
    }
))
server.use(express.json())//to parse req.body
server.use('/products', productRouter.router)
server.use('/categories', categoriesRouter.router)
server.use('/brands', brandsRouter.router)
server.use('/users', userRouter.router)
server.use('/auth', authRouter.router)
main().catch(err => console.log(err))

async function main() {
    await mongoose.connect('mongodb://localhost:27017/ecommerce')
    console.log('database connected')
}

server.get('/', (req, res) => {
    res.end("<h1>started</h1>")
})

server.listen(8080, () => {
    console.log('server is started')
})
