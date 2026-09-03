FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt requirements.lock ./
RUN pip install --no-cache-dir -r requirements.txt -c requirements.lock
COPY . .
RUN useradd --create-home nexus && mkdir -p /app/storage && chown -R nexus:nexus /app
USER nexus
EXPOSE 8000
CMD ["uvicorn", "nexus.main:app", "--host", "0.0.0.0", "--port", "8000"]
