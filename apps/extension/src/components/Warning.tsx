import WarningSvg from "react:~/assets/svg/warning.svg"

interface WarningProps {
    children: string
}

function Warning(props: WarningProps) {
    return (
        <div className="w-full flex flex-row items-center space-x-1">
            <div>
                <WarningSvg className="text-red-600 h-[20px] w-[20px] m-1" />
            </div>
            <div className="w-full">
                <p className="text-xs text-red-600">{props.children}</p>
            </div>
        </div>
    )
}

export default Warning
