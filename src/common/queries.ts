import { gql } from "@apollo/client";

export const appItemsQuery = gql`
    query appItems @api(name: site_text) {
        appItems {
            app_name
            id
        }
    }
`;

export const appItemQuery = gql`
    query AppItem($appItemId: Float!) @api(name: site_text) {
        appItem(id: $appItemId) {
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

export const siteTextQuery = gql`
    query SiteText($siteTextId: Float!) @api(name: site_text) {
        siteText(id: $siteTextId) {
            app
            description
            id
            site_text_key
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

export const updateSiteTextMutation = gql`
    mutation UpdateSiteText($input: UpdateSiteTextInput!)
    @api(name: site_text) {
        updateSiteText(input: $input) {
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
    query SiteTextsByApp($siteTextsByAppId: Float!, $isoCode: String)
    @api(name: site_text) {
        siteTextsByApp(id: $siteTextsByAppId, iso_code: $isoCode) {
            app
            description
            id
            site_text_key
            language_table
            language_id
            translations
        }
    }
`;

export const siteTextTranslationsQuery = gql`
    query SiteTextTranslations($siteTextId: Float!) @api(name: site_text) {
        siteTextTranslations(siteTextId: $siteTextId) {
            description_translation
            id
            language_id
            language_table
            site_text
            site_text_translation
            user_id
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
                skill_level
                user_id
            }
        }
    }
`;

export const languageProficienciesByUserIdQuery = gql`
    query LanguageProfienciesByUserId($userId: String!) @api(name: site_text) {
        languageProfienciesByUserId(user_id: $userId) {
            id
            language_id
            language_table
            ref_name
            skill_level
            user_id
        }
    }
`;

export const createElectionMutation = gql`
    mutation createElection($input: ElectionInput!) @api(name: voting) {
        createElection(input: $input) {
            election {
                app_id
                created_by
                id
                name
            }
        }
    }
`;

export const createBallotEntryMutation = gql`
    mutation createBallotEntryMutation($input: BallotEntryInput!)
    @api(name: voting) {
        createBallotEntry(input: $input) {
            ballotEntry {
                created_by
                election_id
                id
                row
                table_name
            }
        }
    }
`;

export const electionByTableNameQuery = gql`
    query electionByTableName($input: ElectionIdInput!) @api(name: voting) {
        electionByTableName(input: $input) {
            app_id
            created_by
            id
            name
            row
            table_name
        }
    }
`;

export const createVoteMutation = gql`
    mutation CreateVote($input: VoteInput!) @api(name: voting) {
        createVote(input: $input) {
            vote {
                ballot_entry {
                    row
                }
                ballot_entry_id
                id
                up
                user_id
            }
        }
    }
`;

export const updateVoteMutation = gql`
    mutation UpdateVote($input: UpdateVote!) @api(name: voting) {
        updateVote(input: $input) {
            id
            up
            user_id
            ballot_entry {
                row
            }
        }
    }
`;

export const deleteVoteMutation = gql`
    mutation Mutation($deleteVoteId: Float!) @api(name: voting) {
        deleteVote(id: $deleteVoteId)
    }
`;

export const ballotEntryByRowIdQuery = gql`
    query BallotEntryByRowId($row: Float!) @api(name: voting) {
        ballotEntryByRowId(row: $row) {
            created_by
            election_id
            id
            row
            table_name
        }
    }
`;

export const votesQuery = gql`
    query Votes($userId: String) @api(name: voting) {
        votes(user_id: $userId) {
            ballot_entry_id
            id
            up
            user_id
            ballot_entry {
                row
            }
        }
    }
`;

export const votesStatsQuery = gql`
    query VotesStats($electionId: Float!) @api(name: voting) {
        votesStats(election_id: $electionId) {
            ballot_entry_id
            row
            down
            up
        }
    }
`;
