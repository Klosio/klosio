import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import { useAuth } from "~providers/AuthProvider"
import type Organization from "~types/organization.model"

import { httpRequest } from "~core/httpRequest"
import { useAlert } from "~providers/AlertProvider"
import { domainManagementFormSchema } from "~validation/domainManagementForm.schema"
import { FormErrorIcon, FormErrorMessage } from "./FormsError"
import Info from "./Info"

type DomainManagementForm = z.infer<typeof domainManagementFormSchema>

function DomainManagement() {
    const { userSession } = useAuth()
    const { showErrorMessage, showSuccessMessage, hideErrorMessages } =
        useAlert()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isValid, isSubmitting, errors }
    } = useForm<DomainManagementForm>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(domainManagementFormSchema)
    })

    useEffect(() => {
        fetchDefaultDomain()
    }, [])

    const fetchDefaultDomain = async () => {
        const id = userSession?.user?.organization?.id
        if (id) {
            try {
                const response = await httpRequest.get(
                    `/v1/organizations/${id}?fields=domain`
                )
                const organization = response.data as Partial<Organization>
                setValue("domain", organization.domain)
            } catch (error) {
                await showErrorMessage(error.response.data.code)
            }
        }
    }

    const onSubmit: SubmitHandler<DomainManagementForm> = async (data) => {
        await hideErrorMessages()
        try {
            const response = await saveDomain(
                userSession?.user?.organization,
                data.domain
            )
            await showSuccessMessage("Email domain saved with success.")
            navigate("/menu")
        } catch (error) {
            await showErrorMessage(error.response.data.code)
        }
    }

    const saveDomain = async (
        organization: Organization,
        domain: string
    ): Promise<Response> => {
        return await httpRequest.post(
            `/v1/organizations/${organization.id}/domain`,
            { domain }
        )
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
                to={"/emailManagement"}
                className="font-bold text-klosio-green-300 hover:text-klosio-green-600 focus:outline-none focus:ring-2 ring-offset-white focus:ring-klosio-green-300 focus:ring-offset-2 transition-all text-sm">
                Switch to manual management
            </Link>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
                <div>
                    <label
                        htmlFor="domain"
                        className="block text-sm font-medium mb-2 dark:text-white">
                        Organization custom email domain
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="domain"
                            {...register("domain", { required: true })}
                            className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                            placeholder="mydomain.com"
                        />
                        <FormErrorIcon error={errors?.domain} />
                    </div>
                    <FormErrorMessage error={errors?.domain} />
                </div>
                <Info>
                    All users signing-in with an email address from your domain
                    will automatically be associated with your organization.
                </Info>
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

export default DomainManagement
