import React from "react";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";

const Nav = () => {
  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const { pathname } = useLocation();
  const selectedKey = {
    "/blog": "home",
    "/blog/tools": "tools",
    "/blog/contacts": "contacts",
    "/blog/resume": "resume",
    "/blog/resume-ru": "resume-ru",
  }[pathname.replace(/\/$/, "")];

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            Constantine's Blog
          </Link>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    Constantine's Blog
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className={`${
                    selectedKey === "home"
                      ? "text-pink-500 hover:text-pink-600"
                      : "text-gray-800 hover:text-gray-600"
                  } text-xs uppercase py-3 font-bold block`}
                  to="/"
                >
                  <i
                    className={`${
                      selectedKey === "home" ? "" : "text-gray-500"
                    } fas fa-newspaper  mr-2 text-sm`}
                  ></i>{" "}
                  Blog
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={`${
                    selectedKey === "tools"
                      ? "text-pink-500 hover:text-pink-600"
                      : "text-gray-800 hover:text-gray-600"
                  } text-xs uppercase py-3 font-bold block`}
                  to="/tools"
                >
                  <i
                    className={`${
                      selectedKey === "tools" ? "" : "text-gray-500"
                    } fas fa-tools  mr-2 text-sm`}
                  ></i>{" "}
                  Stuff I Use
                </Link>
              </li>

              {/* Divider */}
              <hr className="my-4 md:min-w-full" />

              <li className="items-center">
                <Link
                  className={`${
                    ["resume", "resume-ru"].includes(selectedKey)
                      ? "text-pink-500 hover:text-pink-600"
                      : "text-gray-800 hover:text-gray-600"
                  } text-xs uppercase py-3 font-bold block`}
                  to="/resume"
                >
                  <i
                    className={`${
                      ["resume", "resume-ru"].includes(selectedKey)
                        ? ""
                        : "text-gray-500"
                    } fas fa-file-alt  mr-2 text-sm`}
                  ></i>{" "}
                  Resume
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={`${
                    selectedKey === "contacts"
                      ? "text-pink-500 hover:text-pink-600"
                      : "text-gray-800 hover:text-gray-600"
                  } text-xs uppercase py-3 font-bold block`}
                  to="/contacts"
                >
                  <i
                    className={`${
                      selectedKey === "contacts" ? "" : "text-gray-500"
                    } fas fa-address-card  mr-2 text-sm`}
                  ></i>{" "}
                  Contacts
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
