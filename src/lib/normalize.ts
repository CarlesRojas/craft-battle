export const normalize = (str: string, withSpaces = false) =>
    str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(withSpaces ? /[^a-zA-Z0-9-_ ]/gi : /[^a-zA-Z0-9-_]/gi, '')
        .trim()
        .toLowerCase()

export const isAlphanumeric = (str: string, withSpaces = false) =>
    str ===
    str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(withSpaces ? /[^a-zA-Z0-9-_ ]/gi : /[^a-zA-Z0-9-_]/gi, '')
        .trim()
