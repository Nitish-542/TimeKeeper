import React from "react";
import { Link } from "react-router-dom";
import LayoutTheme from "../components/Layout/LayoutTheme";

const Pagenotfound = () => {
  return (
    <LayoutTheme title={"404"}>
      <div className='pnf'>
        <h1 className='pnf-title'>404</h1>
        <h2 className='pnf-heading'>Oops ! Page Not Found</h2>
        <Link to='/' className='pnf-btn'>
          Go Back
        </Link>
      </div>
    </LayoutTheme>
  );
};

export default Pagenotfound;
