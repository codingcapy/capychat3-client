


import { NavLink } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { useState, useEffect } from "react";
import Friends from "../components/Friends";
import Chats from "../components/Chats";
import Messages from "../components/Messages";
import AddFriend from "../components/AddFriend";



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
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <div className="hidden md:flex">
                    <div className="flex">
                        <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} friends={user.friends} />
                        <Chats clickedChat={clickedChat} chats={user.chats} />
                        {showMessages && <Messages currentChat={currentChat} currentUser={user.username} />}
                        {showAddFriend && <AddFriend currentUser={user.username} />}
                        <NavLink to="/" onClick={logoutService}>Logout</NavLink>
                    </div>
                </div>
            </main>
            <div
                className={`flex py-5 md:hidden sticky z-10 bg-white ${isMenuSticky ? "top-0" : "bottom-0"
                    }`}
            >
                <NavLink to="/" onClick={logoutService}>Logout</NavLink>
            </div>
        </div>
    )
}