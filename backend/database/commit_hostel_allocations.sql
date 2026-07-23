-- Run this once in the Supabase SQL editor before deploying the allocation API.
-- The function serialises one academic-group allocation and commits allocation rows
-- plus student status changes in the same PostgreSQL transaction.

alter table public.students
  add column if not exists is_pwd boolean not null default false,
  add column if not exists is_defence boolean not null default false;

alter table public.firstyear_students
  add column if not exists is_pwd boolean not null default false,
  add column if not exists is_defence boolean not null default false;

alter table public.allocations
  add column if not exists allocation_type text not null default 'REGULAR';

create unique index if not exists allocations_one_result_per_student
  on public.allocations (academic_year, course, year, student_table, student_id);

create or replace function public.commit_hostel_allocations(
  p_academic_year text,
  p_course text,
  p_year text,
  p_student_table text,
  p_allocations jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requested_count integer;
  v_eligible_count integer;
begin
  if p_student_table not in ('students', 'firstyear_students') then
    raise exception 'Invalid student table';
  end if;
  if jsonb_typeof(p_allocations) <> 'array' or jsonb_array_length(p_allocations) = 0 then
    raise exception 'At least one allocation is required';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    concat_ws('|', p_academic_year, p_course, p_year), 0
  ));

  if exists (
    select 1 from allocations
    where academic_year = p_academic_year and course = p_course and year = p_year
  ) then
    raise exception 'Allocation already exists for this academic group';
  end if;

  select jsonb_array_length(p_allocations) into v_requested_count;
  execute format($query$
    with eligible as (
      select s.id
      from %I s
      join jsonb_to_recordset($1) as r(student_id bigint, branch_id bigint, category_id bigint, allocation_type text)
        on r.student_id = s.id and r.branch_id = s.branch_id
      where s.academic_year = $2
        and s.course = $3
        and s.year_of_study = $4
        and s.is_hostelite = false
      for update of s
    )
    select count(*) from eligible
  $query$, p_student_table)
  into v_eligible_count
  using p_allocations, p_academic_year, p_course, p_year;

  if v_eligible_count <> v_requested_count then
    raise exception 'One or more selected students are no longer eligible';
  end if;

  insert into allocations (student_id, student_table, branch_id, category_id, allocation_type, academic_year, course, year)
  select r.student_id, p_student_table, r.branch_id, r.category_id, coalesce(r.allocation_type, 'REGULAR'), p_academic_year, p_course, p_year
  from jsonb_to_recordset(p_allocations) as r(student_id bigint, branch_id bigint, category_id bigint, allocation_type text);

  execute format($query$
    update %I s
    set is_hostelite = true
    from jsonb_to_recordset($1) as r(student_id bigint)
    where s.id = r.student_id
  $query$, p_student_table)
  using p_allocations;

  return jsonb_build_object('allocated_count', v_requested_count);
end;
$$;
