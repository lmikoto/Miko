import { BrowserWindow, dialog } from 'electron';

import fs from 'fs';
import path from 'path';

import types from '../renderer/common/event-type';
import setting from './setting';
import settingKeys from './setting/setting.key';
import { TreeData } from '../renderer/common/interface';
import result from './result';

class File {
  private win: BrowserWindow;

  initWin(win: BrowserWindow) {
    this.win = win;
  }

  readContent(filePath: string) {
    if (filePath && fs.existsSync(filePath)) {
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
    if (rootPath) {
      const dir: TreeData[] = [];
      const md: TreeData[] = [];

      const list = fs.readdirSync(rootPath);

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < list.length; i++) {
        const name = list[i];
        if (this.isDir(path.join(rootPath, name))) {
          dir.push({
            title: name,
            key: path.join(rootPath, name),
            isDir: true
          });
        } else if (this.isMD(path.join(rootPath, name))) {
          md.push({
            title: name,
            key: path.join(rootPath, name),
            isLeaf: true
          });
        }
      }

      return [...dir, ...md];
    }

    return [];
  }

  createMD = (mdPath: string, mdName: string) => {
    if (mdPath) {
      const newPath = path.join(mdPath, `${mdName}.md`);
      if (fs.existsSync(newPath)) {
        return result('文件已经存在');
      }
      fs.writeFileSync(newPath, '');
      return result();
    }
    return result();
  }

  renameFile = (filePath: string, oldName: string, newName: string) => {
    if (filePath) {
      const oldPath = path.join(filePath);
      let newPath;
      if (this.isDir(oldName)) {
        newPath = path.join(path.resolve(filePath, '..'), newName);
      } else {
        newPath = path.join(path.resolve(filePath, '..'), `${newName}.md`);
      }
      fs.renameSync(oldPath, newPath);
      return result(null, path.resolve(newPath, '..'));
    }
    return result();
  }

  createFolder = (dirPath: string, name: string) => {
    if (dirPath) {
      const newPath = path.join(dirPath, name);
      if (fs.existsSync(newPath)) {
        return result('文件夹已经存在');
      }
      fs.mkdirSync(path.join(dirPath, name));
      return result();
    }
    return result();
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
    return (
      (fs.existsSync(filePath) &&
        !fs.statSync(filePath).isDirectory() &&
        filePath.endsWith('md')) ||
      filePath.endsWith('MD')
    );
  }
}

export default new File();
