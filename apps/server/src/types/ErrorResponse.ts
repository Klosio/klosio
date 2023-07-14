import MessageResponse from "./MessageResponse"

export default interface ErrorResponse extends MessageResponse {
    code: string
    stack?: string
}
