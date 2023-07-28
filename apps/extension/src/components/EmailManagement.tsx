import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import DeleteSvg from "react:~assets/svg/delete.svg"
import UserPlusSvg from "react:~assets/svg/user-plus.svg"
import { z } from "zod"

import { useAuth } from "~providers/AuthProvider"

import { httpRequest } from "~core/httpRequest"
import { useAlert } from "~providers/AlertProvider"
import { emailManagementFormSchema } from "~validation/emailManagementForm.schema"
import { FormErrorIcon, FormErrorMessage } from "./FormsError"

type EmailManagementForm = z.infer<typeof emailManagementFormSchema>

function EmailManagement() {
    const { userSession } = useAuth()
    const { showErrorMessage, showSuccessMessage, hideErrorMessages } =
        useAlert()
    const navigate = useNavigate()

    const {
        register,
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { isValid, isSubmitting, errors }
    } = useForm<EmailManagementForm>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(emailManagementFormSchema),
        defaultValues: {
            emails: [{ email: undefined }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "emails"
    })

    useEffect(() => {
        getInvitations()
    }, [])

    const onSubmit: SubmitHandler<EmailManagementForm> = async (data) => {
        await hideErrorMessages()
        await saveEmails(data)
    }

    const saveEmails = async (emails: EmailManagementForm) => {
        try {
            await httpRequest.post(
                `/v1/organizations/${userSession.user.organization.id}/invitations`,
                emails
            )
            await showSuccessMessage("User email addresses saved with success.")
            navigate("/menu")
        } catch (error) {
            await showErrorMessage(error.response.data.code)
        }
    }

    const getInvitations = async () => {
        try {
            const response = await httpRequest.get(
                `/v1/organizations/${userSession.user.organization.id}/invitations`
            )
            const emails = response.data as { email?: string }[]
            if (emails.length > 0) {
                setValue("emails", emails)
            }
        } catch (error) {
            await showErrorMessage(error.response.data.code)
        }
    }

    const removeEmail = async (item, index) => {
        remove(index)
    }

    return (
        <div className="flex flex-col items-center justify-center w-full space-y-3">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Manage users
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                You have a custom email domain and want all users to be
                automatically associated with your organization?
            </p>
            <Link
                to={"/domainManagement"}
                className="font-bold text-klosio-green-300 hover:text-klosio-green-600 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm">
                Switch to email domain detection
            </Link>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center justify-center w-full space-y-3">
                {!!getValues().emails.length && (
                    <div className="w-full">
                        <label
                            htmlFor="test"
                            className="block text-sm font-medium mb-2">
                            User email
                        </label>
                        <div className="flex flex-col space-y-2">
                            {fields.map((item, index) => (
                                <div key={`${item.email}:${index}`}>
                                    <div className="w-full flex flex-row space-x-2">
                                        <div className="relative w-4/5">
                                            <input
                                                type="text"
                                                {...register(
                                                    `emails.${index}.email`
                                                )}
                                                placeholder="my-user@email.com"
                                                className="py-3 px-4 w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700"
                                            />
                                            <FormErrorIcon
                                                error={
                                                    errors.emails?.[index]
                                                        ?.email
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeEmail(item, index)
                                            }
                                            className="w-1/5 py-3 px-4 inline-flex justify-center bg-red-400 hover:bg-red-500 items-center gap-2 rounded-md border border-transparent font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all">
                                            <DeleteSvg />
                                        </button>
                                    </div>
                                    <FormErrorMessage
                                        error={errors.emails?.[index]?.email}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    className="text-klosio-green-300 hover:text-klosio-green-400"
                    onClick={() => append({ email: undefined })}>
                    <UserPlusSvg className="w-min" />
                </button>
                <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-500 text-white disabled:cursor-not-allowed disabled:bg-klosio-blue-300 hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    disabled={!isValid || isSubmitting}>
                    Save
                </button>
            </form>
        </div>
    )
}

export default EmailManagement
