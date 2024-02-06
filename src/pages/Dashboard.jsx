


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
    const [showDefault, setShowDefault] = useState(true)
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [showFriend, setShowFriend] = useState(false)
    const [showMessages, setShowMessages] = useState(false)
    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [friend, setFriend] = useState("")
    const [friends, setFriends] = useState(user.friends)
    const [chats, setChats] = useState(user.chats)
    const [currentChat, setCurrentChat] = useState(null)

    function tappedChats() {
        setChatsMode(true);
        setMessagesMode(false);
        setFriendsMode(false);
    }

    function tappedChat() {
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
        setShowDefault(false)
    }
    async function clickedChat(chat) {
        const newChat = await axios.get(`${DOMAIN}/api/chats/${chat.chatId}`)
        setCurrentChat(newChat.data)
        console.log("current chat is")
        console.log(currentChat)
        setShowMessages(true)
        setShowAddFriend(false)
        setShowFriend(false)
        setShowDefault(false)
        tappedChat()
    }
    function clickedFriend(username) {
        setFriend(username);
        setShowMessages(false)
        setShowAddFriend(false)
        setShowFriend(true)
        setShowDefault(false)
    }

    const [message, setMessage] = useState("")

    async function handleCreateChat(e) {
        e.preventDefault()
        const title = e.target.title.value
        const currentUser = user.username
        const currentFriend = friend;
        const chat = { title, user: currentUser, friend: currentFriend }
        const res = await axios.post(`${DOMAIN}/api/chats`, chat)
        if (res?.data.success) {
            const user1 = await axios.get(`${DOMAIN}/api/users/${user.userId}`)
            setMessage(res?.data.message)
            console.log(user1.data.chats)
            setChats(user1.data.chats)
        }
        else {
            setMessage(res?.data.message)
        }
    }

    async function handleCreateMessage(e) {
        e.preventDefault()
        const content = e.target.content.value
        const currentUser = user.username
        const message = { content, user: currentUser, chatId: currentChat.chatId }
        const res = await axios.post(`${DOMAIN}/api/messages`, message)
        if (res?.data.success) {
            console.log(`${DOMAIN}/api/chats/${currentChat.chatId}`)
            const newChat = await axios.get(`${DOMAIN}/api/chats/${currentChat.chatId}`)
            setMessage(res?.data.message)
            console.log("what")
            console.log(newChat)
            console.log(newChat.data)
            console.log(newChat.data.messages)
            setCurrentChat(newChat.data)
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
                        <Chats clickedChat={clickedChat} chats={chats} />
                        {showDefault && <div className="px-5 border-2 border-slate-600 bg-slate-800 min-w-full h-screen overflow-y-auto">
                            <div className="text-xl sticky top-0 bg-slate-800 py-5">Messages</div>
                        </div>}
                        {showMessages && <Messages currentChat={currentChat} currentUser={user.username} handleCreateMessage={handleCreateMessage} message={message} />}
                        {showAddFriend && <AddFriend currentUser={user.username} setFriends={setFriends} user={user} />}
                        {showFriend && <FriendProfile handleCreateChat={handleCreateChat} friendName={friend} message={message} />}
                        <div className="flex flex-col">
                            <NavLink to={`/dashboard/${user.userId}`} className="px-5 py-5 bg-slate-800 font-bold">{user.username}</NavLink>
                            <NavLink to="/" onClick={logoutService} className="px-5 bg-slate-800">Logout</NavLink>
                        </div>
                    </div>
                </div>
                <div className="px-3 md:hidden">
                    {chatsMode && <Chats chats={chats} clickedChat={clickedChat} />}
                    {friendsMode && <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} friends={friends} />}
                    {messagesMode && <Messages currentChat={currentChat} currentUser={user.username} />}
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