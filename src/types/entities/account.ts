export interface Account {
  id: string;
  firebaseUid?: string;
  website?: string;
  facebookURL?: string;
  linkedInURL?: string;

  avatarURL?: string;
  identityCode: string;
  fullName: string;
  email: string;
  alternativeEmail: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: boolean;

  selfDescription?: string;
  degree?: string;
  degreeType?: string;
  proficiencyLevel?: string;

  companyName?: string;

  createTime: Date;
  deleteTime?: Date;
  role: string;
  status: string;

  majorId: string;
}
