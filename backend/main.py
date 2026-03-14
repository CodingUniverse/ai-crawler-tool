from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse


app = FastAPI(title="Simple Web Crawler API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CrawlRequest(BaseModel):
    url: str


def normalize_url(raw_url: str) -> str:
    url = raw_url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    parsed = urlparse(url)
    if not parsed.scheme:
        url = f"https://{url}"
        parsed = urlparse(url)

    if parsed.scheme not in {"http", "https"}:
        raise HTTPException(status_code=400, detail="Only http/https URLs are supported")

    if not parsed.netloc:
        raise HTTPException(status_code=400, detail="Invalid URL")

    return url


@app.get("/")
def health_check():
    return {"message": "Backend is running"}


@app.post("/crawl")
def crawl_page(data: CrawlRequest):
    target_url = normalize_url(data.url)

    try:
        response = requests.get(target_url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {exc}") from exc

    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.title.string.strip() if soup.title and soup.title.string else "No title found"

    return {"title": title}
