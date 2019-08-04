import { BrowserWindow } from 'electron';

export default class MainWindow {
  mainWindow: BrowserWindow;
  constructor() {
    this.createMainWindow();
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      show: false
    });
    this.mainWindow.maximize();
  }

  loadURL(url: string) {
    this.mainWindow.loadURL(url);
  }

  openDevTools() {
    this.mainWindow.webContents.openDevTools({ mode: 'bottom' });
  }

  show() {
    this.mainWindow.show();
  }

  getBrowserWin() {
    return this.mainWindow;
  }
}
