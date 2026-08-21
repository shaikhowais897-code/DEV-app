# Whoosh Streaming — Database

## Collections

### users
| Field | Type | Required | Unique | Default |
|-------|------|----------|--------|---------|
| name | String | Yes | No | — |
| email | String | Yes | Yes | — |
| passwordHash | String | Yes | No | — (hashed) |
| role | String (enum) | No | No | 'user' |
| avatar | String | No | No | '' |
| plan | String (enum) | No | No | 'Free' |
| billingStatus | String (enum) | No | No | 'Trial' |
| preferredQuality | String (enum) | No | No | 'Auto' |
| preferredAudio | String | No | No | 'English' |
| preferredSubtitle | String | No | No | 'English' |
| autoplayNext | Boolean | No | No | true |
| refreshToken | String | No | No | — (select: false) |

**Indexes**: email (unique), role

### movies
| Field | Type | Required | Unique |
|-------|------|----------|--------|
| slug | String | Yes | Yes |
| title | String | Yes | No |
| contentType | String (enum) | No | No |
| synopsis | String | Yes | No |
| year | Number | Yes | No |
| duration | String | Yes | No |
| durationSeconds | Number | Yes | No |
| rating | Number | No | No |
| genre | [String] | Yes | No |
| badges | [String] | No | No |
| accessLevel | String (enum) | No | No |
| isFeatured | Boolean | No | No |
| cast | [{ name, role, avatar }] | No | No |
| relatedSlugs | [String] | No | No |

**Indexes**: slug (unique), genre, accessLevel, isFeatured, rating, year, text(title+synopsis+director)

### watchlists
| Field | Type | Required |
|-------|------|----------|
| userId | ObjectId (ref User) | Yes |
| movieSlug | String | Yes |

**Indexes**: (userId, movieSlug) unique compound, (userId, createdAt) for listing

### ratings
| Field | Type | Required |
|-------|------|----------|
| userId | ObjectId (ref User) | Yes |
| movieSlug | String | Yes |
| rating | Number (1-5) | Yes |

**Indexes**: (userId, movieSlug) unique compound, movieSlug for aggregation

### watchprogresses
| Field | Type | Required |
|-------|------|----------|
| userId | ObjectId (ref User) | Yes |
| movieSlug | String | Yes |
| progressPercent | Number (0-100) | Yes |
| lastPositionSeconds | Number | No |
| completed | Boolean | No |

**Indexes**: (userId, movieSlug) unique compound, (userId, updatedAt) for continue-watching

### auditlogs
| Field | Type | Required |
|-------|------|----------|
| actor | String | Yes |
| action | String | Yes |
| target | String | No |
| details | String | No |
| status | String (enum) | No |
| ip | String | No |

**Indexes**: createdAt, actor, action
