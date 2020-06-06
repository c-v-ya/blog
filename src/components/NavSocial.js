import React from "react";
import { Link } from "gatsby";

const NavSocial = ({ url, icon, name }) => (
  <span>
    <Link to={url} target="blank">
      {icon} {name}
    </Link>
  </span>
);

export default NavSocial;
