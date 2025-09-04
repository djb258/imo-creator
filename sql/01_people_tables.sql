-- Create people schema and tables for cold-outreach system
create schema if not exists people;

create table if not exists people.contact (
  contact_id   bigserial primary key,
  full_name    text,
  title        text,
  email        text,
  phone        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists people.contact_verification (
  contact_id        bigint primary key references people.contact on delete cascade,
  email_status      text,          -- 'green'|'yellow'|'red'|'gray'
  email_checked_at  timestamptz,
  email_confidence  int,
  email_source_url  text
);

-- Create company_slot table if not exists (for linking companies to contacts)
create table if not exists company.company_slot (
  company_slot_id  bigserial primary key,
  company_id       bigint not null references company.company on delete cascade,
  role_code        text not null, -- 'CEO'|'CFO'|'HR'
  contact_id       bigint references people.contact on delete set null,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  unique (company_id, role_code)
);

-- Create indexes for performance
create index if not exists idx_contact_email on people.contact(email);
create index if not exists idx_contact_verification_status on people.contact_verification(email_status);
create index if not exists idx_company_slot_company_role on company.company_slot(company_id, role_code);