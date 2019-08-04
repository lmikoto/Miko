import { BrowserWindow, dialog } from 'electron';

import fs from 'fs';
import path from 'path';

import types from '../renderer/common/event-type';
import setting from './setting';
import settingKeys from './setting/setting.key';

class File {
  readContent(filePath: string) {
    const data = fs.readFileSync(path.join(filePath));
    return data.toString();
  }

  readMD(win: BrowserWindow) {
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
          setting.update({ CURRENT_MD_PATH: filePath });
          const data = this.readContent(filePath);
          win.webContents.send(types.READED, { data });
        }
      }
    );
  }

  readPath() {}

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
    return  this.readContent(mdPath);
  }
}

export default new File();
