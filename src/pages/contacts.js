import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";

import Layout from "../components/Layout";
import NavSocial from "../components/NavSocial";

const Contacts = () => (
  <Layout>
    <Helmet>
      <title>Constantine's contacts</title>
      <meta
        charSet="utf-8"
        name="description"
        property="og:description"
        content="Constantine's contacts"
      />
      <meta
        name="keywords"
        content="python, django, react, web development, blog, contacts"
      ></meta>
      <meta name="author" content="Constantine Yarushkin"></meta>
      <link rel="canonical" href="https://c-v-ya.github.io/blog/contacts" />
    </Helmet>
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-2 md:py-4 bg-white rounded-lg shadow-md">
      <div className="text-2xl lg:text-4xl mb-4">Contacts</div>
      <p>
        The best way to contact me is telegram{" "}
        <NavSocial
          url={"https://t.me/c_v_ya"}
          icon={<i className="fab fa-telegram-plane" />}
          name={"@c_v_ya"}
        />
        .
      </p>
      <p>
        Or send me an email to{" "}
        <NavSocial
          url="mailto:ceeveeya@gmail.com"
          icon={<i className="fa fa-envelope" />}
          name={"ceeveeya@gmail.com"}
        />
        . Yes, I actually read and respond there.
      </p>
      <hr />
      <p>
        Connect with me on{" "}
        <NavSocial
          url={"https://linkedin.com/in/constantine-yarushkin"}
          icon={<i className="fab fa-linkedin-in" />}
          name={"LinkedIn"}
        />{" "}
        . Just for the future opportunities, who knows how life could turn around.
      </p>
      <hr />
      <p>
        You can find my code on{" "}
        <NavSocial
          url={"https://github.com/c-v-ya"}
          icon={<i className="fab fa-github" />}
          name={"GitHub"}
        />{" "}
        and{" "}
        <NavSocial
          url={"https://gitlab.com/c.v.ya"}
          icon={<i className="fab fa-gitlab" />}
          name={"GitLab"}
        />
        . Although the repositories there are identical.
      </p>
      <hr />
      <p>
        All my writings in <Link to="/">blog</Link> are also available on{" "}
        <NavSocial
          url={"https://medium.com/@c-v-ya"}
          icon={<i className="fab fa-medium" />}
          name={"Medium"}
        />{" "}
        and{" "}
        <NavSocial
          url="https://dev.to/c_v_ya"
          icon={<i className="fab fa-dev" />}
          name={"dev.to"}
        />
        .
      </p>
      <hr />
      <p>
        I'm also somewhat active on{" "}
        <NavSocial
          url={"https://instagram.com/c.v.ya"}
          icon={<i className="fab fa-instagram" />}
          name={"Instagram"}
        />{" "}
        and{" "}
        <NavSocial
          url="https://twitter.com/c_v_ya"
          icon={<i className="fab fa-twitter" />}
          name={"Twitter"}
        />
        .
      </p>
    </div>
  </Layout>
);

export default Contacts;
