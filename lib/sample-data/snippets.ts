export const SAMPLE_SNIPPETS = [
  {
    title: "useLocalStorage Hook",
    technology: "React",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Custom React hook for syncing state with localStorage. Perfect for persisting user preferences, form data, or any state that should survive page refreshes.",
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: { language: "typescript" },
          content: [
            {
              type: "text",
              text: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

// Usage
const [name, setName] = useLocalStorage('name', 'John');`,
            },
          ],
        },
      ],
    },
    tags: ["react", "hooks", "typescript", "localStorage"],
  },
  {
    title: "FastAPI File Upload",
    technology: "Python",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Handle file uploads with validation and error handling in FastAPI. Includes file size limits, extension validation, and secure file storage.",
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: { language: "python" },
          content: [
            {
              type: "text",
              text: `from fastapi import FastAPI, File, UploadFile, HTTPException
from pathlib import Path
import shutil

app = FastAPI()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"File type {file_ext} not allowed")
    
    # Validate file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large")
    
    # Save file
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file.filename, "size": file_size}`,
            },
          ],
        },
      ],
    },
    tags: ["python", "fastapi", "upload", "validation"],
  },
  {
    title: "Docker Multi-Stage Build",
    technology: "Docker",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Production-ready Dockerfile with multi-stage build for Next.js. Optimizes image size by separating build and runtime dependencies.",
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: { language: "dockerfile" },
          content: [
            {
              type: "text",
              text: `# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && \\
    npm cache clean --force

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]`,
            },
          ],
        },
      ],
    },
    tags: ["docker", "dockerfile", "multi-stage", "production"],
  },
] as const;
