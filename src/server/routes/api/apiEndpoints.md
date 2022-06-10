# API Endpoints

Splits into 2 types:

-   public
-   protected

## File Structure

-   `api.ts` is top of the hierarchy of all the api routes. It is used in `server.ts` to mount the whole api route.

-   Any router files that are not inside of a folder are public. (except `api.ts`)

-   `auth` folder strictly handles all authentications and is public.

-   `resource` folder strictly handles all resource delivery and is protected. Requests without a valid access token will be rejected.
