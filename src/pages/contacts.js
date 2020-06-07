import React from "react";
import { Link } from "gatsby";
import { Divider, Col } from "antd";
import {
  CodeOutlined,
  GithubOutlined,
  GitlabOutlined,
  LinkedinOutlined,
  MediumOutlined,
  MailOutlined,
} from "@ant-design/icons";

import Layout from "../components/Layout";
import NavSocial from "../components/NavSocial";

const Contacts = () => (
  <Layout>
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
    </Col>
  </Layout>
);

export default Contacts;
