import { useEffect, useState } from "react"

import "./style.css"

import Landing from "~components/landing"
import Logged from "~components/logged"
import type User from "~types/user"

import("preline")

function IndexPopup() {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        // Get user state from storage
        setUser({ name: "Christophe Dupont" })
    }, [])

    function logout(): void {
        setUser(null)
    }

    function login(): void {
        setUser({ name: "Christophe Dupont" })
    }

    return (
        <div className="m-2 w-[300px] space-y-2 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <div className="border-b border-gray-200">
                <h1 className="text-lg text-center font-bold text-gray-80">
                    Battlecards AI Companion
                </h1>
            </div>
            {user ? <Logged {...{ user, logout }} /> : <Landing />}
        </div>
    )
}

export default IndexPopup
