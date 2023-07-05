import { useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/supabase"

import "~/style.css"

import AppHeader from "~components/AppHeader"
import Options from "~components/Options"
import OptionsUnauthorized from "~components/OptionsUnauthorized"
import type User from "~types/user.model"
import type UserSession from "~types/userSession.model"

import("preline")

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

function IndexOptions() {
    const [userSession, setUserSession] = useStorage<UserSession>({
        key: "user",
        instance: new Storage({
            area: "local"
        })
    })

    const initUserSession = async () => {
        if (!userSession) {
            let session = await fetchUserSession()
            if (!session) {
                await setUserSession(null)
                return
            }
            const user = await fetchUser(session)
            if (!user) {
                await setUserSession(null)
                return
            }
            await setUserSession({ ...session, user: user })
        }
    }

    const fetchUserSession = async (): Promise<UserSession> => {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
            console.error(error)
            return
        }
        const session = data.session
        if (!session || !session.user) {
            return
        }
        return { authId: session.user.id, token: session.access_token }
    }

    const fetchUser = async (session: UserSession): Promise<User> => {
        const response = await fetch(
            `${serverUri}/api/v1/users/auth-id/${session.authId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.token}`
                }
            }
        )
        if (!response.ok) {
            console.error("Error on user get")
            return
        }
        return (await response.json()) as User
    }

    useEffect(() => {
        initUserSession()
    }, [])

    return (
        <div className="m-2 flex flex-col w-full text-center">
            <AppHeader />
            {userSession && userSession?.user?.role_id === "KLOSIO_ADMIN" ? (
                <Options userSession={userSession} />
            ) : (
                <OptionsUnauthorized />
            )}
        </div>
    )
}

export default IndexOptions
