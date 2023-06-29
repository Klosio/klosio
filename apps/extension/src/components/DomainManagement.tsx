import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom"
import InfoSvg from "react:~/assets/svg/info.svg"
import { z } from "zod"

import { supabase } from "~core/supabase"
import { useAuth } from "~providers/AuthProvider"
import type Organization from "~types/organization.model"

import SuccessAlert from "./SuccessAlert"

const emailManagementFormSchema = z.object({
    domain: z
        .string()
        .regex(
            new RegExp(
                /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/
            ),
            "The domain is invalid"
        )
        .nonempty("The domain is required")
})

type EmailManagementForm = z.infer<typeof emailManagementFormSchema>

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

function DomainManagement() {
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    const { userSession } = useAuth()

    const showAlert = (setState: Function) => {
        setState(true)
        setTimeout(() => {
            setState(false)
        }, 5000)
    }

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isValid, isSubmitting }
    } = useForm<EmailManagementForm>({
        resolver: zodResolver(emailManagementFormSchema)
    })

    useEffect(() => {
        const fetch = async () => {
            await fetchDefaultDomain()
        }
        fetch()
    }, [])

    const fetchDefaultDomain = async () => {
        if (userSession.user.organization.id) {
            const { data, error } = await supabase
                .from("organizations")
                .select("domain")
                .eq("id", userSession.user.organization.id)
                .single()
            if (error) {
                console.log(error)
                return
            }
            setValue("domain", data.domain)
        }
    }

    const onSubmit: SubmitHandler<EmailManagementForm> = async (data) =>
        await saveDomain(userSession?.user?.organization, data.domain).then(
            async (response) => {
                if (response.status === 204) {
                    showAlert(setShowSuccess)
                    await fetchDefaultDomain()
                } else {
                    showAlert(setShowError)
                }
            }
        )

    const saveDomain = async (
        organization: Organization,
        domain: string
    ): Promise<Response> => {
        return await fetch(
            `${serverUri}/api/v1/organizations/${organization.id}/domain`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession.token}`
                },
                body: JSON.stringify({ domain })
            }
        )
    }

    return (
        <div className="flex flex-col items-center justify-center w-full space-y-3">
            {showSuccess && (
                <SuccessAlert message="Your organization has been sucessfully created." />
            )}
            {showError && <>Error</>}
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Manage users
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                You don’t have a custom email domain or want to restrict access
                to only a few users?
            </p>
            <Link
                to={"/emailManagement"}
                className="font-bold text-klosio-green-300 hover:text-klosio-green-600 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm">
                Switch to email detection
            </Link>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center justify-center w-full space-y-3">
                <div className="w-full">
                    <label
                        htmlFor="domain"
                        className="block text-sm font-medium mb-2 dark:text-white">
                        Organization custom email domain
                    </label>
                    <input
                        type="text"
                        id="domain"
                        {...register("domain", { required: true })}
                        className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                        placeholder="mydomain.com"
                    />
                </div>
                <div className="w-full flex flex-row items-center space-x-1">
                    <div>
                        <InfoSvg className="text-klosio-yellow-400 h-[20px] w-[20px]" />
                    </div>
                    <div className="w-full">
                        <p className="text-xs text-klosio-yellow-400">
                            All users signing-in with an email address from your
                            domain will automatically be associated with your
                            organization.
                        </p>
                    </div>
                </div>
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

export default DomainManagement
