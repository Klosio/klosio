import type Organization from "~types/organization.model"
import type User from "~types/user.model"

interface LoginStatusProps {
    user: User
    organization: Organization
}

function LoginStatus(props: LoginStatusProps) {
    return (
        <>
            <div>
                <p className="font-semi-bold">Connected as</p>
                <p className="font-bold">{props.user?.email}</p>
            </div>
            {props.organization && (
                <div>
                    <p className="font-semi-bold">Connected to</p>
                    <p className="font-bold">{props.organization.name}</p>
                </div>
            )}
        </>
    )
}

export default LoginStatus
