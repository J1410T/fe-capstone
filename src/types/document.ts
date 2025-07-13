export type DocumentProject = {
  id: string;
  name: string;
  type: string;
  dateInDoc: string;
  updatedAt: string;
  uploadAt: string;
  status: string;
  uploaderId: string;
  projectId: string;
  evaluationId: string;
  individualEvaluationId: string;
  transactionId: string;
  documentFields: DocumentField[];
};

export type DocumentField = {
  id: string;
  indexInDoc: number;
  chapter: string;
  chapterAlign: string;
  chapterStyle: string;
  title: string;
  titleAlign: string;
  titleStyle: string;
  subtitle: string;
  subTitleAlign: string;
  subTitleStyle: string;
  updatedAt: string;
  createdAt: string;
  documentId: string;
  fieldContents: FieldContent[];
};

export type FieldContent = {
  id: string;
  indexInField: number;
  title: string;
  titleAlign: string;
  titleStyle: string;
  content: string;
  contentAlign: string;
  contentStyle: string;
  updatedAt: string;
  createdAt: string;
  documentFieldId: string;
  contentTables: ContentTable[];
};

export type ContentTable = {
  id: string;
  columnIndex: number;
  rowIndex: number;
  columnTitle: string;
  columnTitleAlign: string;
  columnTitleStyle: string;
  subColumnTitle: string;
  subColumnTitleAlign: string;
  subColumnTitleStyle: string;
  cellContent: string;
  cellContentAlign: string;
  cellContentStyle: string;
  updatedAt: string;
  createdAt: string;
  fieldContentId: string;
};
