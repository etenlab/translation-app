import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    useIonToast,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";
import {
    appItemsQuery,
    ballotEntryByRowIdQuery,
    createBallotEntryMutation,
    createSiteTextTranslationMutation,
    createVoteMutation,
    electionByTableNameQuery,
    siteTextsByAppIdQuery,
    siteTextTranslationsQuery,
    updateVoteMutation,
    votesQuery,
} from "../common/queries";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { IAppItem } from "./AppList";
import { ISiteText } from "./SiteText";
import { useLocation } from "react-router";
import queryString from "query-string";
import { Autocomplete, TextField } from "@mui/material";
import { iso_639_3_enum } from "../common/iso_639_3_enum";
import { useKeycloak } from "@react-keycloak/web";
import { thumbsUpSharp, thumbsDownSharp } from "ionicons/icons";

export interface ISiteTextTranslation {
    id: number;
    site_text: number;
    site_text_translation: string;
    user_id: string;
    language_id: number;
    language_table: string;
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

const SiteTextTranslation = () => {
    const [present] = useIonToast();
    const { search } = useLocation();
    const { keycloak } = useKeycloak();
    const { control, handleSubmit } = useForm();

    const [app, setApp] = useState<IAppItem | undefined>(undefined);
    const [siteText, setSiteText] = useState<ISiteText | undefined>(undefined);
    const [siteTextTranslation, setSiteTextTranslation] = useState<string>("");
    const [languageId, setLanguageId] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [votesAA, setVotes] = useState<IVote[] | undefined>(undefined);

    const iso_639_3_options = useMemo(() => Object.keys(iso_639_3_enum), []);
    const params = queryString.parse(search);

    const [getVotes] = useLazyQuery(votesQuery);
    const { data: votesData } = useQuery(votesQuery, {
        variables: { userId: userId },
    });
    const [getBallotEntry] = useLazyQuery(ballotEntryByRowIdQuery);
    const { data: appItemsData } = useQuery(appItemsQuery);
    const { data: siteTextTranslationsData } = useQuery(
        siteTextTranslationsQuery
    );
    const { data: electionData } = useQuery(electionByTableNameQuery, {
        skip: siteText === undefined,
        variables: {
            input: {
                table_name: "site_text_keys",
                row: siteText?.id!,
            },
        },
    });

    const electionId: number = useMemo(
        () => electionData?.electionByTableName?.id!,
        [electionData]
    );

    const siteTextTranslationData: {
        siteTextTranslations: ISiteTextTranslation[];
    } = useMemo(() => siteTextTranslationsData, [siteTextTranslationsData]);

    const siteTextRequest = useQuery(siteTextsByAppIdQuery, {
        skip: app?.id === undefined,
        variables: {
            siteTextsByAppId: app?.id ?? +params.app_id!,
        },
    });

    const appData: { appItems: IAppItem[] } = useMemo(
        () => appItemsData,
        [appItemsData]
    );

    const siteTextData: { siteTextsByApp: ISiteText[] } = useMemo(
        () => siteTextRequest.data,
        [siteTextRequest.data]
    );

    const isDisabled =
        !siteTextData ||
        (siteTextData && siteTextData.siteTextsByApp.length < 1);

    useEffect(() => {
        loadUserInfo();
        async function loadUserInfo() {
            const res = await keycloak.loadUserInfo();
            //@ts-expect-error
            setUserId(res.preferred_username);
            // setUserId(res.sub)
        }
    }, [keycloak]);

    useEffect(() => {
        if (params.app_id! && params.site_text_id! && !siteText) {
            const appItem = appData?.appItems.find(
                (appItem) => appItem.id === +params.app_id!
            );

            const siteTextItem = siteTextData?.siteTextsByApp.find(
                (siteTextItem) => siteTextItem.id === +params.site_text_id!
            );

            setApp(appItem);
            setSiteText(siteTextItem);
        }
    }, [appData?.appItems, params, siteText, siteTextData?.siteTextsByApp]);

    const [createSiteTextTranslation] = useMutation(
        createSiteTextTranslationMutation
    );
    const [createBallotEntry] = useMutation(createBallotEntryMutation);
    const [createVote] = useMutation(createVoteMutation);
    const [updateVote] = useMutation(updateVoteMutation);

    useEffect(() => {
        setVotes(votesData?.votes);
    }, [votesData, createVote]);

    // Add languages filter (userId)

    const handleChange = (iso: string) => {
        if (iso === null) setLanguageId("");
        let query = iso.toLowerCase();

        setLanguageId(
            iso_639_3_options.filter(
                (i) => i.toLowerCase().indexOf(query) > -1
            )[0]
        );
    };

    const handleSubmitForm = () => {
        createSiteTextTranslation({
            variables: {
                input: {
                    site_text: siteText?.id,
                    site_text_translation: siteTextTranslation,
                    language_id: languageId,
                    language_table: "iso_639_3",
                    user_id: "user_id",
                },
            },
            update: (cache, result) => {
                createBallotEntry({
                    variables: {
                        input: {
                            created_by: userId,
                            election_id: electionId!,
                            table_name: "site_text_translations",
                            row: result.data.createSiteTextTranslation
                                .siteTextTranslation.id,
                        },
                    },
                });

                const cached = cache.readQuery({
                    query: siteTextTranslationsQuery,
                    returnPartialData: true,
                });
                cache.writeQuery({
                    query: siteTextTranslationsQuery,
                    data: {
                        //@ts-expect-error
                        ...cached,
                        siteTextTranslations: [
                            //@ts-expect-error
                            ...cached.siteTextTranslations,
                            result.data.createSiteTextTranslation,
                        ],
                    },
                });
            },
            onError: (e) => {
                present({
                    message: e.message,
                    duration: 1500,
                    color: "danger",
                });
            },
            onCompleted: () => {
                setApp(undefined);
                setSiteText(undefined);
                setSiteTextTranslation("");
                setLanguageId("");
            },
        });

        setApp(undefined);
        setSiteText(undefined);
        setSiteTextTranslation("");
    };

    const handleVote = async (up: boolean, id?: number) => {
        const { data: ballotEntry } = await getBallotEntry({
            variables: { row: id },
        });
        const { data: votesI } = await getVotes({
            variables: { userId: userId },
        });

        setVotes(votesI.votes);

        const row: IVote = votesI.votes.find(
            (vote: IVote) =>
                vote.ballot_entry.row === id && vote.user_id === userId
        );

        if (row) {
            if (row.up === up) return;
            return updateVote({
                variables: {
                    input: {
                        up: up,
                        vote_id: row.id,
                        user_id: userId,
                    },
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
            refetchQueries: [votesQuery],
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
                        votes: [result.data.createVote],
                    },
                });
            },
        });
    };

    return (
        <IonContent>
            <div style={{ padding: "60px 20px 60px 20px" }}>
                <h3 style={{ color: "cornflowerblue" }}>
                    Site Text Translation
                </h3>
                <div>
                    <form onSubmit={handleSubmit(handleSubmitForm)}>
                        <Controller
                            control={control}
                            name="appName"
                            render={() => (
                                <IonSelect
                                    placeholder="Choose App"
                                    style={{ border: "1px solid gray" }}
                                    onIonChange={(e) => {
                                        setApp(e.detail.value);
                                        setSiteText(undefined);
                                    }}
                                    value={app}
                                >
                                    {appData &&
                                        appData.appItems.map(
                                            (item: IAppItem) => (
                                                <IonSelectOption
                                                    key={item.id}
                                                    id={item.app_name}
                                                    value={item}
                                                >
                                                    {item.app_name}
                                                </IonSelectOption>
                                            )
                                        )}
                                </IonSelect>
                            )}
                        />

                        <div
                            className="ion-center"
                            style={{ paddingTop: 10, paddingBottom: 10 }}
                        >
                            <Controller
                                control={control}
                                name="siteText"
                                render={() => (
                                    <IonSelect
                                        placeholder={
                                            isDisabled
                                                ? "No site texts available"
                                                : "Choose Site Text"
                                        }
                                        style={{ border: "1px solid gray" }}
                                        onIonChange={(e) => {
                                            setSiteText(e.detail.value);
                                        }}
                                        disabled={isDisabled}
                                        value={siteText}
                                    >
                                        {siteTextData &&
                                            siteTextData.siteTextsByApp.map(
                                                (item: ISiteText) => (
                                                    <IonSelectOption
                                                        key={item.id}
                                                        value={item}
                                                    >
                                                        {item.site_text_key}
                                                    </IonSelectOption>
                                                )
                                            )}
                                        {!siteTextData && (
                                            <IonItem>
                                                'No items to select'
                                            </IonItem>
                                        )}
                                    </IonSelect>
                                )}
                            />
                        </div>
                        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                            <p>{siteText?.description}</p>
                        </div>

                        <Controller
                            control={control}
                            name="ISO 693-3 Code"
                            render={() => (
                                <Autocomplete
                                    isOptionEqualToValue={(_, value) =>
                                        value === ""
                                    }
                                    value={languageId}
                                    disablePortal
                                    id="ISO 693-3 Code"
                                    options={iso_639_3_options}
                                    sx={{
                                        py: 2,
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="ISO 693-3 Code"
                                        />
                                    )}
                                    onChange={(_, isoCode) =>
                                        handleChange(isoCode!)
                                    }
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="siteTextTranslation"
                            render={() => (
                                <IonInput
                                    disabled={!siteText}
                                    placeholder="New Translation"
                                    style={{ border: "1px solid gray" }}
                                    onIonChange={(e) => {
                                        setSiteTextTranslation(
                                            //@ts-expect-error
                                            e.target.value
                                        );
                                    }}
                                    value={siteTextTranslation}
                                />
                            )}
                        />

                        <IonButton
                            fill="outline"
                            type="submit"
                            disabled={
                                !app ||
                                !siteText ||
                                !siteTextTranslation ||
                                !languageId
                            }
                        >
                            Submit
                        </IonButton>
                    </form>
                    <IonList lines="none">
                        {siteTextTranslationData &&
                            siteTextTranslationData.siteTextTranslations.map(
                                (item: ISiteTextTranslation) => {
                                    let fill = null;
                                    if (votesAA?.length) {
                                        fill = votesAA?.find(
                                            (vote) =>
                                                vote.ballot_entry.row ===
                                                    item.id &&
                                                vote.user_id === userId
                                        );
                                    }

                                    return (
                                        <IonItem key={item.id}>
                                            <IonButton
                                                color={"light"}
                                                style={{
                                                    color: "black",
                                                }}
                                                fill={
                                                    fill?.up
                                                        ? undefined
                                                        : "default"
                                                }
                                                onClick={() => {
                                                    handleVote(true, item.id);
                                                }}
                                            >
                                                <IonIcon icon={thumbsUpSharp} />
                                            </IonButton>
                                            <IonButton
                                                color={"light"}
                                                style={{
                                                    color: "black",
                                                }}
                                                fill={
                                                    fill != null &&
                                                    fill.up === false
                                                        ? undefined
                                                        : "default"
                                                }
                                                onClick={() => {
                                                    handleVote(false, item.id);
                                                }}
                                            >
                                                <IonIcon
                                                    icon={thumbsDownSharp}
                                                />
                                            </IonButton>
                                            {item.site_text_translation}
                                        </IonItem>
                                    );
                                }
                            )}
                    </IonList>
                </div>
            </div>
        </IonContent>
    );
};

export default SiteTextTranslation;
