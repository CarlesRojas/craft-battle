import { LOCAL_STORAGE_PREFIX } from '@/lib/storage'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext } from 'react'
import useSound from 'use-sound'
import { useLocalStorage } from 'usehooks-ts'

export enum Sound {
    CLICK = 'CLICK',
    BUBBLE = 'BUBBLE',
    CLEAR = 'CLEAR',
    PING = 'PING',
}

type AudioContextType = {
    muted: boolean
    toggleMute: () => void
    play: (sound: Sound) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

interface Props {
    children: ReactNode
}

export function AudioProvider({ children }: Props) {
    const [muted, setMuted] = useLocalStorage(`${LOCAL_STORAGE_PREFIX}_MUTED`, false)

    const [playClick] = useSound('/audio/click.webm', { soundEnabled: !muted })
    const [playBubble] = useSound('/audio/bubble.webm', { soundEnabled: !muted, volume: 0.2 })
    const [playClear] = useSound('/audio/delete.webm', { soundEnabled: !muted, volume: 0.7 })
    const [playPing] = useSound('/audio/ping.webm', { soundEnabled: !muted, volume: 0.3 })

    const toggleMute = useCallback(() => {
        setMuted(prev => !prev)
    }, [setMuted])

    const play = useCallback(
        (sound: Sound) => {
            if (muted) return

            const playSound: Record<Sound, () => void> = {
                [Sound.CLICK]: () => playClick(),
                [Sound.BUBBLE]: () => playBubble(),
                [Sound.CLEAR]: () => playClear(),
                [Sound.PING]: () => playPing(),
            }

            playSound[sound]()
        },
        [muted, playClick, playBubble, playClear, playPing],
    )

    return <AudioContext.Provider value={{ muted, toggleMute, play }}>{children}</AudioContext.Provider>
}

export function useAudio() {
    const context = useContext(AudioContext)

    if (!context) throw new Error('useAudio must be used within an AudioProvider')

    return context
}
