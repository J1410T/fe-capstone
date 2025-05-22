export interface Transaction {
  id: string;
  code: string;
  title: string;
  type: string;

  senderAccount?: string;
  senderName?: string;
  senderBankName?: string;

  receiverAccount?: string;
  receiverName?: string;
  receiverBankName?: string;
  transferContent?: string;

  requestDate: Date;
  handleDate?: Date;
  feeCost: number;
  totalMoney: number;
  payMethod: string;
  status: string;

  requestPersonId: string;
  handlePersonId: string;
  projectId?: string;
  fundRequestDocId?: string;
}
