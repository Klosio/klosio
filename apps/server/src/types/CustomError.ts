import { ErrorCode } from "./ErrorCode"

export default interface CustomError extends Error {
    code: ErrorCode
}
