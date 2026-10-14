import "server-only";
import { TableClient } from "@azure/data-tables";
import { LEAD_COLUMNS, type LeadRow } from "./leadRow";

// Azure Table Storage backend for leads (see the overview in ./db.ts). One
// entity per lead in the `leads` table: PartitionKey "lead", RowKey = lead_id,
// and one property per LEAD_COLUMNS entry. Table Storage doesn't store nulls,
// so null columns are simply absent and come back as null.

// LEADS_TABLE_NAME only exists to point a one-off check at a scratch table.
const TABLE_NAME = process.env.LEADS_TABLE_NAME || "leads";
const PARTITION = "lead";

export function isTableStorageConfigured(): boolean {
  return Boolean(process.env.AZURE_TABLES_CONNECTION_STRING);
}

declare global {
  // eslint-disable-next-line no-var
  var __hlrTable: Promise<TableClient> | undefined;
}

// Created once per warm instance; `createTable` is a no-op when the table
// already exists, so a fresh storage account needs no manual setup.
function getTable(): Promise<TableClient> {
  if (globalThis.__hlrTable) return globalThis.__hlrTable;

  const client = TableClient.fromConnectionString(process.env.AZURE_TABLES_CONNECTION_STRING!, TABLE_NAME);
  globalThis.__hlrTable = client.createTable().then(
    () => client,
    (error) => {
      globalThis.__hlrTable = undefined; // retry on the next request
      throw error;
    }
  );
  return globalThis.__hlrTable;
}

export async function insertTableLead(row: LeadRow): Promise<void> {
  const properties = Object.fromEntries(Object.entries(row).filter(([, value]) => value !== null));
  await (await getTable()).createEntity({ partitionKey: PARTITION, rowKey: String(row.lead_id), ...properties });
}

export async function listTableLeads(): Promise<LeadRow[]> {
  const rows: LeadRow[] = [];
  for await (const entity of (await getTable()).listEntities<Record<string, unknown>>()) {
    rows.push(
      Object.fromEntries(
        LEAD_COLUMNS.map((column) => [column, (entity[column] as string | number | undefined) ?? null])
      ) as LeadRow
    );
  }
  return rows;
}
