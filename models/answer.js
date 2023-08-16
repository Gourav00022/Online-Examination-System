const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({

    answer:{type:String},
    
})

module.exports = mongoose.model("answer", answerSchema);