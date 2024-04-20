import "./index.css";
import React, { useContext } from "react";
import { handleHyperlink } from "../../../tool";
import { AuthContext } from "../../../AuthContextProvider";

// Component for the Question's Body
const QuestionBody = ({  views, text, askby, meta, updateQuestion, modifiedOn }) => {
  const { user } = useContext(AuthContext);

  return (
    <div id="questionBody" className="questionBody right_padding">
      <div className="bold_title answer_question_view">{views} views</div>
      <div className="answer_question_text">{handleHyperlink(text)}</div>
      <div className="answer_question_right">
        <div className="question_author">{askby}</div>
        <div className="answer_question_meta">asked {meta}</div>
        {user === askby ? <button onClick={() => updateQuestion()}> Edit Question </button> : <></>}
        {modifiedOn ?  <div className="answer_question_meta">modified {modifiedOn}</div> : <></>}
      </div>
    </div>
  );
};

export default QuestionBody;
