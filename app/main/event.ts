import { ipcMain } from 'electron';

import { forEach } from 'lodash';
import types from '../renderer/common/event-type';
import file from './file';
import setting from './setting';
import settingKey from './setting/setting.key';

export function eventListener() {
  ipcMain.on(types.OPEN_MD, () => {});

  ipcMain.on(types.SAVE_MD, (event: any, value: string) => {
    file.saveMD(value);
  });

  ipcMain.on(types.OPEN_LAST_MD, (event: any) => {
    event.returnValue = file.openLastMD();
  });

  ipcMain.on(types.GET_FILE_MODE, (event: any) => {
    event.returnValue = setting.get(settingKey.FILE_MODE);
  });

  ipcMain.on(types.READ_FOLDER, (event: any, path: string) => {
    event.returnValue = file.readOneFolder(path);
  });
}

export function removeEventListeners() {
  const registed = [types.OPEN_MD];
  forEach(registed, type => {
    ipcMain.removeAllListeners(type);
  });
}
