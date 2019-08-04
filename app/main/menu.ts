import { Menu, MenuItemConstructorOptions } from 'electron';
import { BrowserWindow } from 'electron';
import file from './file';

function mainMenuTemplate(win: BrowserWindow): MenuItemConstructorOptions[] {
  return [
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
      ]
    },
    {
      label: '文件',
      submenu: [
        { label: '打开文件夹', role: 'openfile' },
        {
          label: '打开markdown',
          role: 'openmarkdown',
          click: () => {
            file.readMD(win);
          }
        }
      ]
    }
  ];
}

const mainMenu = (mainWindow: BrowserWindow) => {
  return Menu.buildFromTemplate(mainMenuTemplate(mainWindow));
};

export { mainMenu };
