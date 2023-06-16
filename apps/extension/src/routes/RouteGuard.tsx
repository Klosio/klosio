import { Navigate } from "react-router-dom"

interface RouteGuardProps {
    isAccessible?: boolean
    redirectTo?: string
    children: JSX.Element
}

function RouteGuard({
    isAccessible = false,
    redirectTo = "/",
    children
}: RouteGuardProps) {
    return isAccessible ? children : <Navigate to={redirectTo} replace />
}

export default RouteGuard
