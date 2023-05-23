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
        <FontAwesomeIcon color="white" icon={faBars} />
      </div>
      <Sidebar
        onBackdropClick={toggle}
        toggled={open}
        breakPoint="all"
        backgroundColor="#FED7AA"
      >
        <Menu>
          <Link className="text-white" href='/'>
            <MenuItem
              component={<div/>}
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
              Inicio
            </MenuItem>
          </Link>
          <Link className="text-white" href='/learning'>
            <MenuItem
              component={<div/>}
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
              Aprendizaje
            </MenuItem>
          </Link>
          <Link className="text-white" href='/play'>
            <MenuItem
              component={<div/>}
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
              Jugar
            </MenuItem>
          </Link>
          <Link className="text-white" href='/menu'>
            <MenuItem
              component={<div/>}
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
              Contribuir
            </MenuItem>
          </Link>
        </Menu>
      </Sidebar>
      <Link
        className="whitespace-nowrap text-3xl font-bold text-white mx-auto"
        href="/"
      >
        SignAI
      </Link>
      {!isMobile && (
        <div className="flex justify-end gap-x-3">
          <Link className="text-white font-bold text-xl" href='/'>Aprendizaje</Link>
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
