export const normalize = (str: string) =>
    str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-_]/gi, '')
        .trim()
        .toLowerCase()

export const isAlphanumeric = (str: string) =>
    str ===
    str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-_]/gi, '')
        .trim()
