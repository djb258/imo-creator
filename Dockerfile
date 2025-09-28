FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE $PORT

# Use uvicorn directly - no gunicorn!
CMD python3 -m uvicorn src.server.main:app --host 0.0.0.0 --port ${PORT:-10000}