export type Signatory = {
  _id: string;
  email: string;
  role: string;
  organization: string;
  position: string;
  requestedBy: string;
  isExecutive: boolean;
  submittedAt: Date;
};

export type Annex01 = {
  _id: string;
  orgnanization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type Annex01 = {
  _id: string;
  orgnanization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexA = {
  _id: string;
  organization: Organization;
  academicYearOfLastRecognition: string;
  affiliation: string;
  officialEmail: string;
  officialWebsite: string;
  organizationSocials: string[];
  category: string;
  strategicDirectionalAreas: string[];
  mission: string;
  vision: string;
  description: string;
  objectives: string[];
  startingBalance: number;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexA1 = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
  officers: Officer[];
};

export type EducationalBackground = {
  level: string;
  nameAndLocation: string;
  yearOfGraduation: string;
  organization: string;
  position: string;
};

export type ExtraCurricularActivity = {
  nameOfOrganization: string;
  position: string;
  inclusiveDates: string;
};

export type Officer = {
  _id: string;
  organization: Organization;
  firstName: string;
  middleName: string;
  lastName: string;
  position: string;
  affiliation: string;
  program: string;
  mobileNumber: string;
  residence: string;
  email: string;
  facebook: string;
  educationalBackground: EducationalBackground[];
  recordOfExtraCurricularActivities: ExtraCurricularActivity[];
  religion: string;
  citizenship: string;
  gender: string;
  image: string;
  status: "COMPLETE" | "INCOMPLETE";
  academicYear: string;
};

export type OfficerData = Omic<Officer, '_id' | 'organization', 'academicYear',>

export type OfficerData = {
  organization: string;
  firstName: string;
  middleName: string;
  lastName: string;
  position: string;
  affiliation: string;
  program: string;
  mobileNumber: string;
  residence: string;
  email: string;
  facebook: string;
  educationalBackground: [
    {
      level: string;
      nameAndLocation: string;
      yearOfGraduation: string;
      organization: string;
      position: string;
    }
  ];
  recordOfExtraCurricularActivities: [
    {
      nameOfOrganization: string;
      position: string;
      inclusiveDates: string;
    }
  ];
  religion: string;
  citizenship: string;
  gender: string;
  image: string;
  status: "COMPLETE" | "INCOMPLETE";
};

export type AnnexB = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexC = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexC1 = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexD = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexE = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexE1 = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexE2 = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexE3 = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexF = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexG = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexH = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexI = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexJ = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexK = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type AnnexL = {
  _id: string;
  organization: Organization;
  academicYear: string;
  isSubmitted: boolean;
};

export type Organization = {
  _id: string;
  name: string;
  logo: string;
  signatories: Signatory[];
  isArchived: boolean;
  affiliation: string;
  status: "Acrtive" | "Incomplete" | "Inactive" | "For Revision";
  annex01: Annex01;
  annexA: AnnexA;
  annexA1: AnnexA1;
  annexB: AnnexB;
  annexC: AnnexC;
  annexC1: AnnexC1;
  annexD: AnnexD;
  annexE: AnnexE;
  annexE1: AnnexE1;
  annexE2: AnnexE2;
  annexE3: AnnexE3;
  annexF: AnnexF;
  annexG: AnnexG;
  annexH: AnnexH;
  annexI: AnnexI;
  annexJ: AnnexJ;
  annexK: AnnexK;
  annexL: AnnexL;
};
