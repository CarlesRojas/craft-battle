import BubbleSound from '@/audio/bubble.webm'
import ClickSound from '@/audio/click.webm'
import ClearSound from '@/audio/delete.webm'
import PingSound from '@/audio/ping.webm'
import { LOCAL_STORAGE_PREFIX } from '@/lib/storage'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useRef } from 'react'
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
    const mutedRef = useRef(false)

    const [playClick] = useSound(ClickSound, { soundEnabled: !muted })
    const [playBubble] = useSound(BubbleSound, { volume: 0.3, soundEnabled: !muted })
    const [playClear] = useSound(ClearSound, { volume: 0.7, soundEnabled: !muted })
    const [playPing] = useSound(PingSound, { volume: 0.7, soundEnabled: !muted })

    const toggleMute = useCallback(() => {
        const nextMuted = !mutedRef.current
        mutedRef.current = nextMuted
        setMuted(nextMuted)
    }, [])

    const play = useCallback(
        (sound: Sound) => {
            if (mutedRef.current) return

            const playSound: Record<Sound, () => void> = {
                [Sound.CLICK]: () => playClick(),
                [Sound.BUBBLE]: () => playBubble(),
                [Sound.CLEAR]: () => playClear(),
                [Sound.PING]: () => playPing(),
            }

            playSound[sound]()
        },
        [playClick, playBubble, playClear, playPing],
    )

    return <AudioContext.Provider value={{ muted, toggleMute, play }}>{children}</AudioContext.Provider>
}

export function useAudio() {
    const context = useContext(AudioContext)

    if (!context) throw new Error('useAudio must be used within an AudioProvider')

    return context
}
