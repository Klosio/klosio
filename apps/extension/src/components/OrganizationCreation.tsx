import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { useAuth } from "~providers/AuthProvider"
import type Organization from "~types/organization.model"

import { httpRequest } from "~core/httpRequest"
import { useAlert } from "~providers/AlertProvider"
import { organizationCreationFormSchema } from "~validation/organizationCreationForm.schema"
import { FormErrorIcon, FormErrorMessage } from "./FormsError"
import Info from "./Info"

type OrganizationCreationForm = z.infer<typeof organizationCreationFormSchema>

function OrganizationCreation() {
    const { userSession, updateSession } = useAuth()
    const { showErrorMessage, showSuccessMessage, hideErrorMessages } =
        useAlert()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { isValid, isSubmitting, errors }
    } = useForm<OrganizationCreationForm>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(organizationCreationFormSchema)
    })

    const onSubmit: SubmitHandler<OrganizationCreationForm> = async (
        data: OrganizationCreationForm
    ) => {
        await hideErrorMessages()
        await submitOrganizationCreation(data)
    }

    const submitOrganizationCreation = async (
        form: OrganizationCreationForm
    ) => {
        try {
            const organization = await createOrganization(form)
            await showSuccessMessage("Organization created with success.")
            userSession.user.organization = organization
            await updateSession(userSession)
            navigate("/menu")
        } catch (error) {
            await showErrorMessage(error.response.data.code)
        }
    }

    const createOrganization = async (
        form: OrganizationCreationForm
    ): Promise<Organization> => {
        const response = await httpRequest.post("/v1/organizations/", {
            ...form,
            user: userSession.user
        })
        return response.data as Organization
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                        Create an organization
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        You will be the only administrator of this organization
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-y-4 mt-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm mb-2 dark:text-white">
                            Organization name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-klosio-blue-300 focus:ring-klosio-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                {...register("name", {
                                    required: true
                                })}
                            />
                            <FormErrorIcon error={errors?.name} />
                        </div>
                        <FormErrorMessage error={errors?.name} />
                    </div>
                    <Info>
                        Only you will be able to provide the business context
                        and manage the organization users.
                    </Info>
                    <button
                        type="submit"
                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-500 text-white disabled:cursor-not-allowed disabled:bg-klosio-blue-300 hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                        disabled={!isValid || isSubmitting}>
                        Create
                    </button>
                </form>
            </div>
        </>
    )
}

export default OrganizationCreation
