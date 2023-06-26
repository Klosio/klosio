import klosioLogo from "data-base64:~assets/icon.png"

const Landing = () => {
    return (
        <div className="w-[200px] flex flex-col bg-white border shadow-sm rounded-xl">
            <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
                <img src={klosioLogo} className="w-[80px]" alt="Klosio Logo" />
                <p className="mt-5 text-base text-center text-gray-500">
                    Please use the Klosio extension to sign in and start the
                    meeting.
                </p>
            </div>
        </div>
    )
}

export default Landing
