import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import LoginStatus from "~components/LoginStatus"
import { httpRequest } from "~core/httpRequest"
import { isRecording, isRecordingAllowed } from "~core/recorder"
import { supabase } from "~core/supabase"
import { useAlert } from "~providers/AlertProvider"
import { useAuth } from "~providers/AuthProvider"

interface MenuProps {
    currentTab: chrome.tabs.Tab
}

function Menu(props: MenuProps) {
    const navigate = useNavigate()
    const { userSession, logout } = useAuth()
    const { showErrorMessage } = useAlert()

    const [record, setRecord] = useState(false)
    const [isReady, setIsReady] = useState(false)

    const handleLogout = async () => {
        supabase.auth.signOut()
        await logout()
    }

    const fetchOrganizationState = async () => {
        try {
            const response = await httpRequest.get(
                `/v1/organizations/${userSession?.user?.organization?.id}/ready`
            )
            setIsReady(response.data.ready)
        } catch (error) {
            await showErrorMessage(error.response.data.code)
        }
    }

    useEffect(() => {
        const updateRecordingStatus = async () => {
            const recordingStatus = await isRecording()
            setRecord(recordingStatus)
            if (userSession?.user?.organization) {
                await fetchOrganizationState()
            }
        }
        updateRecordingStatus()
    }, [userSession])

    return (
        <div className="m-2 flex flex-col space-y-2 text-sm text-center text-gray-700 dark:text-white">
            <LoginStatus user={userSession?.user} />
            {userSession?.user?.organization ? (
                <>
                    <button
                        onClick={() => navigate("/startMeeting")}
                        disabled={
                            !isRecordingAllowed(props.currentTab) ||
                            record ||
                            !isReady
                        }
                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold disabled:cursor-not-allowed disabled:bg-klosio-green-200 bg-klosio-green-300 text-white hover:bg-klosio-green-400 focus:outline-none focus:ring-2 focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                        Start a meeting
                    </button>
                    {["KLOSIO_ADMIN", "ORG_ADMIN"].includes(
                        userSession?.user?.role_id
                    ) && (
                        <>
                            <button
                                onClick={() => navigate("/domainManagement")}
                                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-klosio-green-100 border border-transparent font-semibold text-klosio-green-300 hover:bg-klosio-green-100 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Manage users
                            </button>
                            <button
                                onClick={() => navigate("/provideContext")}
                                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-klosio-green-100 border border-transparent font-semibold text-klosio-green-300 hover:bg-klosio-green-100 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Provide Context
                            </button>
                        </>
                    )}
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
