export interface ContentTable {
  id: string;
  columnIndex: number;
  rowIndex: number;

  columnTitle?: string;
  columnTitleAlign?: string;
  columnTitleStyle?: string;

  subColumnTitle?: string;
  subColumnTitleAlign?: string;
  subColumnTitleStyle?: string;

  cellContent?: string;
  cellContentAlign?: string;
  cellContentStyle?: string;

  updatedAt: Date;
  createdAt: Date;
  fieldContentId: string;
}
