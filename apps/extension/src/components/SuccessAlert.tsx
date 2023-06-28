function SuccessAlert(props: { message: string }) {
    return (
        <div
            className="bg-klosio-green-100 text-klosio-green-500 rounded-md p-4 w-full flex flex-row items-center space-x-1"
            role="alert">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                    d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                    stroke-width="0"
                    fill="currentColor"></path>
            </svg>
            <span className="w-full font-bold text-xs">{props.message}</span>
        </div>
    )
}

export default SuccessAlert
