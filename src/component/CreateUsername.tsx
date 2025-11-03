import { Button } from '@/component/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/component/ui/field'
import { Input } from '@/component/ui/input'
import { api } from '@/db/_generated/api'
import { isAlphanumeric } from '@/lib/normalize'
import { getTranslation } from '@/locale/getTranslation'
import { Language } from '@/locale/language'
import { useForm } from '@tanstack/react-form'
import { useConvex } from 'convex/react'
import { useRef } from 'react'
import { v4 as uuid } from 'uuid'
import z from 'zod'

interface Props {
    language: Language
    onUsernameCreated: ({ username, key }: { username: string; key: string }) => void
}

const CreateUsername = ({ language, onUsernameCreated }: Props) => {
    const t = getTranslation(language)
    const convex = useConvex()
    const newUuid = useRef(uuid())

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

                const isValid = await convex.mutation(api.username.create, { username, key: newUuid.current })

                if (!isValid) return { fields: { username: t.form.error.usernameTaken } }
            },
        },
        onSubmit: async ({ value: { username } }) => {
            onUsernameCreated({ username, key: newUuid.current })
        },
    })

    return (
        <form
            onSubmit={e => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="w-full max-w-96 p-4"
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
