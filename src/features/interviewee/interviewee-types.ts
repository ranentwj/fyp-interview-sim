export type PreparedInterviewee = {
  id: string;
  name: string;
  age: number;
  gender: string;
  ethnicity: string;
  occupation: string;
  location: string;
  portrait: string;
  shortBackground: string;
  background: string;
};

export type CustomIntervieweeDraft = {
  name: string;
  age: string;
  gender: string;
  ethnicity: string;
  occupation: string;
  location: string;
  background: string;
};

export const emptyCustomIntervieweeDraft: CustomIntervieweeDraft = {
  name: "",
  age: "",
  gender: "",
  ethnicity: "",
  occupation: "",
  location: "",
  background: "",
};
