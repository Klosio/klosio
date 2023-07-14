import { createContext, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { httpRequest } from "~core/httpRequest"
import { addGetSessionListener } from "~core/session"
import { supabase } from "~core/supabase"
import type User from "~types/user.model"
import type UserSession from "~types/userSession.model"

const AuthContext = createContext(null)

interface Auth {
    userSession: UserSession
    login: (session: UserSession) => Promise<void>
    logout: () => Promise<void>
    updateSession: (session: UserSession) => Promise<void>
}

export function AuthProvider({ children }) {
    const [userSession, setUserSession] = useStorage<UserSession>({
        key: "user",
        instance: new Storage({
            area: "local"
        })
    })

    const navigate = useNavigate()

    const initUserSession = async () => {
        if (!userSession) {
            let session = await fetchUserSession()
            if (!session) {
                await setUserSession(null)
                return
            }
            try {
                const user = await fetchUser(session)
                session.user = user
            } catch (error) {
                //console.error(error)
            }
            await setUserSession(session)
            addGetSessionListener(session)
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

    const updateSession = async (session: UserSession) => {
        await setUserSession(session)
    }

    const login = async (session: UserSession) => {
        await updateSession(session)
        navigate("/menu")
    }

    const logout = async () => {
        await setUserSession(null)
        navigate("/", { replace: true })
    }

    const auth: Auth = { userSession, login, logout, updateSession }

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}
