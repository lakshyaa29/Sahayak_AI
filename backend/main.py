import os
import sys

# Add directory paths to sys.path so both 'backend.app' and relative imports resolve
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)

for path in [BASE_DIR, PARENT_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

from backend.app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
