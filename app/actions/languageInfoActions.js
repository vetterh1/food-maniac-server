import * as c from '../utils/constants';

function requestLanguageInfo() { return { type: c.REQUEST_LANGUAGE_INFO }; }

function changeLanguage(index) { return { type: c.CHANGE_LANGUAGE, index: index }; }
