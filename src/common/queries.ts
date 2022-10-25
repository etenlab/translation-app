import { gql } from "@apollo/client";

export const appItemsQuery = gql`
    query Query {
        appItems {
            app_name
            id
        }
    }
`;

export const createAppItemMutation = gql`
    mutation Mutation($input: AppItemInput!) {
        createAppItem(input: $input) {
            appItem {
                id
            }
        }
    }
`;

export const siteTextsQuery = gql`
    query Query {
        siteTexts {
            app
            description
            site_text_key
            id
        }
    }
`;

export const createSiteTextMutation = gql`
    mutation Mutation($input: SiteTextInput!) {
        createSiteText(input: $input) {
            siteText {
                app
                description
                id
                site_text_key
            }
        }
    }
`;
export const siteTextsByAppIdQuery = gql`
    query Query($siteTextsByAppIdId: Float!) {
        siteTextsByAppId(id: $siteTextsByAppIdId) {
            app
            description
            id
            site_text_key
            language_table
            language_id
        }
    }
`;

export const siteTextTranslationsQuery = gql`
    query Query {
        siteTextTranslations {
            language_id
            id
            language_table
            site_text_translation
            user_id
            site_text
        }
    }
`;

export const createSiteTextTranslationMutation = gql`
    mutation Mutation($input: SiteTextTranslationInput!) {
        createSiteTextTranslation(input: $input) {
            siteTextTranslation {
                id
                language_id
                language_table
                user_id
                site_text_translation
                site_text
            }
        }
    }
`;
export const languageProficienciesQuery = gql`
    query Query {
        languageProficiencies {
            id
            language_id
            language_table
            skill_level
            user_id
            ref_name
        }
    }
`;

export const createLanguageProficiencyMutation = gql`
    mutation Mutation($input: LanguageProficiencyInput!) {
        createLanguageProficiency(input: $input) {
            languageProficiency {
                id
                language_id
                language_table
                user_id
                skill_level
            }
        }
    }
`;
