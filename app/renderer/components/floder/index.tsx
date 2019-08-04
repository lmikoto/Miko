import React from 'react';

import { Tree } from 'antd';

const { TreeNode, DirectoryTree } = Tree;
import './index.scss';
import { ipcRenderer } from 'electron';
import commonTypes from '../../common/event-type';

import { TreeData } from '../../common/interface';

import { AntTreeNode } from 'antd/lib/tree';

interface State {
  fileMode: 'MD' | 'FOLDER' | string;
  treeData: TreeData[];
}
class Floder extends React.PureComponent<any, State> {

  state = {
    fileMode: 'MD',
    treeData: [],
  };
  onSelect = (keys: any, event: any) => {
    console.log('Trigger Select', keys, event);
  }

  onExpand = () => {
    console.log('Trigger Expand');
  }

  componentDidMount() {
    const fileMode = ipcRenderer.sendSync(commonTypes.GET_FILE_MODE);
    this.setState({ fileMode });
    this.initListenner();
  }

  initListenner = () => {

    ipcRenderer.on(commonTypes.FILE_MODE_CHANGE, (_: any, { fileMode }: any) => {
      this.setState({ fileMode });
    });

    ipcRenderer.on(commonTypes.PATH_READED, (_: any, { treeData }: any) => {
      this.setState({ treeData });
    });
  }

  renderTreeNodes = (data: TreeData[]) =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} key={item.key} />;
    })

  onLoadData = (treeNode: AntTreeNode) => {
    return new Promise(resolve => {
      // 已经加载过了
      if (treeNode.props.children) {
        resolve();
      }
      const treeData = ipcRenderer.sendSync(commonTypes.READ_FOLDER, treeNode.props.eventKey);
      treeNode.props.dataRef.children = [
        ...treeData
      ];
      this.setState({
        treeData: [...this.state.treeData],
      });
      resolve();
    });
  }

  render() {
    const { fileMode, treeData } = this.state;
    return (
      fileMode === 'FOLDER' &&
      <div className="floder-container">
        <DirectoryTree
          multiple
          defaultExpandAll
          onSelect={this.onSelect}
          onExpand={this.onExpand}
          loadData={this.onLoadData as any}
        >
          {this.renderTreeNodes(treeData)}
        </DirectoryTree>
      </div>
    );
  }
}

export default Floder;
