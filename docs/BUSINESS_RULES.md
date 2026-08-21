# Whoosh Streaming — Business Rules

## BR-001
Only authenticated users can manage their watchlist.

## BR-002
Only authenticated users can rate movies. One rating per user per movie.

## BR-003
Only admin users can create, edit, or delete movies.

## BR-004
Only admin users can toggle a movie's featured status.

## BR-005
Only admin users can manage other users (view list, change role/plan, delete).

## BR-006
An admin cannot delete their own account.

## BR-007
Movie ratings are aggregated in real-time: average and per-star breakdown are recalculated on every rate/unrate.

## BR-008
Watch progress is marked "completed" when progressPercent >= 95%. Completed items don't appear in continue-watching.

## BR-009
Users can only update whitelisted profile fields: name, avatar, preferredQuality, preferredAudio, preferredSubtitle, autoplayNext. Users cannot change their own role or plan.

## BR-010
Movie slugs are immutable after creation to prevent breaking cross-references.

## BR-011
Duplicate watchlist entries are prevented by unique compound index (userId + movieSlug).

## BR-012
Admin operations (user update, user delete) are automatically logged to audit trail.

## BR-013
Free content (accessLevel: 'free') is publicly browsable. Premium content metadata is public, but playback access would be gated by subscription (enforcement is frontend-side for now).
