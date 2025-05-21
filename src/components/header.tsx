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
  faRunning,
} from "@fortawesome/free-solid-svg-icons";
import { CSSObject, menuClasses } from "react-pro-sidebar";

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

const rootStyles: CSSObject = {
  ["." + menuClasses.button]: {
    backgroundColor: "#fb923c",
    textTransform: "uppercase",
    fontWeight: "700",
    "&:hover": {
      backgroundColor: "#f97316",
    },
  },
};

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
          <Link className="text-white" href="/">
            <MenuItem
              component={<div />}
              icon={<FontAwesomeIcon color="white" icon={faHome} />}
              rootStyles={rootStyles}
            >
              Inicio
            </MenuItem>
          </Link>
          <Link className="text-white" href="/learning">
            <MenuItem
              component={<div />}
              icon={<FontAwesomeIcon color="white" icon={faBook} />}
              rootStyles={rootStyles}
            >
              Aprendizaje
            </MenuItem>
          </Link>
          <Link className="text-white" href="/action">
            <MenuItem
              component={<div />}
              icon={<FontAwesomeIcon color="white" icon={faRunning} />}
              rootStyles={rootStyles}
            >
              Acción
            </MenuItem>
          </Link>
          <Link className="text-white" href="/mobile">
            <MenuItem
              component={<div />}
              icon={<FontAwesomeIcon color="white" icon={faRunning} />}
              rootStyles={rootStyles}
            >
              Acción Móvil
            </MenuItem>
          </Link>
          <Link className="text-white" href="/menu">
            <MenuItem
              component={<div />}
              icon={<FontAwesomeIcon color="white" icon={faHandsHelping} />}
              rootStyles={rootStyles}
            >
              Contribuir
            </MenuItem>
          </Link>
          <Link className="text-white" href="/play">
            <MenuItem
              component={<div />}
              icon={<FontAwesomeIcon color="white" icon={faGamepad} />}
              rootStyles={rootStyles}
            >
              Jugar
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
          <Link className="text-white font-bold text-xl" href="/learning">
            Aprendizaje
          </Link>
          <Link className="text-white font-bold text-xl" href="/menu">
            Contribuir
          </Link>
          <Link className="text-white font-bold text-xl" href="/action">
            Acción
          </Link>
          <Link className="text-white font-bold text-xl" href="/mobile">
            Acción Móvil
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
