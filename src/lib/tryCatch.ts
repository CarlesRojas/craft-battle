export const tryCatch = async <T, TError = Error>(promise: Promise<T>): Promise<[T, null] | [null, TError]> => {
    try {
        const result = await promise
        return [result, null]
    } catch (error) {
        return [null, error as TError]
    }
}

export const tryCatchAll = async <T extends Array<any>, TError = Error>(
    promises: [...{ [K in keyof T]: Promise<T[K]> }],
): Promise<[{ [K in keyof T]: T[K] }, null] | [null, TError]> => {
    try {
        const result = await Promise.all(promises)
        return [result, null]
    } catch (error) {
        return [null, error as TError]
    }
}
