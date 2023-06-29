import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import LoginStatus from "~components/LoginStatus"
import type Option from "~types/option.model"
import type UserSession from "~types/userSession.model"

import "~/style.css"

import { FormErrorMessage } from "./FormsError"

import("preline")

interface OptionsProps {
    userSession: UserSession
}

const optionsFormSchema = z.object({
    prompt: z.string().nonempty({ message: "The prompt is required" })
})

type OptionsForm = z.infer<typeof optionsFormSchema>

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

function Options(props: OptionsProps) {
    const [currentPrompt, setCurrentPrompt] = useState("")

    const {
        register,
        handleSubmit,
        formState: { isValid, isSubmitting, errors }
    } = useForm<OptionsForm>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: zodResolver(optionsFormSchema),
        defaultValues: {
            prompt: currentPrompt
        }
    })

    const onSubmit = async (data: OptionsForm) => await savePrompt(data)

    const fetchCurrentPrompt = async () => {
        const response = await fetch(`${serverUri}/api/v1/options/prompt`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userSession.token}`
            }
        })
        if (!response.ok) {
            console.error("Error on prompt get")
            return
        }
        const option: Option = await response.json()
        setCurrentPrompt(option.value)
    }

    const savePrompt = async (form: OptionsForm) => {
        const response = await fetch(`${serverUri}/api/v1/options/prompt`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userSession.token}`
            },
            body: JSON.stringify({ value: form.prompt })
        })
        if (!response.ok) {
            console.error("Error on prompt save")
            return
        }
        setCurrentPrompt(form.prompt)
        alert("Prompt updated")
    }

    useEffect(() => {
        fetchCurrentPrompt()
    }, [])

    return (
        <>
            <LoginStatus user={props.userSession.user} />
            <div className="mt-2">
                <h1 className="text-center block text-2xl font-bold text-gray-800 dark:text-white">
                    Provide options
                </h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-5 items-center w-full">
                    <div className="w-1/2">
                        <label
                            htmlFor="prompt"
                            className="block text-sm mb-2 dark:text-white">
                            Your prompt
                        </label>
                        <div className="relative w-full">
                            <textarea
                                name="prompt"
                                {...register("prompt", {
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
                        disabled={!isValid || isSubmitting}
                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-500 text-white hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                        Save prompt
                    </button>
                </div>
            </form>
        </>
    )
}

export default Options
