import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";

import { Col, List, Divider } from "antd";

import Layout from "../components/Layout";

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

  const scrollToTop = () => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
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
      <Col
        xs={{ span: 24 }}
        lg={{ span: 10, offset: 4 }}
        style={{ padding: "1rem" }}
      >
        <h1>Constantine's Blog</h1>

        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 7,
          }}
          dataSource={listData}
          renderItem={(item) => (
            <List.Item
              key={`${item.date}__${item.title}`}
              onClick={scrollToTop()}
            >
              <List.Item.Meta
                title={<Link to={item.path}>{item.title}</Link>}
                description={item.description}
              />
              <p>
                {item.date}
                <Divider type="vertical" />
                {item.timeToRead} minute read
              </p>
            </List.Item>
          )}
        />
      </Col>
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
      filter: { frontmatter: { title: { ne: "Resume" } } }
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
