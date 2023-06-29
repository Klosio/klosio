import { zodResolver } from "@hookform/resolvers/zod"
import csvFileTemplate from "raw:~/assets/painpoints-template.csv"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { type z } from "zod"

import { useAuth } from "~providers/AuthProvider"
import type BusinessContext from "~types/businessContext.model"
import type Organization from "~types/organization.model"
import { businessContextFormSchema } from "~validation/businessContextForm.schema"

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

type BusinessContextForm = z.infer<typeof businessContextFormSchema>

function ProvideContext() {
    const [csvFile, setCsvFile] = useState<File>(null)
    const [businessContext, setBusinessContext] =
        useState<BusinessContext>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting }
    } = useForm<BusinessContextForm>({
        resolver: zodResolver(businessContextFormSchema),
        defaultValues: {
            ...businessContext
        }
    })

    const { userSession } = useAuth()

    const navigate = useNavigate()

    const onSubmit = async (form: BusinessContextForm) => {
        const organization = userSession.user.organization
        const businessContextPromise = saveBusinessContext(organization, form)
        const painpointsPromise = savePainpoints(organization)
        const responses = await Promise.all([
            painpointsPromise,
            businessContextPromise
        ])
        if (responses.some((response) => !response.ok)) {
            console.error("Error on business context save")
            return
        }
        alert("Business context saved with success")
        navigate("/menu")
    }

    const savePainpoints = async (
        organization: Organization
    ): Promise<Response> => {
        const formData = new FormData()
        formData.append("file", csvFile)
        return await fetch(
            `${serverUri}/api/v1/organizations/${organization.id}/painpoints`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userSession.token}`
                },
                body: formData
            }
        )
    }

    const createBusinessContext = async (
        organization: Organization,
        form: BusinessContextForm
    ): Promise<Response> => {
        const { battlecards, ...businessContextForm } = form
        return await fetch(
            `${serverUri}/api/v1/organizations/${organization.id}/business-context`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession.token}`
                },
                body: JSON.stringify(businessContextForm)
            }
        )
    }

    const updateBusinessContext = async (
        organization: Organization,
        form: BusinessContextForm
    ): Promise<Response> => {
        const { battlecards, ...businessContextForm } = form
        return await fetch(
            `${serverUri}/api/v1/organizations/${organization.id}/business-context/${businessContext.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession.token}`
                },
                body: JSON.stringify(businessContextForm)
            }
        )
    }

    const saveBusinessContext = async (
        organization: Organization,
        form: BusinessContextForm
    ): Promise<Response> => {
        if (!businessContext) {
            return await createBusinessContext(organization, form)
        }
        return await updateBusinessContext(organization, form)
    }

    const fetchBusinessContext = async () => {
        const organizationId = userSession.user.organization.id
        const response = await fetch(
            `${serverUri}/api/v1/organizations/${organizationId}/business-context`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userSession.token}`
                }
            }
        )
        if (!response.ok) {
            console.error("Error on business context get")
            return
        }
        const businessContexts: BusinessContext[] = await response.json()
        if (!businessContexts || !businessContexts.length) {
            return
        }
        if (businessContexts.length > 1) {
            console.error(
                `Multiple business contexts per organization not supported for now, taking the first found for organization ${organizationId}`
            )
        }
        setBusinessContext(businessContexts[0])
        reset(businessContexts[0])
    }

    useEffect(() => {
        fetchBusinessContext()
    }, [])

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                        Provide context
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Give information about your business context to get
                        accurate real-time battlecards
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-2 items-center">
                        <div className="w-full">
                            <label
                                htmlFor="industry"
                                className="block text-sm mb-2 dark:text-white">
                                Your industry
                            </label>
                            <div className="relative">
                                <input
                                    id="industry"
                                    type="text"
                                    {...register("industry", {
                                        required: true
                                    })}
                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                    placeholder="Software as a Service"
                                />
                                {errors.industry && (
                                    <div>
                                        <p className="text-xs text-red-600 mt-2">
                                            {errors.industry?.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="selling"
                                className="block text-sm mb-2 dark:text-white">
                                The product / service you are selling
                            </label>
                            <div className="relative">
                                <input
                                    id="selling"
                                    type="text"
                                    {...register("selling", { required: true })}
                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                    placeholder="Scheduling and workforce management software"
                                />
                                {errors.selling && (
                                    <div>
                                        <p className="text-xs text-red-600 mt-2">
                                            {errors.selling?.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="target"
                                className="block text-sm mb-2 dark:text-white">
                                Your target audience
                            </label>
                            <div className="relative">
                                <textarea
                                    id="target"
                                    {...register("target", { required: true })}
                                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                    placeholder="Companies in Healthcare, Manufacturing, Hospitality, Retail..."
                                />
                                {errors.target && (
                                    <div>
                                        <p className="text-xs text-red-600 mt-2">
                                            {errors.target?.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <a
                            href={csvFileTemplate}
                            download
                            className="text-klosio-blue-600 decoration-2 hover:underline font-medium">
                            Download .csv template
                        </a>
                        <div>
                            <label
                                htmlFor="battlecards"
                                className="block text-sm mb-2 dark:text-white">
                                Your battlecards
                            </label>
                            <div className="w-full">
                                <label
                                    htmlFor="battlecards"
                                    className="sr-only">
                                    Your battlecards
                                </label>
                                <input
                                    id="battlecards"
                                    type="file"
                                    {...register("battlecards", {
                                        required: true
                                    })}
                                    className="block w-full border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                                                file:bg-transparent file:border-0
                                                file:bg-gray-100 file:mr-4
                                                file:py-3 file:px-4
                                                dark:file:bg-gray-700 dark:file:text-gray-400"
                                    onChange={(event) => {
                                        setCsvFile(event.target.files[0])
                                    }}
                                />
                                {errors.battlecards && (
                                    <div>
                                        <p className="text-xs text-red-600 mt-2"></p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-500 text-white disabled:cursor-not-allowed disabled:bg-klosio-blue-300 hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                            disabled={!isValid || isSubmitting}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProvideContext
