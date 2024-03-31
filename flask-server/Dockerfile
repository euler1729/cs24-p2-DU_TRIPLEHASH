FROM python:3.11.4-slim-bookworm

# Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN bash -c "pip install --upgrade pip"
RUN bash -c "pip install -r requirements.txt"

RUN bash -c "python init_db.py"

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV FLASK_ENV development

# Run app.py when the container launches
CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]
