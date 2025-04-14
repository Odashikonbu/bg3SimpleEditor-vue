<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useSound } from "@vueuse/sound";
import hotkeys from 'hotkeys-js';
import Grid from "@/layouts/Grid.vue";
import Footer from "@/layouts/Footer.vue";
import Header from "@/layouts/Header.vue";
import { configStore, dataStore, dialogVisible, i18n } from "@/modules/params";
import notificationSound from "@/assets/notification.wav";
import {
  clearData,
  exportDictionary,
  importDictionary,
  loadTranslation,
  openDialog,
  saveMasterDictionary,
  writeXMLFile,
} from "@/modules/appModules";
const config = configStore();
const data = dataStore();

const { play } = useSound(notificationSound);
const syncConfig = () => {
  if (config.darkMode) {
    document.getElementById("app")?.classList.add("app-dark");
    document.body.setAttribute("data-ag-theme-mode", "dark");
  } else {
    document.getElementById("app")?.classList.remove("app-dark");
    document.body.setAttribute("data-ag-theme-mode", "light");
  }

  i18n.global.locale.value = config.language;
};

const initComplete = ref<boolean>(false);
const initHotkey = () => {
  if (initComplete.value) return;

  hotkeys("ctrl+o", function(event){
    event.preventDefault();
    openDialog();
  })

  hotkeys("ctrl+s", function(event){
    event.preventDefault();
    saveMasterDictionary();
  })

  hotkeys("ctrl+w", function(event){
    event.preventDefault();
    clearData();
  })

  hotkeys("ctrl+r", function(event){
    event.preventDefault();
    dialogVisible.value = !dialogVisible.value;
  })

  hotkeys("shift+alt+s", function(event){
    event.preventDefault();
    writeXMLFile();
  })

  hotkeys("shift+alt+e", function(event){
    event.preventDefault();
    exportDictionary();
  })

  hotkeys("shift+alt+i", function(event){
    event.preventDefault();
    importDictionary();
  })

hotkeys("shift+alt+l", function(event){
  event.preventDefault();
  loadTranslation();
})

  initComplete.value = true;
};

onMounted(syncConfig);
onMounted(initHotkey);
watch(config, syncConfig);
watch(data, () => {
  if (data.success) {
    play();
    data.success = false;
  }
});
</script>
<template>
  <Header />
  <Grid />
  <Footer />
</template>
<style scoped>
@reference "tailwindcss";
@custom-variant dark (&:where(.app-dark, .app-dark *));
header,
footer {
  @apply fixed w-full bg-slate-300 text-gray-800 dark:bg-black! dark:text-white!;
}
header {
  @apply top-0 h-[110px];
}
footer {
  @apply bottom-0 h-[100px];
}
main {
  @apply size-full pb-[100px] pt-[110px] bg-slate-300 dark:bg-slate-950 text-white;
}
</style>
