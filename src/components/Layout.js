import React from "react";

import PropTypes from "prop-types";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";

import Nav from "./Nav";

deckDeckGoHighlightElement();

const Layout = ({ children }) => {
  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (e) {}
  };

  return (
    <>
      <Nav />
      <div className="relative min-h-screen md:ml-64 md:text-lg bg-yellow-50 body">
        <div className="md:px-5 mx-auto w-full xl:w-8/12 py-4 text-gray-900 leading-8">
          {children}
          <button
            className="md:invisible fixed bottom-16 right-5"
            title="Back to top"
            onClick={scrollToTop}
          >
            <i className="fa fa-chevron-circle-up"></i>
          </button>
          <div className="pt-4 text-center">
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
              <a href="https://tailwindcss.com" target="blank">
                TailwindCSS
              </a>{" "}
              and{" "}
              <a href="https://pages.github.com" target="blank">
                GitHub Pages
              </a>
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
