import { ipcMain } from 'electron';

import { forEach } from 'lodash';
import types from '../common/event-type';

export function eventListener() {
  ipcMain.on(types.OPEN_MD, () => {});
}

export function removeEventListeners() {
  const registed = [types.OPEN_MD];
  forEach(registed, type => {
    ipcMain.removeAllListeners(type);
  });
}
