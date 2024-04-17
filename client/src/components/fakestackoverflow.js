import React, {useState} from "react";
import Header from "./Header";
import SideBarNav from "./SideBarNav";
// import { Route, Navigate , Routes} from "react-router-dom";
import { useNavigate,  } from "react-router-dom";

export default function fakeStackOverflow({children}) {
    const [selectedTab, setSelectedTab] = useState('q');
    const navigate = useNavigate();

    const handleQuestions = () => {
        setSelectedTab('q')
        navigate("/questions")
    }

    const handleTags = () => {
        setSelectedTab('t')
    }

    const handleFavourites = () => {
        setSelectedTab('f')
    }

    return (
       <div id="main-content" style={{height: '100vh'}}>
        <Header></Header>
        <div id="main" className="main">
            <SideBarNav
                selected={selectedTab}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
                handleFavourites={handleFavourites}
            />
            <div id="right_main" className="right_main">
                {children}
            </div>
        </div>
       </div>
    );
}
