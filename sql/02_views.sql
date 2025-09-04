-- Create views for cold-outreach system
-- Convenient access to contact data with company and verification info

-- Full contact view with company and verification details
create or replace view people.contact_full as
select 
  c.contact_id,
  c.full_name,
  c.title,
  c.email,
  c.phone,
  c.created_at,
  c.updated_at,
  cv.email_status,
  cv.email_checked_at,
  cv.email_confidence,
  cv.email_source_url,
  cs.company_id,
  cs.role_code,
  cs.company_slot_id
from people.contact c
left join people.contact_verification cv on c.contact_id = cv.contact_id
left join company.company_slot cs on c.contact_id = cs.contact_id;

-- Available company slots (empty positions)
create or replace view company.available_slots as
select 
  cs.company_slot_id,
  cs.company_id,
  cs.role_code,
  cs.created_at,
  cs.updated_at
from company.company_slot cs
where cs.contact_id is null;

-- Verified contacts by status
create or replace view people.verified_contacts as
select 
  c.contact_id,
  c.full_name,
  c.title,
  c.email,
  c.phone,
  cv.email_status,
  cv.email_confidence,
  cv.email_checked_at
from people.contact c
inner join people.contact_verification cv on c.contact_id = cv.contact_id
where cv.email_status in ('green', 'yellow')
order by 
  case cv.email_status 
    when 'green' then 1 
    when 'yellow' then 2 
  end,
  cv.email_confidence desc;

-- Contacts needing verification
create or replace view people.unverified_contacts as
select 
  c.contact_id,
  c.full_name,
  c.email,
  c.created_at
from people.contact c
left join people.contact_verification cv on c.contact_id = cv.contact_id
where cv.contact_id is null or cv.email_status is null
order by c.created_at desc;