# Wolf & Word Bible API

A public REST API providing access to Bible text across multiple versions.

## Base URL

```
https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api
```

## Authentication

**None required** - This is a public API.

---

## Endpoints

### 1. API Documentation

```
GET /
```

Returns this documentation in JSON format.

---

### 2. List Bible Versions

```
GET /versions
```

Returns all available Bible versions.

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "abbreviation": "KJV",
      "name": "King James Version",
      "language": "en",
      "copyright_info": "Public Domain"
    }
  ]
}
```

---

### 3. List Books

```
GET /books
GET /books?testament=OT
GET /books?testament=NT
```

Returns all 66 books of the Bible.

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `testament` | No | Filter by `OT` (Old Testament) or `NT` (New Testament) |

**Response:**
```json
{
  "success": true,
  "count": 66,
  "data": [
    {
      "name": "Genesis",
      "abbreviation": "Gen",
      "testament": "OT",
      "book_number": 1,
      "total_chapters": 50
    }
  ]
}
```

---

### 4. Fetch Verses

```
GET /verses?book={book}&chapter={chapter}
GET /verses?book={book}&chapter={chapter}&version={version}
GET /verses?book={book}&chapter={chapter}&verse={verse}
GET /verses?book={book}&chapter={chapter}&verse={start}-{end}
GET /verses?book={book}&chapter={chapter}&clean=true
```

Fetch verses from a specific chapter.

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `book` | Yes | Book name or abbreviation (e.g., `John`, `Gen`, `1Cor`) |
| `chapter` | Yes | Chapter number |
| `version` | No | Version abbreviation (default: `KJV`) |
| `verse` | No | Single verse number or range (e.g., `16` or `16-18`) |
| `clean` | No | Strip bracket notation from KJV text (default: `false`). Use `clean=true` to remove `[` and `]` while keeping the words inside. |

**Example Requests:**
```bash
# John 3:16 in KJV
curl "https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api/verses?book=John&chapter=3&verse=16"

# Genesis 1:1-5 in BSB
curl "https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api/verses?book=Genesis&chapter=1&verse=1-5&version=BSB"

# Entire Romans 8
curl "https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api/verses?book=Romans&chapter=8"

# Joshua 14:15 with brackets stripped (KJV uses [brackets] for translator-added words)
curl "https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api/verses?book=Joshua&chapter=14&verse=15&clean=true"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "book": "John",
    "chapter": 3,
    "version": "KJV",
    "version_name": "King James Version",
    "verse_count": 1,
    "verses": [
      {
        "verse": 16,
        "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
      }
    ]
  }
}
```

---

### 5. Fetch Pericopes

```
GET /pericopes
GET /pericopes?book={book}
GET /pericopes?book={book}&chapter={chapter}
```

Fetch passage divisions (pericopes) with thematic titles.

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `book` | No | Filter by book name |
| `chapter` | No | Filter by chapter number |

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "name": "Nicodemus Visits Jesus",
      "book": "John",
      "chapter": 3,
      "verse_start": 1,
      "verse_end": 21,
      "verse_count": 21,
      "subtitle": null,
      "theme": null
    }
  ]
}
```

---

## Available Versions

| Abbreviation | Name |
|--------------|------|
| `KJV` | King James Version |
| `BSB` | Berean Standard Bible |
| `MSV` | Modern Standard Version |
| `WEB` | World English Bible |

---

## Error Responses

All errors return a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request - Missing required parameters |
| 404 | Not Found - Book, version, or verses not found |
| 500 | Server Error |

---

## Usage Examples

### JavaScript/TypeScript

```typescript
const API_BASE = 'https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api';

// Fetch John 3:16
async function getVerse() {
  const response = await fetch(`${API_BASE}/verses?book=John&chapter=3&verse=16`);
  const data = await response.json();
  console.log(data.data.verses[0].text);
}

// Fetch all New Testament books
async function getNTBooks() {
  const response = await fetch(`${API_BASE}/books?testament=NT`);
  const data = await response.json();
  return data.data;
}
```

### Python

```python
import requests

API_BASE = 'https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api'

# Fetch Romans 8:28-39
response = requests.get(f'{API_BASE}/verses', params={
    'book': 'Romans',
    'chapter': 8,
    'verse': '28-39',
    'version': 'KJV'
})

data = response.json()
for verse in data['data']['verses']:
    print(f"{verse['verse']}: {verse['text']}")
```

### cURL

```bash
# Get all versions
curl "https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api/versions"

# Get Psalm 23
curl "https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api/verses?book=Psalms&chapter=23"
```

---

## Rate Limits

Currently no rate limits are enforced. Please be respectful with usage.

---

## Data Statistics

- **Books:** 66 (39 OT + 27 NT)
- **Verses:** 124,000+
- **Versions:** 4
- **Pericopes:** 2,000+ thematic divisions
