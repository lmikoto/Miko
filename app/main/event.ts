import { ipcMain } from 'electron';

import { forEach } from 'lodash';
import types from '../renderer/common/event-type';
import file from './file';

export function eventListener() {
  ipcMain.on(types.OPEN_MD, () => {});

  ipcMain.on(types.SAVE_MD, (event: any, value: string) => {
    file.saveMD(value);
  });

  ipcMain.on(types.OPEN_LAST_MD, (event: any) => {
      event.returnValue = file.openLastMD();
  });
}

export function removeEventListeners() {
  const registed = [types.OPEN_MD];
  forEach(registed, type => {
    ipcMain.removeAllListeners(type);
  });
}
