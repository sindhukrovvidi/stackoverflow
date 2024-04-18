import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";
import { useEffect, useState } from "react";
import { getQuestionsByFilter } from "../../services/questionService";

const QuestionPage = ({
    title_text = "All Questions",
    search,
    clickTag,
    handleAnswer,
    handleNewQuestion,
}) => {
    const [qlist, setQlist] = useState([]);
    const [questionOrder, setQuestionOrder] = useState("newest")

    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionsByFilter(questionOrder, search);
            setQlist(res || []);
        };

        fetchData().catch((e) => console.log(e));
    }, [questionOrder, search]);
    return (
        <>
            <QuestionHeader
                title_text={title_text}
                qcnt={qlist.length}
                questionOrder={questionOrder}
                setQuestionOrder={setQuestionOrder}
                handleNewQuestion={handleNewQuestion}
            />
            <div id="question_list" className="question_list">
                {qlist.map((q, idx) => (
                    <Question
                        q={q}
                        key={idx}
                        clickTag={clickTag}
                        handleAnswer={handleAnswer}
                    />
                ))}
            </div>
            {title_text === "Search Results" && !qlist.length && (
                <div className="bold_title right_padding">
                    No Questions Found
                </div>
            )}
        </>
    );
};

export default QuestionPage;
