import { Link, Navigate } from "react-router-dom"

import type User from "~types/user.model"

interface LandingProps {
    user: User
}

function LandingPage(props: LandingProps) {
    return (
        <>
            {props.user && <Navigate to="/menu" />}
            <div className="w-full text-center">
                <Link
                    to={"/login"}
                    className="w-full font-semibold text-green-500 hover:text-green-400 focus:outline-none focus:ring-2 ring-offset-white focus:ring-green-500 focus:ring-offset-2 transition-all text-sm">
                    Sign in to Battlecards AI Companion
                </Link>
            </div>
        </>
    )
}

export default LandingPage
