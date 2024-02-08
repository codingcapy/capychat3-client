


import { NavLink, useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import DOMAIN from "../services/endpoint";
import useAuthStore from "../store/AuthStore";
import Friends from "../components/Friends";
import Chats from "../components/Chats";
import Messages from "../components/Messages";
import AddFriend from "../components/AddFriend";
import FriendProfile from "../components/FriendProfile";

const socket = io("http://localhost:3333");

export default function Dashboard() {

    const { logoutService, user } = useAuthStore((state) => state)
    const [chatsMode, setChatsMode] = useState(true);
    const [messagesMode, setMessagesMode] = useState(false);
    const [friendsMode, setFriendsMode] = useState(false);
    const [addFriendMode, setAddFriendMode] = useState(false);
    const [friendMode, setFriendMode] = useState(false);
    const [showDefault, setShowDefault] = useState(true)
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [showFriend, setShowFriend] = useState(false)
    const [showMessages, setShowMessages] = useState(false)
    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [friend, setFriend] = useState("")
    const [friends, setFriends] = useState(user.friends)
    const [chats, setChats] = useState(user.chats)
    const [currentChat, setCurrentChat] = useState(null)
    const [currentChatId, setCurrentChatId] = useState(null)
    const [inputChat, setInputChat] = useState("")
    const [inputMessage, setInputMessage] = useState("")

    function tappedChats() {
        setChatsMode(true);
        setMessagesMode(false);
        setFriendsMode(false);
        setAddFriendMode(false);
        setFriendMode(false);
    }

    function tappedChat() {
        setChatsMode(false);
        setMessagesMode(true);
        setFriendsMode(false);
        setAddFriendMode(false);
        setFriendMode(false);
    }

    function tappedFriends() {
        setChatsMode(false);
        setMessagesMode(false);
        setFriendsMode(true);
        setAddFriendMode(false);
        setFriendMode(false);
    }
    function tappedAddFriend() {
        setChatsMode(false);
        setMessagesMode(false);
        setFriendsMode(false);
        setAddFriendMode(true);
        setFriendMode(false);
    }
    function tappedFriend() {
        setChatsMode(false);
        setMessagesMode(false);
        setFriendsMode(false);
        setAddFriendMode(false);
        setFriendMode(true);
    }

    function clickedAddFriend() {
        setShowMessages(false)
        setShowAddFriend(true)
        setShowFriend(false)
        setShowDefault(false)
        tappedAddFriend()
    }
    async function clickedChat(chat) {
        const newChat = await axios.get(`${DOMAIN}/api/chats/${chat.chatId}`)
        setCurrentChatId(chat.chatId)
        setCurrentChat(newChat.data)
        console.log("current chat is")
        setShowMessages(true)
        console.log(currentChat) // null
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
        tappedFriend()
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
            setChats(user1.data.chats)
            setInputChat("")
        }
        else {
            setMessage(res?.data.message)
            setInputChat("")
        }
    }

    async function handleCreateMessage(e) {
        e.preventDefault()
        const content = e.target.content.value
        const currentUser = user.username
        const message = { content, user: currentUser, chatId: currentChat.chatId }
        const res = await axios.post(`${DOMAIN}/api/messages`, message)
        if (res?.data.success) {
            const newChat = await axios.get(`${DOMAIN}/api/chats/${currentChat.chatId}`)
            setMessage(res?.data.message)
            setCurrentChat(newChat.data)
            setInputMessage("")
            socket.emit("message", message);
        }
        else {
            setMessage(res?.data.message)
            setInputMessage("")
        }
    }

    useEffect(() => {
        console.log("use effect current chat:")
        console.log(currentChat)
        socket.on("message", receiveMessage);
        return () => socket.off("message", receiveMessage);
    }, [currentChat]);

    async function receiveMessage() {
        console.log("receive message current chat:")
        console.log(currentChat) // null
        const newChat = await axios.get(`${DOMAIN}/api/chats/${currentChat.chatId}`)
        setCurrentChat(newChat.data)
        console.log("after")
        console.log(currentChat)
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
                        {showMessages && <Messages currentChat={currentChat} currentUser={user.username} handleCreateMessage={handleCreateMessage} message={message} inputMessage={inputMessage} setInputMessage={setInputMessage} />}
                        {showAddFriend && <AddFriend currentUser={user.username} setFriends={setFriends} user={user} />}
                        {showFriend && <FriendProfile handleCreateChat={handleCreateChat} friendName={friend} user={user} message={message} inputChat={inputChat} setInputChat={setInputChat} />}
                        <div className="flex flex-col">
                            <NavLink to={`/dashboard/${user.userId}`} className="px-5 py-5 bg-slate-800 font-bold">{user.username}</NavLink>
                            <NavLink to="/" onClick={logoutService} className="px-5 bg-slate-800">Logout</NavLink>
                        </div>
                    </div>
                </div>
                <div className="px-3 md:hidden">
                    {chatsMode && <Chats chats={chats} clickedChat={clickedChat} />}
                    {friendsMode && <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} friends={friends} />}
                    {messagesMode && <Messages currentChat={currentChat} currentUser={user.username} handleCreateMessage={handleCreateMessage} message={message} inputMessage={inputMessage} setInputMessage={setInputMessage} />}
                    {showAddFriend && <AddFriend currentUser={user.username} setFriends={setFriends} user={user} />}
                    {showFriend && <FriendProfile handleCreateChat={handleCreateChat} friendName={friend} message={message} />}
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