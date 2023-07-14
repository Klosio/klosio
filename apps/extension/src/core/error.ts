import { ERRORS } from "~constants/errors"
import type { ErrorCode } from "~types/errorCode.model"

export default function getErrorMessage(errorCode: ErrorCode): string {
    return ERRORS[errorCode]
}
