import React from "react";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import { Col, Divider } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

import Layout from "../components/Layout";

const Template = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const image = data.file ? data.file.childImageSharp.fluid : null;
  const { title, date, description, tags, path } = post.frontmatter;
  const { next, prev } = pageContext;

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta
          charSet="utf-8"
          name="description"
          property="og:description"
          content={`Post "${description}" on Constantine's blog`}
        />
        <meta name="keywords" content={tags}></meta>
        <meta name="author" content="Constantine Yarushkin"></meta>
        <link rel="canonical" href={`https://c-v-ya.github.io/blog${path}`} />
      </Helmet>
      <Col
        xs={{ span: 24 }}
        lg={{ span: 12, offset: 4 }}
        style={{ padding: "1rem" }}
      >
        <h1>{title}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingBottom: "0.5rem",
          }}
        >
          <em>{date}</em>
          <Divider type="vertical" />
          <span>{post.timeToRead} min read</span>
        </div>
        {image && (
          <div style={{ paddingBottom: "0.5rem" }}>
            <Img fluid={image} />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <Divider />
        <ul
          className="ant-pagination"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {next && (
            <li className="ant-pagination-item ant-pagination-prev">
              <Link to={next.frontmatter.path}>
                <LeftOutlined /> Previous post
              </Link>
            </li>
          )}
          {prev && (
            <li className="ant-pagination-item ant-pagination-next">
              <Link to={prev.frontmatter.path}>
                Next post <RightOutlined />
              </Link>
            </li>
          )}
        </ul>
      </Col>
    </Layout>
  );
};

export default Template;

export const postQuery = graphql`
  query BlogPost($path: String!, $imagePath: String) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        path
        description
        tags
      }
      html
      timeToRead
    }
    file(relativePath: { eq: $imagePath }) {
      childImageSharp {
        fluid(quality: 100, maxWidth: 1280) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
