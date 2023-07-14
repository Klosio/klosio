import ErrorSvg from "react:~/assets/svg/error.svg"

interface ErrorAlertProps {
    children: string
}

function ErrorAlert(props: ErrorAlertProps) {
    return (
        <div
            className="bg-red-200 text-red-600 rounded-md p-4 w-full flex flex-row items-center space-x-1"
            role="alert">
            <ErrorSvg className="w-[20px]" />
            <p className="w-full font-bold text-xs">{props.children}</p>
        </div>
    )
}

export default ErrorAlert
