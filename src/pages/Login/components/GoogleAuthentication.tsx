// import {
//   GoogleOAuthProvider,
//   GoogleLogin,
//   CredentialResponse,
// } from "@react-oauth/google";
// import { env } from "@/config/env";
// import { useAuthResponse } from "@/hooks/queries";
// import { useNavigate } from "react-router-dom";
// import { mockUserLogin } from "@/utils";
// import { useAuth } from "@/contexts";
// import { UserRole } from "@/contexts/auth-types";
// import { useEffect, useState } from "react";
// import { axiosClient } from "@/services/api";
// import { GoogleAuthResponse } from "@/types/auth";

// const GoogleAuthentication = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [googleToken, setGoogleToken] = useState<string | null>(null);

//   const queryAuthResponse = useAuthResponse(googleToken ?? undefined);

//   const handleSuccess = (response: CredentialResponse) => {
//     const token = response.credential;
//     if (token) {
//         const res = await axiosClient.get<GoogleAuthResponse>(
//                   `/auth/google-authentication?Token=${token}`
//                 );
//                 setGoogleToken(res.data);
//               };
//     } else {
//       console.warn("Google token is missing from response.");
//     }
//   };

//   const handleError = () => {
//     console.log("Error during Google login!");
//   };

//   // Thực hiện login sau khi query thành công
//   useEffect(() => {
//     if (queryAuthResponse.isSuccess && googleToken) {
//       login(mockUserLogin(UserRole.RESEARCHER).credential.token);
//       navigate("/home");
//     }
//   }, []);

//   return (
//     <div>
//       <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
//         <GoogleLogin
//           text="continue_with"
//           onSuccess={handleSuccess}
//           onError={handleError}
//         />
//       </GoogleOAuthProvider>
//     </div>
//   );
// };

// export default GoogleAuthentication;

import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { env } from "@/config/env";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts";
import { GoogleAuthResponse } from "@/types/auth";
import { useEffect, useState } from "react";
import { axiosClient } from "@/services/api";
import { mockUserLogin } from "@/utils";
import { UserRole } from "@/contexts/auth-types";

const GoogleAuthentication = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authData, setAuthData] = useState<GoogleAuthResponse | null>(null);

  const handleSuccess = async (response: CredentialResponse) => {
    const token = response.credential;
    if (!token) {
      console.warn("Google token is missing from response.");
      return;
    }

    try {
      const res = await axiosClient.post<GoogleAuthResponse>(
        `/auth/google-authentication?Token=${token}`
      );
      setAuthData(res.data);
    } catch (error) {
      console.error("Failed to fetch Google auth response:", error);
    }
  };

  const handleError = () => {
    console.log("Error during Google login!");
  };

  useEffect(() => {
    if (authData) {
      login(mockUserLogin(UserRole.RESEARCHER).credential.token);
      navigate("/home");
    }
  }, []);

  return (
    <div>
      <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
        <GoogleLogin
          text="continue_with"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleAuthentication;
