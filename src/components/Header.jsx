



import { NavLink } from "react-router-dom";



export default function Header() {


    return (
        <header className="sticky z-50 top-0 md:flex justify-between">
            <div>
                <NavLink to="/">CapyTalk</NavLink>
                <NavLink to="/">Home</NavLink>
            </div>
            <div>
                <NavLink>About</NavLink>
                <NavLink>Contact</NavLink>
            </div>
            <div>
                <NavLink to="/users/login">Login</NavLink>
                <NavLink to="/users/signup">Sign Up</NavLink>
            </div>
        </header>
    )
}