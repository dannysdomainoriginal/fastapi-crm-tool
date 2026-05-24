from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
from routers import contacts, deals, tasks, auth

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(title="CRM Tool API", lifespan=lifespan)

# CORS setup
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(auth.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")
app.include_router(deals.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")

# Health check route
@app.get("/health")
def health_check():
    return {"status": "ok"}

# ------------------------- Handle frontend rendering ------------------------ #
base_directory = Path(__file__).resolve().parent.parent
frontend_directory = base_directory / "frontend" / "dist"

app.mount(
    "/assets", StaticFiles(directory=frontend_directory / "assets"), name="assets"
)

@app.get("/")
async def serve_root():
    return FileResponse(frontend_directory / "index.html")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    return FileResponse(frontend_directory / "index.html")
