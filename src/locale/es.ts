import type { LanguageObject } from '@/locale/language'

export const es: LanguageObject = {
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
            minLength: 'La longitud mínima es {{min}}',
            maxLength: 'La longitud máxima es {{max}}',
            required: 'Este campo es obligatorio',
            invalid: 'Valor inválido',
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
