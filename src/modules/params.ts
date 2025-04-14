import { defineStore } from 'pinia'
import { ref } from 'vue';
import { createI18n } from 'vue-i18n';
import lang from '@/assets/lang.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { 
    en: lang.en, 
    ja: lang.ja, 
    es: lang.es, 
    fr: lang.fr, 
    esla: lang.esla, 
    de: lang.de, 
    it: lang.it, 
    ko: lang.ko, 
    ptbr: lang.ptbr,
    pl: lang.pl,
    ru: lang.ru,
    tr: lang.tr,
    uk: lang.uk,
    zhcn: lang.zhcn,
    zhtw: lang.zhtw,
 }
})

export interface dictValue {
  originText: string;
  translatedText: string;
}

export interface dictionary extends dictValue {
  contentuid: string;
}

export interface translation extends dictionary {
  index: number;
}

export type result = {
  messageType: number;
  message: string;
};

export const configStore = defineStore('config', () => {
  const darkMode = ref<boolean>(true);
  const autoTranslation = ref<boolean>(true);
  const language = ref<"fr"|"de"|"es"|"pl"|"ru"|"zhcn"|"tr"|"ptbr"|"it"|"esla"|"zhtw"|"uk"|"ko"|"ja"|"en">("en");

  return {
    darkMode, 
    autoTranslation, 
    language
  }
},{ persist: true,},)

export const dataStore = defineStore("data", () => {
  const translation = ref<translation[]>([]);
  const loadingFile = ref<String>("");
  const unSavedTranslation = ref<boolean>(false);
  const displayMessage = ref<result>({ messageType: 0, message: "" });
  const searchText = ref<string>("");
  const success = ref<boolean>(false);

  return { 
    translation, 
    unSavedTranslation,
    loadingFile, 
    displayMessage, 
    searchText,
    success
  }
}, {persist: false});

export const dialogVisible = ref<boolean>(false);