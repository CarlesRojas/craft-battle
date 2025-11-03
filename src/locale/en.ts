import type { LanguageObject } from '@/locale/language'

export const en: LanguageObject = {
    home: {
        welcome: 'Hello, {{USER}}!',
        findMatch: 'Find a match',
        findRandomOpponent: 'Find a random opponent',
        searchPlaceholder: 'Enter opponent username',
        searchOpponent: 'Search opponent',
        noResults: 'No results found',
        or: 'or',

        invite: {
            title: 'Invites',
            send: 'Send invite',
            sent: 'You have invited {{USER}} to a battle.',
            content: 'User {{USER}} has invited you to a battle!',
            accept: 'Accept',
            reject: 'Reject',
            revoke: 'Revoke',
        },
    },

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

        label: {
            username: 'Choose a username',
        },

        error: {
            generic: 'Something went wrong',
            minLength: 'Minimum length is {{MIN}}',
            maxLength: 'Maximum length is {{MAX}}',
            required: 'This field is required',
            invalid: 'Invalid value',
            alphanumeric: 'Only letters, numbers and hyphens are allowed',
            usernameTaken: 'Username is already taken',
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
