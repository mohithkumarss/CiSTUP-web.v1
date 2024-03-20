import React from "react";
import logo from "../assets/logo.svg";
import "./nav.css";

function Nav() {
  return (
    <nav id="nav">
      <div id="logo">
        <img src={logo} alt="" />
        <hr />
      </div>
    </nav>
  );
}

export default Nav;
