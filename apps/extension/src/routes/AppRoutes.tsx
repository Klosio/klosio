import { Route, Routes, useLocation } from "react-router-dom"

import DomainManagement from "~components/DomainManagement"
import EmailManagement from "~components/EmailManagement"
import LandingPage from "~components/LandingPage"
import LanguageSelection from "~components/LanguageSelection"
import LoginMenu from "~components/LoginMenu"
import Menu from "~components/Menu"
import OrganizationCreation from "~components/OrganizationCreation"
import ProvideContext from "~components/ProvideContext"
import SignUp from "~components/SignUp"
import { isRecordingAllowed, startRecording } from "~core/recorder"
import { isLoggedIn } from "~core/session"
import { useAuth } from "~providers/AuthProvider"

import { useEffect } from "react"
import { useAlert } from "~providers/AlertProvider"
import RoleGuard from "./RoleGuard"
import RouteGuard from "./RouteGuard"

interface AppRoutesProps {
    currentTab: chrome.tabs.Tab
}

function AppRoutes(props: AppRoutesProps) {
    const { userSession } = useAuth()
    const { hideErrorMessages } = useAlert()
    let location = useLocation()
    const isUserLoggedIn = isLoggedIn(userSession)

    const removeAlertsOnRouteChange = async () => {
        await hideErrorMessages()
    }

    useEffect(() => {
        removeAlertsOnRouteChange()
    }, [location])

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
                        <RoleGuard
                            grantedRoles={[
                                "KLOSIO_ADMIN",
                                "ORG_ADMIN",
                                "ORG_MEMBER"
                            ]}
                            userRole={userSession?.user?.role_id}>
                            <Menu currentTab={props.currentTab} />
                        </RoleGuard>
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
                        <RoleGuard
                            grantedRoles={[
                                "KLOSIO_ADMIN",
                                "ORG_ADMIN",
                                "ORG_MEMBER"
                            ]}
                            userRole={userSession?.user?.role_id}>
                            <LanguageSelection {...{ startRecording }} />
                        </RoleGuard>
                    </RouteGuard>
                }
            />
            <Route
                path="/createOrganization"
                element={
                    <RouteGuard isAccessible={isUserLoggedIn}>
                        <RoleGuard
                            grantedRoles={["KLOSIO_ADMIN", "ORG_ADMIN"]}
                            userRole={userSession?.user?.role_id}>
                            <OrganizationCreation />
                        </RoleGuard>
                    </RouteGuard>
                }
            />
            <Route
                path="/domainManagement"
                element={
                    <RouteGuard isAccessible={isUserLoggedIn}>
                        <RoleGuard
                            grantedRoles={["KLOSIO_ADMIN", "ORG_ADMIN"]}
                            userRole={userSession?.user?.role_id}>
                            <DomainManagement />
                        </RoleGuard>
                    </RouteGuard>
                }
            />
            <Route
                path="/emailManagement"
                element={
                    <RouteGuard isAccessible={isUserLoggedIn}>
                        <RoleGuard
                            grantedRoles={["KLOSIO_ADMIN", "ORG_ADMIN"]}
                            userRole={userSession?.user?.role_id}>
                            <EmailManagement />
                        </RoleGuard>
                    </RouteGuard>
                }
            />
            <Route
                path="/provideContext"
                element={
                    <RouteGuard isAccessible={isUserLoggedIn}>
                        <RoleGuard
                            grantedRoles={["KLOSIO_ADMIN", "ORG_ADMIN"]}
                            userRole={userSession?.user?.role_id}>
                            <ProvideContext />
                        </RoleGuard>
                    </RouteGuard>
                }
            />
        </Routes>
    )
}

export default AppRoutes
