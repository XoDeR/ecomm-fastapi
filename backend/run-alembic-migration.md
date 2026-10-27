From the backend folder (where alembic.ini lives), run:

# 1. Generate a migration from model changes
uv run alembic revision --autogenerate -m "add download_link"

download_link -- here is the name of the model we added

# 2. Review the new file in alembic/versions/ (check it's correct)

# 3. Apply it
uv run alembic upgrade head