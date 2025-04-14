<script setup lang="ts">
import Button from "@/volt/Button.vue";
import MenuBar from "@/layouts/MenuBar.vue";
import InputText from '@/volt/InputText.vue'
import { clearData, exportDictionary, importDictionary, openDialog } from "@/modules/appModules";
import { dataStore } from "@/modules/params";
const data = dataStore();

</script>
<template>
  <header class="flex flex-col h-full p-0!">
    <MenuBar/>
    <section class="flex flex-col h-full mt-[3px]! pb-2">
      <section class="flex flex-row items-end h-full gap-x-4 px-2">
        <Button
          icon="pi pi-times"
          :label="$t('close')"
          @click="clearData"
          :disabled="data.translation.length == 0"
          class="h-[25px]! w-[140px]! text-white! bg-red-950! border-red-950! hover:bg-red-700! text-sm! max-sm:text-xs!"
        />
        <InputText
          v-model="data.searchText"
          placeholder="Search"
          class="h-[28px]"
        />
        <div class="flex-1" />
        <div class="flex flec-row gap-x-4 h-full items-end">
          <Button
            class="h-[25px]! w-[80px]! max-sm:w-[65px]! bg-gray-400! text-black! hover:bg-gray-500! text-sm!"
            :label="i.label"
            @click="i.method"
            :disabled="data.translation.length == 0"
            v-for="i in [{label: 'Import', method: importDictionary}, {label:  'Export', method: exportDictionary}]"
          />
        </div>
        <Button
          class="h-[40px]! w-[180px]! bg-blue-600! text-gray-200! hover:bg-blue-800! max-sm:text-xs ml-5"
          :label="$t('openXML')"
          @click="() => {openDialog()}"
        />
      </section>
    </section>
  </header>
</template>
