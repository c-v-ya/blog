import React from "react";
import { Link } from "gatsby";

const NavSocial = ({ url, icon, name, ...rest }) => (
  <span>
    {url ? (
      <Link to={rest.href} target="blank">
        {icon} {name}
      </Link>
    ) : (
      <a href={url} target="blank">
        {icon} {name}
      </a>
    )}
  </span>
);

export default NavSocial;
