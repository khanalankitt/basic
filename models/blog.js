const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const factSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    fact:{
        type:String,
        required:true
    }
},{timestamps:true})

const Fact = mongoose.model('facts',factSchema);

module.exports = Fact;

