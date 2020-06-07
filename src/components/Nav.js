import React from "react";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import { Grid, Menu, Affix } from "antd";

const Nav = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const { pathname } = useLocation();
  const selectedKey = {
    "/blog/": "home",
    "/blog/contacts": "contacts",
    "/blog/resume": "resume",
  }[pathname];

  return (
    <Affix offsetTop={0}>
      <Menu
        defaultSelectedKeys={[selectedKey]}
        mode={!screens.lg ? "horizontal" : "inline"}
        style={!screens.lg ? { textAlign: "center" } : { minHeight: "100vh" }}
      >
        <Menu.Item key="home">
          <Link to="/">Blog</Link>
        </Menu.Item>
        <Menu.Item key="resume">
          <Link to="/resume">Resume</Link>
        </Menu.Item>
        <Menu.Item key="contacts">
          <Link to="/contacts">Contacts</Link>
        </Menu.Item>
      </Menu>
    </Affix>
  );
};

export default Nav;
