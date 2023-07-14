import CheckSvg from "react:~/assets/svg/check.svg"

function SuccessAlert(props: { message: string }) {
    return (
        <div
            className="bg-klosio-green-100 text-klosio-green-500 rounded-md p-4 w-full flex flex-row items-center space-x-1"
            role="alert">
            <CheckSvg />
            <span className="w-full font-bold text-xs">{props.message}</span>
        </div>
    )
}

export default SuccessAlert
