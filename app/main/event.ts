import { ipcMain } from 'electron';

import { forEach } from 'lodash';
import types from '../renderer/common/event-type';
import file from './file';
import setting from './setting';
import settingKey from './setting/setting.key';

export function eventListener() {
  // 保存md
  ipcMain.on(types.SAVE_MD, (event: any, value: string) => {
    file.saveMD(value);
    event.returnValue = null;
  });

  // 打开上次打开的文件
  ipcMain.on(types.OPEN_LAST_MD, (event: any) => {
    event.returnValue = file.openLastMD();
  });

  // 打开上次打开的文件
  ipcMain.on(types.OPEN_LAST_FOLDER, (event: any) => {
    event.returnValue = file.openLastFolder();
  });

  // 获取当前编辑模式
  ipcMain.on(types.GET_FILE_MODE, (event: any) => {
    event.returnValue = setting.get(settingKey.FILE_MODE);
  });

  // 读单层文件夹
  ipcMain.on(types.READ_FOLDER, (event: any, path: string) => {
    event.returnValue = file.readOneFolder(path);
  });

  // 打开md
  ipcMain.on(types.READ_MD, (event: any, path: string) => {
    file.readOneMD(path);
  });

  // 创建md
  ipcMain.on(types.CREATE_MD, (event: any, path: string, name: string) => {
    event.returnValue = file.createMD(path, name);
  });

  // 创建文件夹
  ipcMain.on(types.CREATE_FOLDER, (event: any, path: string, name: string) => {
    event.returnValue = file.createFolder(path, name);
  });

  // 创建重命名
  ipcMain.on(
    types.RENAME_FILE,
    (event: any, path: string, odlname: string, newName: string) => {
      event.returnValue = file.renameFile(path, odlname, newName);
    }
  );
}

export function removeEventListeners() {
  const registed = [
    types.SAVE_MD,
    types.OPEN_LAST_MD,
    types.GET_FILE_MODE,
    types.READ_FOLDER
  ];
  forEach(registed, type => {
    ipcMain.removeAllListeners(type);
  });
}
