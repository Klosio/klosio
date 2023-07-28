import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

import { supabase } from "~core/supabase"
import { useAuth } from "~providers/AuthProvider"
import type User from "~types/user.model"
import type UserSession from "~types/userSession.model"

import { httpRequest } from "~core/httpRequest"
import { useAlert } from "~providers/AlertProvider"
import type { ErrorCode } from "~types/errorCode.model"
import { loginFormSchema } from "~validation/loginForm.schema"
import { FormErrorIcon, FormErrorMessage } from "./FormsError"

interface EmailLoginResponse {
    ok: boolean
    userSession?: UserSession
    errorCode?: ErrorCode
}

type LoginForm = z.infer<typeof loginFormSchema>

function Login() {
    const { login } = useAuth()
    const { showErrorMessage, hideErrorMessages } = useAlert()

    const {
        register,
        handleSubmit,
        formState: { isValid, isSubmitting, errors }
    } = useForm<LoginForm>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(loginFormSchema)
    })

    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
        await hideErrorMessages()
        await submitSignIn(data)
    }

    const submitSignIn = async (form: LoginForm) => {
        const response = await handleEmailLogin(
            form.email,
            form.password,
            form.remember
        )
        if (!response.ok) {
            await showErrorMessage(response.errorCode)
            return
        }
        await login(response.userSession)
    }

    const handleEmailLogin = async (
        username: string,
        password: string,
        remember: boolean
    ): Promise<EmailLoginResponse> => {
        const response = await authEmailLogin(username, password, remember)
        if (!response.ok) {
            return response
        }
        try {
            const user = await fetchUser(response.userSession)
            return {
                ok: true,
                userSession: { ...response.userSession, user: user }
            }
        } catch (error) {
            return { ok: false, errorCode: error.response.data.code }
        }
    }

    const authEmailLogin = async (
        username: string,
        password: string,
        remember: boolean
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
                switch (error.message) {
                    case "Invalid login credentials":
                        return { ok: false, errorCode: "INVALID_CREDENTIALS" }
                    default:
                        return { ok: false, errorCode: "UNKNOWN" }
                }
            }

            return {
                ok: true,
                userSession: {
                    authId: session.user.id,
                    token: session.access_token,
                    expiresAt: session.expires_at,
                    refreshToken: session.refresh_token,
                    remember: remember
                }
            }
        } catch (error) {
            return { ok: false, errorCode: "UNKNOWN" }
        }
    }

    const fetchUser = async (userSession: UserSession): Promise<User> => {
        const response = await httpRequest.get(
            `/v1/users/auth-id/${userSession.authId}`,
            {
                headers: {
                    Authorization: `Bearer ${userSession.token}`
                }
            }
        )
        return response.data as User
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
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-y-4">
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
                    <button
                        type="submit"
                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-500 text-white disabled:cursor-not-allowed disabled:bg-klosio-blue-300 hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                        disabled={!isValid || isSubmitting}>
                        Sign in
                    </button>
                </form>
            </div>
        </>
    )
}

export default Login
