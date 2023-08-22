const mongoose = require('mongoose')
const {version} = require("mongoose");

const {Schema} = mongoose;

const BrandSchema = new Schema({
    label: {type: String, require: true,unique:true},
    value: {type: String, require: true,unique:true},

})
const virtual = BrandSchema.virtual('id')
virtual.get(function (){
    return this._id
})
BrandSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function (doc,ret){delete ret._id}
})
exports.Brand = mongoose.model('Brand', BrandSchema)

