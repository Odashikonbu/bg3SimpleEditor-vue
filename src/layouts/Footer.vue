<script setup lang="ts">
import Button from "@/volt/Button.vue";
import { dataStore } from "@/modules/params";
import { loadTranslation, saveMasterDictionary, writeXMLFile } from "@/modules/appModules";
const data = dataStore();
</script>
<template>
  <footer class="flex flex-col max-sm:text-sm">
    <section class="flex flex-row h-full items-end gap-x-4 p-2">
      <Button
        :label="$t('loadXML')"
        class="bg-gray-400! text-black! hover:bg-gray-500! h-[30px]!"
        :disabled="data.translation.length == 0"
        @click="loadTranslation"
      />
      <div class="flex-1" />
      <Button
        :label="$t('saveXML')"
        class="bg-gray-400! text-black! hover:bg-gray-500! h-[30px]!"
        @click="writeXMLFile"
        :disabled="data.translation.length == 0"
      />
      <Button
        :label="$t('saveDict')"
        class="bg-blue-600! text-gray-200! hover:bg-blue-800! h-[50px]! w-[180px]!"
        :disabled="data.translation.length == 0"
        @click="saveMasterDictionary"
      />
    </section>
    <section
      class="flex flex-row w-full h-[40px] items-end border-t-[0.1px] border-gray-400 px-2 py-1"
    >
      <span
        :class="[
          'text-gray-800! dark:text-gray-200! text-sm',
          { 'text-red-600!': data.displayMessage.messageType == 2 },
        ]"
        >{{ data.displayMessage.message }}</span
      >
      <div class="flex-1" />
    </section>
  </footer>
</template>
