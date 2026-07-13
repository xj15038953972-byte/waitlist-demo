-- Remove email from User; email is collected only when joining the waitlist.
ALTER TABLE "User" DROP COLUMN IF EXISTS "email";
