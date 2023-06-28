import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom"

type EmailManagementForm = {
    test: Array<{
        email: string
    }>
}

//TODO : implement account creation and management

function EmailManagement() {
    const {
        register,
        control,
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = useForm<EmailManagementForm>({
        defaultValues: {
            test: [{ email: "test@gmail.com" }] // default value
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "test"
    })

    const onSubmit: SubmitHandler<EmailManagementForm> = (data) =>
        console.dir(data)

    return (
        <div className="flex flex-col items-center justify-center w-full space-y-3">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Manage users
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                You don’t have a custom email domain or want to restrict access
                to only a few users?
            </p>
            <Link
                to={"/manageDomain"}
                className="font-bold text-klosio-green-300 hover:text-klosio-green-600 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm">
                Switch to email detection
            </Link>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center justify-center w-full space-y-3">
                <div className="w-full">
                    <label
                        htmlFor="test"
                        className="block text-sm font-medium mb-2 dark:text-white">
                        User email
                    </label>
                    <div className="flex flex-col space-y-2">
                        {fields.map((item, index) => (
                            <div
                                className="w-full flex flex-row space-x-2"
                                key={item.id}>
                                <input
                                    {...register(`test.${index}.email`)}
                                    className="py-3 px-4 w-4/5 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="w-1/5 py-3 px-4 inline-flex justify-center bg-red-400 items-center gap-2 rounded-md border border-transparent font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[20px] w-[20px]"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.75"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"></path>
                                        <path d="M4 7l16 0"></path>
                                        <path d="M10 11l0 6"></path>
                                        <path d="M14 11l0 6"></path>
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => append({ email: "john.doe@email.com" })}>
                    Add
                </button>
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-300 text-white hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                    Save
                </button>
            </form>
        </div>
    )
}

export default EmailManagement
