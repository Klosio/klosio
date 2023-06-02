import { useNavigate } from "react-router-dom"

import LoginStatus from "~components/LoginStatus"
import type Organization from "~types/organization.model"
import type User from "~types/user.model"

interface LoggedProps {
    user: User
    organization: Organization
    allowRecording: boolean
    logout: VoidFunction
}

function Menu(props: LoggedProps) {
    const navigate = useNavigate()

    const logout = () => {
        // TODO : remove local session
        navigate("/")
    }

    return (
        <>
            <div className="m-2 flex flex-col space-y-2 text-sm text-center text-gray-700 dark:text-white">
                <LoginStatus
                    user={props.user}
                    organization={props.organization}
                />
                {props.organization ? (
                    <>
                        <button
                            onClick={() => navigate("/startMeeting")}
                            disabled={!props.allowRecording}
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold disabled:cursor-not-allowed disabled:bg-green-400 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                            Start a meeting
                        </button>
                        <button
                            onClick={() => {
                                alert("Not implemented yet")
                            }}
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-green-100 border border-transparent font-semibold text-green-500 hover:text-white hover:bg-green-100 focus:outline-none focus:ring-2 ring-offset-white focus:ring-green-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                            Import Battlecards
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/createOrganization")}
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold disabled:cursor-not-allowed disabled:bg-green-400 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                            Create an organization
                        </button>
                    </>
                )}

                <button
                    onClick={logout}
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-yellow-100 border border-transparent font-semibold text-yellow-500 hover:text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 ring-offset-white focus:ring-yellow-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                    Logout
                </button>
            </div>
        </>
    )
}

export default Menu
