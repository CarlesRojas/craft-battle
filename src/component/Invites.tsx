import { Button } from '@/component/ui/button'
import { api } from '@/db/_generated/api'
import type { User } from '@/db/username'
import { Sound, useAudio } from '@/integration/AudioProvider'
import { getTranslation } from '@/locale/getTranslation'
import type { Language } from '@/locale/language'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'

import { useNavigate } from '@tanstack/react-router'

import { useCallback, useEffect } from 'react'

interface Props {
    language: Language
    user: User
    setIsLoading: (isLoading: boolean) => void
    currentRoute: string
}

// TODO this only includes bingo invites
const Invites = ({ language, user, setIsLoading, currentRoute }: Props) => {
    const t = getTranslation(language)
    const navigate = useNavigate({ from: currentRoute })
    const { play } = useAudio()

    const removeInvite = useConvexMutation(api.inviteBingo.remove)
    const createGame = useConvexMutation(api.bingo.create)
    const deleteInvitesFromPlayer = useConvexMutation(api.inviteBingo.deleteFromPlayer)

    const activeBingoGame = useConvexQuery(api.bingo.get, { playerId: user._id })
    const receivedInvites = useConvexQuery(api.inviteBingo.getReceived, { receiverId: user._id })
    const sentInvites = useConvexQuery(api.inviteBingo.getSent, { senderId: user._id })
    const hasInvites = (receivedInvites && receivedInvites.length > 0) || (sentInvites && sentInvites.length > 0)

    const navigateToGame = useCallback(async () => {
        await deleteInvitesFromPlayer({ playerId: user._id })
        navigate({ to: '/play/bingo' })
    }, [deleteInvitesFromPlayer, user, navigate])

    useEffect(() => {
        if (!activeBingoGame || activeBingoGame.game.winner) return
        setIsLoading(true)
        navigateToGame()
    }, [activeBingoGame, navigateToGame, setIsLoading])

    if (!hasInvites) return null

    return (
        <div className="flex w-full flex-col items-center gap-4">
            <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.bingo.invite.title}</h2>

            <ul className="flex w-full flex-col gap-2">
                {sentInvites &&
                    sentInvites.map(invite => (
                        <li
                            key={invite._id}
                            className="@container w-full border border-neutral-300 bg-neutral-300/50 p-2 dark:border-neutral-800 dark:bg-neutral-800/50"
                        >
                            <div className="flex flex-col justify-between gap-4 @md:flex-row @md:items-center">
                                {invite.receiver && (
                                    <span className="pl-2 leading-tight font-medium opacity-80">
                                        {t.bingo.invite.sent
                                            .replace('{{USER}}', invite.receiver.username)
                                            .replace('{{DIFFICULTY}}', t.enum.difficulty[invite.difficulty])}
                                    </span>
                                )}

                                <Button
                                    onClick={() => removeInvite({ inviteId: invite._id })}
                                    variant="destructive"
                                    className="w-fit place-self-end"
                                >
                                    {t.bingo.invite.revoke}
                                </Button>
                            </div>
                        </li>
                    ))}

                {receivedInvites &&
                    receivedInvites.map(invite => (
                        <li
                            key={invite._id}
                            className="@container w-full border border-neutral-300 bg-neutral-300/50 p-2 dark:border-neutral-800 dark:bg-neutral-800/50"
                        >
                            <div className="flex flex-col justify-between gap-4 @md:flex-row @md:items-center">
                                {invite.receiver && (
                                    <span className="leading-tight font-medium opacity-80 @md:pl-2">
                                        {t.bingo.invite.content
                                            .replace('{{USER}}', invite.receiver.username)
                                            .replace('{{DIFFICULTY}}', t.enum.difficulty[invite.difficulty])}
                                    </span>
                                )}

                                <div className="flex items-center gap-3 place-self-end @md:place-self-auto">
                                    <Button
                                        onClick={async () => {
                                            play(Sound.CLICK)
                                            setIsLoading(true)
                                            await createGame({
                                                player1Id: invite.senderId,
                                                player2Id: invite.receiverId,
                                                difficulty: invite.difficulty,
                                                inviteId: invite._id,
                                            })
                                        }}
                                        variant="constructive"
                                    >
                                        {t.bingo.invite.accept}
                                    </Button>

                                    <Button
                                        onClick={() => removeInvite({ inviteId: invite._id })}
                                        variant="destructive"
                                    >
                                        {t.bingo.invite.reject}
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default Invites
