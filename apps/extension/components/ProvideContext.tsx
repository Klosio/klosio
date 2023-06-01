import { Field, Form, Formik } from "formik"
import { useNavigate } from "react-router-dom"

interface ProvideContextForm {
    industry: string
    selling: string
    target: string
    file: unknown
}

function ProvideContext() {
    const navigate = useNavigate()

    const submit = (form: ProvideContextForm) => {
        alert(JSON.stringify(form, null, 2))
        navigate("/menu")
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                            Provide context
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Give information about your business context to get
                            accurate real-time battlecards
                        </p>
                    </div>
                </div>
                <Formik
                    initialValues={
                        {
                            industry: "",
                            selling: "",
                            target: "",
                            file: null
                        } as ProvideContextForm
                    }
                    onSubmit={submit}>
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
                                                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
                                                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
                                                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
                            <Field name="file">
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
                                                className="block w-full border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                                        file:bg-transparent file:border-0
                                        file:bg-gray-100 file:mr-4
                                        file:py-3 file:px-4
                                        dark:file:bg-gray-700 dark:file:text-gray-400"
                                                {...field}
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
        </>
    )
}

export default ProvideContext
