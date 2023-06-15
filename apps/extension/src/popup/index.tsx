import { useEffect, useState } from "react"

import "~/style.css"

import { Link, MemoryRouter, Route, Routes } from "react-router-dom"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import LandingPage from "~components/LandingPage"
import LanguageSelection from "~components/LanguageSelection"
import LoginMenu from "~components/LoginMenu"
import Menu from "~components/Menu"
import OrganizationCreation from "~components/OrganizationCreation"
import ProvideContext from "~components/ProvideContext"
import SignUp from "~components/SignUp"
import { getCurrentTab, startRecording } from "~core/recorder"
import { supabase } from "~core/supabase"
import type Organization from "~types/organization.model"
import type User from "~types/user.model"

import("preline")

function IndexPopup() {
    const [user, setUser] = useStorage<User>({
        key: "user",
        instance: new Storage({
            area: "local"
        })
    })
    const [organization, setOrganization] = useState<Organization>()
    const [currentTab, setCurrentTab] = useState(null)

    const init = async () => {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
            console.error(error)
            return
        }
        if (data.session) {
            setUser({ name: data.session.user.email })
        }
    }

    useEffect(() => {
        init()
        getCurrentTab().then((t) => setCurrentTab(t))
    }, [])

    function updateOrganization(organization: Organization): void {
        setOrganization(organization)
    }

    function detectGoogleMeetURL(url: string): boolean {
        const regex = /https:\/\/meet\.google\.com\//
        return regex.test(url)
    }

    async function logout(): Promise<void> {
        await setUser(null)
    }

    async function login(user: User): Promise<void> {
        await setUser(user)
    }

    return (
        <>
            <MemoryRouter>
                <div className="m-2 w-[300px] space-y-2 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
                    <div className="border-b border-gray-200">
                        <h1 className="text-lg text-center font-bold text-gray-80">
                            Battlecards AI Companion
                        </h1>
                        <Link to={".."}>back</Link>
                    </div>
                    <div>
                        <Routes>
                            <Route
                                path="/"
                                element={<LandingPage {...{ user }} />}
                            />
                            <Route
                                path="/signup"
                                element={<SignUp onSuccess={login} />}
                            />
                            <Route
                                path="/login"
                                element={<LoginMenu onSuccess={login} />}
                            />
                            <Route
                                path="/menu"
                                element={
                                    <Menu
                                        {...{
                                            user,
                                            organization,
                                            allowRecording: detectGoogleMeetURL(
                                                currentTab?.url
                                            ),
                                            logout
                                        }}
                                    />
                                }
                            />
                            <Route
                                path="/startMeeting"
                                element={
                                    <LanguageSelection
                                        {...{ startRecording }}
                                    />
                                }
                            />
                            <Route
                                path="/createOrganization"
                                element={
                                    <OrganizationCreation
                                        onSuccess={updateOrganization}
                                    />
                                }
                            />
                            <Route
                                path="/provideContext"
                                element={
                                    <ProvideContext
                                        organization={organization}
                                    />
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </MemoryRouter>
        </>
    )
}

export default IndexPopup
