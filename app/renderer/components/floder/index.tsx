import React, { Fragment } from 'react';

import { Tree, Modal, Input, message } from 'antd';

const { TreeNode, DirectoryTree } = Tree;
import './index.scss';
import commonTypes from '../../common/event-type';

import {
  TreeData,
  RightClickNodeTreeItem,
  Result
} from '../../common/interface';

import { AntTreeNode } from 'antd/lib/tree';

import {
  Menu,
  Item,
  Submenu,
  MenuProvider,
  contextMenu
} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

// @ts-ignore
const { ipcRenderer } = window.require('electron');

interface State {
  fileMode: 'MD' | 'FOLDER' | string;
  treeData: TreeData[];
  rightClickNodeTreeItem: RightClickNodeTreeItem;
  currentNode: AntTreeNode;
  modalvisible: boolean;
  editType: string;
  editName: string;
}
class Floder extends React.PureComponent<any, State> {
  state = {
    fileMode: 'MD',
    treeData: [],
    rightClickNodeTreeItem: {} as RightClickNodeTreeItem,
    currentNode: {} as AntTreeNode,
    modalvisible: false,
    editType: '',
    editName: ''
  };

  onSelect = (keys: string[], event: any) => {
    if (keys.length === 1) {
      const key = keys[0];
      if (this.isMd(key)) {
        ipcRenderer.send(commonTypes.READ_MD, key);
      }
    }
  }

  isMd = (title: string) => {
    return title && (title.endsWith('md') || title.endsWith('MD'));
  }

  onExpand = () => {
    // console.log('Trigger Expand');
  }

  componentDidMount() {
    const fileMode = ipcRenderer.sendSync(commonTypes.GET_FILE_MODE);
    this.setState({ fileMode });
    this.initListenner();
    this.openLastFolder();
  }

  initListenner = () => {
    ipcRenderer.on(
      commonTypes.FILE_MODE_CHANGE,
      (_: any, { fileMode }: any) => {
        this.setState({ fileMode });
      }
    );

    ipcRenderer.on(commonTypes.PATH_READED, (_: any, { treeData }: any) => {
      this.setState({ treeData });
    });
  }

  openLastFolder = () => {
    const treeData = ipcRenderer.sendSync(commonTypes.OPEN_LAST_FOLDER);
    this.setState({ treeData });
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
      return (
        <TreeNode {...item} title={item.title} dataRef={item} key={item.key} />
      );
    })

  rightMenu = () => {
    const { currentNode = {} as any } = this.state;
    const { props = {} } = currentNode;
    const { dataRef = {} } = props;
    const { isDir } = dataRef;
    return (
      <Menu id="right-menu">
        {isDir && (
          <Submenu label="新建">
            <Item onClick={() => this.handleEdit(commonTypes.CREATE_MD)}>
              MD文件
            </Item>
            <Item onClick={() => this.handleEdit(commonTypes.CREATE_FOLDER)}>
              文件夹
            </Item>
          </Submenu>
        )}
        <Item onClick={() => this.handleEdit(commonTypes.RENAME_FILE)}>
          重命名
        </Item>
        {!isDir && <Item onClick={this.openReveal}>作为ppt打开</Item>}
      </Menu>
    );
  }

  openReveal = () => {
    const { currentNode } = this.state;
    ipcRenderer.send(commonTypes.OPEN_REVEAL, currentNode.props.dataRef.key);
  }

  title = (fileName: string) => {
    return (
      <Fragment>
        <MenuProvider id="right-menu" style={{ display: 'inline-block' }}>
          {fileName}
        </MenuProvider>
      </Fragment>
    );
  }

  onContextMenu = (e: any) => {
    contextMenu.show({
      id: 'right-menu',
      event: e
    });
  }

  onRightClick = (e: any) => {
    const currentNode = e.node;
    this.setState({ currentNode });
  }

  handleEdit = (editType: string) => {
    if (editType === commonTypes.RENAME_FILE) {
      const { currentNode } = this.state;
      this.setState({
        modalvisible: true,
        editType,
        editName: currentNode.props.dataRef.title.split('.')[0]
      });
    } else {
      this.setState({ modalvisible: true, editType });
    }
  }

  editOk = () => {
    const { currentNode, editName, editType } = this.state;
    const { key, title } = currentNode.props.dataRef;
    let result: Result;
    switch (editType) {
      case commonTypes.CREATE_FOLDER:
      case commonTypes.CREATE_MD:
        result = ipcRenderer.sendSync(editType, key, editName);
        break;
      case commonTypes.RENAME_FILE:
        result = ipcRenderer.sendSync(editType, key, title, editName);
        break;
      default:
        result = {};
        break;
    }
    if (result.errMsg) {
      message.error(result.errMsg);
    }

    this.setState({ modalvisible: false, editName: '' });

    // 刷新文件夹
    this.openLastFolder();
  }

  render() {
    const { fileMode, treeData, modalvisible, editName, editType } = this.state;
    return (
      fileMode === 'FOLDER' && (
        <div className="floder-container" onContextMenu={this.onContextMenu}>
          <DirectoryTree
            onRightClick={this.onRightClick}
            multiple
            // defaultExpandAll
            onSelect={this.onSelect}
            onExpand={this.onExpand}
          >
            {this.renderTreeNodes(treeData)}
          </DirectoryTree>
          {this.rightMenu()}
          <Modal
            visible={modalvisible}
            onCancel={() =>
              this.setState({ modalvisible: false, editName: '' })
            }
            title={editType}
            onOk={this.editOk}
          >
            <Input
              value={editName}
              ref={ref => {
                if (ref) {
                  ref.input.focus();
                }
              }}
              onPressEnter={this.editOk}
              onChange={e => this.setState({ editName: e.target.value })}
            />
          </Modal>
        </div>
      )
    );
  }
}

export default Floder;
