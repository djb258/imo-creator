import { neon } from '@neondatabase/serverless';
import type { CheckTask } from '@field-monitor/shared';

/**
 * Scheduler module — queries due tasks from Neon and builds the dispatch queue.
 *
 * Used by the GitHub Actions scheduler workflow to determine which
 * URLs need checking and optionally dispatch to the orchestrator.
 *
 * dry_run=true: builds the queue and returns it, but does NOT dispatch.
 * dry_run=false: builds the queue and dispatches each task to orchestrator.
 */

export interface SchedulerConfig {
  database_url: string;
  orchestrator_url: string;
  dry_run: boolean;
  batch_size: number;
}

export interface SchedulerResult {
  dry_run: boolean;
  tasks_due: number;
  tasks_dispatched: number;
  tasks: CheckTask[];
  errors: string[];
}

export async function runScheduler(config: SchedulerConfig): Promise<SchedulerResult> {
  const sql = neon(config.database_url);
  const errors: string[] = [];

  // Step 1: Due-ness query — find tasks that need checking
  const rows = await sql`
    SELECT
      ur.url_id, ur.domain, ur.path,
      fs.field_name, fs.field_id
    FROM field_monitor.url_registry ur
    JOIN field_monitor.field_state fs ON fs.url_id = ur.url_id
    WHERE ur.is_active = true
      AND fs.status IN ('ACTIVE', 'STALE')
      AND (
        fs.last_checked_at IS NULL
        OR fs.last_checked_at < now() - (ur.check_interval_minutes || ' minutes')::interval
      )
    ORDER BY fs.last_checked_at ASC NULLS FIRST
    LIMIT ${config.batch_size}
  `;

  const tasks: CheckTask[] = rows.map(r => ({
    url_id: r.url_id as string,
    domain: r.domain as string,
    path: r.path as string,
    field_name: r.field_name as string,
    field_id: r.field_id as string,
  }));

  // dry_run guarantee: do NOT dispatch when dry_run=true
  if (config.dry_run) {
    return {
      dry_run: true,
      tasks_due: tasks.length,
      tasks_dispatched: 0,
      tasks,
      errors: [],
    };
  }

  // Step 2: Dispatch each task to orchestrator
  let dispatched = 0;
  for (const task of tasks) {
    try {
      const resp = await fetch(`${config.orchestrator_url}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (resp.ok) {
        dispatched++;
      } else {
        errors.push(`Dispatch failed for ${task.url_id}/${task.field_name}: HTTP ${resp.status}`);
      }
    } catch (err) {
      errors.push(`Dispatch error for ${task.url_id}/${task.field_name}: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }

  return {
    dry_run: false,
    tasks_due: tasks.length,
    tasks_dispatched: dispatched,
    tasks,
    errors,
  };
}
