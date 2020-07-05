import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { Col } from "antd";

import Layout from "../components/Layout";

const Resume = ({ data }) => {
  const post = data.markdownRemark;
  const { title, tags } = post.frontmatter;

  return (
    <Layout>
      <Helmet>
        <title>Constantine's resume</title>
        <meta
          charSet="utf-8"
          name="description"
          property="og:description"
          content="Constantine's resume"
        />
        <meta name="keywords" content={tags}></meta>
        <meta name="author" content="Constantine Yarushkin"></meta>
        <link rel="canonical" href="https://c-v-ya.github.io/blog/resume" />
      </Helmet>
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
        tags
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
