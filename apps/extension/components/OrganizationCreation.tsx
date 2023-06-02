import { Field, Form, Formik } from "formik"
import { useNavigate } from "react-router-dom"

interface OrganizationCreationProps {}

interface OrganizationCreationForm {
    name: string
}

function OrganizationCreation(props: OrganizationCreationProps) {
    const navigate = useNavigate()
    let submitDisabled = false

    const submit = async (form: OrganizationCreationForm) => {
        submitDisabled = true
        console.log(JSON.stringify(form))
        const response = await fetch(
            `http://localhost:3000/api/v1/organization/`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            }
        )
        if (!response.ok) {
            console.error("Error on organization save")
            submitDisabled = false
        }

        navigate("/menu")
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                            Create an organization
                        </h1>
                    </div>
                </div>
                <Formik
                    initialValues={
                        {
                            name: ""
                        } as OrganizationCreationForm
                    }
                    onSubmit={submit}>
                    <Form>
                        <div className="grid gap-y-4 mt-2">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm mb-2 dark:text-white">
                                    Organization name
                                </label>
                                <div className="relative">
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                        required
                                        aria-describedby="name-error"
                                    />
                                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                        <svg
                                            className="h-5 w-5 text-red-500"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            aria-hidden="true">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <p
                                    className="hidden text-xs text-red-600 mt-2"
                                    id="name-error">
                                    This organization name is already taken.
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={submitDisabled}
                                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Create
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}

export default OrganizationCreation
