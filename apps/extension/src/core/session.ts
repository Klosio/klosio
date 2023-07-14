import type UserSession from "~types/userSession.model"

import { Storage } from "@plasmohq/storage"
import { isGoogleMeetURL } from "./browser"

async function getUserSession(): Promise<UserSession> {
    const storage = new Storage({
        area: "local"
    })
    return (await storage.get("user")) as UserSession
}

function isLoggedIn(userSession: UserSession): boolean {
    return userSession ? !!userSession.user : false
}

function addGetSessionListener(userSession: UserSession) {
    chrome.runtime.onMessage.addListener(function (
        request,
        sender,
        sendResponse
    ) {
        if (!sender.tab || !isGoogleMeetURL(sender.tab.url)) {
            return
        }
        if (request.session === "get") sendResponse(userSession)
    })
}

export { getUserSession, isLoggedIn, addGetSessionListener }
