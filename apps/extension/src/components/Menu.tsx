import { useNavigate } from "react-router-dom"

import LoginStatus from "~components/LoginStatus"
import { supabase } from "~core/supabase"
import type Organization from "~types/organization.model"
import type User from "~types/user.model"

interface LoggedProps {
    user: User
    organization: Organization
    allowRecording: boolean
    logout: () => Promise<void>
}

function Menu(props: LoggedProps) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        supabase.auth.signOut()
        await props.logout()
        navigate("/")
    }

    return (
        <div className="m-2 flex flex-col space-y-2 text-sm text-center text-gray-700 dark:text-white">
            <LoginStatus user={props.user} organization={props.organization} />
            {props.organization ? (
                <>
                    <button
                        onClick={() => navigate("/startMeeting")}
                        disabled={!props.allowRecording}
                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold disabled:cursor-not-allowed disabled:bg-klosio-green-200 bg-klosio-green-300 text-white hover:bg-klosio-green-400 focus:outline-none focus:ring-2 focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                        Start a meeting
                    </button>
                    <button
                        onClick={() => navigate("/provideContext")}
                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-klosio-green-100 border border-transparent font-semibold text-klosio-green-300 hover:bg-klosio-green-100 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                        Provide Context
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={() => navigate("/createOrganization")}
                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold disabled:cursor-not-allowed disabled:bg-klosio-green-300 bg-klosio-green-400 text-white hover:bg-klosio-green-300 focus:outline-none focus:ring-2 focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                        Create an organization
                    </button>
                </>
            )}

            <button
                onClick={handleLogout}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-klosio-yellow-300 border border-transparent font-semibold text-white hover:bg-klosio-yellow-400 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-yellow-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                Logout
            </button>
        </div>
    )
}

export default Menu