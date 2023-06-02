import { Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"

import "./style.css"

import("preline")

interface OptionsForm {
    prompt: string
}

function Options() {
    const [currentPrompt, setCurrentPrompt] = useState("")

    const fetchCurrentPrompt = (): Promise<string> => {
        return fetch("http://localhost:3000/api/v1/prompt", {
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => response.json())
            .then((data) => {
                return data.prompt
            })
    }

    const savePrompt = (prompt: string): Promise<Response> => {
        return fetch("http://localhost:3000/api/v1/prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: currentPrompt })
        })
    }

    useEffect(() => {
        fetchCurrentPrompt().then((prompt) => {
            setCurrentPrompt(prompt)
        }),
            []
    })

    const submit = async (form: OptionsForm) => {
        alert(JSON.stringify(form, null, 2))
        await savePrompt(form.prompt)
    }

    return (
        <div className="m-2 flex flex-col w-full">
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
                onSubmit={submit}>
                <Form>
                    <div className="flex flex-col space-y-3 items-center">
                        <Field name="industry">
                            {({ field, form, meta }) => (
                                <div>
                                    <label
                                        htmlFor="industry"
                                        className="block text-sm mb-2 dark:text-white">
                                        Your prompt
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            type="text"
                                            {...field}
                                            className="block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                            Save
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default Options
