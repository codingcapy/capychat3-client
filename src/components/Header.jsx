



import { NavLink } from "react-router-dom";



export default function Header() {


    return (
        <header className="sticky z-50 top-0 md:flex justify-between py-5 bg-indigo-600 text-white">
            <div>
                <NavLink to="/" className="px-5">CapyTalk</NavLink>
                <NavLink to="/" className="px-5">Home</NavLink>
            </div>
            <div>
                <NavLink className="px-5">About</NavLink>
                <NavLink className="px-5">Contact</NavLink>
            </div>
            <div>
                <NavLink to="/users/login" className="px-5">Login</NavLink>
                <NavLink to="/users/signup" className="px-5">Sign Up</NavLink>
            </div>
        </header>
    )
}