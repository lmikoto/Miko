import React from 'react';
import { CMLine } from './cm.type';
import { blobToBase64 } from '../../utils';
import uuid4 from 'uuid/v4';
import './index.scss';

class Editor extends React.PureComponent {
  private editorRef: any;

  private cm: any;

  componentDidMount() {
    const simpleEditor = new SimpleMDE({
      element: this.editorRef,
      spellChecker: false,
    });
    this.cm = simpleEditor.codemirror;
    // simpleEditor.codemirror.on('change', () => {
    //   // this.setState({
    //   //   // value: simplemde.value()
    //   // });
    // });

    // tslint:disable-next-line:max-line-length
    simpleEditor.value('![hahah](data:image/png;base64,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)');
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
