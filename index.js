require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const Question = require('./models/question');
const Answer = require('./models/answer');

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get('/', async (req, res) => {
  try {
    const questions = await Question.find({});
    

    const data = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

    const dataArr = [data];

    console.log(dataArr);
    res.send(dataArr);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));



