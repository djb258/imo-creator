-- Safe update procedures for cold-outreach system
-- Atomic operations with rollback capabilities

-- Safe contact upsert with verification data
create or replace function people.upsert_contact_with_verification(
  p_full_name text,
  p_title text,
  p_email text,
  p_phone text default null,
  p_email_status text default null,
  p_email_confidence int default null,
  p_email_source_url text default null
) returns bigint as $$
declare
  v_contact_id bigint;
begin
  -- Upsert contact record
  insert into people.contact (full_name, title, email, phone, updated_at)
  values (p_full_name, p_title, p_email, p_phone, now())
  on conflict (email) 
  do update set 
    full_name = excluded.full_name,
    title = excluded.title,
    phone = coalesce(excluded.phone, people.contact.phone),
    updated_at = now()
  returning contact_id into v_contact_id;
  
  -- Upsert verification record if verification data provided
  if p_email_status is not null then
    insert into people.contact_verification (
      contact_id, email_status, email_checked_at, 
      email_confidence, email_source_url
    )
    values (
      v_contact_id, p_email_status, now(), 
      p_email_confidence, p_email_source_url
    )
    on conflict (contact_id)
    do update set
      email_status = excluded.email_status,
      email_checked_at = excluded.email_checked_at,
      email_confidence = excluded.email_confidence,
      email_source_url = excluded.email_source_url;
  end if;
  
  return v_contact_id;
end;
$$ language plpgsql;

-- Safe company slot assignment
create or replace function company.assign_contact_to_slot(
  p_company_id bigint,
  p_role_code text,
  p_contact_id bigint
) returns boolean as $$
begin
  -- Check if slot exists and is empty
  if not exists (
    select 1 from company.company_slot 
    where company_id = p_company_id 
    and role_code = p_role_code 
    and contact_id is null
  ) then
    return false;
  end if;
  
  -- Assign contact to slot
  update company.company_slot 
  set contact_id = p_contact_id, updated_at = now()
  where company_id = p_company_id 
  and role_code = p_role_code 
  and contact_id is null;
  
  return found;
end;
$$ language plpgsql;

-- Bulk update contact verification status
create or replace function people.bulk_update_verification(
  p_updates jsonb
) returns int as $$
declare
  v_updated_count int := 0;
  v_update jsonb;
begin
  -- Iterate through updates array
  for v_update in select jsonb_array_elements(p_updates)
  loop
    insert into people.contact_verification (
      contact_id,
      email_status,
      email_checked_at,
      email_confidence,
      email_source_url
    )
    values (
      (v_update->>'contact_id')::bigint,
      v_update->>'email_status',
      now(),
      (v_update->>'email_confidence')::int,
      v_update->>'email_source_url'
    )
    on conflict (contact_id)
    do update set
      email_status = excluded.email_status,
      email_checked_at = excluded.email_checked_at,
      email_confidence = excluded.email_confidence,
      email_source_url = excluded.email_source_url;
    
    v_updated_count := v_updated_count + 1;
  end loop;
  
  return v_updated_count;
end;
$$ language plpgsql;

-- Create unique constraint on email to prevent duplicates
alter table people.contact add constraint unique_email unique (email);