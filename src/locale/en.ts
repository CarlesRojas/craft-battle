import type { LanguageObject } from '@/locale/language'

export const en: LanguageObject = {
    meta: {
        appName: 'Craft Battle',
        description: 'Craft attack and defense words to battle online against other players.',
    },

    form: {
        cancel: 'Cancel',
        clear: 'Clear',
        create: 'Create',
        update: 'Update',
        delete: 'Delete',
        save: 'Save',
        edit: 'Edit',

        error: {
            generic: 'Something went wrong',
            minLength: 'Minimum length is {{min}}',
            maxLength: 'Maximum length is {{max}}',
            required: 'This field is required',
            invalid: 'Invalid value',
        },
    },

    footer: {
        privacyPolicy: 'Privacy Policy',
        termsAndConditions: 'Terms and Conditions',
        copyright: 'Copyright © 2025 Craft Battle',
    },

    enum: {
        language: {
            en: 'English',
            es: 'Español',
        },
    },
}
