import React from "react";

import PropTypes from "prop-types";
import { Link } from "gatsby";

const PostCard = ({ post }) => (
  <div className="mb-6" key={post.path}>
    <div className="max-w-4xl px-10 py-6 bg-white rounded-lg shadow-md">
      <div className="mt-2">
        <Link
          to={post.path}
          className="text-2xl text-gray-700 font-bold hover:underline"
        >
          {post.title}
        </Link>
        <p className="mt-2 text-gray-600">{post.description}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-light text-gray-600">{post.date}</span>
        <span className="px-2 py-1 font-light text-gray-600 ">
          {post.timeToRead} minute read
        </span>
      </div>
    </div>
  </div>
);

PostCard.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string,
    path: PropTypes.string.isRequired,
    image: PropTypes.string,
    timeToRead: PropTypes.number,
  }).isRequired,
};

export default PostCard;
