import type { LanguageObject } from '@/locale/language'

export const es: LanguageObject = {
    common: {
        welcomeUser: 'Hola, ¡{{USER}}!',
    },

    createUsername: {
        welcome: '¡Bienvenido a Craft Battle!',
        chooseUsername: 'Elige un nombre de usuario',
    },

    mode: {
        choose: 'Elige un modo',
        comingSoon: 'Próximamente',

        classic: {
            title: 'Clásico',
            description:
                'El modo clásico donde juegas solo y puedes crear cualquier palabra combinando continuamente 2 palabras',
        },

        bingo: {
            title: 'Bingo',
            description: 'Una carrera para crear las palabras aleatorias del bingo. Puedes jugar solo o con un amigo.',
        },

        battle: {
            title: 'Batalla',
            description:
                'Crea una palabra para atacar a tu oponente, luego otra para defenderte de su ataque. El primer jugador en llegar a 0 HP pierde.',
        },
    },

    home: {
        findMatch: 'Encontrar partida',
        findRandomOpponent: 'Encuentra un oponente aleatorio',
        searchFriend: 'Buscar amigos',
        searchPlaceholder: 'Nombre de usuario',
        searchOpponent: 'Buscar',
        noResults: 'No se encontraron resultados',
        or: 'o',

        invite: {
            title: 'Invitaciones',
            send: 'Enviar invitación',
            sent: 'Has invitado a {{USER}} a una batalla.',
            content: '¡El usuario {{USER}} te ha invitado a una batalla!',
            accept: 'Aceptar',
            reject: 'Rechazar',
            revoke: 'Revocar',
        },
    },

    game: {
        search: 'Buscar',
    },

    meta: {
        appName: 'Craft Battle',
        description: 'Crea palabras de ataque y defensa para luchar online contra otros jugadores',
    },

    form: {
        cancel: 'Cancelar',
        clear: 'Eliminar',
        create: 'Crear',
        update: 'Actualizar',
        delete: 'Eliminar',
        save: 'Guardar',
        edit: 'Editar',

        error: {
            generic: 'Algo salió mal',
            minLength: 'La longitud mínima es {{MIN}}',
            maxLength: 'La longitud máxima es {{MAX}}',
            required: 'Este campo es obligatorio',
            invalid: 'Valor inválido',
            alphanumeric: 'Solo se permiten letras, números y guiones',
            usernameTaken: 'El nombre de usuario no está disponible',
        },
    },

    footer: {
        privacyPolicy: 'Política de privacidad',
        termsAndConditions: 'Términos y condiciones',
        copyright: 'Derechos de autor © 2025 Craft Battle',
    },

    enum: {
        language: {
            en: 'English',
            es: 'Español',
        },

        sort: {
            DISCOVERED: 'Descubierto',
            NAME: 'Nombre',
        },

        order: {
            ASC: 'Ascendente',
            DESC: 'Descendente',
        },
    },
}
