export type Social = {
  _id: string;
  platform: string;
  link: string;
  __v: number;
};

export type SocialInput = {
  platform: string;
  link: string;
};

export type Member = {
  _id: string;
  __v: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  position: string;
  college: string;
  student_number: string;
  contact_number: string;
  address: string;
  other_organizations: {
    name: string;
    position: string;
    inclusive_date: string;
  }[];
  religion: string;
  citizenship: string;
  gender: string;
  educational_background: EducationalBackground[];
  is_new_member: boolean;
  program: string;
  year_level: string;
  image?: string;
};

export type MemberInput = {
  first_name: string;
  middle_name: string;
  last_name: string;
  position: string;
  college: string;
  student_number: string;
  contact_number: string;
  address: string;
  other_organizations: {
    name: string;
    position: string;
    inclusive_date: string;
  }[];
  religion: string;
  citizenship: string;
  gender: string;
  educational_background: string[];
  is_new_member: boolean;
  program: string;
  year_level: string;
};

export type EducationalBackgroundInput = {
  attainment: "Secondary" | "College" | "Special Training";
  name: string;
  location: string;
  year_of_graduation: string;
  organizations: string[];
};

export type EducationalBackground = {
  _id: string;
  attainment: "Secondary" | "College" | "Special Training";
  name: string;
  location: string;
  year_of_graduation: string;
  organizations: EducationalBackgroundOrganization[];
  __v: number;
};

export type EducationalBackgroundOrganization = {
  _id: string;
  name: string;
  position: string;
  __v: number;
};

export type EducationalBackgroundOrganizationInput = {
  name: string;
  position: string;
};

export type Organization = {
  _id: string;
  name: string;
  image: string;
  affiliation: string;
  is_univ_wide: boolean;
  website?: string;
  email: string;
  socials?: Socials[];
  members?: Member[];
  advisers?: string[];
  accreditation_code: string;
  is_active: boolean;
  status: "For Revision" | "Ready for Printing";
  __v: number;
};

export type OrganizationInput = {
  name: string;
  image: string;
  affiliation: string;
  is_univ_wide: boolean;
  website: string;
  email: string;
  socials: Socials[];
  members: Member[];
  advisers: string[];
  accreditation_code: string;
  is_active: boolean;
  status: "For Revision" | "Ready for Printing";
};

export type UserInput = {
  email: string;
  password: string;
};

export type UserRegistrationInput = {
  email: string;
  password: string;
  confirm_password: string;
  role: "RSO" | "SOCC" | "AU";
};

export type User = {
  _id: string;
  email: string;
  password: string;
  image: string;
  role: "RSO" | "OSA" | "SOCC" | "AU" | "ADVISER";
  first_name: string;
  middle_name: string;
  last_name: string;
  contact_number: string;
  college: string;
  address: string;
  second_address: string;
  signature: string;
  organization: Organization;
  affiliation: string;
  __v: number;
};

export type AnnexC1 = {
  _id: string;
  articles: Article[];
  organization: Organization;
  __v: number;
};

export type AnnexC1Input = {
  articles: string[];
  organization: string;
};

export type Article = {
  _id: string;
  order: number;
  title: string;
  description: string[];
  sections: Section[];
  __v: number;
};

export type ArticleInput = {
  order: number;
  title: string;
  description: string[];
  sections: string[];
};

export type Section = {
  _id: string;
  order: number;
  title: string;
  paragraph: string;
  image: string;
  article: string;
  subsections: Subsection[];
  __v: number;
};

export type SectionInput = {
  order: number;
  title: string;
  paragraph: string;
  image: string;
  article: string;
  subsections: string[];
};

export type Subsection = {
  _id: string;
  number: string;
  title: string;
  paragraph: string;
  section: string;
  __v: number;
};

export type SubsectionInput = {
  number: string;
  title: string;
  paragraph: string;
  section: string;
};

export type LetteredParagraph = {
  _id: string;
  letter: string;
  paragraph: string;
  subsection: string;
  section: string;
  __v: number;
};

export type LetteredParagraphInput = {
  letter: string;
  paragraph: string;
  subsection: string;
  section: string;
};

type AffiliationInput = {
  name: string;
};

type AffiliationResponse = {
  _id: string;
  name: string;
  isArchived: boolean;
  _v: number;
};
