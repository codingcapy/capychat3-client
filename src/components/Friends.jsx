import { useEffect, useState } from "react"


export default function Friends(props) {

    const [friends, setFriends] = useState(
        props.friends.map((friend) => <div key={friend} onClick={() => props.clickedFriend(friend)} className="cursor-pointer">
            {friend}
        </div>)
    )

    return (
        <div className="px-5 flex-2 border-2 border-slate-600 min-w-72 h-screen overflow-y-auto">
            <div className="py-5 text-xl sticky top-0 bg-slate-800">Friends</div>
            <div>
                <div className="py-5 cursor-pointer" onClick={() => props.clickedAddFriend()} >+ Add a Friend</div>
                {props.friends.map((friend) => <div key={friend} onClick={() => props.clickedFriend(friend)} className="cursor-pointer">
            {friend}
        </div>)}
            </div>
        </div>
    )
}