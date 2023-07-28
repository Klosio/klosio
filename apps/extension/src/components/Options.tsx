import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import LoginStatus from "~components/LoginStatus"
import type Option from "~types/option.model"
import type UserSession from "~types/userSession.model"

import "~/style.css"

import { FormErrorMessage } from "./FormsError"

import { MATCH_THRESHOLD, PROMPT } from "~constants/options"
import { httpRequest } from "~core/httpRequest"
import { useAlert } from "~providers/AlertProvider"
import { optionsFormSchema } from "~validation/optionsForm.schema"

import("preline")

const availableOptions = [PROMPT, MATCH_THRESHOLD] as const
export type AvailableOption = (typeof availableOptions)[number]

interface OptionsProps {
    userSession: UserSession
}

type OptionsForm = z.infer<typeof optionsFormSchema>

function Options(props: OptionsProps) {
    const { showErrorMessage, showSuccessMessage } = useAlert()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isValid, isSubmitting, errors }
    } = useForm<OptionsForm>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(optionsFormSchema)
    })

    const onSubmit = async (data: OptionsForm) => await saveOptions(data)

    const fetchCurrentValue = async (optionName: AvailableOption) => {
        try {
            const response = await httpRequest.get(`/v1/options/${optionName}`)
            const option = response.data as Option
            setValue(optionName, option.value)
        } catch (error) {
            await showErrorMessage(error.response.data.code)
        }
    }

    const saveOptions = async (form: OptionsForm) => {
        const savedOptionPromises = availableOptions.map((option) =>
            saveOptionValue(option, form[option])
        )
        try {
            await Promise.all(savedOptionPromises)
        } catch (error) {
            await showErrorMessage(error.response.data.code)
            return
        }
        await showSuccessMessage("Options saved with success.")
    }

    const saveOptionValue = async (
        optionName: AvailableOption,
        value: string
    ) => {
        const response = await httpRequest.put(`/v1/options/${optionName}`, {
            value: value
        })
        setValue(optionName, value)
        return response
    }

    useEffect(() => {
        availableOptions.forEach((option) => fetchCurrentValue(option))
    }, [])

    return (
        <>
            <LoginStatus user={props.userSession.user} />
            <div className="mt-2">
                <h1 className="text-center block text-2xl font-bold text-gray-800 dark:text-white">
                    Provide options
                </h1>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-5 items-center w-full">
                <div className="w-1/2">
                    <label
                        htmlFor={PROMPT}
                        className="block text-sm mb-2 dark:text-white">
                        Prompt
                    </label>
                    <div className="relative w-full">
                        <textarea
                            name={PROMPT}
                            {...register(PROMPT, {
                                required: true
                            })}
                            className="block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-500 focus:ring-klosio-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            required
                        />
                    </div>
                </div>
                <div className="w-1/2">
                    <label
                        htmlFor={MATCH_THRESHOLD}
                        className="block text-sm mb-2 dark:text-white">
                        Match threshold
                    </label>
                    <div className="relative w-full">
                        <input
                            type="text"
                            name={MATCH_THRESHOLD}
                            {...register(MATCH_THRESHOLD, {
                                required: true
                            })}
                            className="block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-500 focus:ring-klosio-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            required
                        />
                    </div>
                    <FormErrorMessage error={errors?.prompt} />
                </div>
                <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-500 text-white disabled:cursor-not-allowed disabled:bg-klosio-blue-300 hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    disabled={!isValid || isSubmitting}>
                    Save options
                </button>
            </form>
        </>
    )
}

export default Options
