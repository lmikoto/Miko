import axios from 'axios';
import { dialog, shell } from 'electron';
import pkg from '../../package.json';

const release = 'https://api.github.com/repos/lmikoto/miko/releases/latest';
const downloadUrl = 'https://github.com/lmikoto/miko/releases/latest';
const version = pkg.version;

function compareVersion2Update(current: string, latest: string) {
  const currentVersion = current.split('.').map(item => Number(item));
  const latestVersion = latest.split('.').map(item => Number(item));
  let flag = false;

  for (let i = 0; i < 3; i++) {
    if (currentVersion[i] < latestVersion[i]) {
      flag = true;
    }
  }

  return flag;
}

export default async function checkVersion() {
  const res = await axios.get(release);
  if (res.status === 200) {
    const latest = res.data.name; // 获取版本号
    const result = compareVersion2Update(version, latest); // 比对版本号，如果本地版本低于远端则更新
    if (result) {
      dialog.showMessageBox(
        {
          type: 'info',
          title: '发现新版本',
          buttons: ['Yes', 'No'],
          message: '发现新版本，更新了很多功能，是否去下载最新的版本？',
          checkboxLabel: '以后不再提醒',
          checkboxChecked: false
        },
        (btn: number) => {
          if (btn === 0) {
            shell.openExternal(downloadUrl);
          }
        }
      );
    }
  }
}
