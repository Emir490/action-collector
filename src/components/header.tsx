import useMobile from "@/hooks/useMobile";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faBook,
  faGamepad,
  faHandsHelping,
} from "@fortawesome/free-solid-svg-icons";
import { menuClasses } from "react-pro-sidebar";

const Sidebar = dynamic(
  () => import("react-pro-sidebar").then((mod) => mod.Sidebar),
  { ssr: false }
);
const Menu = dynamic(
  () => import("react-pro-sidebar").then((mod) => mod.Menu),
  { ssr: false }
);
const MenuItem = dynamic(
  () => import("react-pro-sidebar").then((mod) => mod.MenuItem),
  { ssr: false }
);

const Header = () => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <div className="bg-orange-400 p-3 flex justify-between items-center">
      <div onClick={toggle}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <Sidebar
        onBackdropClick={toggle}
        toggled={open}
        breakPoint="always"
        backgroundColor="#FED7AA"
      >
        <Menu>
          <MenuItem
            icon={<FontAwesomeIcon color="white" icon={faHome} />}
            rootStyles={{
              ["." + menuClasses.button]: {
                backgroundColor: "#fb923c",
                textTransform: "uppercase",
                fontWeight: "700",
                "&:hover": {
                  backgroundColor: "#f97316",
                },
              },
            }}
          >
            <Link className="text-white" href='/'>Inicio</Link>
          </MenuItem>
          <MenuItem
            icon={<FontAwesomeIcon color="white" icon={faBook} />}
            rootStyles={{
              ["." + menuClasses.button]: {
                backgroundColor: "#fb923c",
                textTransform: "uppercase",
                fontWeight: "700",
                "&:hover": {
                  backgroundColor: "#f97316",
                },
              },
            }}
          >
            <Link className="text-white" href='/learning'>Aprendizaje</Link>
          </MenuItem>
          <MenuItem
            icon={<FontAwesomeIcon color="white" icon={faGamepad} />}
            rootStyles={{
              ["." + menuClasses.button]: {
                backgroundColor: "#fb923c",
                textTransform: "uppercase",
                fontWeight: "700",
                "&:hover": {
                  backgroundColor: "#f97316",
                },
              },
            }}
          >
            <Link className="text-white" href='/play'>Jugar</Link>
          </MenuItem>
          <MenuItem
            icon={<FontAwesomeIcon color="white" icon={faHandsHelping} />}
            rootStyles={{
              ["." + menuClasses.button]: {
                backgroundColor: "#fb923c",
                textTransform: "uppercase",
                fontWeight: "700",
                "&:hover": {
                  backgroundColor: "#f97316",
                },
              },
            }}
          >
            <Link className="text-white" href='/menu'>Contribuir</Link>
          </MenuItem>
        </Menu>
      </Sidebar>
      <Link
        className="whitespace-nowrap text-3xl font-bold text-white mx-auto"
        href="/"
      >
        SignAI
      </Link>
      {!isMobile && (
        <div className="flex justify-end">
          <Link className="text-white font-bold text-xl" href="/menu">
            Contribuir
          </Link>
          <Link className="text-white font-bold text-xl" href="/play">
            Jugar
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
