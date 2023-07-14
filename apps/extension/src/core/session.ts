import type UserSession from "~types/userSession.model"

import { Storage } from "@plasmohq/storage"
import { isGoogleMeetURL } from "./browser"
import { supabase } from "./supabase"

// from storage
async function getUserSession(): Promise<UserSession | null> {
    const storage = new Storage({
        area: "local"
    })
    const userSession = (await storage.get("user")) as UserSession
    if (userSession && isSessionExpired(userSession)) {
        const newUserSession = await refreshUserSession()
        newUserSession.user = userSession.user
        storage.set("user", newUserSession)
        return newUserSession
    }
    return userSession
}

// from Supabase
async function refreshUserSession(): Promise<UserSession> {
    const { data, error } = await supabase.auth.getSession() // token is auto-refreshed
    if (error) {
        //console.error(error)
        return
    }
    let session = data.session
    if (!session || !session.user) {
        return
    }
    return {
        authId: session.user.id,
        token: session.access_token,
        expiresAt: session.expires_at,
        refreshToken: session.refresh_token,
        remember: false
    }
}

function isSessionExpired(userSession: UserSession): boolean {
    if (Date.now() >= userSession.expiresAt * 1000) {
        return true
    }
    return false
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

export {
    getUserSession,
    isSessionExpired,
    refreshUserSession,
    isLoggedIn,
    addGetSessionListener
}
