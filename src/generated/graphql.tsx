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

export type Mutation_Root = {
  __typename?: 'mutation_root';
  createAppItem: AppItemOutput;
  createLanguageProficiency: LanguageProficiencyOutput;
  createSiteText: SiteTextOutput;
  createSiteTextTranslation: SiteTextTranslationOutput;
};


export type Mutation_RootCreateAppItemArgs = {
  input: AppItemInput;
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

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch apps */
  appItems: Array<AppItem>;
  /** fetch language profiencies */
  languageProficiencies: Array<LanguageProficiency>;
  /** fetch site text translations */
  siteTextTranslations: Array<SiteTextTranslation>;
  /** fetch site texts */
  siteTexts: Array<SiteText>;
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
    