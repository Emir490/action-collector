import Link from "next/link";
import { Navbar } from "flowbite-react";

const Header = () => {
    return (
        <Navbar rounded fluid>
            <Navbar.Toggle />
            <Navbar.Brand
                to="/"
            >
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    SignAI
                </span>
            </Navbar.Brand>
            <Navbar.Collapse>
                <Navbar.Link href="/menu">
                    Contribuir
                </Navbar.Link>
                <Navbar.Link to="/play">
                    Jugar
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    Services
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    Pricing
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    Contact
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;