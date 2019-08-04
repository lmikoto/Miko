export interface TreeData {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeData[];
}
