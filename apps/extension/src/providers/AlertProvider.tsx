import { createContext, useContext, useState } from "react"
import ErrorAlert from "~components/ErrorAlert"
import SuccessAlert from "~components/SuccessAlert"
import getErrorMessage from "~core/error"
import type AlertMessage from "~types/alertMessage.model"
import type { ErrorCode } from "~types/errorCode.model"

const AlertContext = createContext(null)

interface Alert {
    showErrorMessage: (errorCode: ErrorCode) => Promise<void>
    showSuccessMessage: (message: string) => Promise<void>
    hideErrorMessages: () => Promise<void>
}

export function AlertProvider({ children }) {
    const [errorMessages, setErrorMessages] = useState<AlertMessage[]>([])
    const [successMessages, setSuccessMessages] = useState<AlertMessage[]>([])

    const showErrorMessage = async (errorCode: ErrorCode) => {
        const errorMessage = {
            type: "ERROR",
            text: getErrorMessage(errorCode)
        } as AlertMessage
        setErrorMessages((errorMessages) => [...errorMessages, errorMessage])
    }

    const showSuccessMessage = async (message: string) => {
        const successMessage = {
            type: "SUCCESS",
            text: message
        } as AlertMessage
        setSuccessMessages((successMessages) => [
            ...successMessages,
            successMessage
        ])
        setTimeout(() => {
            setSuccessMessages([])
        }, 5000)
    }

    const hideErrorMessages = async () => {
        setErrorMessages([])
    }

    const alert: Alert = {
        showErrorMessage,
        showSuccessMessage,
        hideErrorMessages
    }

    return (
        <AlertContext.Provider value={alert}>
            <ul>
                {errorMessages.map((errorMessage, index) => (
                    <li key={index}>
                        <ErrorAlert>{errorMessage.text}</ErrorAlert>
                    </li>
                ))}
            </ul>
            <ul>
                {successMessages.map((successMessage, index) => (
                    <li key={index}>
                        <SuccessAlert message={successMessage.text} />
                    </li>
                ))}
            </ul>
            {children}
        </AlertContext.Provider>
    )
}

export const useAlert = () => {
    return useContext(AlertContext)
}
