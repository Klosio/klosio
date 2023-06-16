import { Route, Routes } from "react-router-dom"

import LandingPage from "~components/LandingPage"
import LanguageSelection from "~components/LanguageSelection"
import LoginMenu from "~components/LoginMenu"
import Menu from "~components/Menu"
import OrganizationCreation from "~components/OrganizationCreation"
import ProvideContext from "~components/ProvideContext"
import SignUp from "~components/SignUp"
import { isRecordingAllowed, startRecording } from "~core/recorder"
import { useAuth } from "~providers/AuthProvider"

import RouteGuard from "./RouteGuard"

interface AppRoutesProps {
    currentTab: chrome.tabs.Tab
}

function AppRoutes(props: AppRoutesProps) {
    const { userSession } = useAuth()
    const isUserLoggedIn = userSession ? !!userSession.user : false

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <RouteGuard
                        isAccessible={!isUserLoggedIn}
                        redirectTo="/menu">
                        <LandingPage />
                    </RouteGuard>
                }
            />
            <Route
                path="/signup"
                element={
                    <RouteGuard isAccessible={!isUserLoggedIn}>
                        <SignUp />
                    </RouteGuard>
                }
            />
            <Route
                path="/login"
                element={
                    <RouteGuard isAccessible={!isUserLoggedIn}>
                        <LoginMenu />
                    </RouteGuard>
                }
            />
            <Route
                path="/menu"
                element={
                    <RouteGuard isAccessible={isUserLoggedIn}>
                        <Menu currentTab={props.currentTab} />
                    </RouteGuard>
                }
            />
            <Route
                path="/startMeeting"
                element={
                    <RouteGuard
                        isAccessible={
                            isUserLoggedIn &&
                            isRecordingAllowed(props.currentTab)
                        }>
                        <LanguageSelection {...{ startRecording }} />
                    </RouteGuard>
                }
            />
            <Route
                path="/createOrganization"
                element={
                    <RouteGuard isAccessible={isUserLoggedIn}>
                        <OrganizationCreation />
                    </RouteGuard>
                }
            />
            <Route
                path="/provideContext"
                element={
                    <RouteGuard isAccessible={isUserLoggedIn}>
                        <ProvideContext />
                    </RouteGuard>
                }
            />
        </Routes>
    )
}

export default AppRoutes
