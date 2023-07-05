import "~/style.css"

import("preline")

function OptionsUnauthorized() {
    return (
        <>
            <div className="max-w-[50rem] flex flex-col mx-auto w-full h-full">
                <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                    <h1 className="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">
                        404
                    </h1>
                    <h1 className="block text-2xl font-bold text-white"></h1>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Oops, something went wrong.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Sorry, we couldn't find your page.
                    </p>
                </div>
            </div>
        </>
    )
}

export default OptionsUnauthorized
