import fs from 'fs';
import { Config } from './setting.type';
import { app } from 'electron';

const SPLIT = process.platform === 'win32' ? '\\' : '/';
const DATA_PATH = app.getPath('appData');
const SETTING_NAME = 'setting.json';

class FSDB {
  private filePath: string = `${DATA_PATH}${SPLIT}${SETTING_NAME}`;
  private data: Config;

  constructor() {
    this.data = {};
    this.init();
  }

  init() {
    const { filePath } = this;
    try {
      if (!fs.existsSync(filePath)) {
        this.write(this.data);
      } else {
        this.read();
      }
    } catch (ex) {
      console.warn(ex);
    }
  }

  update(data: Config) {
    const newData = { ...this.data, ...data };
    this.data = newData;
    this.write(newData);
  }

  write(data: Config) {
    const { filePath } = this;
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), {
        encoding: 'utf8'
      });
    } catch (ex) {
      console.warn(ex);
    }
  }

  read() {
    const { filePath } = this;
    try {
      const content = fs.readFileSync(filePath, {
        encoding: 'utf8'
      });
      this.data = JSON.parse(content);
    } catch (ex) {
      console.warn(ex);
    }
  }

  getCache() {
    return this.data;
  }
}

const setting = new FSDB();

export default setting;
