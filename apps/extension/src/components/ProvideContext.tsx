import { Field, Form, Formik } from "formik"
import csvFileTemplate from "raw:~/assets/painpoints-template.csv"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "~providers/AuthProvider"
import type Organization from "~types/organization.model"

interface ProvideContextForm {
    industry: string
    selling: string
    target: string
    file: unknown
}

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

function ProvideContext() {
    const [csvFile, setCsvFile] = useState<File>(null)
    const { userSession } = useAuth()

    const navigate = useNavigate()

    const submit = async (form: ProvideContextForm) => {
        const response = await savePainpoints(userSession.user.organization)
        if (!response.ok) {
            console.error("Error on pain points save")
            return
        }
        navigate("/menu")
    }

    const savePainpoints = async (
        organization: Organization
    ): Promise<Response> => {
        const formData = new FormData()
        formData.append("file", csvFile)
        return await fetch(
            `${serverUri}/api/v1/organizations/${organization._id}/painpoints`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userSession.token}`
                },
                body: formData
            }
        )
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                        Provide context
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Give information about your business context to get
                        accurate real-time battlecards
                    </p>
                </div>
                <Formik
                    initialValues={
                        {
                            industry: "",
                            selling: "",
                            target: "",
                            file: undefined
                        } as ProvideContextForm
                    }
                    onSubmit={submit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="flex flex-col space-y-2 items-center">
                                <Field name="industry">
                                    {({ field, form, meta }) => (
                                        <div className="w-full">
                                            <label
                                                htmlFor="industry"
                                                className="block text-sm mb-2 dark:text-white">
                                                Your industry
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    {...field}
                                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                                    placeholder="Software as a Service"
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
                                <Field name="selling">
                                    {({ field, form, meta }) => (
                                        <div className="w-full">
                                            <label
                                                htmlFor="industry"
                                                className="block text-sm mb-2 dark:text-white">
                                                The product / service you are
                                                selling
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    {...field}
                                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                                    placeholder="Scheduling and workforce management software"
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
                                <Field name="target">
                                    {({ field, form, meta }) => (
                                        <div className="w-full">
                                            <label
                                                htmlFor="industry"
                                                className="block text-sm mb-2 dark:text-white">
                                                Your target audience
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    type="text"
                                                    {...field}
                                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                                    placeholder="Companies in Healthcare, Manufacturing, Hospitality, Retail..."
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
                                <a
                                    href={csvFileTemplate}
                                    download
                                    className="text-klosio-blue-600 decoration-2 hover:underline font-medium">
                                    Download .csv template
                                </a>
                                <Field name="file" type="file">
                                    {({ field, form, meta }) => (
                                        <div>
                                            <label
                                                htmlFor="industry"
                                                className="block text-sm mb-2 dark:text-white">
                                                Your battlecards
                                            </label>
                                            <div className="w-full">
                                                <label
                                                    htmlFor="file"
                                                    className="sr-only">
                                                    Your battlecards
                                                </label>
                                                <input
                                                    type="file"
                                                    name="file"
                                                    className="block w-full border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                                                                file:bg-transparent file:border-0
                                                                file:bg-gray-100 file:mr-4
                                                                file:py-3 file:px-4
                                                                dark:file:bg-gray-700 dark:file:text-gray-400"
                                                    {...field}
                                                    onChange={(event) => {
                                                        setCsvFile(
                                                            event.target
                                                                .files[0]
                                                        )
                                                    }}
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
                                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-300 text-white hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                                    disabled={isSubmitting}>
                                    Save
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default ProvideContext
