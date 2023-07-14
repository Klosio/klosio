import type { ErrorCode } from "~types/errorCode.model"

const defaultMessage = "An error occured, please try again."

export const ERRORS: Record<ErrorCode, string> = {
    // SERVER ERRORS
    UNKNOWN: defaultMessage,
    UNAUTHORIZED: defaultMessage,
    NOT_FOUND: defaultMessage,
    MISSING_PARAMETER: defaultMessage,
    INVALID_FIELD_NAME: defaultMessage,
    INVALID_FORMAT: defaultMessage,
    INVALID_EXTENSION: "Invalid extension. The file extension must be .csv.",
    EMPTY_FILE: "The file must not be empty.",
    INCORRECT_TEMPLATE:
        "Invalid template. The file header columns must be 'painpoint' and 'answer'.",
    EXISTING_NAME: "This name already exists.",
    EXISTING_EMAIL: "This email address already exists.",
    // SUPABASE ERRORS
    INVALID_CREDENTIALS: "Invalid credentials."
}
