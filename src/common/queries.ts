import { gql } from "@apollo/client";

export const appItemsQuery = gql`
    query appItems @api(name: site_text) {
        appItems {
            app_name
            id
        }
    }
`;

export const createAppItemMutation = gql`
    mutation createAppItem($input: AppItemInput!) @api(name: site_text) {
        createAppItem(input: $input) {
            appItem {
                id
            }
        }
    }
`;

export const siteTextsQuery = gql`
    query siteTexts @api(name: site_text) {
        siteTexts {
            app
            description
            site_text_key
            id
        }
    }
`;

export const createSiteTextMutation = gql`
    mutation createSiteText($input: SiteTextInput!) @api(name: site_text) {
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
    query siteTextsByAppId($siteTextsByAppIdId: Float!) @api(name: site_text) {
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
    query siteTextTranslations @api(name: site_text) {
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
    mutation createSiteTextTranslation($input: SiteTextTranslationInput!)
    @api(name: site_text) {
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
    query languageProficiencies @api(name: site_text) {
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
    mutation createLanguageProficiency($input: LanguageProficiencyInput!)
    @api(name: site_text) {
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
