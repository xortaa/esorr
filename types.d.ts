export type Socials = {
  _id: string;
  platform: string;
  link: string;
  __v: number;
};

export type SocialsInput = {
  platform: string;
  link: string;
};

export type Members = {
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
  educational_background: string;
  is_new_member: boolean;
  program: string;
  year_level: string;
};

export type MembersInput = {
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
  educational_background: string;
  is_new_member: boolean;
  program: string;
  year_level: string;
};
