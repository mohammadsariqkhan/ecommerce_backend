const express = require('express')
const server = express();
const mongoose = require('mongoose')
const session = require('express-session')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const passport = require('passport')
const productRouter = require('./routes/Products')
const categoriesRouter = require('./routes/Categories')
const brandsRouter = require('./routes/Brands')
const cors = require('cors')
const {createProduct} = require("./controller/Product");
const userRouter = require('./routes/User')
const authRouter = require('./routes/Auth')
const cartRouter = require('./routes/Cart')
const ordersRouter = require('./routes/Order')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {User} = require("./model/User");
const crypto = require("crypto");
const {isAuth, sanitizeUser, cookieExtractor} = require("./services/common");
const LocalStrategy = require('passport-local').Strategy

const SECRET_KEY = 'SECRET_KEY'


const opts = {}
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = 'SECRET_KEY';

server.use(express.static('build'))
server.use(cookieParser())
server.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
}));
server.use(passport.authenticate('session'));


server.use(cors(
    {
        exposedHeaders: ['X-Total-Count']
    }
))
server.use(express.json())//to parse req.body
server.use('/products', isAuth(), productRouter.router)
server.use('/categories', isAuth(), categoriesRouter.router)
server.use('/brands', isAuth(), brandsRouter.router)
server.use('/users', isAuth(), userRouter.router)
server.use('/auth', authRouter.router)
server.use('/cart', isAuth(), cartRouter.router)
server.use('/orders', isAuth(), ordersRouter.router)
passport.use('local', new LocalStrategy(
    {usernameField:'email'},
    async function (email, password, done) {
        try {
            const user = await User.findOne({email: email})
            if (!user) {
                return done(null, false, {message: 'invalid credentials'})
            }
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {

                    return done(null, false, {message: 'invalid credentials'})

                }
                const token = jwt.sign(sanitizeUser(user), SECRET_KEY);

                done(null, {token})
            })

        } catch (err) {
            done(err)
        }
    }
));


passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({jwt_payload})
    try {
        const user = await User.findById(jwt_payload.id)
        if (user) {
            return done(null,sanitizeUser(user));
        } else {
            return done(null, false);
            // or you could create a new account
        }
    } catch (err) {
        return done(err, false);


    }
}));


passport.serializeUser(function (user, cb) {
    console.log('serialize', user)
    process.nextTick(function () {
        return cb(null, {id: user.id, role: user.role});
    });
});

passport.deserializeUser(function (user, cb) {
    console.log('de-serialize', user)
    process.nextTick(function () {
        return cb(null, user);
    });
});
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
