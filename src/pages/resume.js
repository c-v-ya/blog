import React from "react";
import { graphql } from "gatsby";
import { Col } from "antd";

import Layout from "../components/Layout";

const Resume = ({ data }) => {
  const post = data.markdownRemark;
  const { title } = post.frontmatter;

  return (
    <Layout>
      <Col
        xs={{ span: 24 }}
        lg={{ span: 10, offset: 4 }}
        style={{ padding: "1rem" }}
      >
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </Col>
    </Layout>
  );
};

export default Resume;

export const postQuery = graphql`
  query Resume {
    markdownRemark(frontmatter: { path: { eq: "/resume-md" } }) {
      frontmatter {
        title
        path
      }
      html
    }
    file {
      childImageSharp {
        fluid {
          src
        }
      }
    }
  }
`;
