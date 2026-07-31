import sys

with open("src/App.tsx", "r") as f:
    app_content = f.read()

old_func = """  const handleForgotPassword = async (e: React.FormEvent) => {
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
  };"""

new_func = """  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) return;
    setAuthLoading(true);
    try {
      await setDoc(doc(db, "password_reset_requests", forgotPasswordEmail + "_" + Date.now()), {
        email: forgotPasswordEmail,
        timestamp: Date.now(),
        status: "PENDING_ISSUE_MODE",
        issueType: issueType,
        note: issueNote
      });
      alert(`Request submitted successfully. An admin will review it shortly in Issue Mode.`);
      setIsForgotPassword(false);
      setForgotPasswordEmail("");
      setIssueNote("");
      setIssueType("password_reset");
    } catch (e: any) {
      setAuthError(e.message || "Failed to submit request.");
    } finally {
      setAuthLoading(false);
    }
  };"""
app_content = app_content.replace(old_func, new_func)

old_form = """                            <form onSubmit={handleForgotPassword} className="w-full flex flex-col gap-4">
                              <h3 className="text-xl font-bold mb-2">Reset Password</h3>
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
                              />
                              <button
                                type="submit"
                                disabled={authLoading || !forgotPasswordEmail}
                                className={`w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                  kidsMode
                                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                                    : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white"
                                }`}
                              >
                                {authLoading ? "Submitting..." : "Submit Reset Request"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsForgotPassword(false)}
                                className={`mt-2 font-medium transition-colors ${
                                  kidsMode ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-white"
                                }`}
                              >
                                Back to login
                              </button>
                            </form>"""

new_form = """                            <form onSubmit={handleForgotPassword} className="w-full flex flex-col gap-4 text-left">
                              <h3 className="text-xl font-bold mb-2 text-center">Submit Issue Request</h3>
                              
                              <div className="flex gap-2">
                                <label className={`flex-1 p-3 border rounded-xl cursor-pointer text-center font-medium transition-colors ${
                                  issueType === 'password_reset' 
                                  ? (kidsMode ? 'bg-rose-100 border-rose-500 text-rose-700' : 'bg-red-500/20 border-red-500 text-white') 
                                  : (kidsMode ? 'bg-white border-rose-200 text-gray-500' : 'bg-white/5 border-white/10 text-gray-400')
                                }`}>
                                  <input type="radio" name="issue_type" value="password_reset" checked={issueType === 'password_reset'} onChange={() => setIssueType('password_reset')} className="hidden" />
                                  Password Reset
                                </label>
                                <label className={`flex-1 p-3 border rounded-xl cursor-pointer text-center font-medium transition-colors ${
                                  issueType === 'transfer_code' 
                                  ? (kidsMode ? 'bg-rose-100 border-rose-500 text-rose-700' : 'bg-red-500/20 border-red-500 text-white') 
                                  : (kidsMode ? 'bg-white border-rose-200 text-gray-500' : 'bg-white/5 border-white/10 text-gray-400')
                                }`}>
                                  <input type="radio" name="issue_type" value="transfer_code" checked={issueType === 'transfer_code'} onChange={() => setIssueType('transfer_code')} className="hidden" />
                                  Transfer Code
                                </label>
                              </div>

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
                              />
                              
                              <textarea
                                placeholder="Add a comment or note for the admin (Optional)"
                                value={issueNote}
                                onChange={(e) => setIssueNote(e.target.value)}
                                rows={2}
                                className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors resize-none ${
                                  kidsMode
                                    ? "bg-white border-rose-200 text-rose-950 focus:border-rose-400 placeholder:text-rose-400/70"
                                    : "bg-white/5 border-white/10 text-white focus:border-white/30"
                                }`}
                              />

                              <button
                                type="submit"
                                disabled={authLoading || !forgotPasswordEmail}
                                className={`w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 ${
                                  kidsMode
                                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                                    : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white"
                                }`}
                              >
                                {authLoading ? "Submitting..." : "Submit Request"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsForgotPassword(false)}
                                className={`mt-2 font-medium transition-colors text-center ${
                                  kidsMode ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-white"
                                }`}
                              >
                                Back to login
                              </button>
                            </form>"""
app_content = app_content.replace(old_form, new_form)

with open("src/App.tsx", "w") as f:
    f.write(app_content)
