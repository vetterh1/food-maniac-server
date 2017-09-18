import * as c from '../utils/constants';

export function requestLanguageInfo() { return { type: c.REQUEST_LANGUAGE_INFO }; }
export function requestCurrentLanguage() { return { type: c.REQUEST_CURRENT_LANGUAGE }; }
export function changeLanguage(codeLanguage) { return { type: c.CHANGE_LANGUAGE, codeLanguage }; }
export function setupLanguages(list, codeLanguage) { return { type: c.SETUP_LANGUAGES, list, codeLanguage }; }
