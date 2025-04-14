<script setup lang="ts">
import { onMounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellValueChangedEvent,
  RowStyle,
  themeAlpine,
} from "ag-grid-community";
import { dataStore, type translation } from "@/modules/params";
import { openXMLFile } from "@/modules/appModules";

const data = dataStore();

onMounted(() => {
  const unlisten = listen("tauri://drag-drop", async (event) => {
    const paths = (event.payload as { paths: string[] }).paths;
    await openXMLFile(paths[0]);
  });

  return () => {
    unlisten.then((f) => f());
  };
});

const onUpdateRows = (event: CellValueChangedEvent<translation>) => {
  if (event.oldValue != event.newValue) {
    const newRows = [...data.translation];
    newRows[event.data.index].translatedText = event.newValue;
    data.translation = newRows;
    data.unSavedTranslation = true;
  }
};
</script>
<template>
  <main>
    <section class="size-full p-2">
      <ag-grid-vue
        style="height: 100%; border-radius: 0"
        :rowHeight="40"
        :gridOptions="{
          stopEditingWhenCellsLoseFocus: true,
          suppressMoveWhenColumnDragging: true,
          suppressScrollOnNewData: true,
          getRowStyle: (params):RowStyle|undefined => {
            if (params.data?.originText != params.data?.translatedText) {
              return { background: 'green', color: 'white' };
            }

          },
          theme: themeAlpine
            .withParams({
              wrapperBorder: true,
              headerRowBorder: true,
              borderRadius: 0.5,
            }).withParams({
              browserColorScheme: 'dark',
              rowBorder: { style: 'solid', width: 1, color: 'white' },
              columnBorder: { style: 'dashed', color: 'white' },
              headerBackgroundColor: '#777777',
              headerTextColor: '#EEEEEE',
            }, 'dark')
            .withParams({
              browserColorScheme: 'light',
              rowBorder: { style: 'solid', width: 1, color: 'black' },
              columnBorder: { style: 'dashed', color: 'black' },
              headerBackgroundColor: '#DDDDDD',
              headerTextColor: 'black',
            }, 'light')
        }"
        :defaultColDef="{
          suppressMovable: true,
        }"
        :columnDefs="[
          {
            field: 'contentuid',
            headerName: 'UUID',
            width: 120,
            headerStyle: { borderRight: 'solid 0.01px #474747' },
          },
          {
            field: 'originText',
            headerName: $t('originText'),
            headerStyle: { borderRight: 'solid 0.01px #474747' },
          },
          {
            field: 'translatedText',
            headerName: $t('translatedText'),
            resizable: false,
            flex: 1,
            editable: true,
            cellEditor: 'agTextCellEditor',
            cellEditorParams: {
              outerHeight: 40,
              innerHeight: 40,
            },
          },
        ]"
        :rowData="data.translation"
        :quickFilterText="data.searchText"
        :onCellValueChanged="(e: CellValueChangedEvent<translation>) => onUpdateRows(e)"
        overlayNoRowsTemplate="Drag&Drop .xml File"
      />
    </section>
  </main>
</template>
