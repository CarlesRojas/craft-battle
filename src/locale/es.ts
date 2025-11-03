import type { LanguageObject } from '@/locale/language'

export const es: LanguageObject = {
    home: {
        welcome: 'Hola, {{USER}}!',
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

        label: {
            username: 'Elige un nombre de usuario',
        },

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
    },
}
