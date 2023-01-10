import { useState } from 'react';
import { IonContent, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router";
import Title from "../common/Title";
import { DiscussionList as DiscussionsSummary, MockLoginForm } from '@eten-lab/discussion-box';

export default function DiscussionList() {
  const [mockUserInfo, setMockUserInfo] = useState<{
    userInfo: unknown;
    userInfoType: 'email' | 'name' | 'user_id';
  } | null>(null);
  const history = useHistory();

  return (
    <IonContent>
      <div style={{ padding: "60px 20px 60px 20px", height: "100vh" }}>
        <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
          <IonIcon
            className="back"
            icon={arrowBack}
            onClick={() =>
              history.goBack()
            }
          />
          <Title title="My Discussion" />
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
        {(mockUserInfo) ? (
          <DiscussionsSummary
            userInfoType={mockUserInfo.userInfoType}
            userInfo={mockUserInfo.userInfo}
          />
        ) : null}

      </div>
    </IonContent>
  );
}
