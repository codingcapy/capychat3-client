

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import DOMAIN from "../services/endpoint";

export default function AddFriend(props) {

    const navigate = useNavigate();
    const [message, setMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        const username = props.currentUser
        const friend = e.target.frienduser.value;
        const data = { username, friend }
        const res = await axios.post(`${DOMAIN}/api/user/friends`, data)
        if (res?.data.success) {
            setMessage(res?.data.message)
            navigate("/dashboard")
        }
        else {
            setMessage(res?.data.message)
        }
    }

    return (
        <div className="px-5 flex-2 border-2 min-w-full h-screen overflow-y-auto ">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <h2 className="py-10 text-2xl text-slate-700 font-medium text-center">Add Friend</h2>
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="frienduser" id="frienduser" placeholder="Username" required className="px-2 border rounded-lg border-slate-700 py-1" />
                </div>
                <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Add</button>
            </form>
            <p>{message}</p>
        </div>
    )
}