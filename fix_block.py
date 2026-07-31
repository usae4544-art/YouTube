import sys

with open("src/App.tsx", "r") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'Or Email Login' in line:
        start_idx = i + 10 # approximate
    if '</button>' in line and 'Need an account? Register' in line:
        end_idx = i + 2 # </form> is next

# Let's find exactly
with open("src/App.tsx", "r") as f:
    content = f.read()

import re
# Find the exact block we want to replace
# From: <form ... > to the end of the <form>
# Wait, it's safer to just replace everything between 'Or Email Login' divider and the end of the user condition.

target = re.search(r'Or Email Login\n.*?</div>\n                          </div>\n(.*?)                        </>\n                      \)}', content, re.DOTALL)
if target:
    original = target.group(1)
    
    new_block = """
                          {isForgotPassword ? (
                            <form onSubmit={handleForgotPassword} className="w-full flex flex-col gap-4">
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
                            <form
                              onSubmit={handleCustomAuth}
                              className="w-full flex flex-col gap-4"
                            >
                              {authError && (
                                <div className="text-red-500 font-medium text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                  {authError}
                                </div>
                              )}

                              {isRegistering && (
                                <input inputMode="none" autoComplete="off"
                                  type="text"
                                  placeholder="Full Name"
                                  value={authName}
                                  onChange={(e) => setAuthName(e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
                                    kidsMode
                                      ? "bg-white border-rose-200 text-rose-950 focus:border-rose-400 placeholder:text-rose-400/70"
                                      : "bg-white/5 border-white/10 text-white focus:border-white/30"
                                  }`}
                                  required
                                />
                              )}

                              <input inputMode="none" autoComplete="off"
                                type="email"
                                placeholder="Email address"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
                                  kidsMode
                                    ? "bg-white border-rose-200 text-rose-950 focus:border-rose-400 placeholder:text-rose-400/70"
                                    : "bg-white/5 border-white/10 text-white focus:border-white/30"
                                }`}
                                required
                              />

                              <input inputMode="none" autoComplete="off"
                                type="password"
                                placeholder="Password"
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
                                  kidsMode
                                    ? "bg-white border-rose-200 text-rose-950 focus:border-rose-400 placeholder:text-rose-400/70"
                                    : "bg-white/5 border-white/10 text-white focus:border-white/30"
                                }`}
                                required
                              />

                              {isRegistering && (
                                <input inputMode="none" autoComplete="off"
                                  type="password"
                                  placeholder="Confirm Password"
                                  value={authConfirmPassword}
                                  onChange={(e) => setAuthConfirmPassword(e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
                                    kidsMode
                                      ? "bg-white border-rose-200 text-rose-950 focus:border-rose-400 placeholder:text-rose-400/70"
                                      : "bg-white/5 border-white/10 text-white focus:border-white/30"
                                  }`}
                                  required
                                />
                              )}
                              
                              {!isRegistering && (
                                <button
                                  type="button"
                                  onClick={() => setIsForgotPassword(true)}
                                  className={`text-sm text-right transition-colors ${kidsMode ? "text-rose-600 hover:text-rose-800" : "text-gray-400 hover:text-white"}`}
                                >
                                  Forgot Password?
                                </button>
                              )}

                              <button
                                type="submit"
                                disabled={authLoading}
                                className={`w-full py-3 font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg mt-2 ${
                                  kidsMode
                                    ? "bg-rose-500 text-white hover:bg-rose-600"
                                    : "bg-white text-black hover:bg-gray-200"
                                }`}
                              >
                                {authLoading
                                  ? "Please wait..."
                                  : isRegistering
                                    ? "Create Account"
                                    : "Sign In"}
                              </button>

                              <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className={`text-sm mt-2 transition-colors font-medium ${
                                  kidsMode
                                    ? "text-rose-600 hover:text-rose-800"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                {isRegistering
                                  ? "Already have an account? Sign in"
                                  : "Need an account? Register"}
                              </button>
                            </form>
                          )}
"""
    
    content = content.replace(original, new_block)
    with open("src/App.tsx", "w") as f:
        f.write(content)
else:
    print("Match failed")
