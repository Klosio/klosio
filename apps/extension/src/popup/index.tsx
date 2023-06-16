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

    const fetchUserSession = async () => {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
            console.error(error)
            return
        }
        if (data.session) {
            setUser({ email: data.session.user.email })
        }
    }

    useEffect(() => {
        fetchUserSession()
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
                    <div className="border-b border-gray-200 flex flex-row relative">
                        <Link
                            to={".."}
                            className="w-[24px] h-[24px] absolute z-10 top-[2px] -left-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="hover:text-gray-500 cursor-pointer"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"></path>
                                <path d="M15 6l-6 6l6 6"></path>
                            </svg>
                        </Link>
                        <h1 className="text-lg font-bold text-gray-80 relative text-center w-full">
                            Battlecards AI Companion
                        </h1>
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
