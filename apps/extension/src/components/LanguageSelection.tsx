import { useState } from "react"

interface LanguageSelectionProps {
    startRecording: (language: string) => void
}

function LanguageSelection(props: LanguageSelectionProps) {
    const languages = [
        { label: "English", code: "en", emoji: "🇬🇧" },
        { label: "French", code: "fr", emoji: "🇫🇷" }
    ]

    const [selectedCountry, setSelectedCountry] = useState(languages[0])

    const handleChange = (event) => {
        setSelectedCountry(
            languages.find((language) => language.code === event.target.value)
        )
    }

    const startMeeting = () => {
        props.startRecording(selectedCountry.code)
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full space-y-2">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                    Start a meeting
                </h1>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Select the language of your meeting before starting.
                </p>
                <div className="space-y-2 w-full">
                    <label
                        htmlFor="af-submit-app-category"
                        className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200">
                        Language
                    </label>

                    <select
                        value={selectedCountry.code}
                        onChange={handleChange}
                        id="af-submit-app-category"
                        className="py-2 px-3 pr-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                        {languages.map((language) => (
                            <option key={language.code} value={language.code}>
                                {language.emoji} {language.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={startMeeting}
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-green-300 text-white hover:bg-klosio-green-400 focus:outline-none focus:ring-2 focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                    Start
                </button>
            </div>
        </>
    )
}

export default LanguageSelection
