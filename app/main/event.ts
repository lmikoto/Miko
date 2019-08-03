import { ipcMain } from 'electron';

import { forEach } from 'lodash';
import types from '../common/event-type';

export function eventListener() {
  ipcMain.on(types.OPEN_MD, () => {});
}

export function removeEventListeners() {
  forEach(types, type => {
    ipcMain.removeAllListeners(type);
  });
}
