import { Link } from "react-router-dom"

function LandingPage() {
    return (
        <>
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
