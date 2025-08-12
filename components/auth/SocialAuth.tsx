import { FaGithub } from "react-icons/fa6";
import Button from "../common/Button";
import { FaGoogle } from "react-icons/fa6";
import { signIn } from "next-auth/react";

const SocialAuth = () => {
  const handleOnClick = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/user/1" });
    console.log(provider);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <Button
        type="button"
        label="continue with Google"
        icon={FaGoogle}
        onClick={() => handleOnClick("google")}
      />
      <Button
        type="button"
        label="continue with Github"
        icon={FaGithub}
        onClick={() => handleOnClick("github")}
      />
    </div>
  );
};

export default SocialAuth;

// const handleGoogleLogin = () => {
//   const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;
//   const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
//   const scope = "openid email profile";

//   const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&prompt=consent`;

//   window.location.href = authUrl;
// };
