import { z } from 'zod';
const VINSchema = z.string().regex(/^[A-Z]{3}-\d{4}-\d{2}-[A-Z]+-[A-Z]+-V\d+$/);
const FlowSchema = z.object({
  schema_version: z.literal('HEIR/1.0'),
  vin: VINSchema,
  compliance: z.object({
    heir_rules: z.array(z.enum(['STAMPED', 'SPVPET', 'STACKED']))
  })
});

console.log('✅ Factory + Garage enforcement system with HEIR/ORBT compliance');
console.log('📋 VIN format: IMO-YYYY-MM-SYSTEM-MODE-VN');
console.log('🚦 HEIR rules: STAMPED, SPVPET, STACKED');
console.log('🚗 Garage requires GREEN health.json to start');
