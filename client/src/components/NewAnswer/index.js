// import "./index.css";
import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../tool";
import { addAnswer } from "../../services/answerService";
import { AuthContext } from "../../AuthContextProvider";

const NewAnswer = ({ handleAnswer }) => {
  const { qid } = useParams();
  const [text, setText] = useState("");
  const [textErr, setTextErr] = useState("");
  const { csrfToken } = useContext(AuthContext);
  const postAnswer = async () => {
    let isValid = true;

    if (!text) {
      setTextErr("Answer text cannot be empty");
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer = {
      text: text,
      ans_date_time: new Date(),
    };

    const res = await addAnswer(qid, answer, csrfToken);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };
  return (
    <Form>
      <Textarea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            postAnswer();
          }}
        >
          Post Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
