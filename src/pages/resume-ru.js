import React from "react";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";

import Layout from "../components/Layout";

const Resume = ({ data }) => {
  const post = data.markdownRemark;
  const { title, tags } = post.frontmatter;

  return (
    <Layout>
      <Helmet>
        <title>Resume</title>
        <meta
          charSet="utf-8"
          name="description"
          property="og:description"
          content="Resume"
        />
        <meta name="keywords" content={tags}></meta>
        <meta name="author" content="Constantine Yarushkin"></meta>
        <link rel="canonical" href="https://c-v-ya.github.io/blog/resume" />
      </Helmet>
      <div className="flex flex-wrap mx-auto max-w-5xl px-4 md:px-8 py-2 md:py-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-1 text-2xl lg:text-4xl mb-4">{title}</div>
        <div className="flex flex-1 justify-end">
          <Link to="/resume">[EN]</Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
};

export default Resume;

export const postQuery = graphql`
  query ResumeRu {
    markdownRemark(frontmatter: { path: { eq: "/resume-ru-md" } }) {
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
