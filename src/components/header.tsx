import { Navbar } from "flowbite-react";
import Link from "next/link";

const Header = () => {
    return (
        <Navbar className="bg-orange-400 p-3" fluid rounded theme={{base: 'dark'}}>
            <Link className="self-center whitespace-nowrap text-3xl font-bold text-white" href='/'>
                SignAI
            </Link>
            <Navbar.Toggle className="text-black" />
            <Navbar.Collapse>
                <Link className="text-white font-bold text-xl" href="/menu">
                    Contribuir
                </Link>
                <Link className="text-white font-bold text-xl" href="/play">
                    Jugar
                </Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;