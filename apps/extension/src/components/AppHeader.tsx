import { Link, useLocation } from "react-router-dom"

function AppHeader() {
    const location = useLocation()

    const disabledRoutes = ["/", "/menu"]

    return (
        <>
            <div className="border-b border-gray-200 flex flex-row relative">
                {!disabledRoutes.some(
                    (route) => route === location.pathname
                ) && (
                    <Link
                        to={".."}
                        className="w-[24px] h-[24px] absolute z-10 top-[2px] -left-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="hover:text-gray-500 cursor-pointer"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"></path>
                            <path d="M15 6l-6 6l6 6"></path>
                        </svg>
                    </Link>
                )}
                <h1 className="text-lg font-bold text-gray-80 relative text-center w-full">
                    Battlecards AI Companion
                </h1>
            </div>
        </>
    )
}

export default AppHeader
