import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AppItem = {
  __typename?: 'AppItem';
  app_name: Scalars['String'];
  id: Scalars['Int'];
};

export type AppItemInput = {
  app_name: Scalars['String'];
};

export type AppItemOutput = {
  __typename?: 'AppItemOutput';
  appItem: AppItem;
};

export type BallotEntry = {
  __typename?: 'BallotEntry';
  created_by: Scalars['String'];
  election_id: Scalars['Int'];
  id: Scalars['Int'];
  row: Scalars['Int'];
  table_name: Scalars['String'];
};

export type BallotEntryInput = {
  created_by: Scalars['String'];
  election_id: Scalars['Int'];
  row: Scalars['Int'];
  table_name: Scalars['String'];
};

export type BallotEntryOutput = {
  __typename?: 'BallotEntryOutput';
  ballotEntry: BallotEntry;
};

export type Election = {
  __typename?: 'Election';
  app_id: Scalars['Int'];
  created_by: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  row: Scalars['Int'];
  table_name: Scalars['String'];
};

export type ElectionInput = {
  app_id: Scalars['Int'];
  created_by: Scalars['String'];
  name: Scalars['String'];
};

export type ElectionOutput = {
  __typename?: 'ElectionOutput';
  election: Election;
};

export type LanguageProficiency = {
  __typename?: 'LanguageProficiency';
  id: Scalars['Int'];
  language_id: Scalars['Int'];
  language_table: Scalars['String'];
  ref_name: Scalars['String'];
  skill_level: LanguageProficiencyEnum;
  user_id: Scalars['String'];
};

export enum LanguageProficiencyEnum {
  Conversational = 'Conversational',
  Fluent = 'Fluent',
  Proficient = 'Proficient',
  RecognizeWords = 'RecognizeWords',
  StartedLearning = 'StartedLearning'
}

export type LanguageProficiencyInput = {
  language_id: Scalars['Int'];
  language_table: Scalars['String'];
  skill_level: LanguageProficiencyEnum;
  user_id: Scalars['String'];
};

export type LanguageProficiencyOutput = {
  __typename?: 'LanguageProficiencyOutput';
  languageProficiency: LanguageProficiency;
};

export type SiteText = {
  __typename?: 'SiteText';
  app: Scalars['Int'];
  description: Scalars['String'];
  id: Scalars['Int'];
  language_id: Scalars['Int'];
  language_table: Scalars['String'];
  site_text_key: Scalars['String'];
};

export type SiteTextInput = {
  app: Scalars['Int'];
  description: Scalars['String'];
  language_id?: InputMaybe<Scalars['Int']>;
  language_table?: InputMaybe<Scalars['String']>;
  site_text_key: Scalars['String'];
};

export type SiteTextOutput = {
  __typename?: 'SiteTextOutput';
  siteText: SiteText;
};

export type SiteTextTranslation = {
  __typename?: 'SiteTextTranslation';
  id: Scalars['Int'];
  language_id: Scalars['Int'];
  language_table: Scalars['String'];
  site_text: Scalars['Int'];
  site_text_translation: Scalars['String'];
  user_id: Scalars['String'];
};

export type SiteTextTranslationInput = {
  language_id?: InputMaybe<Scalars['Int']>;
  language_table?: InputMaybe<Scalars['String']>;
  site_text: Scalars['Int'];
  site_text_translation: Scalars['String'];
  user_id: Scalars['String'];
};

export type SiteTextTranslationOutput = {
  __typename?: 'SiteTextTranslationOutput';
  siteTextTranslation: SiteTextTranslation;
};

export type UpdateVote = {
  up: Scalars['Boolean'];
  user_id: Scalars['String'];
  vote_id: Scalars['Int'];
};

export type Vote = {
  __typename?: 'Vote';
  ballot_entry: BallotEntry;
  ballot_entry_id: Scalars['Int'];
  id: Scalars['Int'];
  up: Scalars['Boolean'];
  user_id: Scalars['String'];
};

export type VoteInput = {
  ballot_entry_id: Scalars['Int'];
  up: Scalars['Boolean'];
  user_id: Scalars['String'];
};

export type VoteOutput = {
  __typename?: 'VoteOutput';
  vote: Vote;
};

export type Mutation_Root = {
  __typename?: 'mutation_root';
  createAppItem: AppItemOutput;
  createBallotEntry: BallotEntryOutput;
  createElection: ElectionOutput;
  createLanguageProficiency: LanguageProficiencyOutput;
  createSiteText: SiteTextOutput;
  createSiteTextTranslation: SiteTextTranslationOutput;
  createVote: VoteOutput;
  updateVote: Scalars['Boolean'];
};


export type Mutation_RootCreateAppItemArgs = {
  input: AppItemInput;
};


export type Mutation_RootCreateBallotEntryArgs = {
  input: BallotEntryInput;
};


export type Mutation_RootCreateElectionArgs = {
  input: ElectionInput;
};


export type Mutation_RootCreateLanguageProficiencyArgs = {
  input: LanguageProficiencyInput;
};


export type Mutation_RootCreateSiteTextArgs = {
  input: SiteTextInput;
};


export type Mutation_RootCreateSiteTextTranslationArgs = {
  input: SiteTextTranslationInput;
};


export type Mutation_RootCreateVoteArgs = {
  input: VoteInput;
};


export type Mutation_RootUpdateVoteArgs = {
  input: UpdateVote;
};

export type Query_Root = {
  __typename?: 'query_root';
  appItems: Array<AppItem>;
  ballotEntryByRowId: BallotEntry;
  electionByTableName: Election;
  languageProficiencies: Array<LanguageProficiency>;
  siteTextTranslations: Array<SiteTextTranslation>;
  siteTexts: Array<SiteText>;
  votes: Array<Vote>;
};


export type Query_RootVotesArgs = {
  user_id?: InputMaybe<Scalars['String']>;
};


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    