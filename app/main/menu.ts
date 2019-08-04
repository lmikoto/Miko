import { Menu, MenuItemConstructorOptions } from 'electron';
import file from './file';

const mainMenuTemplate: MenuItemConstructorOptions[] = [
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
      {
        label: '打开文件夹',
        role: 'openfile',
        click: () => {
          file.readFolder();
        }
      },
      {
        label: '打开markdown',
        role: 'openmarkdown',
        click: () => {
          file.readMD();
        }
      }
    ]
  }
];

const mainMenu = () => {
  return Menu.buildFromTemplate(mainMenuTemplate);
};

export { mainMenu };
