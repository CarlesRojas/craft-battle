export const normalize = (str: string, withSpaces = false, trim = true) => {
    const result = str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(withSpaces ? /[^a-zA-Z0-9-_ ]/gi : /[^a-zA-Z0-9-_]/gi, '')
        .toLowerCase()

    return trim ? result.trim() : result
}

export const isAlphanumeric = (str: string, withSpaces = false) =>
    str ===
    str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(withSpaces ? /[^a-zA-Z0-9-_ ]/gi : /[^a-zA-Z0-9-_]/gi, '')
        .trim()

export const getFirstEmoji = (str: string) => {
    const emojiRegex = /\p{Emoji}/u
    const match = str.match(emojiRegex)
    return match ? match[0] : ''
}
