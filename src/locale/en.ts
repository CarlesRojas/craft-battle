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
            description: 'Race a friend to craft the random words in the bingo. First to get three words wins!',
        },

        dialog: {
            classicTitle: 'Start a new Classic Game?',
            classicSubtitle: 'This will delete all your current progress in the Classic Game.',
            bingoTitle: 'Start a new Bingo Game with {{OPPONENT}}?',
            bingoSubtitle: 'This will delete all your current progress in the Bingo Game with {{OPPONENT}}.',
            start: 'Start New Game',
            cancel: 'Cancel',
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
        loading: 'Waiting for all players to join...',

        difficulty: {
            select: 'Select difficulty',
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
        },

        invite: {
            title: 'Invites',
            send: 'Send invite',
            sent: 'You have invited {{USER}} to a Bingo game. ({{DIFFICULTY}})',
            content: '{{USER}} has invited you to a Bingo game! ({{DIFFICULTY}})',
            accept: 'Accept',
            reject: 'Reject',
            revoke: 'Revoke',
        },

        win: {
            victory: 'Victory!',
            defeat: 'Defeat!',

            victorySubtitle: 'You defeated {{OPPONENT}}!',
            defeatSubtitle: '{{OPPONENT}} defeated you!',

            summary: {
                title: 'Game Summary',
                difficulty: 'Difficulty',
                opponentScore: 'Opponent Score',
                yourScore: 'Your Score',
            },

            rematch: 'Rematch',
            backToMenu: 'Back to Menu',
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
