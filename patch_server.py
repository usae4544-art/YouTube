import sys

with open("server.ts", "r") as f:
    content = f.read()

content = content.replace(
    'console.error("Gemini Suggest failed:", error);',
    'console.warn("Gemini Suggest unavailable (likely high demand). Using fallback.");'
)

content = content.replace(
    'console.error("Gemini summarization failed:", error);',
    'console.warn("Gemini summarization unavailable (likely high demand). Using fallback.");'
)

content = content.replace(
    'console.error("Gemini chat failed:", error);',
    'console.warn("Gemini chat unavailable (likely high demand). Using fallback.");'
)

content = content.replace(
    'console.error("Gemini assistant failed:", error);',
    'console.warn("Gemini assistant unavailable (likely high demand). Using fallback.");'
)

content = content.replace(
    'console.error("Ad scan failed:", error);',
    'console.warn("Ad scan unavailable (likely high demand). Using fallback.");'
)

with open("server.ts", "w") as f:
    f.write(content)
