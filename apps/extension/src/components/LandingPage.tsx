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
                    className="w-full font-bold text-klosio-green-300 hover:text-klosio-green-600 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm">
                    Sign in to Battlecards AI Companion
                </Link>
            </div>
        </>
    )
}

export default LandingPage
