import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "~providers/AuthProvider"
import type UserSession from "~types/userSession.model"

import { useAlert } from "~providers/AlertProvider"
import type { Languages } from "~types/languages.model"
import { languageFormSchema } from "~validation/languageForm.schema"

type LanguageForm = z.infer<typeof languageFormSchema>

interface LanguageSelectionProps {
    startRecording: (language: string, userSession: UserSession) => void
}

const languages: Languages = [
    { label: "English", code: "en", emoji: "🇬🇧" },
    { label: "French", code: "fr", emoji: "🇫🇷" }
]

function LanguageSelection(props: LanguageSelectionProps) {
    const {
        register,
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = useForm<LanguageForm>({
        resolver: zodResolver(languageFormSchema)
    })

    const { userSession } = useAuth()
    const { showSuccessMessage, hideErrorMessages } = useAlert()

    const onSubmit: SubmitHandler<LanguageForm> = async (data) => {
        await hideErrorMessages()
        startMeeting(data.country, userSession)
        await showSuccessMessage("Meeting started with success.")
    }

    const startMeeting = (countryCode: string, userSession: UserSession) => {
        props.startRecording(countryCode, userSession)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center w-full space-y-2">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Start a meeting
            </h1>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Select the language of your meeting before starting.
            </p>
            <div className="space-y-2 w-full">
                <label
                    htmlFor="country"
                    className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200">
                    Language
                </label>
                <select
                    id="country"
                    {...register("country", { required: true })}
                    className="py-2 px-3 pr-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                    {languages.map((language) => (
                        <option key={language.code} value={language.code}>
                            {language.emoji} {language.label}
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-green-300 text-white hover:bg-klosio-green-400 focus:outline-none focus:ring-2 focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                Start
            </button>
        </form>
    )
}

export default LanguageSelection
