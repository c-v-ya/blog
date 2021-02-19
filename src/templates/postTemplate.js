import React from "react";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Img from "gatsby-image";

import Layout from "../components/Layout";

const Template = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const image = data.file ? data.file.childImageSharp.fluid : null;
  const { title, date, description, tags, path } = post.frontmatter;
  const { next, prev } = pageContext;

  return (
    <Layout>
      <Helmet>
        <title>{title} by Constantine</title>
        <meta
          charSet="utf-8"
          name="description"
          property="og:description"
          content={`"${description}" by Constantine`}
        />
        <meta name="keywords" content={tags}></meta>
        <meta name="author" content="Constantine Yarushkin"></meta>
        <link rel="canonical" href={`https://c-v-ya.github.io/blog${path}`} />
      </Helmet>
      <div className="flex flex-wrap mx-auto max-w-5xl px-4 md:px-8 py-2 md:py-4 bg-white rounded-lg shadow-md">
        <div className="text-4xl lg:text-6xl">{title}</div>
        <div className="w-full text-right pb-2">
          <em className="p-2">{date}</em>
          <span className="p-2">{post.timeToRead} min read</span>
        </div>
        {image && (
          <div className="w-full pb-4">
            <Img fluid={image} />
          </div>
        )}
        <div
          className="block w-full"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <hr />
        <ul className="flex pagination">
          {next && (
            <li
              className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1"
              type="button"
              style={{ transition: "all .15s ease" }}
            >
              <Link to={next.frontmatter.path} className="text-white">
                <i className="fas fa-chevron-left"></i> Previous post
              </Link>
            </li>
          )}
          {prev && (
            <li
              className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1"
              type="button"
              style={{ transition: "all .15s ease" }}
            >
              <Link to={prev.frontmatter.path} className="text-white">
                Next post <i className="fas fa-chevron-right"></i>
              </Link>
            </li>
          )}
        </ul>
      </div>
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
