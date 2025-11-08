import { useGoogleLogin } from "@react-oauth/google";
import axios from "../api/axiosConfig"

const Login = () => {
  const googleResponse = async (authResult) => {
    try {
      if (authResult.code) {
        console.log(authResult);
        
        const response = await axios.post(`/api/auth/google/callback?code=${authResult.code}`);
        console.log(response);
      }
    } catch (error) {
      console.error("error while requesting google", error);
    }
  };

 const googleLogin = useGoogleLogin({
  onSuccess: googleResponse,
  onError: googleResponse,
  flow: "auth-code",
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar',
  ].join(' '),
});

  return <button onClick={() => googleLogin()}>login with google</button>;
};

export default Login;
