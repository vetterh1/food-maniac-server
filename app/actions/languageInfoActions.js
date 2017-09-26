import * as c from '../utils/constants';

export function requestLanguageInfo() { return { type: c.REQUEST_LANGUAGE_INFO }; }
export function requestCurrentLanguage() { return { type: c.REQUEST_CURRENT_LOCALE }; }
export function changeLanguage(locale) { return { type: c.CHANGE_LANGUAGE, locale }; }
export function setupLanguages(list, locale) { return { type: c.SETUP_LANGUAGES, list, locale }; }
