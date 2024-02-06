


import { NavLink, useLoaderData } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { useState, useEffect } from "react";
import Friends from "../components/Friends";
import Chats from "../components/Chats";
import Messages from "../components/Messages";
import AddFriend from "../components/AddFriend";
import axios from "axios";
import DOMAIN from "../services/endpoint";
import FriendProfile from "../components/FriendProfile";


export default function Dashboard() {

    const { logoutService, user } = useAuthStore((state) => state)
    const [chatsMode, setChatsMode] = useState(true);
    const [messagesMode, setMessagesMode] = useState(false);
    const [friendsMode, setFriendsMode] = useState(false);
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [showFriend, setShowFriend] = useState(false)
    const [showMessages, setShowMessages] = useState(true)
    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [friend, setFriend] = useState("")
    const [friends, setFriends] = useState(user.friends)
    const [currentChat, setCurrentChat] = useState({ messages: [] })

    function tappedChats() {
        setChatsMode(true);
        setMessagesMode(false);
        setFriendsMode(false);
    }

    function tappedMessages() {
        setChatsMode(false);
        setMessagesMode(true);
        setFriendsMode(false);
    }

    function tappedFriends() {
        setChatsMode(false);
        setMessagesMode(false);
        setFriendsMode(true);
    }

    function clickedAddFriend() {
        setShowMessages(false)
        setShowAddFriend(true)
        setShowFriend(false)
    }
    function clickedChat(chat) {
        setCurrentChat(chat)
        console.log("current chat is")
        console.log(currentChat)
        setShowMessages(true)
        setShowAddFriend(false)
        setShowFriend(false)
    }
    function clickedFriend(username) {
        setFriend(username);
        setShowMessages(false)
        setShowAddFriend(false)
        setShowFriend(true)
    }

    const [message, setMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        const username = props.currentUser
        const friend = e.target.frienduser.value;
        const data = { username, friend }
        const res = await axios.post(`${DOMAIN}/api/user/friends`, data)
        if (res?.data.success) {
            const user = await axios.get(`${DOMAIN}/api/user/${props.user.userId}`)
            setMessage(res?.data.message)
            props.setFriends(user.friends)
            navigate(`/dashboard/${props.user.userId}`)
        }
        else {
            setMessage(res?.data.message)
        }
    }

    useEffect(() => {
        function handleScroll() {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            setIsMenuSticky(scrollPosition > scrollThreshold);
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-800 text-white">
            <main className="flex-1">
                <div className="hidden md:flex">
                    <div className="flex">
                        <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} friends={friends} />
                        <Chats clickedChat={clickedChat} chats={user.chats} />
                        {showMessages && <Messages currentChat={currentChat} currentUser={user.username} />}
                        {showAddFriend && <AddFriend currentUser={user.username} setFriends={setFriends} user={user} />}
                        {showFriend && <FriendProfile currentUser={user} friendName={friend} />}
                        <div className="flex flex-col">
                            <NavLink to={`/dashboard/${user.userId}`} className="px-5 py-5 bg-slate-800 font-bold">{user.username}</NavLink>
                            <NavLink to="/" onClick={logoutService} className="px-5 bg-slate-800">Logout</NavLink>
                        </div>
                    </div>
                </div>
                <div className="px-3">
                    {chatsMode && <Chats />}
                    {friendsMode && <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} friends={friends} />}
                </div>
            </main>
            <div
                className={`flex justify-between py-5 md:hidden sticky z-10 bg-slate-800 ${isMenuSticky ? "top-0" : "bottom-0"
                    }`}
            >
                <div className="px-5" onClick={() => tappedFriends()}>
                    Friends
                </div>
                <div className="px-5" onClick={tappedChats}>
                    Chats
                </div>
                <NavLink to="/" onClick={logoutService} className="px-5">Logout</NavLink>
            </div>
        </div>
    )
}