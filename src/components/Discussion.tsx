import { useState } from 'react';
import { IonContent, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory, useParams, useLocation } from "react-router";
import queryString from "query-string";
import Title from "../common/Title";
import { Discussion as DiscussionBox, MockLoginForm } from '@eten-lab/discussion-box';

export default function Discussion() {
  const { site_text, site_text_translation_id } = useParams<{
    site_text: string;
    site_text_translation_id: string;
  }>();
  const [mockUserInfo, setMockUserInfo] = useState<{
    userInfo: unknown;
    userInfoType: 'email' | 'name' | 'user_id';
  } | null>(null);
  const history = useHistory();
  const { search } = useLocation();
  const params = queryString.parse(search);

  const backHandler = () => {
    if (params.site_text_id) {
      history.push({
        pathname: `/translation-app/site_texts`,
        search: `site_text_id=${params.site_text_id}`,
      })
    } else {
      history.goBack();
    }
  }

  return (
    <IonContent>
      <div style={{ padding: "60px 20px 60px 20px", height: "100vh" }}>
        <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
          <IonIcon
            className="back"
            icon={arrowBack}
            onClick={backHandler}
          />
          <Title title={`${site_text} #${site_text_translation_id}`} />
        </div>

        {!mockUserInfo && (
          <>
            <div>This is temp component to mock user login activity as there is no mature sso.</div>
            <MockLoginForm
              setMockUserInfo={({ userInfo, userInfoType }: {
                userInfo: unknown;
                userInfoType: 'email' | 'name' | 'user_id';
              }) => setMockUserInfo({ userInfo, userInfoType })}
            />
            <div>
              <p>user id ex: 100 ~ xxx, email: hiroshi@test.com, Username: Gru</p>
              <p>if you know anything among user_id, email, or username, then you can login by inputting one of them and click login button</p>
              <hr />
              <p>if you want to register then you should input Email and Username then click register button</p>
            </div>
          </>
        )}
        {(mockUserInfo && site_text.trim() !== "" && site_text_translation_id) ? (
          <DiscussionBox
            tableName={site_text}
            rowId={+site_text_translation_id}
            userInfoType={mockUserInfo.userInfoType}
            userInfo={mockUserInfo.userInfo}
            style={{
              height: '100%',
              padding: '0px',
            }}
          />
        ) : null}

      </div>
    </IonContent>
  );
}
