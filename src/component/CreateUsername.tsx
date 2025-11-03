import { Button } from '@/component/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/component/ui/field'
import { Input } from '@/component/ui/input'
import { api } from '@/db/_generated/api'
import { User } from '@/db/username'
import { isAlphanumeric } from '@/lib/normalize'
import { getTranslation } from '@/locale/getTranslation'
import { Language } from '@/locale/language'
import { useForm } from '@tanstack/react-form'
import { useConvex } from 'convex/react'
import { v4 as uuid } from 'uuid'
import z from 'zod'

interface Props {
    language: Language
    onUsernameCreated: (user: User, key: string) => void
}

const CreateUsername = ({ language, onUsernameCreated }: Props) => {
    const t = getTranslation(language)
    const convex = useConvex()

    const formSchema = z.object({
        username: z
            .string()
            .refine(isAlphanumeric, t.form.error.alphanumeric)
            .min(3, t.form.error.minLength.replace('{{MIN}}', '3'))
            .max(32, t.form.error.maxLength.replace('{{MAX}}', '32')),
    })

    const form = useForm({
        defaultValues: { username: '' },
        validators: {
            onSubmit: formSchema,
            onSubmitAsync: async ({ value: { username } }) => {
                if (!username) return { fields: { username: t.form.error.required } }

                const isTaken = await convex.query(api.username.isTaken, { username })
                if (isTaken) return { fields: { username: t.form.error.usernameTaken } }
            },
        },
        onSubmit: async ({ value: { username } }) => {
            const key = uuid()
            const newUser = await convex.mutation(api.username.create, { username, key })
            if (newUser) onUsernameCreated(newUser, key)
        },
    })

    return (
        <div className="flex w-full max-w-lg flex-col items-center gap-16 place-self-start overscroll-y-auto px-3 py-6">
            <h1 className="font-goldman w-full text-left text-3xl tracking-wider text-balance text-slate-400">
                {t.home.welcome}
            </h1>

            <form
                onSubmit={e => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
                className="flex w-full flex-col gap-3"
            >
                <FieldGroup>
                    <form.Field
                        name="username"
                        children={field => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="font-goldman w-full text-xl tracking-wide opacity-80"
                                    >
                                        {t.form.label.username}
                                    </FieldLabel>

                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={e => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
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

                <Button type="submit">{t.form.create}</Button>
            </form>
        </div>
    )
}

export default CreateUsername
