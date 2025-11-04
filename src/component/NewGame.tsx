import { Button } from '@/component/ui/button'
import { Field, FieldError, FieldGroup } from '@/component/ui/field'
import { Input } from '@/component/ui/input'
import { api } from '@/db/_generated/api'
import { User } from '@/db/username'
import { isAlphanumeric } from '@/lib/normalize'
import { getTranslation } from '@/locale/getTranslation'
import type { Language } from '@/locale/language'
import { useForm } from '@tanstack/react-form'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import { useState } from 'react'
import z from 'zod'

interface Props {
    language: Language
    user: User
}

const NewGame = ({ language, user }: Props) => {
    const t = getTranslation(language)

    const searchOpponent = useConvexMutation(api.username.search)
    const createInvite = useConvexMutation(api.invite.create)
    const removeInvite = useConvexMutation(api.invite.remove)
    const acceptInvite = useConvexMutation(api.invite.accept)

    const receivedInvites = useConvexQuery(api.invite.getReceived, { receiverId: user._id })
    const sentInvites = useConvexQuery(api.invite.getSent, { senderId: user._id })
    const hasInvites = (receivedInvites && receivedInvites.length > 0) || (sentInvites && sentInvites.length > 0)

    const [opponents, setOpponents] = useState<User[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    const formSchema = z.object({
        opponent: z
            .string()
            .refine(isAlphanumeric, t.form.error.alphanumeric)
            .min(3, t.form.error.minLength.replace('{{MIN}}', '3'))
            .max(32, t.form.error.maxLength.replace('{{MAX}}', '32')),
    })

    const form = useForm({
        defaultValues: { opponent: '' },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            const search = await searchOpponent({ query: value.opponent, excludeId: user._id })
            setOpponents(search)
            setHasSearched(true)
        },
    })

    return (
        <div className="flex w-full max-w-lg flex-col items-center gap-12 place-self-start overscroll-y-auto px-3 py-6">
            <h1 className="font-goldman w-full text-left text-3xl tracking-wider text-balance text-sky-500">
                {t.home.welcomeUser.replace('{{USER}}', user.username)}
            </h1>

            <div className="flex w-full flex-col items-center gap-4">
                <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.home.findMatch}</h2>

                <Button
                    onClick={() => {
                        // TODO: Implement random opponent search
                        console.log('Finding random opponent')
                    }}
                    className="w-full"
                >
                    {t.home.findRandomOpponent}
                </Button>
            </div>

            <div className="flex w-full flex-col items-center gap-4">
                <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.home.searchFriend}</h2>

                <form
                    onSubmit={e => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="flex w-full gap-4"
                >
                    <FieldGroup>
                        <form.Field
                            name="opponent"
                            children={field => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={e => field.handleChange(e.target.value)}
                                            placeholder={t.home.searchPlaceholder}
                                            autoComplete="off"
                                        />

                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors.map(e =>
                                                    typeof e === 'string' ? { message: e } : e,
                                                )}
                                            />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                    </FieldGroup>

                    <Button type="submit" className="w-fit">
                        {t.home.searchOpponent}
                    </Button>
                </form>

                {hasSearched &&
                    (opponents.length === 0 ? (
                        <p className="w-full text-left text-sm tracking-wide opacity-50">{t.home.noResults}</p>
                    ) : (
                        <ul className="flex w-full flex-col gap-2">
                            {opponents.map(opponent => (
                                <li
                                    key={opponent._id}
                                    className="flex w-full items-center justify-between gap-4 border border-neutral-800 bg-neutral-800/50 p-2"
                                >
                                    <span className="pl-2 leading-tight font-medium opacity-80">
                                        {opponent.username}
                                    </span>

                                    <Button
                                        onClick={() => {
                                            form.reset()
                                            setOpponents([])
                                            setHasSearched(false)
                                            createInvite({ senderId: user._id, receiverId: opponent._id })
                                        }}
                                    >
                                        {t.home.invite.send}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ))}
            </div>

            {hasInvites && (
                <div className="flex w-full flex-col items-center gap-4">
                    <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.home.invite.title}</h2>

                    <ul className="flex w-full flex-col gap-2">
                        {sentInvites &&
                            sentInvites.map(invite => (
                                <li
                                    key={invite._id}
                                    className="@container w-full border border-neutral-800 bg-neutral-800/50 p-2"
                                >
                                    <div className="flex flex-col justify-between gap-4 @md:flex-row @md:items-center">
                                        {invite.receiver && (
                                            <span className="pl-2 leading-tight font-medium opacity-80">
                                                {t.home.invite.sent.replace('{{USER}}', invite.receiver.username)}
                                            </span>
                                        )}

                                        <Button
                                            onClick={() => removeInvite({ inviteId: invite._id })}
                                            variant="destructive"
                                            className="w-fit place-self-end"
                                        >
                                            {t.home.invite.revoke}
                                        </Button>
                                    </div>
                                </li>
                            ))}

                        {receivedInvites &&
                            receivedInvites.map(invite => (
                                <li
                                    key={invite._id}
                                    className="@container w-full border border-neutral-800 bg-neutral-800/50 p-2"
                                >
                                    <div className="flex flex-col justify-between gap-4 @md:flex-row @md:items-center">
                                        {invite.receiver && (
                                            <span className="leading-tight font-medium opacity-80 @md:pl-2">
                                                {t.home.invite.content.replace('{{USER}}', invite.receiver.username)}
                                            </span>
                                        )}

                                        <div className="flex items-center gap-3 place-self-end @md:place-self-auto">
                                            <Button
                                                onClick={() => {
                                                    acceptInvite({
                                                        senderId: invite.senderId,
                                                        receiverId: invite.receiverId,
                                                    })
                                                    // TODO: Start game
                                                }}
                                                variant="constructive"
                                            >
                                                {t.home.invite.accept}
                                            </Button>

                                            <Button
                                                onClick={() => removeInvite({ inviteId: invite._id })}
                                                variant="destructive"
                                            >
                                                {t.home.invite.reject}
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default NewGame
