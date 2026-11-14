-- Remove the temporary asynchronous HTTP extension used for failed Edge import attempts.
delete from private.transit_import_tokens;
drop extension if exists pg_net;
