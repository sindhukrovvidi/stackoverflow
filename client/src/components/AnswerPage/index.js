import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { getMetaData } from "../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../services/questionService";
import { AuthContext } from "../../AuthContextProvider";

// Component for the Answers page
const AnswerPage = ({ handleNewQuestion, handleNewAnswer }) => {
    const { qid } = useParams();
    const [question, setQuestion] = useState({});
    const {csrfToken} = useContext(AuthContext)
    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid, csrfToken);
            setQuestion(res || {});
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);

    return (
        <>
            <AnswerHeader
                ansCount={
                    question && question.answers && question.answers.length
                }
                title={question && question.title}
                handleNewQuestion={handleNewQuestion}
            />
            <QuestionBody
                views={question && question.views}
                text={question && question.text}
                askby={question && question.asked_by}
                meta={question && getMetaData(new Date(question.ask_date_time))}
            />
            {question &&
                question.answers &&
                question.answers.map((a, idx) => (
                    <Answer
                        key={idx}
                        text={a.text}
                        ansBy={a.ans_by}
                        meta={getMetaData(new Date(a.ans_date_time))}
                    />
                ))}
            <button
                className="bluebtn ansButton"
                onClick={() => {
                    handleNewAnswer(qid);
                }}
            >
                Answer Question
            </button>
        </>
    );
};

export default AnswerPage;
