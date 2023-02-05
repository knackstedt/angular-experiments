export type ToastMessage = {
    severity: "error" | "warn" | "info" | "success"
    title: string,
    message: string,
    stack?: string,
    state?: string,
    encodeHTML?: boolean,
    cssClass?: string[],
    data: any
}