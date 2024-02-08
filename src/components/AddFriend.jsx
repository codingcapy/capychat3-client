

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import DOMAIN from "../services/endpoint";

const socket = io("http://localhost:3333");

export default function AddFriend(props) {

    const navigate = useNavigate();
    const [message, setMessage] = useState("")
    const [inputFriend, setinputFriend] = useState("")

    console.log(props.friends)
    console.log(props.setFriends)
    console.log(props.user)


    async function handleSubmit(e) {
        e.preventDefault()
        const username = props.currentUser
        const friend = e.target.frienduser.value;
        const data = { username, friend }
        const res = await axios.post(`${DOMAIN}/api/user/friends`, data)
        if (res?.data.success) {
            setMessage(res?.data.message)
            const user = await axios.get(`${DOMAIN}/api/users/${props.user.userId}`)
            props.setFriends(user.data.friends)
            setinputFriend("")
            socket.emit("friend", data.friend);
            // navigate(`/dashboard/${props.user.userId}`)
        }
        else {
            setMessage(res?.data.message)
            setinputFriend("")
        }
    }

    // useEffect(() => {
    //     console.log("use effect props friends:")
    //     console.log(props.friends)
    //     socket.on("friend", receiveFriend);
    //     return () => socket.off("friend", receiveFriend);
    // }, [props.friends]);

    // async function receiveFriend() {
    //     console.log("receive friend props friends:")
    //     console.log(props.friends) // null
    //     const newUser = await axios.get(`${DOMAIN}/api/users/${props.user.userId}`)
    //     console.log(newUser)
    //     props.setFriends(newUser.data.friends)
    //     console.log("friends:")
    //     console.log(newUser.data.friends)
    // }

    return (
        <div className="px-5 flex-2 border-2 min-w-full h-screen overflow-y-auto ">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <h2 className="py-10 text-2xl text-slate-700 font-medium text-center">Add Friend</h2>
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="frienduser" id="frienduser" placeholder="Username" value={inputFriend} onChange={(e) => setinputFriend(e.target.value)} required className="px-2 border rounded-lg border-slate-700 py-1 text-black" />
                </div>
                <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Add</button>
            </form>
            <p>{message}</p>
        </div>
    )
}