import React from "react";
import { Link } from "gatsby";

const NavSocial = ({ url, icon, name, ...rest }) => (
  <span>
    {url ? (
      <a href={url} target="blank">
        {icon} {name}
      </a>
    ) : (
      <Link to={rest.href} target="blank">
        {icon} {name}
      </Link>
    )}
  </span>
);

export default NavSocial;
