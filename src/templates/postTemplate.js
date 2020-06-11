import React from "react";
import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import { Col, Divider } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

import Layout from "../components/Layout";

const Template = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const image = data.file ? data.file.childImageSharp.fluid : null;
  const { title, date } = post.frontmatter;
  const { next, prev } = pageContext;

  return (
    <Layout>
      <Col
        xs={{ span: 24 }}
        lg={{ span: 12, offset: 4 }}
        style={{ padding: "1rem" }}
      >
        <h1>{title}</h1>
        <p style={{ textAlign: "right" }}>
          <em>{date}</em>
          <Divider type="vertical" />
          <span>{post.timeToRead} min to read</span>
        </p>
        {image && (
          <p>
            <Img fluid={image} />
          </p>
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
