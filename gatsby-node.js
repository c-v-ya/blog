const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve("src/templates/postTemplate.js");
    resolve(
      graphql(`
        query {
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { title: { ne: "Resume" } } }
          ) {
            edges {
              node {
                frontmatter {
                  path
                  title
                  date(formatString: "MMMM DD, YYYY")
                  author
                  description
                  image
                }
              }
            }
          }
        }
      `).then((result) => {
        console.log(result);
        const posts = result.data.allMarkdownRemark.edges;

        posts.forEach(({ node }, index) => {
          const path = node.frontmatter.path;
          const imagePath = node.frontmatter.image;
          createPage({
            path,
            component: postTemplate,
            context: {
              imagePath,
              prev: index === 0 ? null : posts[index - 1].node,
              next: index === posts.length - 1 ? null : posts[index + 1].node,
            },
          });
          resolve();
        });
      })
    );
  });
};
