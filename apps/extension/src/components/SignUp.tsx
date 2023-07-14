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
import { FormErrorIcon, FormErrorMessage } from "./FormsError"

const signUpFormSchema = z.object({
    email: z
        .string()
        .email({ message: "The email is invalid" })
        .nonempty({ message: "The email is required" }),
    password: z.string().nonempty({ message: "The password is required" })
})

type SignUpForm = z.infer<typeof signUpFormSchema>

interface SignUpResponse {
    ok: boolean
    userSession?: UserSession
    errorCode?: ErrorCode
}

interface UserDto {
    email: string
    authId: string
}

function SignUp() {
    const { login } = useAuth()
    const { showErrorMessage, showSuccessMessage, hideErrorMessages } =
        useAlert()

    const {
        register,
        handleSubmit,
        formState: { isValid, isSubmitting, errors }
    } = useForm<SignUpForm>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: zodResolver(signUpFormSchema)
    })

    const onSubmit: SubmitHandler<SignUpForm> = async (data: SignUpForm) => {
        await submit(data)
    }

    const submit = async (form: SignUpForm) => {
        await hideErrorMessages()
        const response = await handleSignUp(form.email, form.password)
        if (!response.ok) {
            await showErrorMessage(response.errorCode)
            return
        }
        await showSuccessMessage("Account created with success.")
        await login(response.userSession)
    }

    const authSignUp = async (
        username: string,
        password: string
    ): Promise<SignUpResponse> => {
        try {
            const {
                error,
                data: { session }
            } = await supabase.auth.signUp({ email: username, password })

            if (error) {
                switch (error.message) {
                    case "User already registered":
                        return { ok: false, errorCode: "EXISTING_EMAIL" }
                    default:
                        return { ok: false, errorCode: "UNKNOWN" }
                }
            }

            return {
                ok: true,
                userSession: {
                    authId: session.user.id,
                    token: session.access_token
                }
            }
        } catch (error) {
            return { ok: false, errorCode: "UNKNOWN" }
        }
    }

    const createUser = async (
        username: string,
        userSession: UserSession
    ): Promise<User> => {
        const userToCreate: UserDto = {
            email: username,
            authId: userSession.authId
        }
        const response = await httpRequest.post(`/v1/users`, userToCreate, {
            headers: {
                Authorization: `Bearer ${userSession.token}`
            }
        })
        return response.data as User
    }

    const handleSignUp = async (
        username: string,
        password: string
    ): Promise<SignUpResponse> => {
        const response = await authSignUp(username, password)
        if (!response.ok) {
            return response
        }
        try {
            const createdUser = await createUser(username, response.userSession)
            return {
                ok: true,
                userSession: { ...response.userSession, user: createdUser }
            }
        } catch (error) {
            return {
                ok: false,
                errorCode: error.response.data.code
            }
        }
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                            Sign up
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Already have a Battlecard account?
                        </p>
                        <p>
                            <Link
                                className="text-klosio-blue-600 decoration-2 hover:underline font-medium"
                                to="/login">
                                Sign in here
                            </Link>
                        </p>
                    </div>
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
                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-500 focus:ring-klosio-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    {...register("password", {
                                        required: true
                                    })}
                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-500 focus:ring-klosio-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                />
                                <FormErrorIcon error={errors?.password} />
                            </div>
                            <FormErrorMessage error={errors?.password} />
                        </div>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-500 text-white hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignUp
