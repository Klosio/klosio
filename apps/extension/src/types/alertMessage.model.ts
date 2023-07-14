import type { AlertType } from "./alertType.model"

export default interface AlertMessage {
    type: AlertType
    text: string
}
