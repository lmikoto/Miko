import { BrowserWindow } from 'electron';
import url from 'url';
import path from 'path';
import types from '../../renderer/common/event-type';
import { ipcMain } from 'electron';

class RevealWindow {
  mainWindow: BrowserWindow;

  mdContent: string;

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      show: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.mainWindow.maximize();

    const isDev = process.env.NODE_ENV === 'development';
    const port = parseInt(process.env.PORT!, 10) || 3000;
    const devUrl = `http://localhost:${port}/reveal.html`;

    const prodUrl = url.format({
      pathname: path.resolve(__dirname, 'build/reveal.html'),
      protocol: 'file:',
      slashes: true
    });
    const realUrl = isDev ? devUrl : prodUrl;
    this.mainWindow.loadURL(realUrl);

    if (isDev) {
      this.mainWindow.webContents.openDevTools({ mode: 'bottom' });
    }
  }

  show() {
    if (this.mainWindow) {
      this.mainWindow.show();
    }
  }

  getBrowserWin() {
    return this.mainWindow;
  }

  showPPTPre = (mdContent: string) => {
    this.mdContent = mdContent;
    this.show();
  }

  sendContentToPPT = () => {
    this.mainWindow.webContents.send(types.REVEAL_MD_READED, this.mdContent);
  }
}

const realWin = new RevealWindow();

ipcMain.on('reveal-ready', () => {
  realWin.sendContentToPPT();
});

export default realWin;
