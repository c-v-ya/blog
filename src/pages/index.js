import React, { useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import InfiniteScroll from "react-infinite-scroll-component";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/free-brands-svg-icons/faCss3";

import Layout from "../components/Layout";
import PostCard from "../components/PostCard";

const Home = ({ data }) => {
  const listData = [];

  data.allMarkdownRemark.edges.map(({ node }) => {
    const { title, date, description, path, image } = node.frontmatter;
    const { timeToRead } = node;
    listData.push({
      title,
      date,
      description,
      path,
      image,
      timeToRead,
    });
    return listData;
  });

  const [count, setCount] = useState({
    prev: 0,
    next: 10,
  });
  const [hasMore, setHasMore] = useState(true);
  const [current, setCurrent] = useState(
    listData.slice(count.prev, count.next)
  );
  const getMorePosts = () => {
    if (current.length === listData.length) {
      setHasMore(false);
      return;
    }
    setCurrent(
      current.concat(listData.slice(count.prev + 10, count.next + 10))
    );
    setCount((prevState) => ({
      prev: prevState.prev + 10,
      next: prevState.next + 10,
    }));
  };

  return (
    <Layout>
      <Helmet>
        <title>Constantine's blog</title>
        <meta
          charSet="utf-8"
          name="description"
          property="og:description"
          content="Constantine's blog"
        />
        <meta
          name="keywords"
          content="python, django, react, web development, blog"
        ></meta>
        <meta name="author" content="Constantine Yarushkin"></meta>
        <link rel="canonical" href="https://c-v-ya.github.io/blog" />
      </Helmet>
      <InfiniteScroll
        dataLength={current.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={<div className="text-xl text-center">Loading...</div>}
      >
        {current &&
          current.map((post, index) => <PostCard key={index} post={post} />)}
      </InfiniteScroll>
    </Layout>
  );
};

Home.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Home;

export const AllBlogsQuery = graphql`
  query AllBlogPosts {
    allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      filter: {
        frontmatter: {
          path: { nin: ["/resume-md", "/resume-ru-md", "/tools-md"] }
        }
      }
    ) {
      edges {
        node {
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            author
            path
          }
          timeToRead
        }
      }
    }
  }
`;
