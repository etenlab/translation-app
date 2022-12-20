import { IonContent, IonIcon, IonItem, IonList, IonText } from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Title from "../common/Title";
import { useEffect, useState } from "react";
import {
    ballotEntryByRowIdQuery,
    createVoteMutation,
    deleteVoteMutation,
    electionByTableNameQuery,
    siteTextQuery,
    siteTextTranslationsQuery,
    updateVoteMutation,
    votesQuery,
    votesStatsQuery,
} from "../common/queries";
import {
    arrowBack,
    thumbsDownOutline,
    thumbsDownSharp,
    thumbsUpOutline,
    thumbsUpSharp,
} from "ionicons/icons";
import Button from "../common/Button";
import { useKeycloak } from "@react-keycloak/web";
import { orderBy } from "lodash";

export interface ISiteTextTranslation {
    id: number;
    site_text: number;
    site_text_translation: string;
    description_translation: string;
    user_id: string;
    language_id: number;
    language_table: string;
    up: number;
    down: number;
}

export interface IBallotEntry {
    id: number;
    row: number;
    table_name: string;
    created_by: string;
    election_id: string;
}

export interface IVote {
    id: number;
    ballot_entry: IBallotEntry;
    up: boolean;
    user_id: string;
}

const SiteTextv2 = () => {
    const { keycloak } = useKeycloak();
    const { search } = useLocation();
    const history = useHistory();

    const params = queryString.parse(search);

    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [votes, setVotes] = useState<IVote[]>([]);
    const [votedTranslations, setVotedTranslations] = useState<
        ISiteTextTranslation[]
    >([]);

    const [getSiteText, { data }] = useLazyQuery(siteTextQuery);
    const [getSiteTextTranslations, { data: translations, loading }] =
        useLazyQuery(siteTextTranslationsQuery);
    const [getBallotEntry] = useLazyQuery(ballotEntryByRowIdQuery);

    const { data: electionData } = useQuery(electionByTableNameQuery, {
        skip: data?.siteText === undefined,
        variables: {
            input: {
                table_name: "site_text_keys",
                row: data?.siteText.id!,
            },
        },
    });

    const { data: votesStats } = useQuery(votesStatsQuery, {
        skip: !electionData?.electionByTableName.id,
        variables: {
            electionId: electionData?.electionByTableName.id,
        },
    });

    useQuery(votesQuery, {
        skip: userId === undefined,
        variables: {
            userId: userId,
        },
        onCompleted: (data) => {
            setVotes(data.votes);
        },
    });

    const [createVote] = useMutation(createVoteMutation);
    const [updateVote] = useMutation(updateVoteMutation);
    const [deleteVote] = useMutation(deleteVoteMutation);

    useEffect(() => {
        loadUserInfo();
        async function loadUserInfo() {
            const res = await keycloak.loadUserInfo();
            //@ts-expect-error
            setUserId(res.preferred_username);
        }
    }, [keycloak]);

    useEffect(() => {
        if (params.site_text_id! != null) {
            getSiteText({
                variables: {
                    siteTextId: +params.site_text_id,
                },
            });

            getSiteTextTranslations({
                variables: {
                    siteTextId: +params.site_text_id!,
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getVotesStats();
        async function getVotesStats() {
            /*
                maybe refactor
            */
            if (
                translations?.siteTextTranslations.length > 0 &&
                votesStats?.votesStats.length > 0
            ) {
                let mergedTranslations =
                    translations?.siteTextTranslations?.map(
                        (translation: ISiteTextTranslation) => {
                            const votedTranslation =
                                votesStats?.votesStats?.find(
                                    (voteStat: any) =>
                                        voteStat.row === translation.id
                                );

                            if (votedTranslation) {
                                return {
                                    ...votedTranslation,
                                    ...translation,
                                };
                            }
                            return { ...translation, up: 0 };
                        }
                    );

                mergedTranslations = orderBy(mergedTranslations, "up", "desc");
                return setVotedTranslations(mergedTranslations);
            }

            setVotedTranslations(translations?.siteTextTranslations);
        }
    }, [userId, translations, votesStats]);

    const handleVote = async (up: boolean, id?: number) => {
        const { data: ballotEntry } = await getBallotEntry({
            variables: { row: id },
        });

        const row = votes.find(
            (vote: IVote) =>
                vote.ballot_entry.row === id && vote.user_id === userId
        );

        if (row) {
            if (row.up === up)
                return deleteVote({
                    variables: { deleteVoteId: row.id },
                    refetchQueries: [votesQuery, votesStatsQuery],
                    onCompleted: (data) => {
                        setVotes((prev: IVote[]) => [
                            ...prev.filter(
                                (vote) => vote.id !== data.deleteVote.id
                            ),
                        ]);
                    },
                });

            return updateVote({
                variables: {
                    input: {
                        up: up,
                        vote_id: row.id,
                        user_id: userId,
                    },
                },
                refetchQueries: [votesQuery, votesStatsQuery],
                onCompleted: (data) => {
                    setVotes((prev: IVote[]) => [
                        ...prev.filter(
                            (vote) => vote.id !== data.updateVote.id
                        ),
                        data.updateVote,
                    ]);
                },
            });
        }

        createVote({
            variables: {
                input: {
                    up: up,
                    user_id: userId,
                    ballot_entry_id: ballotEntry.ballotEntryByRowId.id!,
                },
            },
            refetchQueries: [votesQuery, votesStatsQuery],
            update: (cache, result) => {
                const cached = cache.readQuery({
                    query: votesQuery,
                    returnPartialData: true,
                });
                cache.writeQuery({
                    query: votesQuery,
                    data: {
                        //@ts-expect-error
                        ...cached,
                        votes: [result.data.createVote.vote],
                    },
                });

                setVotes((prev: IVote[]) => [
                    ...prev,
                    result.data.createVote.vote,
                ]);
            },
        });
    };

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <IonIcon
                        className="back"
                        icon={arrowBack}
                        onClick={() =>
                            history.push(
                                `/translation-app/apps?app_id=${data?.siteText.app}`
                            )
                        }
                    />
                    <Title title={data?.siteText.site_text_key} />
                </div>
                <IonText className="font-description">
                    {data?.siteText.description}
                </IonText>
                <div className="button-container">
                    <Button
                        label="Edit Site Text"
                        color="light"
                        onClick={() =>
                            history.push({
                                pathname: "/translation-app/edit-site-text",
                                search: `site_text_id=${data?.siteText.id}`,
                            })
                        }
                    />
                    <Button
                        label="Add New Translation +"
                        onClick={() =>
                            history.push({
                                pathname:
                                    "/translation-app/create-site-text-translation",
                                search: `site_text_id=${data?.siteText.id}`,
                            })
                        }
                    />
                </div>
                <div style={{ paddingTop: "30px" }}>
                    <IonText className="font-subtitle">
                        List of Site Texts Translations
                    </IonText>
                    <IonList
                        style={{ marginLeft: "-20px", marginTop: "5px" }}
                        lines="none"
                    >
                        {votedTranslations &&
                            votedTranslations.map(
                                (item: ISiteTextTranslation) => {
                                    let fill = null;
                                    if (votes?.length) {
                                        fill = votes?.find(
                                            (vote) =>
                                                vote.ballot_entry.row ===
                                                    item.id &&
                                                vote.user_id === userId
                                        );
                                    }

                                    return (
                                        <IonItem
                                            key={item.id}
                                            style={{
                                                padding: "10px 0px 10px 0px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent:
                                                            "space-between",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <Title
                                                        title={
                                                            item.site_text_translation
                                                        }
                                                    />
                                                    <div
                                                        style={{
                                                            alignSelf: "center",
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            width: "20%",
                                                        }}
                                                    >
                                                        <div>
                                                            <IonIcon
                                                                icon={
                                                                    fill?.up
                                                                        ? thumbsUpSharp
                                                                        : thumbsUpOutline
                                                                }
                                                                style={{
                                                                    color: "green",
                                                                }}
                                                                onClick={() =>
                                                                    handleVote(
                                                                        true,
                                                                        item.id
                                                                    )
                                                                }
                                                            />

                                                            <IonText
                                                                style={{
                                                                    fontSize: 14,
                                                                    paddingLeft:
                                                                        "5px",
                                                                    color: "green",
                                                                }}
                                                            >
                                                                {item.up ?? 0}
                                                            </IonText>
                                                        </div>
                                                        <div>
                                                            <IonIcon
                                                                icon={
                                                                    fill !=
                                                                        null &&
                                                                    fill.up ===
                                                                        false
                                                                        ? thumbsDownSharp
                                                                        : thumbsDownOutline
                                                                }
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                                onClick={() =>
                                                                    handleVote(
                                                                        false,
                                                                        item.id
                                                                    )
                                                                }
                                                            />
                                                            <IonText
                                                                style={{
                                                                    fontSize: 14,
                                                                    paddingLeft:
                                                                        "5px",
                                                                    color: "red",
                                                                }}
                                                            >
                                                                {item.down ?? 0}
                                                            </IonText>
                                                        </div>
                                                    </div>
                                                </div>
                                                <IonText>
                                                    {
                                                        item.description_translation
                                                    }
                                                </IonText>
                                                <IonText className="font-username">
                                                    Translation by{" "}
                                                    {item.user_id}
                                                </IonText>
                                            </div>
                                        </IonItem>
                                    );
                                }
                            )}
                    </IonList>

                    {!loading &&
                        translations?.siteTextTranslations.length < 1 && (
                            <div>
                                <IonText>
                                    No site translations available
                                </IonText>
                            </div>
                        )}
                </div>
            </div>
        </IonContent>
    );
};

export default SiteTextv2;
