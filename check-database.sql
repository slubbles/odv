-- Check your specific project
SELECT 
  id,
  title,
  status,
  creator_wallet,
  campaign_id,
  campaign_pda,
  initialize_tx,
  created_at
FROM projects 
WHERE id = 'f08c223a-bbb4-4c45-9ecf-9d8f6d71fa7b';

-- Expected results:
-- campaign_id should be: 4
-- campaign_pda should be: 2evNg9hPQbQX7FzGj9eZgWMXe3VwRZSYnmfAhj6X85fs
-- If campaign_pda is different, that's the problem!
