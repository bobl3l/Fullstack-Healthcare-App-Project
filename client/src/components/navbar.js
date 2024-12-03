import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import "../index.css";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Logo from "../components/logo";
import { AuthContext } from "./AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/doctor" },
    { name: "Appointments", href: "/appointments" },
  ];
  const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext);
  const [isPromptOpen, setPromptOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  function logOut() {
    axios
      .post("http://localhost:5000/logout")
      .then(function (response) {
        if (response.status === 200) {
          setIsLoggedIn(false);
          navigate("/");
          setPromptOpen(false);
        } else {
          console.log("Login failed.");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Disclosure as="nav" className="border-b-2 border-neutral-300 bg-slate-100">
      <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Logo />
            <div className="sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={
                      location.pathname === item.href ? "page" : undefined
                    }
                    className={classNames(
                      location.pathname === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            {isLoggedIn ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://static-00.iconduck.com/assets.00/profile-major-icon-1024x1024-9rtgyx30.png"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      onClick={() => navigate("/profile")}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Your Profile
                    </a>
                  </MenuItem>

                  <MenuItem>
                    <a
                      onClick={() => setPromptOpen(true)}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Log out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <a
                key="login"
                href="/login"
                className="text-gray-700 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
      {/* Logout Modal */}
      {isPromptOpen && (
        <div className="modal">
          <div className="bg-white text-center p-6 rounded-md">
            <div className="m-4 font-bold text-xl">
              <h1>Logout now?</h1>
            </div>
            <div className="flex-row flex">
              <button
                onClick={() => setPromptOpen(false)}
                className="btn btn-cancel"
              >
                Close
              </button>
              <button onClick={() => logOut()} className="btn btn-close">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
