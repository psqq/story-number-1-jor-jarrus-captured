import i18n from 'gettext.js';
import config from './config';

let userLocale = window.navigator.language;
if (!new Set(['ru', 'en']).has(userLocale)) {
    userLocale = 'en';
}

const messages = i18n({
    locale: userLocale,
});

messages.setMessages(
    'messages',
    'ru', {
        [config.messages.enSotryMessage]: config.messages.ruSotryMessage,
        [config.messages.enPurposeMsg]: config.messages.ruPurposeMsg,
        [config.messages.enHelpScreenText]: config.messages.ruHelpScreenText,
        'Welcome to game': 'Добро пожаловать в игру',
        'Main menu:': 'Главное меню:',
        'Current deep:': 'Текущая глубина:',
    }
);

export default messages;
