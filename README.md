# final-year-project

1. Clone this repo
2. Create a postgres database locally (ensuring postgres-specific settings have been added to settings.py https://docs.djangoproject.com/en/5.1/ref/databases/)

## Frontend

3. In the frontend directory, run npm install to install the packages
4. Create a .env file with the following: VITE_BACKEND_URL={backend url} where backend url is the url for the django backend (e.g the default http://localhost:8000)

## Backend

5. In the root directory, create a new python virtual environment then run pip install -r requirements.txt

## Root env file

6. Generate a gemini api key from here: https://aistudio.google.com/app/apikey
7. Create a .env file in the root directory with the following info

SECRET_KEY={django secret key}
DEBUG=True
DEV_ORIGIN=http://localhost:5173

DB_ENGINE=django.db.backends.postgresql
DB_NAME={name of postgres db}
DB_USER={username for db}
DB_PASSWORD={password for db}
DB_HOST=localhost
DB_PORT=5432

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

API_KEY={gemini api key}

## To Run

In the root directory, run http-server project/media
In another terminal in the frontend directory, run npm run dev
In another terminal in the project directory, run python manage.py runserver

Go to http://localhost:8000/signup/ to get started!
