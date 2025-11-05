import { createLocalStorage } from '@/lib/localStorage'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'
import z from 'zod'

import BubbleSound from '@/audio/bubble.webm'
import ClickSound from '@/audio/click.webm'
import ClearSound from '@/audio/delete.webm'
import PingSound from '@/audio/ping.webm'

export enum Sound {
    CLICK = 'CLICK',
    BUBBLE = 'BUBBLE',
    CLEAR = 'CLEAR',
    PING = 'PING',
}

const audioStorage = createLocalStorage('AUDIO', z.object({ muted: z.boolean() }).optional(), undefined)

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
    const [muted, setMuted] = useState(false)
    const mutedRef = useRef(false)

    const [playClick] = useSound(ClickSound, { soundEnabled: !muted })
    const [playBubble] = useSound(BubbleSound, { volume: 0.3, soundEnabled: !muted })
    const [playClear] = useSound(ClearSound, { volume: 0.7, soundEnabled: !muted })
    const [playPing] = useSound(PingSound, { volume: 0.7, soundEnabled: !muted })

    useEffect(() => {
        const audio = audioStorage.get() ?? { muted: false }
        setMuted(audio.muted)
        mutedRef.current = audio.muted
    }, [])

    const toggleMute = () => {
        const nextMuted = !mutedRef.current
        mutedRef.current = nextMuted
        setMuted(nextMuted)
        audioStorage.set({ muted: nextMuted })
    }

    const play = (sound: Sound) => {
        if (mutedRef.current) return

        const playSound: Record<Sound, () => void> = {
            [Sound.CLICK]: () => playClick(),
            [Sound.BUBBLE]: () => playBubble(),
            [Sound.CLEAR]: () => playClear(),
            [Sound.PING]: () => playPing(),
        }

        playSound[sound]()
    }

    return <AudioContext.Provider value={{ muted, toggleMute, play }}>{children}</AudioContext.Provider>
}

export function useAudio() {
    const context = useContext(AudioContext)

    if (!context) throw new Error('useAudio must be used within an AudioProvider')

    return context
}
