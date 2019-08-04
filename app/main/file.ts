import { WebContents, BrowserWindow, dialog } from 'electron';

import fs from 'fs';
import path from 'path';

import types from '../common/event-type';

export default class {
  private win: WebContents;
  constructor(win: BrowserWindow) {
    this.win = win.webContents;
  }

  readContent(filePath: string) {
    const data = fs.readFileSync(path.join(filePath));
    return data.toString();
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
          const data = this.readContent(filePath);
          this.win.send(types.READED, { data });
        }
      }
    );
  }

  readPath() {}
}
