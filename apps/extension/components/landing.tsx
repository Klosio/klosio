import { useState } from "react"

import Login from "./login"

interface LandingProps {}

function Landing(props: LandingProps) {
    const [landing, setLanding] = useState(true)

    return (
        <div className="w-full">
            {landing ? (
                <button
                    onClick={() => setLanding(false)}
                    className="w-full text-center font-semibold text-green-500 hover:text-green-400 focus:outline-none focus:ring-2 ring-offset-white focus:ring-green-500 focus:ring-offset-2 transition-all text-sm">
                    Sign in to Battlecards AI Companion
                </button>
            ) : (
                <Login />
            )}
        </div>
    )
}

export default Landing
