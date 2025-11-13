import { Button } from '@/component/ui/button'
import { Field, FieldError, FieldGroup } from '@/component/ui/field'
import { Input } from '@/component/ui/input'
import { BingoDifficulty } from '@/data/bingo'
import { api } from '@/db/_generated/api'
import type { User } from '@/db/username'
import { cn } from '@/lib/cn'
import { isAlphanumeric } from '@/lib/normalize'
import { getTranslation } from '@/locale/getTranslation'
import type { Language } from '@/locale/language'
import { useForm } from '@tanstack/react-form'
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from 'convex/react'
import { Loader, User as UserIcon } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import z from 'zod'

interface Props {
    language: Language
    user: User
    setIsLoading: (isLoading: boolean) => void
}

const CreateBingoGame = ({ language, user, setIsLoading }: Props) => {
    const t = getTranslation(language)

    const isSearchingOpponent = useConvexQuery(api.searchingOpponent.isSearching, { userId: user._id })
    const cancelSearch = useConvexMutation(api.searchingOpponent.cancel)
    const searchOpponent = useConvexMutation(api.username.search)
    const createInvite = useConvexMutation(api.inviteBingo.create)
    const searchOpponentResult = useConvexMutation(api.searchingOpponent.search)
    const createGame = useConvexMutation(api.bingo.create)

    const [opponents, setOpponents] = useState<Array<User>>([])
    const [hasSearched, setHasSearched] = useState(false)
    const [difficulty, setDifficulty] = useState(BingoDifficulty.EASY)

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
            const search = await searchOpponent({ searchQuery: value.opponent, excludeId: user._id })
            setOpponents(search)
            setHasSearched(true)
        },
    })

    const onSearchOpponent = async () => {
        const result = await searchOpponentResult({ userId: user._id, difficulty })

        if (result) {
            setIsLoading(true)

            await createGame({
                player1Id: user._id,
                player2Id: result.userId,
                difficulty: result.difficulty,
            })
        }
    }

    const onCancelSearch = async () => {
        await cancelSearch({ userId: user._id })
    }

    useEffect(() => {
        if (isSearchingOpponent) setDifficulty(isSearchingOpponent as BingoDifficulty)
    }, [isSearchingOpponent])

    return (
        <Fragment>
            <h1 className="font-goldman w-full text-left text-3xl tracking-wider text-balance text-sky-600 dark:text-sky-500">
                {t.common.welcomeUser.replace('{{USER}}', user.username)}
            </h1>

            <div className="flex w-full flex-col items-center gap-4">
                <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.bingo.difficulty.select}</h2>

                <div className="grid w-full grid-cols-3 flex-col items-center gap-4">
                    <Button
                        onClick={() => setDifficulty(BingoDifficulty.EASY)}
                        className="w-full"
                        variant={difficulty === BingoDifficulty.EASY ? 'constructive' : 'white'}
                        disabled={!!isSearchingOpponent}
                    >
                        {t.bingo.difficulty.easy}
                    </Button>

                    <Button
                        onClick={() => setDifficulty(BingoDifficulty.MEDIUM)}
                        className="w-full"
                        variant={difficulty === BingoDifficulty.MEDIUM ? 'default' : 'white'}
                        disabled={!!isSearchingOpponent}
                    >
                        {t.bingo.difficulty.medium}
                    </Button>

                    <Button
                        onClick={() => setDifficulty(BingoDifficulty.HARD)}
                        className="w-full"
                        variant={difficulty === BingoDifficulty.HARD ? 'destructive' : 'white'}
                        disabled={!!isSearchingOpponent}
                    >
                        {t.bingo.difficulty.hard}
                    </Button>
                </div>
            </div>

            <div className="flex w-full flex-col items-center gap-4">
                <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.bingo.findMatch}</h2>

                <div
                    className={cn(
                        'flex w-full flex-col gap-4',
                        isSearchingOpponent && 'grid grid-cols-[minmax(0,1fr)_minmax(0,min-content)]',
                    )}
                >
                    <Button
                        onClick={onSearchOpponent}
                        className={cn('w-full', isSearchingOpponent && 'opacity-100!')}
                        disabled={!!isSearchingOpponent}
                    >
                        {isSearchingOpponent ? (
                            <div className="flex animate-pulse items-center justify-center gap-2">
                                <Loader className="size-5 animate-spin stroke-3" />
                                {t.bingo.waitingForOpponent}
                            </div>
                        ) : (
                            t.bingo.findRandomOpponent
                        )}
                    </Button>

                    {isSearchingOpponent && (
                        <Button onClick={onCancelSearch} className="w-full" variant="destructive">
                            {t.form.cancel}
                        </Button>
                    )}
                </div>
            </div>

            {!isSearchingOpponent && (
                <div className="flex w-full flex-col items-center gap-4">
                    <h2 className="font-goldman w-full text-xl tracking-wide opacity-80">{t.bingo.searchFriend}</h2>

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
                                                placeholder={t.bingo.searchPlaceholder}
                                                autoComplete="off"
                                                icon={<UserIcon className="size-5" />}
                                                onClear={field.state.value ? () => field.handleChange('') : undefined}
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
                            {t.bingo.searchOpponent}
                        </Button>
                    </form>

                    {hasSearched &&
                        (opponents.length === 0 ? (
                            <p className="w-full text-left text-sm tracking-wide opacity-50">{t.bingo.noResults}</p>
                        ) : (
                            <ul className="flex w-full flex-col gap-2">
                                {opponents.map(opponent => (
                                    <li
                                        key={opponent._id}
                                        className="flex w-full items-center justify-between gap-4 border border-neutral-300 bg-neutral-300/50 p-2 dark:border-neutral-800 dark:bg-neutral-800/50"
                                    >
                                        <span className="pl-2 leading-tight font-medium opacity-80">
                                            {opponent.username}
                                        </span>

                                        <Button
                                            onClick={() => {
                                                form.reset()
                                                setOpponents([])
                                                setHasSearched(false)
                                                createInvite({
                                                    senderId: user._id,
                                                    receiverId: opponent._id,
                                                    difficulty,
                                                })
                                            }}
                                        >
                                            {t.bingo.invite.send}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ))}
                </div>
            )}
        </Fragment>
    )
}

export default CreateBingoGame
