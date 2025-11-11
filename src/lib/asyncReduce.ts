export async function asyncReduce<T, TAcc>(
    array: Array<T>,
    reducer: (acc: TAcc, item: T, index: number) => Promise<TAcc>,
    initialValue: TAcc,
): Promise<TAcc> {
    let result = initialValue

    for (let i = 0; i < array.length; i++) result = await reducer(result, array[i], i)

    return result
}
