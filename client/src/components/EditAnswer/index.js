import { useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../tool";
import { AuthContext } from "../../AuthContextProvider";
import { updateAnswer } from "../../services/answerService";
import { ToastContainer, toast } from "react-toastify";
import { deleteAnswerById } from "../../services/answerService";

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
      toast.success('Successfully updated the Answer');
      handleAnswer(qid);
    } else {
      toast.error('Unable to update the answer. Login or try later!')
    }
  };

  const deleteTheAnswer = async () => {
    try {
      const res = await deleteAnswerById(aid, csrfToken);
      if (res?.data?.status === 200 || res?.response?.data?.status === 200) {
        toast.success("Successfully deleted the answer!");
        handleAnswer(qid);
      } else {
        toast.error(
          res?.response?.data?.message ||
            "Unable to delete the answer, login and try again!"
        );
      }
    } catch (error) {
      console.log("Error while deleting the question ", error);
    }
  }

  return (
    <Form>
      <ToastContainer />
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
        <button
          className="form_delete_postBtn"
          onClick={() => {
            deleteTheAnswer();
          }}
        >
          Delete Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default EditAnswer;
