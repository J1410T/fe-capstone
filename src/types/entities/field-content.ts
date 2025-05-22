export interface FieldContent {
  id: string;
  title?: string;
  titleAlign?: string;
  titleStyle?: string;
  content?: string;
  contentAlign?: string;
  contentStyle?: string;
  indexInField: number;
  updatedAt: Date;
  createdAt: Date;
  documentFieldId: string;
}
