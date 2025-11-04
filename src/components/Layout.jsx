import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [searchHandler, setSearchHandler] = useState(null);

  const showSearch =
    location.pathname === "/movies" || location.pathname === "/tv-shows";

  const showNavbar = !location.pathname.startsWith("/player");

  return (
    <>
      {showNavbar && <Navbar showSearch={showSearch} onSearch={searchHandler} />}
      <Outlet context={{ setSearchHandler }} />
    </>
  );
}
