import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const Post = ({ title, date, description, path }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
    <p>
      <em>Posted on {date}</em>
    </p>
    <Link to={path}>Read more</Link>
  </div>
);

Post.propTypes = {
  date: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Post;
