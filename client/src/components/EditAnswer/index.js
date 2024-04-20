import { useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../tool";
import { AuthContext } from "../../AuthContextProvider";
import { updateAnswer } from "../../services/answerService";

const EditAnswer = ({ handleAnswer }) => {
  const { csrfToken } = useContext(AuthContext);
  const location = useLocation();
  const { aid } = useParams();

  const { currText, qid} = location.state || {}

  const [text, setText] = useState(currText);
  const [textErr, setTextErr] = useState("");

  const updateTheAnswer = async () => {
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
      modifiedOn: new Date(),
    };

    const res = await updateAnswer(aid, answer, csrfToken);
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
            updateTheAnswer();
          }}
        >
          Update Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default EditAnswer;
