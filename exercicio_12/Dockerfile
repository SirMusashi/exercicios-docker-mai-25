FROM python:3.9.18-slim-buster AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.9.18-slim-buster

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

COPY --from=builder /usr/local/bin/flask /usr/local/bin/flask

COPY app.py .

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

USER appuser

EXPOSE 5000

CMD ["python", "app.py"]