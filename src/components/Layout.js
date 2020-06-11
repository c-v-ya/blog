import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import { Row, Col, BackTop, Divider } from "antd";
import { UpCircleOutlined } from "@ant-design/icons";

import Nav from "./Nav";

deckDeckGoHighlightElement();

const Layout = ({ children }) => (
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Constantine's blog</title>
      <link rel="canonical" href="https://c-v-ya.github.io/blog" />
    </Helmet>
    <Row>
      <Col xs={{ span: 24 }} lg={{ span: 4 }}>
        <Nav />
      </Col>
      {children}
      <Divider />
      <Col span={24} style={{ textAlign: "center", paddingBottom: "1rem" }}>
        <small>
          Powered by{" "}
          <a href="https://reactjs.org" target="blank">
            React
          </a>
          ,{" "}
          <a href="https://gatsbyjs.org" target="blank">
            Gatsby
          </a>
          ,{" "}
          <a href="https://ant.design" target="blank">
            Ant Design
          </a>{" "}
          and{" "}
          <a href="https://pages.github.com" target="blank">
            GitHub Pages
          </a>
        </small>
      </Col>
      <BackTop>
        <UpCircleOutlined style={{ fontSize: "1.5rem" }} title="Back to top" />
      </BackTop>
    </Row>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
