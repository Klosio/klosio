import ErrorSvg from "react:~/assets/svg/error.svg"

const FormErrorIcon = (props: { error: any }) => {
    return (
        props?.error && (
            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                <ErrorSvg className="text-red-500" />
            </div>
        )
    )
}

const FormErrorMessage = (props: { error: any }) => {
    return (
        props?.error && (
            <p className="text-xs text-red-600 mt-2">{props.error.message}</p>
        )
    )
}

export { FormErrorIcon, FormErrorMessage }
