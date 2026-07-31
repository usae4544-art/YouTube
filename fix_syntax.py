import sys

with open("src/App.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '  2191' in str(i) or '  2192' in str(i):
        pass # just to see

# I'll just find the exact lines
target_str = """                          </form>
                        )}
                      )}
                    </div>
                  </div>
                )}"""
replacement_str = """                          </form>
                        )}
                        </>
                      )}
                    </div>
                  </div>
                )}"""

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(target_str, replacement_str)

with open("src/App.tsx", "w") as f:
    f.write(content)
