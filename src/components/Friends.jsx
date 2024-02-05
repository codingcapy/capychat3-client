import { useEffect, useState } from "react"


export default function Friends(props) {

    const [friends, setFriends] = useState(
        props.friends.map((friend) => <div key={friend} onClick={() => props.clickedFriend(friend)} className="cursor-pointer">
            {friend}
        </div>)
    )

    useEffect(() => {
        setFriends(
            props.friends.map((friend) => <div key={friend} onClick={() => props.clickedFriend(friend)} className="cursor-pointer">
                {friend}
            </div>)
        )
    }, [props.friends])

    return (
        <div className="px-5 flex-2 border-2 min-w-72 h-screen overflow-y-auto">
            <div className="py-5 text-xl sticky top-0 bg-white">Friends</div>
            <div>
                <div className="py-5 cursor-pointer" onClick={() => props.clickedAddFriend()} >+ Add a Friend</div>
                {friends}
            </div>
        </div>
    )
}