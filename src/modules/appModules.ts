import { exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { open, save } from "@tauri-apps/plugin-dialog";
import { basename, dirname, join, resourceDir } from '@tauri-apps/api/path';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { parse, stringify,  } from 'yaml';

import { configStore, dataStore, i18n, type translation, type dictionary, type dictValue } from '@/modules/params';


export const clearData = async() => {
  const { t } = i18n.global
  const data = dataStore();
  
  if (data.unSavedTranslation) {
    const answer = await confirm(
      t("unsavedTrans")
    );
    if (!answer) {
      return;
    }
  }
  data.translation = [];
  data.displayMessage.message = "";
  data.displayMessage.messageType = 0;
  data.unSavedTranslation = false;
  data.loadingFile = "";
}

export const openDialog = async() => {
  const file = await open({
    multiple: false,
    directory: false,
    filters: [{ name: "XML file", extensions: ["xml", "XML"] }],
  });
  if (file == null){
    return
  } 

  openXMLFile(file);
}

export const openXMLFile = async(path: string):Promise<void> => {
  const data = dataStore();
  const config = configStore();
  try {
    const xml = await readTextFile(path);

    const parser = new XMLParser({ ignoreAttributes: false });
    const result = parser.parse(xml);

    if (!result.contentList || !Array.isArray(result.contentList.content)) {
      data.displayMessage.messageType = 2; 
      data.displayMessage.message = "invalid xml!!!";
      return
    }

    const newContentList: translation[] = result.contentList.content.map((item: any, index:number) => ({
      index: index,
      contentuid: item['@_contentuid'],
      originText: item['#text'],
      translatedText: item['#text'],
    }));

    data.translation = newContentList;
    data.loadingFile = path;

    data.displayMessage.messageType = 1; 
    data.displayMessage.message = `loaded xml: ${await basename(path)}`;

    if(config.autoTranslation){
      applyMasterDictionary();
    }

    return;
  } catch (error) {
    data.displayMessage.messageType = 2; 
    data.displayMessage.message = `Error!!!: ${error}`;
    return;
  }
}

export const writeXMLFile = async(): Promise<void> => {
  const data = dataStore();
  if(data.loadingFile == ""){
    return
  }
  try{
    const file = await save({
      filters: [{ name: "XML file", extensions: ["xml", "XML"] }],
      defaultPath: data.loadingFile.toString(),
      canCreateDirectories: true,
    });
    if(!file){
      return;
    }

    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
    });
  
    const xmlObject = {
      '?xml': {
        '@_version': '1.0',
        '@_encoding': 'UTF-8'
      },
      contentList: {
        content: data.translation.map((item) => ({
          '@_contentuid': item.contentuid,
          '@_version': '1',
          '#text': item.translatedText,
        })),
      },
    };
  
    const xml = builder.build(xmlObject);
    await writeTextFile(file, xml);
    data.displayMessage.messageType = 1;
    data.displayMessage.message = "Success!!";
    data.success = true;
    return
  }catch(e){
    data.displayMessage.messageType = 2;
    data.displayMessage.message = `エラー：${e}`;
    return;
  }
}

export const saveMasterDictionary = async(): Promise<void> => {
  const data = dataStore();
  if(data.loadingFile == ""){
    return
  }

  const dictMap = new Map();

  const masterDictPath = await join(await resourceDir(), "dict.yml")
  try{
    if(await exists(masterDictPath)){
      try{
        const yamlData = parse(await readTextFile(masterDictPath))
        for(const key in yamlData){
          dictMap.set(key, yamlData[key])
        }
      }catch(e){
        data.displayMessage.messageType = 2;
        data.displayMessage.message = "failed load existing dictionary file. please remove or move dict.yaml";
        return
      }
    }
    data.translation.forEach( (item) => {
      if(item.originText != item.translatedText) {
        dictMap.set(item.contentuid, {originText: item.originText, translatedText: item.translatedText,})
      }
    })
  }
  catch(e){
    data.displayMessage.messageType = 2;
    data.displayMessage.message = `error: ${e}`;
    return
  }

  if(dictMap.size == 0){
    data.displayMessage.messageType = 1;
    data.displayMessage.message = `0 translation detected, no file saved`;
    data.success = true;
    return
  }
  await writeTextFile(masterDictPath, stringify(dictMap, {lineWidth: -1}));

  data.displayMessage.messageType = 1;
  data.displayMessage.message = "translation saved!!!";
  data.success = true;
  return
}

