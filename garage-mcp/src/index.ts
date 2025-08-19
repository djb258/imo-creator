#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Vehicle and maintenance data types
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  lastService?: string;
  nextService?: string;
}

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  cost?: number;
  mileage: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  price?: number;
}

// In-memory storage (in a real implementation, this would be persistent)
const vehicles: Vehicle[] = [];
const maintenanceRecords: MaintenanceRecord[] = [];
const inventory: InventoryItem[] = [];

const server = new Server(
  {
    name: 'garage-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'add_vehicle',
        description: 'Add a new vehicle to the garage',
        inputSchema: {
          type: 'object',
          properties: {
            make: { type: 'string', description: 'Vehicle make' },
            model: { type: 'string', description: 'Vehicle model' },
            year: { type: 'number', description: 'Vehicle year' },
            vin: { type: 'string', description: 'Vehicle identification number' },
            mileage: { type: 'number', description: 'Current mileage' },
          },
          required: ['make', 'model', 'year', 'mileage'],
        },
      },
      {
        name: 'list_vehicles',
        description: 'List all vehicles in the garage',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'add_maintenance_record',
        description: 'Add a maintenance record for a vehicle',
        inputSchema: {
          type: 'object',
          properties: {
            vehicleId: { type: 'string', description: 'Vehicle ID' },
            type: { type: 'string', description: 'Type of maintenance (oil change, tire rotation, etc.)' },
            description: { type: 'string', description: 'Detailed description of work performed' },
            cost: { type: 'number', description: 'Cost of maintenance' },
            mileage: { type: 'number', description: 'Vehicle mileage at time of service' },
          },
          required: ['vehicleId', 'type', 'description', 'mileage'],
        },
      },
      {
        name: 'get_maintenance_history',
        description: 'Get maintenance history for a vehicle',
        inputSchema: {
          type: 'object',
          properties: {
            vehicleId: { type: 'string', description: 'Vehicle ID' },
          },
          required: ['vehicleId'],
        },
      },
      {
        name: 'add_inventory_item',
        description: 'Add an item to garage inventory',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Item name' },
            category: { type: 'string', description: 'Item category (tools, parts, supplies, etc.)' },
            quantity: { type: 'number', description: 'Quantity in stock' },
            location: { type: 'string', description: 'Storage location in garage' },
            price: { type: 'number', description: 'Item price' },
          },
          required: ['name', 'category', 'quantity', 'location'],
        },
      },
      {
        name: 'list_inventory',
        description: 'List all items in garage inventory',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Filter by category (optional)' },
          },
        },
      },
      {
        name: 'update_inventory_quantity',
        description: 'Update the quantity of an inventory item',
        inputSchema: {
          type: 'object',
          properties: {
            itemId: { type: 'string', description: 'Item ID' },
            quantity: { type: 'number', description: 'New quantity' },
          },
          required: ['itemId', 'quantity'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'add_vehicle': {
        const vehicle: Vehicle = {
          id: `vehicle_${Date.now()}`,
          make: args.make,
          model: args.model,
          year: args.year,
          vin: args.vin,
          mileage: args.mileage,
        };
        vehicles.push(vehicle);
        return {
          content: [
            {
              type: 'text',
              text: `Added vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} (ID: ${vehicle.id})`,
            },
          ],
        };
      }

      case 'list_vehicles': {
        if (vehicles.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No vehicles in garage.',
              },
            ],
          };
        }
        
        const vehicleList = vehicles
          .map(v => `${v.id}: ${v.year} ${v.make} ${v.model} - ${v.mileage} miles${v.vin ? ` (VIN: ${v.vin})` : ''}`)
          .join('\n');
        
        return {
          content: [
            {
              type: 'text',
              text: `Vehicles in garage:\n${vehicleList}`,
            },
          ],
        };
      }

      case 'add_maintenance_record': {
        const vehicle = vehicles.find(v => v.id === args.vehicleId);
        if (!vehicle) {
          throw new McpError(ErrorCode.InvalidParams, `Vehicle with ID ${args.vehicleId} not found`);
        }

        const record: MaintenanceRecord = {
          id: `maintenance_${Date.now()}`,
          vehicleId: args.vehicleId,
          date: new Date().toISOString().split('T')[0],
          type: args.type,
          description: args.description,
          cost: args.cost,
          mileage: args.mileage,
        };
        
        maintenanceRecords.push(record);
        
        // Update vehicle mileage if this is higher
        if (args.mileage > vehicle.mileage) {
          vehicle.mileage = args.mileage;
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Added maintenance record for ${vehicle.year} ${vehicle.make} ${vehicle.model}: ${record.type} at ${record.mileage} miles${record.cost ? ` ($${record.cost})` : ''}`,
            },
          ],
        };
      }

      case 'get_maintenance_history': {
        const vehicle = vehicles.find(v => v.id === args.vehicleId);
        if (!vehicle) {
          throw new McpError(ErrorCode.InvalidParams, `Vehicle with ID ${args.vehicleId} not found`);
        }

        const records = maintenanceRecords
          .filter(r => r.vehicleId === args.vehicleId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (records.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No maintenance records found for ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
              },
            ],
          };
        }

        const historyText = records
          .map(r => `${r.date} - ${r.type} at ${r.mileage} miles${r.cost ? ` ($${r.cost})` : ''}\n  ${r.description}`)
          .join('\n\n');

        return {
          content: [
            {
              type: 'text',
              text: `Maintenance history for ${vehicle.year} ${vehicle.make} ${vehicle.model}:\n\n${historyText}`,
            },
          ],
        };
      }

      case 'add_inventory_item': {
        const item: InventoryItem = {
          id: `item_${Date.now()}`,
          name: args.name,
          category: args.category,
          quantity: args.quantity,
          location: args.location,
          price: args.price,
        };
        inventory.push(item);
        
        return {
          content: [
            {
              type: 'text',
              text: `Added to inventory: ${item.name} (${item.quantity} units) in ${item.location}`,
            },
          ],
        };
      }

      case 'list_inventory': {
        let items = inventory;
        if (args.category) {
          items = inventory.filter(item => 
            item.category.toLowerCase().includes(args.category.toLowerCase())
          );
        }

        if (items.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: args.category 
                  ? `No inventory items found in category: ${args.category}`
                  : 'No items in inventory.',
              },
            ],
          };
        }

        const itemList = items
          .map(item => `${item.id}: ${item.name} (${item.category}) - ${item.quantity} units @ ${item.location}${item.price ? ` - $${item.price}` : ''}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `Inventory${args.category ? ` (${args.category})` : ''}:\n${itemList}`,
            },
          ],
        };
      }

      case 'update_inventory_quantity': {
        const item = inventory.find(i => i.id === args.itemId);
        if (!item) {
          throw new McpError(ErrorCode.InvalidParams, `Item with ID ${args.itemId} not found`);
        }

        const oldQuantity = item.quantity;
        item.quantity = args.quantity;

        return {
          content: [
            {
              type: 'text',
              text: `Updated ${item.name} quantity from ${oldQuantity} to ${args.quantity} units`,
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Garage MCP server running on stdio');
}

main().catch(console.error);
