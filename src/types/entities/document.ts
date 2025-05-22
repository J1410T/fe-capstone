export interface Document {
  id: string;
  haveHeader?: boolean;
  header?: string;
  headerAlign?: string;
  headerStyle?: string;
  subHeader?: string;
  subHeaderAlign?: string;
  subHeaderStyle?: string;

  title?: string;
  titleAlign?: string;
  titleStyle?: string;
  subtitle?: string;
  subTitleAlign?: string;
  subTitleStyle?: string;

  type: string;
  isSigned?: boolean;
  dateInDoc?: Date;
  updatedAt: Date;
  uploadAt: Date;
  status: string;

  uploader: string;
}
