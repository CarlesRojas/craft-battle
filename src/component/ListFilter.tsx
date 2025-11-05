import { Button } from '@/component/ui/button'
import { Field } from '@/component/ui/field'
import { Input } from '@/component/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component/ui/select'
import { DEFAULT_ORDER, DEFAULT_SORT, Order, Sort } from '@/const/sort'
import { useWordList } from '@/integration/WordListProvider'
import { normalize } from '@/lib/normalize'
import { getTranslation } from '@/locale/getTranslation'
import type { Language } from '@/locale/language'
import { useForm } from '@tanstack/react-form'
import { Search, SortAsc, SortDesc } from 'lucide-react'

interface Props {
    language: Language
}

const ListFilter = ({ language }: Props) => {
    const t = getTranslation(language)

    const { applySort, applySearch } = useWordList()

    const form = useForm({
        defaultValues: { query: '', sort: DEFAULT_SORT, order: DEFAULT_ORDER },
        listeners: {
            onChangeDebounceMs: 300,
            onChange: ({ formApi }) => {
                const { query, sort, order } = formApi.state.values

                applySearch(query)
                applySort(sort, order)
            },
        },
    })

    return (
        <form
            onSubmit={e => e.preventDefault()}
            className="relative grid size-full max-w-full grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-3 p-3"
        >
            <form.Field
                name="query"
                children={field => (
                    <Field>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => {
                                const normalizedValue = normalize(e.target.value, true, false)

                                field.handleChange(normalizedValue)
                            }}
                            autoComplete="off"
                            placeholder={t.game.search}
                            icon={<Search className="size-5" />}
                            onClear={field.state.value ? () => field.handleChange('') : undefined}
                        />
                    </Field>
                )}
            />

            <div className="relative grid size-full max-w-full grid-cols-[minmax(0,1fr)_2.5rem]">
                <form.Field
                    name="sort"
                    children={field => (
                        <Field>
                            <Select
                                name={field.name}
                                value={field.state.value}
                                onValueChange={value => field.handleChange(value as Sort)}
                            >
                                <SelectTrigger id={field.name} className="w-fit border-r-0">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    {Object.values(Sort).map(sort => (
                                        <SelectItem key={sort} value={sort}>
                                            {t.enum.sort[sort]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                />

                <form.Field
                    name="order"
                    children={field => (
                        <Field>
                            <Button
                                size="icon"
                                variant="input"
                                name={field.name}
                                onClick={() =>
                                    field.handleChange(field.state.value === Order.ASC ? Order.DESC : Order.ASC)
                                }
                                onBlur={field.handleBlur}
                            >
                                {field.state.value === Order.ASC ? (
                                    <SortAsc className="size-5" />
                                ) : (
                                    <SortDesc className="size-5" />
                                )}
                            </Button>
                        </Field>
                    )}
                />
            </div>
        </form>
    )
}

export default ListFilter
