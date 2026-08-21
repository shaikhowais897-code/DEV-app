# Whoosh Streaming — Validation Rules

## Auth: Register
| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| name | Yes | string | max 100 chars |
| email | Yes | string | valid email format |
| password | Yes | string | min 8 chars |
| plan | No | string | Free, Premium 4K HDR, Family VIP |

## Auth: Login
| Field | Required | Constraints |
|-------|----------|-------------|
| email | Yes | valid email |
| password | Yes | not empty |

## Auth: Profile Update
| Field | Required | Constraints |
|-------|----------|-------------|
| name | No | 1-100 chars |
| preferredQuality | No | Auto, 4K, 1080p, 720p |
| preferredAudio | No | max 100 chars |
| preferredSubtitle | No | max 100 chars |
| autoplayNext | No | boolean |

## Movie: Create
| Field | Required | Constraints |
|-------|----------|-------------|
| title | Yes | max 200 chars |
| synopsis | Yes | max 2000 chars |
| year | Yes | 1900-2100 |
| duration | Yes | not empty |
| durationSeconds | Yes | positive integer |
| genre | Yes | array, min 1 |
| director | Yes | not empty |
| accessLevel | No | free, premium |
| contentType | No | movie, series, anime, documentary |

## Rating
| Field | Required | Constraints |
|-------|----------|-------------|
| rating | Yes | integer 1-5 |

## Watch Progress
| Field | Required | Constraints |
|-------|----------|-------------|
| progressPercent | Yes | float 0-100 |
| lastPositionSeconds | No | positive integer |
