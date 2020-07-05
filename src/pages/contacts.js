import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";
import { Divider, Col } from "antd";
import {
  CodeOutlined,
  GithubOutlined,
  GitlabOutlined,
  LinkedinOutlined,
  MediumOutlined,
  MailOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

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
    <Col
      xs={{ span: 24 }}
      lg={{ span: 10, offset: 4 }}
      style={{ padding: "1rem" }}
    >
      <h1>Contacts</h1>
      <p>
        The best way to contact me is via email{" "}
        <NavSocial
          url="mailto:ceeveeya@gmail.com"
          icon={<MailOutlined />}
          name={"ceeveeya@gmail.com"}
        />
        . Yes, I actually read and respond there.
      </p>
      <Divider />
      <p>
        Connect with me on{" "}
        <NavSocial
          url={"https://www.linkedin.com/in/constantine-yarushkin"}
          icon={<LinkedinOutlined />}
          name={"LinkedIn"}
        />{" "}
        . Just for future opportunities, who knows how life could turn around.
      </p>
      <Divider />
      <p>
        You can find my code on{" "}
        <NavSocial
          url={"https://github.com/c-v-ya"}
          icon={<GithubOutlined />}
          name={"GitHub"}
        />{" "}
        and{" "}
        <NavSocial
          url={"https://gitlab.com/c.v.ya"}
          icon={<GitlabOutlined />}
          name={"GitLab"}
        />
        . Although the repositories there are identical.
      </p>
      <Divider />
      <p>
        All my writings in <Link to="/">blog</Link> are also available on{" "}
        <NavSocial
          url={"https://medium.com/@c.v.ya"}
          icon={<MediumOutlined />}
          name={"Medium"}
        />{" "}
        and{" "}
        <NavSocial
          url="https://dev.to/c_v_ya"
          icon={<CodeOutlined />}
          name={"dev.to"}
        />
        .
      </p>
      <Divider />
      <p>
        I'm also somewhat active on{" "}
        <NavSocial
          url={"https://instagram.com/c.v.ya"}
          icon={<InstagramOutlined />}
          name={"Instagram"}
        />{" "}
        and{" "}
        <NavSocial
          url="https://twitter.com/c_v_ya"
          icon={<TwitterOutlined />}
          name={"Twitter"}
        />
        .
      </p>
    </Col>
  </Layout>
);

export default Contacts;
