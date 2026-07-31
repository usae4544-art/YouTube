import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix the broken closing tags
content = content.replace(
"""                          </form>
                        )}
                        </>
                      )}
                    </div>
                  </div>
                )}""",
"""                          </form>
                        </>
                      )}
                    </div>
                  </div>
                )}""")

# Now insert the forgot password form
forgot_pw_ui = """
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
"""

content = content.replace(
"""                          <form
                            onSubmit={handleCustomAuth}
                            className="w-full flex flex-col gap-4"
                          >""",
forgot_pw_ui)

# Add closing tag for isForgotPassword ternary
content = content.replace(
"""                            <button
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
                        </>
                      )}
                    </div>
                  </div>
                )}""",
"""                            <button
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
                        </>
                      )}
                    </div>
                  </div>
                )}""")


with open("src/App.tsx", "w") as f:
    f.write(content)
