import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import PrimeVue from "primevue/config";
import { i18n } from "@/modules/params";
import 'primeicons/primeicons.css';
import "./App.css";

ModuleRegistry.registerModules([AllCommunityModule]);
document.oncontextmenu = function () {return false;}

createApp(App)
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(i18n)
  .use(PrimeVue, { unstyled: true })
  .mount("#app");
