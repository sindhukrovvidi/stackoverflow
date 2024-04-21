import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../tool";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import {
  updateQuestion,
  deleteQuestionById,
} from "../../services/questionService";
import { ToastContainer, toast } from "react-toastify";

const EditQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { qid } = useParams();

  const { currTitle, currText, currTags } = location.state || {};

  const [title, setTitle] = useState(currTitle);
  const [text, setText] = useState(currText);
  const [tag, setTag] = useState(currTags);

  const [titleErr, setTitleErr] = useState("");
  const [textErr, setTextErr] = useState("");
  const [tagErr, setTagErr] = useState("");

  const handleQuestions = () => {
    navigate("/questions");
  };
  const updateTheQuestion = async () => {
    let isValid = true;
    if (!title) {
      setTitleErr("Title cannot be empty");
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      isValid = false;
    }

    if (!text) {
      setTextErr("Question text cannot be empty");
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    let tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    if (tags.length === 0) {
      setTagErr("Should have at least 1 tag");
      isValid = false;
    } else if (tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      isValid = false;
    }

    for (let tag of tags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      return;
    }

    const question = {
      title: title,
      text: text,
      tags: tags,
      modifiedOn: new Date(),
    };

    const res = await updateQuestion(qid, question);
    if (res && res._id) {
      toast.success("Successfully updated the question.");
      handleQuestions();
    } else {
      toast.error("Unable to update the question. Login or try later!");
    }
  };

  const deleteTheQuestion = async () => {
    try {
      const res = await deleteQuestionById(qid);
      if (res?.data?.status === 200 || res?.response?.data?.status === 200) {
        toast.success("Successfully delted the question!");
        handleQuestions();
      } else {
        toast.error(
          res?.response?.data?.message ||
            "Unable to delete the question, login and try again!"
        );
      }
    } catch (error) {
      console.log("Error while deleting the question ", error);
    }
  };

  return (
    <Form>
      <ToastContainer />
      <Input
        title={"Question Title"}
        hint={"Limit title to 100 characters or less"}
        id={"formTitleInput"}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <Textarea
        title={"Question Text"}
        hint={"Add details"}
        id={"formTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            updateTheQuestion();
          }}
        >
          Update Question
        </button>
        <button
          className="form_delete_postBtn"
          onClick={() => {
            deleteTheQuestion();
          }}
        >
          Delete Question
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default EditQuestion;
