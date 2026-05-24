from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from settings import settings

# Adjust the SQLite URL for async. 
# If it's a relative path like 'crm_database.db', we prefix with 'sqlite+aiosqlite:///'
sqlite_url = f"sqlite+aiosqlite:///{settings.DB_URL}"

engine = create_async_engine(sqlite_url, echo=True, future=True)

# Using sessionmaker to create a factory for AsyncSession
async_session_maker = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session
