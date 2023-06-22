import { Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"

import LoginStatus from "~components/LoginStatus"
import type Option from "~types/option.model"
import type UserSession from "~types/userSession.model"

import "~/style.css"

import("preline")

interface OptionsProps {
    userSession: UserSession
}
interface OptionsForm {
    prompt: string
}

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

function Options(props: OptionsProps) {
    const [currentPrompt, setCurrentPrompt] = useState("")

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

    const savePrompt = async (prompt: string) => {
        const response = await fetch(`${serverUri}/api/v1/options/prompt`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userSession.token}`
            },
            body: JSON.stringify({ value: prompt })
        })
        if (!response.ok) {
            console.error("Error on prompt save")
            return
        }
        setCurrentPrompt(prompt)
        alert("Prompt updated")
    }

    useEffect(() => {
        fetchCurrentPrompt()
    }, [])

    const submit = async (form: OptionsForm) => {
        await savePrompt(form.prompt)
    }

    return (
        <>
            <LoginStatus user={props.userSession.user} />
            <div className="">
                <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                        Provide options
                    </h1>
                </div>
            </div>
            <Formik
                initialValues={
                    {
                        prompt: currentPrompt
                    } as OptionsForm
                }
                enableReinitialize={true}
                onSubmit={submit}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="flex flex-col space-y-3 items-center">
                            <Field name="prompt">
                                {({ field, form, meta }) => (
                                    <div>
                                        <label
                                            htmlFor="prompt"
                                            className="block text-sm mb-2 dark:text-white">
                                            Your prompt
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                type="text"
                                                {...field}
                                                className="block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-500 focus:ring-klosio-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                                required
                                            />
                                            {meta.touched && meta.error && (
                                                <div>
                                                    <p className="hidden text-xs text-red-600 mt-2">
                                                        {meta.error}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-500 text-white hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Save
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Options
