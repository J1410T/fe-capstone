export interface OTPCode {
  id: string;
  code: string;
  attempt: number;
  createDate: Date;
  accountId: string;
}
