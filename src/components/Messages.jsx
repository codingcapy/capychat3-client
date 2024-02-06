

import { useState, useEffect } from "react";

export default function Messages(props) {

    const [isMenuSticky, setIsMenuSticky] = useState(false);

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

    console.log(props.currentChat)

    return (
        <div className="px-5 border-2 border-slate-600 bg-slate-800 min-w-full h-screen overflow-y-auto">
            <div className="text-xl sticky top-0 bg-slate-800 py-5">{props.currentChat.title}</div>
            <div className="sticky top-16 bg-slate-800 py-5">+ Invite friend</div>
            <div>
                <div className="py-2">
                    <div className="flex"><div className="font-bold">user123</div><div className="pl-2">on 2024-01-19 12:34 PM</div></div>
                    <div>Wassup!</div>
                </div>
                <div className="py-2">
                    <div className="flex"><div className="font-bold">user123</div><div className="pl-2">on 2024-01-19 12:34 PM</div></div>
                    <div>WOOHOO!</div>
                </div>
                <div className="py-2">
                    <div className="flex"><div className="font-bold">user123</div><div className="pl-2">on 2024-01-19 12:34 PM</div></div>
                    <div>🔥🔥🔥🔥🔥🔥🔥🔥</div>
                </div>
                {props.currentChat.messages.map((message)=><div>{message.content}</div>)}
                <div className={`py-10 bg-slate-800 sticky z-20 ${isMenuSticky ? "top-0" : "bottom-0"
                    }`}>
                    <form>
                        <div className="flex">
                            <input type="text" id="content" name="content" placeholder="write a message" required className="py-2 px-2 min-w-96" />
                            <input type="text" id='user' name="user" defaultValue={props.currentUser} className="hidden"/>
                            <input type="text" id='chatid' name="chatid" defaultValue={props.currentChat.chatId} className="hidden"/>
                            <button className=" mx-2 px-5 py-5 rounded-xl bg-yellow-600 text-white">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}