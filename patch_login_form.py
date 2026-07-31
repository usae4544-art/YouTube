import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

forgot_pw_handler = """
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) return;
    setAuthLoading(true);
    try {
      await setDoc(doc(db, "password_reset_requests", forgotPasswordEmail + "_" + Date.now()), {
        email: forgotPasswordEmail,
        timestamp: Date.now(),
        status: "PENDING_ISSUE_MODE"
      });
      alert("Password reset request submitted. An admin will review it shortly in Issue Mode.");
      setIsForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (e: any) {
      setAuthError(e.message || "Failed to submit request.");
    } finally {
      setAuthLoading(false);
    }
  };
"""

if 'const handleForgotPassword' not in content:
    content = content.replace('const handleCustomAuth = async (e: React.FormEvent) => {',
                              forgot_pw_handler + '\n  const handleCustomAuth = async (e: React.FormEvent) => {')

forgot_pw_ui = """
                        {isForgotPassword ? (
                          <form onSubmit={handleForgotPassword} className="w-full space-y-4">
                            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
                            <input
                              type="email"
                              placeholder="Enter your email"
                              value={forgotPasswordEmail}
                              onChange={(e) => setForgotPasswordEmail(e.target.value)}
                              className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
                                kidsMode
                                  ? "bg-white border-rose-200 text-rose-950 focus:border-rose-400 placeholder:text-rose-400/70"
                                  : "bg-white/5 border-white/10 text-white focus:border-white/30"
                              }`}
                              required
                            />
                            <button
                              type="submit"
                              disabled={authLoading}
                              className={`w-full py-3 font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg ${
                                kidsMode
                                  ? "bg-rose-500 text-white hover:bg-rose-600"
                                  : "bg-white text-black hover:bg-gray-200"
                              }`}
                            >
                              {authLoading ? "Submitting..." : "Request Reset"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsForgotPassword(false)}
                              className={`w-full py-3 font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg ${
                                kidsMode
                                  ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                                  : "bg-transparent border border-white/20 text-white hover:bg-white/10"
                              }`}
                            >
                              Back to Login
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleCustomAuth} className="w-full space-y-4">
"""

if 'onSubmit={handleForgotPassword}' not in content:
    content = content.replace('<form onSubmit={handleCustomAuth} className="w-full space-y-4">', forgot_pw_ui)
    # We must close the bracket after the login form
    content = re.sub(
        r'(</form>[ \n\t]*</>)',
        r'</form>\n                        )}',
        content,
        count=1
    )

with open("src/App.tsx", "w") as f:
    f.write(content)
