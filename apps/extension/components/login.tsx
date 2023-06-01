import { Field, Form, Formik } from "formik"
import { useNavigate } from "react-router-dom"

interface LoginProps {}

interface LoginForm {
    email: string
    password: string
    remember: boolean
}

function Login(props: LoginProps) {
    const submit = (form: LoginForm) => {
        alert(JSON.stringify(form, null, 2))
        navigate("/menu")
    }

    const navigate = useNavigate()

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                            Sign in
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Don’t have a Battlecard account yet ?
                            <a
                                className="text-blue-600 decoration-2 hover:underline font-medium"
                                href="../examples/html/signup.html">
                                Sign up here
                            </a>
                        </p>
                    </div>
                </div>
                <Formik
                    initialValues={
                        {
                            email: "",
                            password: "",
                            remember: false
                        } as LoginForm
                    }
                    onSubmit={submit}>
                    <Form>
                        <div className="grid gap-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm mb-2 dark:text-white">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                        required
                                        aria-describedby="email-error"
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
                                    id="email-error">
                                    Please include a valid email address so we
                                    can get back to you
                                </p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm mb-2 dark:text-white">
                                        Password
                                    </label>
                                    <a
                                        className="text-sm text-blue-600 decoration-2 hover:underline font-medium"
                                        href="../examples/html/recover-account.html">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Field
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                        required
                                        aria-describedby="password-error"
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
                                    id="password-error">
                                    8+ characters required
                                </p>
                            </div>
                            <div className="flex items-center">
                                <div className="flex">
                                    <Field
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                    />
                                </div>
                                <div className="ml-3">
                                    <label
                                        htmlFor="remember"
                                        className="text-sm dark:text-white">
                                        Remember me
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                                Sign in
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}

export default Login
