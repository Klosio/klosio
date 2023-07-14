import { useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import "~/style.css"

import AppHeader from "~components/AppHeader"
import Options from "~components/Options"
import OptionsUnauthorized from "~components/OptionsUnauthorized"
import { httpRequest } from "~core/httpRequest"
import {
    addGetSessionListener,
    isSessionExpired,
    refreshUserSession
} from "~core/session"
import { AlertProvider } from "~providers/AlertProvider"
import type User from "~types/user.model"
import type UserSession from "~types/userSession.model"

import("preline")

function IndexOptions() {
    const [userSession, setUserSession] = useStorage<UserSession>({
        key: "user",
        instance: new Storage({
            area: "local"
        })
    })

    const initUserSession = async () => {
        if (userSession && !isSessionExpired(userSession)) {
            return
        }
        let session = await refreshUserSession()
        if (!session) {
            await setUserSession(null)
            return
        }
        if (!userSession?.user) {
            try {
                const user = await fetchUser(session)
                session.user = user
            } catch (error) {
                //console.error(error)
            }
        }

        await setUserSession(session)
        addGetSessionListener(session)
    }

    const fetchUser = async (session: UserSession): Promise<User> => {
        const response = await httpRequest.get(
            `/v1/users/auth-id/${session.authId}`,
            {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            }
        )
        return response.data as User
    }

    useEffect(() => {
        initUserSession()
    }, [])

    return (
        <div className="m-2 flex flex-col w-full items-center justify-center text-center">
            <div className="w-[700px]">
                <AppHeader />
                <AlertProvider>
                    {userSession &&
                    userSession?.user?.role_id === "KLOSIO_ADMIN" ? (
                        <Options userSession={userSession} />
                    ) : (
                        <OptionsUnauthorized />
                    )}
                </AlertProvider>
            </div>
        </div>
    )
}

export default IndexOptions
