/**
 * HEIR/ORBT ID Generator
 * Version: 1.0.0
 * Date: 2025-10-23
 * 
 * Generates Barton Doctrine compliant HEIR and Process IDs
 * for tracking operations across the ORBT (Operational Resource Behavior Tracking) system
 * 
 * HEIR ID Format: HEIR-YYYY-MM-SYSTEM-MODE-VN
 * Process ID Format: PRC-SYSTEM-EPOCHTIMESTAMP
 * 
 * ORBT Layers:
 * - Layer 1: Input/Intake operations
 * - Layer 2: Processing/Middle operations
 * - Layer 3: Output/Generation operations
 * - Layer 4: Orchestration/Coordination operations
 */

class HeirGenerator {
    /**
     * Generate a unique HEIR ID
     * @param {string} system - System identifier (e.g., 'IMO', 'ACTION', 'INTAKE')
     * @param {string} mode - Operation mode (e.g., 'CREATOR', 'ACTION', 'VALIDATE')
     * @param {number} version - Version number (default: 1)
     * @returns {string} HEIR ID in format HEIR-YYYY-MM-SYSTEM-MODE-VN
     */
    static generateHeirId(system, mode, version = 1) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const versionPadded = String(version).padStart(2, '0');
        
        return `HEIR-${year}-${month}-${system}-${mode}-${versionPadded}`;
    }

    /**
     * Generate a unique Process ID
     * @param {string} system - System identifier (e.g., 'IMO', 'ACTION', 'INTAKE')
     * @returns {string} Process ID in format PRC-SYSTEM-EPOCHTIMESTAMP
     */
    static generateProcessId(system) {
        const timestamp = Date.now();
        return `PRC-${system}-${timestamp}`;
    }

    /**
     * Generate a complete HEIR/ORBT payload
     * @param {string} tool - Tool name (e.g., 'apify_run_actor', 'gmail_send')
     * @param {object} data - Tool-specific data payload
     * @param {string} system - System identifier
     * @param {string} mode - Operation mode
     * @param {number} orbtLayer - ORBT layer (1-4)
     * @param {string} blueprintVersion - Blueprint version (default: '1.0')
     * @param {number} version - HEIR version number (default: 1)
     * @returns {object} Complete HEIR/ORBT payload
     */
    static generatePayload(tool, data, system, mode, orbtLayer, blueprintVersion = '1.0', version = 1) {
        // Validate ORBT layer
        if (orbtLayer < 1 || orbtLayer > 4) {
            throw new Error(`Invalid ORBT layer: ${orbtLayer}. Must be between 1 and 4.`);
        }

        return {
            tool: tool,
            data: data,
            unique_id: this.generateHeirId(system, mode, version),
            process_id: this.generateProcessId(system),
            orbt_layer: orbtLayer,
            blueprint_version: blueprintVersion
        };
    }

    /**
     * Parse a HEIR ID into its components
     * @param {string} heirId - HEIR ID to parse
     * @returns {object} Parsed components
     */
    static parseHeirId(heirId) {
        const pattern = /^HEIR-(\d{4})-(\d{2})-([A-Z]+)-([A-Z]+)-(\d{2})$/;
        const match = heirId.match(pattern);

        if (!match) {
            throw new Error(`Invalid HEIR ID format: ${heirId}`);
        }

        return {
            year: match[1],
            month: match[2],
            system: match[3],
            mode: match[4],
            version: parseInt(match[5], 10)
        };
    }

    /**
     * Parse a Process ID into its components
     * @param {string} processId - Process ID to parse
     * @returns {object} Parsed components
     */
    static parseProcessId(processId) {
        const pattern = /^PRC-([A-Z]+)-(\d+)$/;
        const match = processId.match(pattern);

        if (!match) {
            throw new Error(`Invalid Process ID format: ${processId}`);
        }

        return {
            system: match[1],
            timestamp: parseInt(match[2], 10),
            date: new Date(parseInt(match[2], 10))
        };
    }

    /**
     * Validate a HEIR/ORBT payload
     * @param {object} payload - Payload to validate
     * @returns {boolean} True if valid, throws error otherwise
     */
    static validatePayload(payload) {
        const required = ['tool', 'data', 'unique_id', 'process_id', 'orbt_layer', 'blueprint_version'];
        
        for (const field of required) {
            if (!(field in payload)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate HEIR ID format
        this.parseHeirId(payload.unique_id);

        // Validate Process ID format
        this.parseProcessId(payload.process_id);

        // Validate ORBT layer
        if (payload.orbt_layer < 1 || payload.orbt_layer > 4) {
            throw new Error(`Invalid ORBT layer: ${payload.orbt_layer}`);
        }

        return true;
    }

    /**
     * Get ORBT layer description
     * @param {number} layer - ORBT layer number (1-4)
     * @returns {string} Layer description
     */
    static getOrbtLayerDescription(layer) {
        const descriptions = {
            1: 'Input/Intake - Data ingestion and validation',
            2: 'Processing/Middle - Data transformation and enrichment',
            3: 'Output/Generation - Result creation and formatting',
            4: 'Orchestration/Coordination - System-level coordination'
        };

        return descriptions[layer] || 'Unknown layer';
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeirGenerator;
}

// Example usage:
/*
const HeirGenerator = require('./heir-generator');

// Generate a simple HEIR ID
const heirId = HeirGenerator.generateHeirId('IMO', 'CREATOR', 1);
console.log(heirId); // HEIR-2025-10-IMO-CREATOR-01

// Generate a Process ID
const processId = HeirGenerator.generateProcessId('IMO');
console.log(processId); // PRC-IMO-1729651200000

// Generate a complete payload
const payload = HeirGenerator.generatePayload(
    'apify_run_actor',
    { actorId: 'apify~leads-finder', runInput: { query: 'test' } },
    'IMO',
    'ACTION',
    2,
    '1.0',
    1
);
console.log(JSON.stringify(payload, null, 2));

// Validate payload
try {
    HeirGenerator.validatePayload(payload);
    console.log('✅ Payload is valid');
} catch (error) {
    console.error('❌ Payload validation failed:', error.message);
}
*/
