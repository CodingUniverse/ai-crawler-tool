# Simple Web Title Crawler

这是一个最小可运行的前后端项目：

- Frontend: React + Vite
- Backend: FastAPI
- 功能：输入网址，点击按钮，后端抓取网页 `<title>` 并返回给前端显示

## 项目结构

```text
.
├── backend
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── frontend
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── App.jsx
│       └── main.jsx
├── docker-compose.yml
└── README.md
```

## 一键运行

在项目根目录执行：

```bash
docker compose up --build
```

启动后访问：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:8000`

## API 说明

### `POST /crawl`

请求体：

```json
{
  "url": "https://example.com"
}
```

返回示例：

```json
{
  "title": "Example Domain"
}
```

## 说明

- 后端使用 `requests + BeautifulSoup` 抓取页面 title。
- 前端通过 `fetch('/crawl')` 调用后端（由 Vite 代理到 backend 服务）。
