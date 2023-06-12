import * as React from "react";
import { Link, useMatch, useResolvedPath, Navigate } from "react-router-dom";
const NavLink = ({ children, to, ...props }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    
    <div className={`${props.liClass} ${match ? "active" : ""}`} >
      <Link
        onClick={props.onClick}
        to={to}
        className={props.className}
        title={props.title} >
        {children}
      </Link>
    </div>
  );
};

export default NavLink;
