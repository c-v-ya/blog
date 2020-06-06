import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import { Row, Col, BackTop } from "antd";
import { UpCircleOutlined } from "@ant-design/icons";

import Nav from "./Nav";

deckDeckGoHighlightElement();

const Layout = ({ children }) => (
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Constantine Yarushkin blog</title>
      <link rel="canonical" href="https://c-v-ya.github.io/blog/" />
    </Helmet>
    <Row>
      <Col span={4}>
        <Nav />
      </Col>
      {children}
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
