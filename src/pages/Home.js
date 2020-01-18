import React from "react";
import shibaImg from "../assets/images/shiba.jpg";
import './Home.scss';

export default () => (
    <div className="home">
        <div className="bg">Home Sweet home</div>
        <img src={shibaImg} alt="shiba img" />
    </div>
);