import type UserSession from "~types/userSession.model"

import { isGoogleMeetURL } from "./browser"

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

export { isLoggedIn, addGetSessionListener }
