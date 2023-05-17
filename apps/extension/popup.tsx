import "./style.css"

import("preline")

function IndexPopup() {

    const user = { name: "Christophe Dupont"}

    async function openTab() {
        await chrome.tabs.create({
            url: "./tabs/record.html"
        })
    }

    return (
        <div className="m-2 w-[250px] flex flex-col space-y-2">
            <h1 className="text-lg text-center font-bold text-gray-800 dark:text-white">Battlecards AI Companion</h1>
            <h1 className="text-sm text-center font-semi-bold text-gray-700 dark:text-white">Connected as {user.name}</h1>
            <button
                onClick={openTab}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                Start a meeting
            </button>
            <button
                onClick={() => {
                    alert("Not implemented yet")
                }}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-green-100 border border-transparent font-semibold text-green-500 hover:text-white hover:bg-green-100 focus:outline-none focus:ring-2 ring-offset-white focus:ring-green-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                Import Battlecards
            </button>
            <button
                onClick={() => {
                    alert("Not implemented yet")
                }}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-yellow-100 border border-transparent font-semibold text-yellow-500 hover:text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 ring-offset-white focus:ring-yellow-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                Logout
            </button>
        </div>
    )
}

export default IndexPopup
