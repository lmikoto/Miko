import { BrowserWindow, dialog } from 'electron';

import fs from 'fs';
import path from 'path';

import types from '../renderer/common/event-type';
import setting from './setting';
import settingKeys from './setting/setting.key';
import { TreeData } from '../renderer/common/interface';

class File {
  private win: BrowserWindow;

  initWin(win: BrowserWindow) {
    this.win = win;
  }

  readContent(filePath: string) {
    if (filePath) {
      const data = fs.readFileSync(path.join(filePath));
      return data.toString();
    }
    return '';
  }

  readFolder() {
    dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      files => {
        if (files) {
          setting.update({ [settingKeys.FILE_MODE]: 'FOLDER' });
          this.win.webContents.send(types.FILE_MODE_CHANGE, {
            fileMode: 'FOLDER'
          });
          const rootPath = files[0];
          setting.update({ [settingKeys.CURRENT_ROOT_PATH]: rootPath });
          this.win.webContents.send(types.PATH_READED, {
            treeData: this.readOneFolder(rootPath)
          });
        }
      }
    );
  }

  readMD() {
    dialog.showOpenDialog(
      {
        properties: ['openFile'],
        filters: [
          { name: 'MD', extensions: ['md'] },
          { name: '全部文件', extensions: ['*'] }
        ]
      },
      files => {
        if (files) {
          const filePath = files[0];
          this.readOneMD(filePath);
          this.win.webContents.send(types.FILE_MODE_CHANGE, { fileMode: 'MD' });
        }
      }
    );
  }

  readOneFolder = (rootPath: string) => {
    const treeData: TreeData[] = [];

    const list = fs.readdirSync(rootPath);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < list.length; i++) {
      const name = list[i];
      if (this.isDir(path.join(rootPath, name))) {
        treeData.push({ title: name, key: path.join(rootPath, name) });
      } else if (this.isMD(path.join(rootPath, name))) {
        treeData.push({
          title: name,
          key: path.join(rootPath, name),
          isLeaf: true
        });
      }
    }

    return treeData;
  }

  readOneMD = (mdPath: string) => {
    if (this.isMD(mdPath)) {
      const data = this.readContent(mdPath);
      setting.update({ [settingKeys.CURRENT_MD_PATH]: mdPath });
      this.win.webContents.send(types.READED, { data });
    }
  }

  saveMD(value: string) {
    const mdPath = setting.get(settingKeys.CURRENT_MD_PATH);
    if (mdPath) {
      this.saveFile(mdPath, value);
    }
  }

  saveFile = (filePate: string, value: string) => {
    fs.writeFileSync(path.join(filePate), value);
  }

  openLastMD = () => {
    const mdPath = setting.get(settingKeys.CURRENT_MD_PATH);
    return this.readContent(mdPath);
  }

  openLastFolder = () => {
    const mdPath = setting.get(settingKeys.CURRENT_ROOT_PATH);
    return this.readOneFolder(mdPath);
  }

  isDir = (dirPath: string) => {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }

  isMD = (filePath: string) => {
    return filePath.endsWith('md') || filePath.endsWith('MD');
  }
}

export default new File();
