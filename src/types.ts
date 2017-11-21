/* tslint:disable */

export interface Query {
  allLinks: Link[]; 
}

export interface Link {
  id: string; 
  url: string; 
  description: string; 
  postedBy?: User | null; 
  votes: Vote[]; 
}

export interface User {
  id: string; 
  name: string; 
  email?: string | null; 
}

export interface Vote {
  id: string; 
  user: User; 
  link: Link; 
}

export interface Mutation {
  createLink?: Link | null; 
  createUser?: User | null; 
  signinUser: SigninPayload; 
  createVote?: Vote | null; 
}

export interface SigninPayload {
  token?: string | null; 
  user?: User | null; 
}

export interface AuthProviderSignupData {
  email?: AUTH_PROVIDER_EMAIL | null; 
}

export interface AUTH_PROVIDER_EMAIL {
  email: string; 
  password: string; 
}
export interface CreateLinkMutationArgs {
  url: string; 
  description: string; 
}
export interface CreateUserMutationArgs {
  name: string; 
  authProvider: AuthProviderSignupData; 
}
export interface SigninUserMutationArgs {
  email?: AUTH_PROVIDER_EMAIL | null; 
}
export interface CreateVoteMutationArgs {
  linkId: string; 
}
