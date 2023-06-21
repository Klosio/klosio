import type Battlecard from "~types/battlecard.model"

interface BattlecardProps {
    battlecard: Battlecard
}

function BattlecardComponent(props: BattlecardProps) {
    return (
        <div className="flex flex-col space-y-1">
            <div>
                <p className="text-sm font-medium text-gray-800">
                    Detected pain point
                </p>
                <div className="bg-[#FEF9C3] w-full rounded-md p-2">
                    {props.battlecard.question}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-800">
                    Suggested answer
                </p>
                <div className="bg-[#CCFBF1] w-full rounded-md p-2">
                    {props.battlecard.answer}
                </div>
            </div>
        </div>
    )
}

export default BattlecardComponent
