import { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getMetaData } from "../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../services/questionService";
import { useNavigate } from "react-router-dom";
import { getTagsWithIds } from "../../services/tagService";
import { updateVote } from "../../services/voteService";
import { AuthContext } from "../../AuthContextProvider";
import { toast } from "react-toastify";

// Component for the Answers page
const AnswerPage = ({ handleNewQuestion, handleNewAnswer }) => {
    const { qid } = useParams();
    const [question, setQuestion] = useState({});
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [voteCount, setVoteCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid);
            setQuestion(res || {});
            if(res) {
                const sum = res?.votes.reduce((acc, obj) => acc + obj.value, 0);
                setVoteCount(sum)
            }
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);

    const updateQuestion = async() => {
        const {title, text, tags} = question;
        const tag = await getTagsWithIds(tags);
        const tagNames = tag.map(currTag => currTag.name);
        navigate(`/updateQuestion/${qid}`, {
             state: { currTitle: title, currText: text, currTags: tagNames.join(" ") } 
          });
    }

    const updateVoteValue = async(voteValue) => {
        const response = await updateVote(qid, voteValue, user?._id);
        if (response?.status === 200) {
          const { votes } = response;
          const sum = votes?.reduce((acc, obj) => acc + obj.value, 0);
          setVoteCount(sum)
          toast.success("Updated the vote!")
        } else if (response?.status === 400) {
            toast.warning("Your vote has already been updated!");
        }
    }

    const updateAnswer = async(a) => {
        const { text} = a;
        navigate(`/updateAnswer/${a._id}`, {
             state: { currText: text, qid: qid } 
          });
    }

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
                title={question && question.title}
                views={question && question.views}
                text={question && question.text}
                askby={question && question.asked_by}
                meta={question && getMetaData(new Date(question.ask_date_time))}
                updateQuestion={updateQuestion}
                modifiedOn={question && question.modifiedOn ? getMetaData(new Date(question.modifiedOn)) : ''}
                updateVoteValue={updateVoteValue}
                voteCount={voteCount}
            />
            {question &&
                question.answers &&
                question.answers.map((a, idx) => (
                    <Answer
                        key={idx}
                        text={a.text}
                        ansBy={a.ans_by}
                        meta={getMetaData(new Date(a.ans_date_time))}
                        updateAnswer={() => updateAnswer(a)}
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
