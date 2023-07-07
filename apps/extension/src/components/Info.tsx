import InfoSvg from "react:~/assets/svg/info.svg"

interface InfoProps {
    children: string
}

function Info(props: InfoProps) {
    return (
        <div className="w-full flex flex-row items-center space-x-1">
            <div>
                <InfoSvg className="text-klosio-yellow-400 h-[20px] w-[20px] m-1" />
            </div>
            <div className="w-full">
                <p className="text-xs text-klosio-yellow-400">
                    {props.children}
                </p>
            </div>
        </div>
    )
}

export default Info
