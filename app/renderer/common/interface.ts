export interface TreeData {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeData[];
  isEdit?: boolean;
}

export interface RightClickNodeTreeItem {
  pageX: number;
  pageY: number;
  id: string;
  categoryName: string;
}

export interface Result {
  data?: any;
  errMsg?: string;
}
