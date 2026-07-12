import { loginWithEmail, loginWithGitHub, loginWithGoogle, signUpWithEmail } from "./actions";
import { getOAuthCredentials } from "@/lib/oauth";

const hasGitHubAuth = !!getOAuthCredentials(
  process.env.AUTH_GITHUB_ID,
  process.env.AUTH_GITHUB_SECRET,
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
);
const hasGoogleAuth = !!getOAuthCredentials(
  process.env.AUTH_GOOGLE_ID,
  process.env.AUTH_GOOGLE_SECRET,
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

const LoginPage = () => {
  return (
    <>
      <section className="pink_container !min-h-[260px]">
        <h1 className="heading">Login / Sign Up</h1>
        <p className="sub-heading !max-w-3xl">
          Join with email, GitHub, or Google to submit and manage startup pitches.
        </p>
      </section>

      <section className="section_container">
        <div className="grid gap-6 lg:grid-cols-2">
          <form action={signUpWithEmail} className="auth-panel">
            <h2 className="auth-title">Create account</h2>
            <label htmlFor="signup-name" className="startup-form_label">
              Name
            </label>
            <input
              id="signup-name"
              name="name"
              required
              placeholder="Your name"
              className="startup-form_input w-full"
            />

            <label htmlFor="signup-email" className="startup-form_label">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="startup-form_input w-full"
            />

            <label htmlFor="signup-password" className="startup-form_label">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="startup-form_input w-full"
            />

            <button type="submit" className="startup-form_btn">
              Sign Up with Email
            </button>
          </form>

          <div className="auth-panel">
            <form action={loginWithEmail} className="space-y-5">
              <h2 className="auth-title">Log in</h2>
              <label htmlFor="login-email" className="startup-form_label">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="startup-form_input w-full"
              />

              <label htmlFor="login-password" className="startup-form_label">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                placeholder="Your password"
                className="startup-form_input w-full"
              />

              <button type="submit" className="startup-form_btn">
                Log In with Email
              </button>
            </form>

            <div className="mt-7 grid gap-3">
              <form action={loginWithGitHub}>
                <button
                  type="submit"
                  disabled={!hasGitHubAuth}
                  className="auth-provider_btn"
                >
                  Continue with GitHub
                </button>
              </form>
              <form action={loginWithGoogle}>
                <button
                  type="submit"
                  disabled={!hasGoogleAuth}
                  className="auth-provider_btn"
                >
                  Continue with Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
