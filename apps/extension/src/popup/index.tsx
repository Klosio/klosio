import { useEffect, useState } from "react"

import "~/style.css"

import { MemoryRouter } from "react-router-dom"

import AppHeader from "~components/AppHeader"
import { getCurrentTab } from "~core/browser"
import { AlertProvider } from "~providers/AlertProvider"
import { AuthProvider } from "~providers/AuthProvider"
import AppRoutes from "~routes/AppRoutes"

import("preline")

function IndexPopup() {
    const [currentTab, setCurrentTab] = useState(null)

    useEffect(() => {
        getCurrentTab().then((t) => setCurrentTab(t))
    }, [])

    return (
        <MemoryRouter>
            <AuthProvider>
                <div className="m-2 w-[350px] space-y-2 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
                    <AppHeader backLink />
                    <AlertProvider>
                        <AppRoutes currentTab={currentTab} />
                    </AlertProvider>
                </div>
            </AuthProvider>
        </MemoryRouter>
    )
}

export default IndexPopup
