import React from 'react';
import { CMLine } from './cm.type';
import { blobToBase64 } from '../../utils';
import uuid4 from 'uuid/v4';
import './index.scss';
import { ipcRenderer } from 'electron';
import { debounce } from 'lodash';

import commonTypes from '../../common/event-type';

class Editor extends React.PureComponent {
  private editorRef: any;

  private cm: any;

  private sm: any;

  componentDidMount() {
    this.sm = new SimpleMDE({
      element: this.editorRef,
      spellChecker: false,
    });
    this.cm = this.sm.codemirror;
    this.initListenner();
    this.openLastMD();
  }

  saveMD = () => {
    ipcRenderer.send(commonTypes.SAVE_MD, this.sm.value());
  }

  initListenner = () => {
    // auto save
    this.cm.on('change', debounce(this.saveMD, 500));

    ipcRenderer.on(commonTypes.READED, (_: any, { data }: any) => {
      this.sm.value(data);
      this.initImage();
    });
  }

  openLastMD = () => {
    const value = ipcRenderer.sendSync(commonTypes.OPEN_LAST_MD);
    this.sm.value(value);
    this.initImage();
  }

  renderImg = (start: CMLine, end: CMLine, base64: string) => {
    const img = document.createElement('img');
    img.src = base64;
    this.cm.doc.markText(start, end, { replacedWith: img });
  }

  initImage = () => {
    const doc = this.cm.getDoc();
    const lineNum = doc.lineCount();
    const imgStart = /(!\[.*\]\(data:image.*\))/;
    const base64Reg = /!\[(.*)]\((.*)\)/;
    for (let i = 0; i < lineNum; i++) {
      const content = doc.getLine(i);
      const start = content.search(imgStart);
      if (start !== -1) {
        const name = content.match(base64Reg)[1];
        const base64Str = content.match(base64Reg)[2];
        if (name && base64Str) {
          this.renderImg(
            { line: i, ch: start },
            { line: i, ch: start + name.length + base64Str.length + 5 }, // !()[] 一共五个 字符
            base64Str
          );
        }
      }
    }
  }

  gotoNextLine = () => {
    const nextLine: number = this.cm.getCursor().line + 1;
    this.cm.replaceRange('\n', {
      line: nextLine,
      ch: 0
    });
  }

  onImgPaste = async (e: any) => {
    const clipboardData = e.clipboardData;
    if (clipboardData) {
      const items = clipboardData.items;
      if (!items) {
        return;
      }
      let item = items[0];
      const types = clipboardData.types || [];
      for (let i = 0; i < types.length; i++) {
        if (types[i] === 'Files') {
          item = items[i];
          break;
        }
      }
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        const base64 = await blobToBase64(item.getAsFile()) as string;
        const image = `![${uuid4()}](${base64})`;
        const start = {
          line: this.cm.getCursor().line,
          ch: this.cm.getCursor().ch
        };
        this.cm.doc.replaceSelection(image);
        const end = {
          line: this.cm.getCursor().line,
          ch: this.cm.getCursor().ch
        };
        this.renderImg(start, end, base64);
        this.gotoNextLine();
      }
    }
  }

  render() {
    return (
      <div onPaste={this.onImgPaste} className="cm-container">
        <textarea ref={ref => (this.editorRef = ref)} />
      </div>
    );
  }
}

export default Editor;
