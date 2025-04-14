<script setup lang="ts">
import { ref } from 'vue';

import Button from '@/volt/Button.vue';
import Menu from '@/volt/Menu.vue';
import Checkbox from '@/volt/Checkbox.vue';
import Dialog from '@/volt/Dialog.vue'; 
import InputText from '@/volt/InputText.vue';
import { configStore, dialogVisible } from '@/modules/params';

import '/node_modules/flag-icons/css/flag-icons.min.css';
import { replaceTranslation } from '@/modules/appModules';

const config = configStore();

const seartchText = ref<string>("");
const replaceText = ref<string>("");


//language
const languageMenu = ref();
const languageMenuToggle = (event:Event) => { languageMenu.value.toggle(event);};
</script>
<template>
  <section>
    <div class="flex flex-row w-full border-t-0 border-x-0 border-b-1 border-solid border-b-gray-400! rounded-none! py-2 px-2 text-gray-800! dark:text-gray-200! dark:bg-slate-900!">
      <div class="flex flex-row items-center gap-x-2">
        <Button :label="$t('language')" text class="h-[20px]! text-gray-800! dark:text-white! hover:bg-transparent!"  @click="languageMenuToggle"/>
        <Button :label="$t('replace')" text class="h-[20px]! text-gray-800! dark:text-white! hover:bg-transparent!"  @click="dialogVisible = !dialogVisible"/>
        <Menu ref="languageMenu"  :popup="true" :model="[
          { label: '日本語', command: () => { config.language = 'ja'; } },
          { label: 'English', command: () => { config.language = 'en'; } },
          { label: 'Français', command: () => { config.language = 'fr'; } },
          { label: 'Deutsch', command: () => { config.language = 'de'; } },
          { label: 'Español (España)', command: () => { config.language = 'es'; } },
          { label: 'Polski', command: () => { config.language = 'pl'; } },
          { label: 'Русский', command: () => { config.language = 'ru'; } },
          { label: '简体中文', command: () => { config.language = 'zhcn'; } },
          { label: '繁體中文', command: () => { config.language = 'zhtw'; } },
          { label: 'Türkçe', command: () => { config.language = 'tr'; } },
          { label: 'Português (Brasil)', command: () => { config.language = 'ptbr'; } },
          { label: 'Italiano', command: () => { config.language = 'it'; } },
          { label: 'Español (Latinoamérica)', command: () => { config.language = 'esla'; } },
          { label: 'Українська', command: () => { config.language = 'uk'; } },
          { label: '한국어', command: () => { config.language = 'ko'; } },
        ]"/>
      </div>
      <div class="flex flex-1 w-full place-content-end gap-x-5 pt-0 items-center mr-2">
        <label for="auto-trans" class="flex flex-row items-center ml-3">
          <Checkbox input-id="auto-trans" v-model="config.autoTranslation" binary/>
          <span>{{ $t('autoTrans') }}</span>
        </label>
        <Button :icon="config.darkMode ? 'pi pi-moon' : 'pi pi-sun'" class="size-4 text-gray-800! dark:text-white! hover:bg-transparent!" text @click="config.darkMode = !config.darkMode"/>
      </div>
    </div>
  </section>
  <Teleport to="#app">
    <Dialog v-model:visible="dialogVisible" :header="$t('replace')" :modal="false" closable>
      <div class="flex items-center gap-4 mb-4">
          <label for="search" class="font-semibold text-end w-[70px]!">{{$t("searchHeader")}}</label>
          <InputText id="search" class="flex-auto" autocomplete="off" v-model="seartchText"/>
      </div>
      <div class="flex items-center gap-4 mb-8 mx-auto! place-content-center">
          <label for="replace" class="font-semibold text-end w-[70px]!">{{$t("replaceHeader")}}</label>
          <InputText id="replace" class="flex-auto" autocomplete="off" v-model="replaceText"/>
      </div>
      <div class="flex justify-center gap-2">
          <Button type="button" :label="$t('replaceHeader')" class="w-[200px]!" @click="replaceTranslation(seartchText, replaceText)"/>
      </div>
    </Dialog>
  </Teleport>
</template>