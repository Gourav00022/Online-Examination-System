const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
 
  
  /*const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({

    question:{type:String},
    options:[{
        type:String
    }]
})

module.exports = mongoose.model("question", questionSchema);*/