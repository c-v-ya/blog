import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";

import Layout from "../components/Layout";

const Tools = ({ data }) => {
  const post = data.markdownRemark;
  const { title, tags } = post.frontmatter;

  return (
    <Layout>
      <Helmet>
        <title>Stuff I Use</title>
        <meta
          charSet="utf-8"
          name="description"
          property="og:description"
          content="Stuff I Use"
        />
        <meta name="keywords" content={tags}></meta>
        <meta name="author" content="Constantine Yarushkin"></meta>
        <link rel="canonical" href="https://c-v-ya.github.io/blog/tools" />
      </Helmet>
      <div className="flex flex-wrap mx-auto max-w-5xl px-4 md:px-8 py-2 md:py-4 bg-white rounded-lg shadow-md">
        <div className="text-2xl lg:text-4xl mb-4">{title}</div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
};

export default Tools;

export const postQuery = graphql`
  query Tools {
    markdownRemark(frontmatter: { path: { eq: "/tools-md" } }) {
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
