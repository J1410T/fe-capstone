export interface DocumentField {
  id: string;
  chapter?: string;
  chapterAlign?: string;
  chapterStyle?: string;

  title?: string;
  titleAlign?: string;
  titleStyle?: string;
  subtitle?: string;
  subTitleAlign?: string;
  subTitleStyle?: string;

  indexInDoc: number;
  updatedAt: Date;
  createdAt: Date;
  documentId: string;
}
