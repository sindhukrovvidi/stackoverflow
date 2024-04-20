import { useEffect, useState, useContext } from "react";
import "./index.css";
import Tag from "./tag";
import { getTagsWithQuestionNumber } from "../../services/tagService";
import { AuthContext } from "../../AuthContextProvider";

const TagPage = ({ clickTag, handleNewQuestion }) => {
  const [tlist, setTlist] = useState([]);
  const { csrfToken } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      let res = await getTagsWithQuestionNumber(csrfToken);
      setTlist(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, []);
  return (
    <>
      <div className="space_between right_padding">
        <div className="bold_title">{tlist.length} Tags</div>
        <div className="bold_title">All Tags</div>
        <button
          className="bluebtn"
          onClick={() => {
            handleNewQuestion();
          }}
        >
          Ask a Question
        </button>
      </div>
      <div className="tag_list right_padding">
        {tlist.map((t, idx) => (
          <Tag key={idx} t={t} clickTag={clickTag} />
        ))}
      </div>
    </>
  );
};

export default TagPage;
