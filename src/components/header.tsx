import useMobile from "@/hooks/useMobile";
import { Navbar } from "flowbite-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const Sidebar = dynamic(() => import('react-pro-sidebar').then((mod) => mod.Sidebar), { ssr: false });
const Menu = dynamic(() => import('react-pro-sidebar').then((mod) => mod.Menu), { ssr: false });
const MenuItem = dynamic(() => import('react-pro-sidebar').then((mod) => mod.MenuItem), { ssr: false });

const Header = () => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <Navbar
      className="bg-orange-400 p-3"
      fluid
      rounded
      theme={{ base: "dark" }}
    >
      <Link
        className="self-center whitespace-nowrap text-3xl font-bold text-white"
        href="/"
      >
        SignAI
      </Link>
      <Navbar.Toggle className="text-black" onClick={toggle} />
      <Sidebar onBackdropClick={toggle} toggled={open} breakPoint="always" rtl>
        <Menu>
          <MenuItem> Documentation</MenuItem>
          <MenuItem> Calendar</MenuItem>
          <MenuItem> E-commerce</MenuItem>
          <MenuItem> Examples</MenuItem>
        </Menu>
      </Sidebar>
      {!isMobile && (
        <Navbar.Collapse>
          <Link className="text-white font-bold text-xl" href="/menu">
            Contribuir
          </Link>
          <Link className="text-white font-bold text-xl" href="/play">
            Jugar
          </Link>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
};

export default Header;
