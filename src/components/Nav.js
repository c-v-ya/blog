import React from "react";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import { Menu, Affix } from "antd";

const Nav = () => {
  const { pathname } = useLocation();
  const selectedKey = {
    "/blog/": "home",
    "/blog/contacts": "contacts",
    "/blog/resume": "resume",
  }[pathname];

  return (
    <Affix offsetTop={0}>
      <Menu defaultSelectedKeys={[selectedKey]} mode="inline">
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
