import "./index.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContextProvider";
import { logoutUser } from "../../services/userService";

const Header = ({ search, setSearchResults }) => {
  const [val, setVal] = useState(search);
  const { loggedIn, signOutAuth, updateUser, csrfToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const Login = () => {
    navigate('/login');
  };

  const signOut = async() => {
    await logoutUser(csrfToken);
    signOutAuth();
    updateUser("")
    navigate('/questions');
  }

  return (
    <div id="header" className="header">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Stack_Overflow_logo.svg/2560px-Stack_Overflow_logo.svg.png"
        style={{ width: "25%", height: "50%" }}
        onClick={() => navigate("/questions")}
      ></img>
      <input
        style={{ width: "50%" }}
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setSearchResults(e.target.value, "Search Results");
          }
        }}
      />
      {loggedIn ? (
        <button
          className="form_postBtn"
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      ) : (
        <button className="form_postBtn" onClick={Login}>
          Login
        </button>
      )}
    </div>
  );
};

export default Header;
