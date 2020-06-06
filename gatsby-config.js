module.exports = {
  siteMetadata: {
    title: `Constantine Yarushkin blog`,
    description: `Personal tech blog`,
    author: `@c-v-ya`,
  },
  pathPrefix: `/blog`,
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    "gatsby-plugin-antd",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-emoji`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1920,
              quality: 100,
            },
          },
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              theme: "monokai",
              lineNumbers: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              prompt: {
                user: "user",
                host: "host",
                global: false,
              },
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
  ],
};
