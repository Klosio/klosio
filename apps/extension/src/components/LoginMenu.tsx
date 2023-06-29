import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

import { supabase } from "~core/supabase"
import { useAuth } from "~providers/AuthProvider"
import type User from "~types/user.model"
import type UserSession from "~types/userSession.model"

import { FormErrorIcon, FormErrorMessage } from "./FormsError"

interface EmailLoginResponse {
    ok: boolean
    userSession?: UserSession
    message?: string
}

const loginFormSchema = z.object({
    email: z
        .string()
        .email({ message: "The email is invalid" })
        .nonempty({ message: "The email is required" }),
    password: z.string().nonempty({ message: "The password is required" }),
    remember: z.boolean().optional()
})

type LoginForm = z.infer<typeof loginFormSchema>

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

function LoginMenu() {
    const { login } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { isValid, isSubmitting, errors }
    } = useForm<LoginForm>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: zodResolver(loginFormSchema)
    })

    const onSubmit: SubmitHandler<LoginForm> = async (data) =>
        await submitSignIn(data)

    const submitSignIn = async (form: LoginForm) => {
        const response = await handleEmailLogin(form.email, form.password)
        if (!response.ok) {
            alert(response.message)
            return
        }
        await login(response.userSession)
    }

    const handleEmailLogin = async (
        username: string,
        password: string
    ): Promise<EmailLoginResponse> => {
        const response = await authEmailLogin(username, password)
        if (!response.ok) {
            return response
        }
        const user = await fetchUser(response.userSession)
        if (!user) {
            return { ok: false, message: "An error occured, please try again." }
        }
        return {
            ok: true,
            userSession: { ...response.userSession, user: user }
        }
    }

    const authEmailLogin = async (
        username: string,
        password: string
    ): Promise<EmailLoginResponse> => {
        try {
            const {
                error,
                data: { session }
            } = await supabase.auth.signInWithPassword({
                email: username,
                password
            })

            if (error) {
                console.error(`Error with auth: ${error.message}`)
                return { ok: false, message: error.message }
            }

            return {
                ok: true,
                userSession: {
                    authId: session.user.id,
                    token: session.access_token
                }
            }
        } catch (error) {
            console.error(error)
            return { ok: false, message: "An error occured, please try again." }
        }
    }

    const fetchUser = async (userSession: UserSession): Promise<User> => {
        const response = await fetch(
            `${serverUri}/api/v1/users/auth-id/${userSession.authId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession.token}`
                }
            }
        )
        if (!response.ok) {
            console.error("Error on user get")
            return
        }
        return await response.json()
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                        Sign in
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Don’t have a Battlecard account yet?
                    </p>
                    <p>
                        <Link
                            className="text-klosio-blue-600 decoration-2 hover:underline font-medium"
                            to="/signup">
                            Sign up here
                        </Link>
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm mb-2 dark:text-white">
                                Email address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email", {
                                        required: true
                                    })}
                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-500 focus:ring-klosio-blue-500"
                                />
                                <FormErrorIcon error={errors?.email} />
                            </div>
                            <FormErrorMessage error={errors?.email} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="block text-sm mb-2 dark:text-white">
                                    Password
                                </label>
                                <a
                                    className="text-sm text-klosio-blue-600 decoration-2 hover:underline font-medium"
                                    href="../examples/html/recover-account.html">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    {...register("password", {
                                        required: true
                                    })}
                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-500 focus:ring-klosio-blue-500"
                                />
                                <FormErrorIcon error={errors?.password} />
                            </div>
                            <FormErrorMessage error={errors?.password} />
                        </div>
                        <div className="flex items-center">
                            <div className="flex">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    {...register("remember", {
                                        required: false
                                    })}
                                    className="shrink-0 mt-0.5 border-gray-200 rounded text-klosio-blue-600 pointer-events-none focus:ring-klosio-blue-500"
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
                            disabled={!isValid || isSubmitting}
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold disabled:bg-klosio-blue-300 bg-klosio-blue-500 text-white hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginMenu
