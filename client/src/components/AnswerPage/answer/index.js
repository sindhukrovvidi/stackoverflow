import { handleHyperlink } from "../../../tool";
import "./index.css";
import { AuthContext } from "../../../AuthContextProvider";
import { useContext } from "react";

// Component for the Answer Page
const Answer = ({ text, ansBy, meta, updateAnswer }) => {
    const {user} = useContext(AuthContext)
    return (
        <div className="answer right_padding">
            <div id="answerText" className="answerText">
                {handleHyperlink(text)}
            </div>
            <div className="answerAuthor">
                <div className="answer_author">{ansBy}</div>
                <div className="answer_question_meta">{meta}</div>
                {user === ansBy ? <button onClick={() => updateAnswer()}> Edit Answer </button> : <></>}
            </div>
        </div>
    );
};

export default Answer;
