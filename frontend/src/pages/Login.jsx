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
  });

  return <button onClick={() => googleLogin()}>login with google</button>;
};

export default Login;
