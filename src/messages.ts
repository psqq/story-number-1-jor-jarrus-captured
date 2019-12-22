import i18n from 'gettext.js';
import config from './config';

let userLocale = window.navigator.language;
if (!new Set(['ru', 'en']).has(userLocale)) {
    userLocale = 'en';
}

const messages = (i18n as any)({
    locale: userLocale,
});

messages.setMessages(
    'messages',
    'ru', {
        [config.messages.enSotryMessage]: config.messages.ruSotryMessage,
        [config.messages.enPurposeMsg]: config.messages.ruPurposeMsg,
        'Welcome to game': 'Добро пожаловать в игру',
    }
);

export default messages;
