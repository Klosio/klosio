import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { useAuth } from "~providers/AuthProvider"
import type Organization from "~types/organization.model"

import { FormErrorIcon, FormErrorMessage } from "./FormsError"
import Info from "./Info"

const organizationCreationFormSchema = z.object({
    name: z.string().nonempty({ message: "The name is required" })
})

type OrganizationCreationForm = z.infer<typeof organizationCreationFormSchema>

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

function OrganizationCreation() {
    const { userSession, updateSession } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { isValid, isSubmitting, errors }
    } = useForm<OrganizationCreationForm>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: zodResolver(organizationCreationFormSchema)
    })

    const onSubmit: SubmitHandler<OrganizationCreationForm> = async (
        data: OrganizationCreationForm
    ) => await submitOrganizationCreation(data)

    const submitOrganizationCreation = async (
        form: OrganizationCreationForm
    ) => {
        const organization = await createOrganization(form)
        if (!organization) {
            alert("An error occured, please try again.")
            return
        }
        alert("Organization created with success")
        userSession.user.organization = organization
        await updateSession(userSession)
        navigate("/menu")
    }

    const createOrganization = async (
        form: OrganizationCreationForm
    ): Promise<Organization> => {
        const response = await fetch(`${serverUri}/api/v1/organizations/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userSession.token}`
            },
            body: JSON.stringify({ ...form, user: userSession.user })
        })
        if (!response.ok) {
            console.error("Error when saving organization")
            return
        }
        return (await response.json()) as Organization
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-y-4 mt-2">
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
                            Only you will be able to provide the business
                            context and manage the organization users.
                        </Info>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-klosio-blue-300 text-white hover:bg-klosio-blue-600 focus:outline-none focus:ring-2 focus:ring-klosio-blue-300 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default OrganizationCreation