export const applyMasterDictionary = async():Promise<void> => {
  const data = dataStore();
  const masterDictPath = await join(await resourceDir(), "dict.yml")
  if(await exists(masterDictPath)){
    try{
      const yamlData = parse(await readTextFile(masterDictPath))

      data.translation.forEach((item) => {
        const pattern = yamlData[item.contentuid]
        if(pattern != undefined && item.originText == pattern.originText){
          item.translatedText = pattern.translatedText
        }
      })

      data.displayMessage.messageType = 1;
      data.displayMessage.message = `translation applied!!`;
      return
    }catch(e){
      console.log(e)
      data.displayMessage.messageType = 2;
      data.displayMessage.message = `failed load existing dictionary file. please remove or move dict.yaml`;
      return
    }
  }else{
    data.displayMessage.messageType = 1;
    data.displayMessage.message =  `no dict.yaml found. loaded xml file without translate`;
    return
  }
}

export const importDictionary = async():Promise<void> => {
  const data = dataStore();
  const file = await open({
    multiple: false,
    directory: false,
    filters: [
      { name: "YAML file", extensions: ["yaml", "yml", "YAML", "YML"] },
    ],
  });
  if (file == null){
    return
  } 
  if(await exists(file)){
    try{
      const yamlData = parse(await readTextFile(file))

      data.translation.forEach((item) => {
        const pattern = yamlData[item.contentuid]
        if(pattern != undefined && item.originText == pattern.originText){
          item.translatedText = pattern.translatedText
        }
      })

      data.displayMessage.messageType = 1;
      data.displayMessage.message =  `translation imported!!`;
      return
    }catch(e){
      data.displayMessage.messageType = 2;
      data.displayMessage.message =  `failed import dictionary file. please check dictionary yaml file`;
      return
    }
  }else{
    data.displayMessage.messageType = 1;
    data.displayMessage.message =  `no yaml found.`;
    return
  }
}

export const exportDictionary = async():Promise<void> => {
  const data = dataStore();

  const date = new Date();
  const yymmdd =
    date.getFullYear() +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    ("00" + date.getDate()).slice(-2);
  const exportDir = await dirname(data.loadingFile.toString());
  const exportFile =
        (await basename(data.loadingFile.toString())).replace(/\./g, "_").replace("xml", "") +
        "__exported__" +
        yymmdd +
        ".yml";
  const exportFullPath = await join(exportDir, exportFile);

  const file = await save({
    filters: [
      { name: "YAML file", extensions: ["yaml", "yml", "YAML", "YML"] },
    ],
    defaultPath: exportFullPath,
    canCreateDirectories: true,
  });
  if (file == null){
    return
  } 

  const dictMap = new Map();
  try{
    data.translation.forEach( (item) => {
      if(item.originText != item.translatedText) {
        dictMap.set(item.contentuid, {originText: item.originText, translatedText: item.translatedText,})
      }
    })
  }
  catch(e){
    data.displayMessage.messageType = 2;
    data.displayMessage.message =  `error: ${e}`;
    return
  }

  if(dictMap.size == 0){
    data.displayMessage.messageType = 2;
    data.displayMessage.message =  "0 translation detected, no file saved";
    return
  }
  await writeTextFile(file, stringify(dictMap, {lineWidth: -1}));

  data.displayMessage.messageType = 1;
  data.displayMessage.message =  "translation exported!!!";
  return
}

export const loadTranslation = async():Promise<void> => {
  const data = dataStore();
  const dictMap = new Map();
  const file = await open({
    multiple: false,
    directory: false,
    filters: [{ name: "XML file", extensions: ["xml", "XML"] }],
  });
  if (file == null){
    return
  } 

  try {
    const xml = await readTextFile(file);

    const parser = new XMLParser({ ignoreAttributes: false });
    const result = parser.parse(xml);

    console.log(result);

    if (!result.contentList || !Array.isArray(result.contentList.content)) {
      data.displayMessage.messageType = 2;
      data.displayMessage.message =  "invalid xml!!!";
      return
    }

    const contents:dictionary[] = result.contentList.content.map((item: any) => {
      return {
        contentuid: item['@_contentuid'],
        originText: item['#text'],
        translatedText: item['#text'],
      }})

    console.log(contents)
    contents.forEach((item: dictionary) => {
      dictMap.set(item.contentuid, {originText: item.originText, translatedText: item.translatedText,})
    });
    console.log(dictMap)

    
    data.translation.forEach((item) => {
      const pattern = dictMap.get(item.contentuid) as dictValue
      if(pattern != undefined){
        item.translatedText = pattern.translatedText
      }
    })

    data.displayMessage.messageType = 1;
    data.displayMessage.message =  `loaded translation: ${await basename(file)}`;
    return;
  } catch (error) {

    data.displayMessage.messageType = 2;
    data.displayMessage.message =  `Error!!!: ${error}`;
    return;
  }
}