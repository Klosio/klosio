import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom"
import DeleteSvg from "react:~assets/svg/delete.svg"
import UserPlusSvg from "react:~assets/svg/user-plus.svg"
import { z } from "zod"

import { useAuth } from "~providers/AuthProvider"

import { FormErrorMessage } from "./FormsError"

const emailManagementFormSchema = z.object({
    emails: z
        .array(
            z.object({
                email: z
                    .string()
                    .email({ message: "Email is not formated correctly" })
                    .nonempty({ message: "Email is required" })
            })
        )
        .refine(
            (items) => {
                const emails = items.map((item) => item.email)
                return new Set(emails).size === emails.length
            },
            {
                message: "Must be an array of unique strings"
            }
        )
})

type EmailManagementForm = z.infer<typeof emailManagementFormSchema>

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

function EmailManagement() {
    const { userSession } = useAuth()
    const {
        register,
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { isValid, isSubmitting, errors }
    } = useForm<EmailManagementForm>({
        mode: "onBlur",
        reValidateMode: "onBlur",
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

    const onSubmit: SubmitHandler<EmailManagementForm> = async (data) =>
        await saveEmails(data)

    const saveEmails = async (emails: EmailManagementForm) =>
        await fetch(
            `${serverUri}/api/v1/organizations/${userSession.user.organization.id}/invitations`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession.token}`
                },
                body: JSON.stringify(emails)
            }
        )

    const deleteEmail = async (email) =>
        await fetch(
            `${serverUri}/api/v1/organizations/${userSession.user.organization.id}/invitations`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession.token}`
                },
                body: JSON.stringify(email)
            }
        )

    const getInvitations = async () =>
        await fetch(
            `${serverUri}/api/v1/organizations/${userSession.user.organization.id}/invitations`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession.token}`
                }
            }
        )
            .then((response) => response.json())
            .then((emails) => {
                if (emails.length > 0) {
                    setValue("emails", emails)
                }
            })

    const removeEmail = async (item, index) => {
        remove(index)
        console.dir(errors)
        await deleteEmail({ email: item.email })
    }

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
                                        <input
                                            type="text"
                                            {...register(
                                                `emails.${index}.email`
                                            )}
                                            placeholder="my-user@email.com"
                                            className="py-3 px-4 w-4/5 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700"
                                        />
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
                                        {...{
                                            error: errors.emails?.[index]?.email
                                        }}
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
                    disabled={!isValid || isSubmitting}
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-300 text-white hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                    Save
                </button>
            </form>
        </div>
    )
}

export default EmailManagement
