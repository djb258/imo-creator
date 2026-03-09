export type Tier = 'Garage' | 'Car' | 'Sub-Hub';
export type ImplStatus = 'ACTIVE' | 'IN_PROGRESS' | 'SKELETON' | 'PLANNED';
export type DocStatus = 'PRESENT' | 'MISSING';
export type WPStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETE';
export type Priority = 'CRITICAL' | 'HIGH' | 'NORMAL';

export type PipelineStage =
  | 'PLANNER'
  | 'FREEZE'
  | 'BUILDER'
  | 'AUDITOR'
  | 'GATE'
  | 'MERGE';

export interface FleetRepo {
  name: string;
  path: string;
  purpose: string;
  tier: Tier;
  doctrineVersion: string;
  syncStatus: string;
  status: ImplStatus;
  docs: DocItem[];
  subHubs?: SubHub[];
  workPackets: WorkPacket[];
  todos: TodoItem[];
}

export interface SubHub {
  id: string;
  name: string;
  driver: string;
  layer: 'External' | 'Cloudflare';
  status: ImplStatus;
  action?: string;
  errorTable: string;
  description: string;
  doesNot: string;
  interfaces?: { in?: string; out?: string };
  v2Concerns?: string[];
}

export interface DocItem {
  file: string;
  status: DocStatus;
  template?: string;
  /** Owning repo — used by process docs that span multiple repos */
  repo?: string;
}

export interface WorkPacket {
  id: string;
  title: string;
  repo: string;
  status: WPStatus;
  agent?: string;
  currentPhase?: string;
  pipelineStage?: PipelineStage;
  createdAt: string;
  updatedAt: string;
}

export interface TodoItem {
  id: string;
  text: string;
  priority: Priority;
  done: boolean;
}

export type ORBTMode = 'OPERATE' | 'REPAIR' | 'BUILD' | 'TROUBLESHOOT';
export type HealthStatus = 'GREEN' | 'YELLOW' | 'RED';

export interface ProcessHEIR {
  repos: string[];
  subHubs?: string[];
  tools?: string[];
  services?: string[];
  skills?: string[];
}

export interface ProcessIMO {
  ingress: { trigger: string; schema: string };
  middle: { steps: string[]; decisions: string[]; stateTables: string[] };
  egress: { outputs: string[]; consumers: string[] };
}

export interface ProcessERDTable {
  table: string;
  repo: string;
  access: 'READ' | 'WRITE' | 'READ/WRITE';
  order: number;
}

export interface ProcessORBT {
  mode: ORBTMode;
  health: HealthStatus;
  notes?: string;
}

export interface ProcessCTB {
  canonicalTables: string[];
  errorTables: string[];
  promotionPath: string[];
}

export interface Process {
  id: string;
  name: string;
  shortName: string;
  description: string;
  status: ImplStatus;
  docs: DocItem[];
  heir: ProcessHEIR;
  imo: ProcessIMO;
  erd: { tables: ProcessERDTable[] };
  orbt: ProcessORBT;
  ctb: ProcessCTB;
}

export interface AgentEntry {
  id: string;
  repo: string;
  workPacket: string;
  currentPhase: string;
  status: string;
  lastUpdate: string;
}

export interface AgentStatus {
  lastUpdated: string;
  agents: AgentEntry[];
}
