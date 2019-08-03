import React from 'react';
// import SimpleMDE from '@editor/simplemde.min.js';
// import '@editor/simplemde.min.css';

class Editor extends React.PureComponent {
  private editorRef: any;

  componentDidMount() {
    const simplemde = new SimpleMDE({
      element: this.editorRef
    });
    simplemde.codemirror.on('change', () => {
      // this.setState({
      //   // value: simplemde.value()
      // });
    });
  }

  render() {
    return (
      <div>
        <textarea ref={ref => (this.editorRef = ref)} />
      </div>
    );
  }
}

export default Editor;
