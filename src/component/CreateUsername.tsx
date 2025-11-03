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

                const isValid = await convex.query(api.username.isTaken, { username })
                if (!isValid) return { fields: { username: t.form.error.usernameTaken } }
            },
        },
        onSubmit: async ({ value: { username } }) => {
            const key = uuid()
            const newUser = await convex.mutation(api.username.create, { username, key })
            if (newUser) onUsernameCreated(newUser, key)
        },
    })

    return (
        <form
            onSubmit={e => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex w-full max-w-md flex-col gap-3 p-4"
        >
            <FieldGroup>
                <form.Field
                    name="username"
                    children={field => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>{t.form.label.username}</FieldLabel>

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
    )
}

export default CreateUsername
