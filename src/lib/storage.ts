export const LOCAL_STORAGE_PREFIX = 'CRAFT_BATTLE'

export const isLocalStorageAvailable = (): boolean => {
    if (typeof window === 'undefined' || !('localStorage' in window)) return false
    try {
        const testKey = `${LOCAL_STORAGE_PREFIX}__test__`
        window.localStorage.setItem(testKey, '1')
        window.localStorage.removeItem(testKey)
        return true
    } catch {
        return false
    }
}
