import "./index.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContextProvider";
import { checkLoginStatus, logoutUser, getCurrentUserDetails } from "../../services/userService";

const Header = ({ search, setSearchResults, updateLoginStatus,  isLoggedIn}) => {
  const [val, setVal] = useState(search);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await checkLoginStatus();
      updateLoginStatus(response.loggedIn);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const signOut = async () => {
    try {
      await logoutUser();
      updateLoginStatus(false);
      updateUser("");
      navigate('/questions');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const goToProfile = async () => {
    try {
      await getCurrentUserDetails();
      navigate('/profile');
    } catch (error) {
      console.error("Error fetching current user details:", error);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchResults(val, "Search Results");
    }
  };

  const handleInputChange = (e) => {
    setVal(e.target.value);
  };

  const handleLogoClick = () => {
    navigate("/questions");
  };


  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div id="header" className="header">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Stack_Overflow_logo.svg/2560px-Stack_Overflow_logo.svg.png"
        style={{ width: "25%", height: "50%" }}
        onClick={handleLogoClick}
        alt="Stack Overflow Logo"
      />
      <input
        style={{ width: "50%" }}
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleSearchKeyDown}
      />
      {isLoggedIn ? (
        <>
          <button
            className="form_postBtn"
            onClick={goToProfile}
          >
            Profile
          </button>
          <button
            className="form_postBtn"
            onClick={signOut}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button className="form_postBtn" onClick={handleLoginClick}>
          Login
        </button>
      )}
    </div>
  );
};

export default Header;
