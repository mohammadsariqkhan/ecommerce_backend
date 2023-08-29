
const passport = require('passport')
exports. isAuth =(req, res, done)=> {
   return passport.authenticate('jwt')
}
exports.sanitizeUser = (user) => {
    return {id:user.id,role:user.role}
}
exports.cookieExtractor = function (req){
    let token = null;
    if(req && req.cookies){
        token = req.cookies['jwt']
    }
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWUxYmY2MjI0ZTJjZjQxNDc2ODVlZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkzMzI2NTIxfQ.5N2b77_KCDBqQwYaUg-Q5ORN5WVIhSpkjoXmYXA2d7o"
     return token
}