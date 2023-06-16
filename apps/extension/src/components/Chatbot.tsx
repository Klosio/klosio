import BattlecardComponent from "~components/Battlecard"
import type Battlecard from "~types/battlecard.model"

interface ChatbotProps {
    language: string
    battlecards: Array<Battlecard>
}

function Chatbot(props: ChatbotProps) {
    return (
        <div className="m-2 w-[350px] h-[500px] space-y-2 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <div className="border-b border-gray-200">
                <h1 className="text-lg text-center -bold">
                    Battlecards AI Companion
                </h1>
            </div>
            <div className="border-b border-gray-200">
                <h1 className="text-xl text-center font-bold">
                    Meeting battlecards
                </h1>
                <p className="text-sm text-center font-light text-gray-800">
                    Find here the detected pain points and suggested solutions.
                </p>
                <p className="text-sm text-center font-light text-gray-800">
                    Selected language for this meeting : {props.language}
                </p>
            </div>
            <div className="border-b border-gray-200 overflow-y-auto h-3/4">
                {props.battlecards.map((battlecard) => (
                    <BattlecardComponent
                        key={battlecard.painpoint}
                        battlecard={battlecard}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                <button
                    type="button"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-300 text-white hover:bg-klosio-green-400 focus:outline-none focus:ring-2 focus:ring-klosio-green-400 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                    Stop
                </button>
            </div>
        </div>
    )
}

export default Chatbot
