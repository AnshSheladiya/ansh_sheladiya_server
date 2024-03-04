import React from "react";
import logo from "../assests/wallpaper.png";
import Image from "next/image";

const Topbar = () => {
  return (
    <header className="max-w-screen-md py-3 mx-auto my-10 border border-gray-100 shadow lg:w-full w-96 bg-white/80 backdrop-blur-lg md:top-6 rounded-3xl lg:max-w-screen-lg">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0"></div>
          <div className="flex items-center justify-center gap-5">
            <Image
              className="h-7 w-7"
              src={logo}
              alt="WallGlow Logo"
            />
            <a
              className="inline-block px-2 py-1 text-lg font-semibold text-[#35374B] transition-all duration-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 antialiased"
              href="#"
            >
              WallGlow
            </a>
          </div>
          <div className="flex items-center justify-end gap-3">
            <a
              className="items-center justify-center hidden px-3 py-2 text-sm font-semibold text-gray-900 transition-all duration-150 bg-white shadow-sm rounded-xl ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:inline-flex"
              href="/login"
            >
              Sign in
            </a>
            <a
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-white transition-all duration-150 bg-blue-600 shadow-sm rounded-xl hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              href="/login"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;