import { Navigate } from "react-router-dom"

interface RoleGuardProps {
    grantedRoles: string[]
    userRole: string
    redirectTo?: string
    children: JSX.Element
}

function RoleGuard({
    grantedRoles,
    userRole,
    redirectTo = "/",
    children
}: RoleGuardProps): JSX.Element {
    return grantedRoles.includes(userRole) ? (
        children
    ) : (
        <Navigate to={redirectTo} replace />
    )
}

export default RoleGuard
