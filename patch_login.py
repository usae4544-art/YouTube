import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Add "Forgot Password?" next to "Forgot PIN?"
if 'Forgot Password?' not in content:
    content = re.sub(
        r'(Forgot PIN\?[ \n\t]*</button>)',
        r'\1\n                            <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-blue-400 hover:text-blue-300 ml-4">Forgot Password?</button>',
        content
    )
    with open("src/App.tsx", "w") as f:
        f.write(content)
        print("Patched Forgot Password button")
else:
    print("Forgot Password button already exists")
