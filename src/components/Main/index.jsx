
import React, { useEffect, useState } from 'react';
import styles from "./styles.module.css";
import { Form } from 'react-bootstrap';

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [db, setDb] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // Time remaining in seconds
  const [isTimeUp, setIsTimeUp] = useState(false); // Added state to track if time is up

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleOptionChange = (questionId, option) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionId]: option
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedOptions); // send selected options to server

    let count = 0;
    const ids = Object.keys(selectedOptions);

    ids.forEach((id) => {
      const selectedOption = selectedOptions[id];
      const correctOption = correctAnswer[id];

      console.log(`Selected Option for question with ID ${id}: ${selectedOption}`);
      console.log(`Correct Option for question with ID ${id}: ${correctOption}`);

      if (correctOption !== undefined && selectedOption === correctOption) {
        console.log(`Question with ID ${id}: Correct answer selected (${selectedOption})`);
        count++;
      }
    });

    setCorrectCount(count);
    
  };

  useEffect(() => {
    fetch('http://localhost:8080/')
      .then(response => response.json())
      .then(data => {
        const [questions] = data;
        const answerMap = {};

        questions.forEach(question => {
          answerMap[question._id] = question.correctAnswer;
        });

        setDb(questions);
        setCorrectAnswer(answerMap);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const startTime = () => {
    const countdownTimer = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1);
    }, 1000);

    if (timeRemaining === 0) {
      clearInterval(countdownTimer);
      setIsTimeUp(true);
      handleSubmit(new Event('submit')); // Automatically submit the response
    }

    return () => clearInterval(countdownTimer);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    startTime();
  };

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <>
      <div className={styles.main_container}>
        <nav className={styles.navbar}>
          <h1>facebook</h1>
          <button className={styles.white_btn} onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
      {!quizStarted && (
        <div>
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      )}
      {quizStarted && (
        <>
          <div>Time Remaining: {timeRemaining} seconds</div>
          <Form onSubmit={handleSubmit}>
            {db.map(value => (
              <div key={value._id}>
                <h2>{value.question}</h2>
                {value.options.map(option => (
                  <div key={option}>
                    <Form.Check
                      type='radio'
                      name={value._id}
                      value={option}
                      checked={selectedOptions[value._id] === option}
                      onChange={() => handleOptionChange(value._id, option)}
                      label={option}
                    />
                  </div>
                ))}
              </div>
            ))}
            <button type='submit' disabled={isTimeUp}>Submit</button>
          </Form>
          {isTimeUp && (
            <div>
              <h3>Time's up!</h3>
              <p>Correct Answers: {correctCount}</p>
            </div>
          )}
          {!isTimeUp && (
            <p>Correct Answers: {correctCount}</p>
          )}
        </>
      )}
    </>
  );
};

export default Main;
