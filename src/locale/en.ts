import type { LanguageObject } from '@/locale/language'

export const en: LanguageObject = {
    common: {
        welcomeUser: 'Hello, {{USER}}!',
    },

    createUsername: {
        welcome: 'Welcome to Craft Battle!',
        chooseUsername: 'Choose a username',
    },

    mode: {
        activeGames: 'Active Games',
        classicGame: 'Classic Game',
        bingoGame: 'Bingo Game with {{OPPONENT}}',
        battleGame: 'Battle Game with {{OPPONENT}}',
        continue: 'Continue',

        choose: 'Start a new game',
        comingSoon: 'Coming soon',

        classic: {
            title: 'Classic',
            description:
                'The classic mode where you play solo and can craft any word by continuously combining 2 words',
        },
        bingo: {
            title: 'Bingo',
            description: 'Race to craft the random words in the bingo. You can play solo or with a friend.',
        },
        battle: {
            title: 'Battle',
            description:
                'Craft a word to attack your opponent, then another to defend against their attack. The first player to reach 0 HP loses.',
        },
    },

    bingo: {
        findMatch: 'Find a match',
        findRandomOpponent: 'Find a random opponent',
        searchFriend: 'Search for friends',
        searchPlaceholder: 'Enter username',
        searchOpponent: 'Search',
        noResults: 'No results found',
        or: 'or',
        objectives: 'First to get 3 wins!',
        you: 'You',
        opponent: 'Opponent',

        difficulty: {
            select: 'Select difficulty',
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
        },

        invite: {
            title: 'Invites',
            send: 'Send invite',
            sent: 'You have invited {{USER}} to a bingo game. ({{DIFFICULTY}})',
            content: '{{USER}} has invited you to a bingo game! ({{DIFFICULTY}})',
            accept: 'Accept',
            reject: 'Reject',
            revoke: 'Revoke',
        },
    },

    game: {
        search: 'Search',
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
        },

        sort: {
            DISCOVERED: 'Discovered',
            NAME: 'Name',
        },

        order: {
            ASC: 'Ascending',
            DESC: 'Descending',
        },

        difficulty: {
            EASY: 'Easy',
            MEDIUM: 'Medium',
            HARD: 'Hard',
        },
    },
}
