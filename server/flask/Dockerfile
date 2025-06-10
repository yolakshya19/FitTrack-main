FROM python:3-alpine3.12

# Set working directory
WORKDIR /server/flask

# Install system dependencies (for pyttsx3 and opencv)
RUN apt-get update && apt-get install -y \
    espeak \
    libespeak1 \
    libglib2.0-0 \
    libgl1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency list
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app code
COPY . .

# Expose Flask port
EXPOSE 8080

# Start the Flask app
CMD ["python", "app.py"]
