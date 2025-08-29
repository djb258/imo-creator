#!/usr/bin/env node

/**
 * MCP Doctrine Layer - Pre-Commit Validation Hook
 * Classification: System-Critical Infrastructure  
 * Compliance: HEIR Doctrine v2.1 + ORBT Policy Framework v3.2
 * Purpose: Enforce MCP tool compliance before code commits
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

class MCPDoctrinePreCommitValidator {
    constructor() {
        this.violations = [];
        this.config = this.loadConfig();
        this.heirRegex = /^HEIR-[0-9]{4}-[0-9]{2}-[A-Z]{3,8}-[A-Z]{2,6}-[0-9]{2}$/;
        this.processIdRegex = /^PRC-[A-Z0-9]{8}-[0-9]{13}$/;
    }

    loadConfig() {
        const configPath = path.join(process.cwd(), 'mcp-doctrine-layer', 'config', 'enforcement.json');
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        
        // Default enforcement config
        return {
            enforce_heir_compliance: true,
            enforce_orbt_validation: true,
            enforce_tool_manifests: true,
            require_unique_id_in_commits: true,
            allow_emergency_bypass: true,
            bypass_env_var: 'MCP_DOCTRINE_BYPASS',
            max_orbt_layer_without_approval: 4,
            required_fields: ['unique_id', 'process_id', 'orbt_layer', 'blueprint_version']
        };
    }

    async validate() {
        console.log('🔒 MCP Doctrine Layer - Pre-Commit Validation Starting...');
        
        // Check for emergency bypass
        if (this.checkEmergencyBypass()) {
            console.log('⚠️  EMERGENCY BYPASS ACTIVATED - Doctrine validation skipped');
            console.log('📋 Post-commit mortem documentation REQUIRED within 24 hours');
            return { success: true, bypass: true };
        }

        try {
            // Get list of staged files
            const stagedFiles = this.getStagedFiles();
            console.log(`📋 Validating ${stagedFiles.length} staged files...`);

            // Validate each type of change
            await this.validateMCPToolFiles(stagedFiles);
            await this.validateCommitMessage();
            await this.validateHEIRCompliance(stagedFiles);
            await this.validateORBTAuthorization(stagedFiles);
            await this.validateToolManifests(stagedFiles);
            await this.validateProcessLineage(stagedFiles);

            if (this.violations.length > 0) {
                this.printViolations();
                return { success: false, violations: this.violations };
            }

            console.log('✅ All MCP Doctrine Layer validations passed');
            return { success: true, violations: [] };

        } catch (error) {
            console.error('❌ MCP Doctrine validation failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    checkEmergencyBypass() {
        const bypassValue = process.env[this.config.bypass_env_var];
        const validBypassReasons = ['PRODUCTION_INCIDENT', 'SECURITY_PATCH', 'ROLLBACK_EMERGENCY'];
        
        if (bypassValue && validBypassReasons.includes(bypassValue.toUpperCase())) {
            // Log bypass usage
            this.logBypassUsage(bypassValue);
            return true;
        }
        return false;
    }

    getStagedFiles() {
        try {
            const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
            return output.trim().split('\n').filter(file => file);
        } catch (error) {
            throw new Error('Failed to get staged files from git');
        }
    }

    async validateMCPToolFiles(stagedFiles) {
        const mcpFiles = stagedFiles.filter(file => 
            file.includes('mcp') || 
            file.includes('tool') ||
            file.endsWith('.mcp.js') ||
            file.endsWith('.mcp.ts')
        );

        for (const file of mcpFiles) {
            await this.validateMCPFile(file);
        }
    }

    async validateMCPFile(filePath) {
        if (!fs.existsSync(filePath)) {
            return; // File deleted, skip validation
        }

        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for required HEIR/ORBT imports
        if (!content.includes('MantisLogger') && !content.includes('mantis')) {
            this.addViolation('MISSING_MANTIS_LOGGING', filePath, 
                'MCP tool files must import and use Mantis logging system');
        }

        // Check for HEIR unique ID usage
        if (!this.heirRegex.test(content) && !content.includes('generateSystemUniqueId')) {
            this.addViolation('MISSING_HEIR_ID', filePath,
                'MCP tool must generate or validate HEIR unique IDs');
        }

        // Check for ORBT layer specification
        if (!content.includes('orbt_layer') && !content.includes('orbtLayer')) {
            this.addViolation('MISSING_ORBT_LAYER', filePath,
                'MCP tool must specify ORBT layer for authorization');
        }

        // Check for required validation functions
        const requiredFunctions = ['validateHEIRCompliance', 'validateORBTAuthorization'];
        for (const func of requiredFunctions) {
            if (!content.includes(func)) {
                this.addViolation('MISSING_VALIDATION_FUNCTION', filePath,
                    `Missing required validation function: ${func}`);
            }
        }

        // Check for security violations
        const forbiddenPatterns = [
            { pattern: /process\.env\.[A-Z_]*SECRET/gi, reason: 'Hardcoded secret access detected' },
            { pattern: /password\s*=\s*["'][^"']+["']/gi, reason: 'Hardcoded password detected' },
            { pattern: /api[_-]?key\s*=\s*["'][^"']+["']/gi, reason: 'Hardcoded API key detected' },
            { pattern: /DROP\s+TABLE|DELETE\s+FROM.*WHERE\s+1=1/gi, reason: 'Dangerous SQL pattern detected' }
        ];

        for (const { pattern, reason } of forbiddenPatterns) {
            if (pattern.test(content)) {
                this.addViolation('SECURITY_VIOLATION', filePath, reason);
            }
        }
    }

    async validateCommitMessage() {
        if (!this.config.require_unique_id_in_commits) {
            return;
        }

        try {
            // Get the commit message from git (staged commit)
            const commitMsg = execSync('git log --format=%B -n 1 HEAD', { encoding: 'utf8' }).trim();
            
            // Check for HEIR unique ID in commit message
            if (!this.heirRegex.test(commitMsg) && !commitMsg.includes('SYSTEM-')) {
                this.addViolation('MISSING_HEIR_ID_IN_COMMIT', 'commit-message',
                    'Commit message must include a valid HEIR unique ID or SYSTEM- prefix for automated commits');
            }

            // Check for ORBT layer justification in significant changes
            const changedFiles = this.getStagedFiles();
            if (changedFiles.length > 5 && !commitMsg.includes('ORBT-') && !commitMsg.includes('Layer')) {
                this.addViolation('MISSING_ORBT_JUSTIFICATION', 'commit-message',
                    'Large commits (>5 files) must include ORBT layer justification');
            }

        } catch (error) {
            // If no commits yet, skip this validation
            if (!error.message.includes('bad default revision')) {
                throw error;
            }
        }
    }

    async validateHEIRCompliance(stagedFiles) {
        // Check for HEIR unique ID registry updates
        const registryFiles = stagedFiles.filter(file => 
            file.includes('heir') || file.includes('unique_id') || file.includes('registry')
        );

        for (const file of registryFiles) {
            if (!fs.existsSync(file)) continue;
            
            const content = fs.readFileSync(file, 'utf8');
            
            // Validate HEIR ID format consistency
            const heirMatches = content.match(this.heirRegex);
            if (heirMatches) {
                for (const heirId of heirMatches) {
                    if (!this.validateHEIRIdStructure(heirId)) {
                        this.addViolation('INVALID_HEIR_ID_FORMAT', file,
                            `Invalid HEIR ID format: ${heirId}`);
                    }
                }
            }
        }
    }

    validateHEIRIdStructure(heirId) {
        const parts = heirId.split('-');
        if (parts.length !== 6) return false;
        
        const [prefix, year, month, system, mode, version] = parts;
        
        // Validate year (2024-2030)
        const yearNum = parseInt(year);
        if (yearNum < 2024 || yearNum > 2030) return false;
        
        // Validate month (01-12)
        const monthNum = parseInt(month);
        if (monthNum < 1 || monthNum > 12) return false;
        
        // Validate version number (01-99)
        const versionNum = parseInt(version);
        if (versionNum < 1 || versionNum > 99) return false;
        
        return true;
    }

    async validateORBTAuthorization(stagedFiles) {
        const orbtFiles = stagedFiles.filter(file => 
            file.includes('orbt') || file.includes('authorization') || file.includes('layer')
        );

        for (const file of orbtFiles) {
            if (!fs.existsSync(file)) continue;
            
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for ORBT layer escalation patterns
            const layerMatches = content.match(/orbt[_-]?layer["\s:]*([1-7])/gi);
            if (layerMatches) {
                for (const match of layerMatches) {
                    const layer = parseInt(match.match(/\d/)[0]);
                    if (layer <= this.config.max_orbt_layer_without_approval) {
                        // Check if this requires approval
                        if (!content.includes('approval') && !content.includes('escalation')) {
                            this.addViolation('MISSING_ORBT_APPROVAL', file,
                                `ORBT Layer ${layer} operations require approval documentation`);
                        }
                    }
                }
            }
        }
    }

    async validateToolManifests(stagedFiles) {
        const manifestFiles = stagedFiles.filter(file => 
            file.includes('manifest') || file.includes('tool') && file.endsWith('.json')
        );

        for (const file of manifestFiles) {
            if (!fs.existsSync(file)) continue;
            
            try {
                const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
                
                // Validate required fields
                for (const field of this.config.required_fields) {
                    if (!this.hasNestedField(manifest, field)) {
                        this.addViolation('MISSING_REQUIRED_FIELD', file,
                            `Tool manifest missing required field: ${field}`);
                    }
                }

                // Validate ORBT layer range
                if (manifest.orbt_layer_range) {
                    const { minimum, maximum } = manifest.orbt_layer_range;
                    if (minimum < 1 || maximum > 7 || minimum > maximum) {
                        this.addViolation('INVALID_ORBT_RANGE', file,
                            'ORBT layer range must be valid (1-7) with minimum <= maximum');
                    }
                }

                // Validate security profile
                if (!manifest.security_profile || !manifest.security_profile.risk_level) {
                    this.addViolation('MISSING_SECURITY_PROFILE', file,
                        'Tool manifest must include security profile with risk level');
                }

            } catch (error) {
                this.addViolation('INVALID_JSON', file,
                    'Tool manifest contains invalid JSON');
            }
        }
    }

    async validateProcessLineage(stagedFiles) {
        // Check for process ID generation and lineage tracking
        const codeFiles = stagedFiles.filter(file => 
            file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.py')
        );

        for (const file of codeFiles) {
            if (!fs.existsSync(file)) continue;
            
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for process ID generation without lineage tracking
            if (content.includes('generateProcessId') || content.includes('process_id')) {
                if (!content.includes('lineage') && !content.includes('parent')) {
                    this.addViolation('MISSING_LINEAGE_TRACKING', file,
                        'Process ID generation must include lineage tracking');
                }
            }

            // Check for proper process termination
            if (content.includes('terminateProcess') || content.includes('killProcess')) {
                if (!content.includes('auditTrail') && !content.includes('cleanup')) {
                    this.addViolation('IMPROPER_PROCESS_TERMINATION', file,
                        'Process termination must include audit trail and cleanup');
                }
            }
        }
    }

    hasNestedField(obj, fieldPath) {
        const keys = fieldPath.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return false;
            }
        }
        
        return true;
    }

    addViolation(code, file, message) {
        this.violations.push({
            code,
            file,
            message,
            timestamp: new Date().toISOString(),
            severity: this.getViolationSeverity(code)
        });
    }

    getViolationSeverity(code) {
        const severityMap = {
            'SECURITY_VIOLATION': 'CRITICAL',
            'MISSING_HEIR_ID': 'HIGH',
            'MISSING_ORBT_LAYER': 'HIGH',
            'INVALID_ORBT_RANGE': 'HIGH',
            'MISSING_LINEAGE_TRACKING': 'MODERATE',
            'MISSING_MANTIS_LOGGING': 'MODERATE',
            'MISSING_VALIDATION_FUNCTION': 'MODERATE',
            'INVALID_JSON': 'LOW'
        };
        
        return severityMap[code] || 'LOW';
    }

    printViolations() {
        console.log('\n❌ MCP DOCTRINE LAYER VIOLATIONS DETECTED:');
        console.log('=' * 60);
        
        const groupedViolations = this.groupViolationsBySeverity();
        
        for (const severity of ['CRITICAL', 'HIGH', 'MODERATE', 'LOW']) {
            const violations = groupedViolations[severity];
            if (violations && violations.length > 0) {
                console.log(`\n🚨 ${severity} VIOLATIONS (${violations.length}):`);
                
                for (const violation of violations) {
                    console.log(`  📄 ${violation.file}`);
                    console.log(`     ${violation.code}: ${violation.message}`);
                }
            }
        }
        
        console.log('\n📋 REMEDIATION STEPS:');
        console.log('1. Fix all CRITICAL and HIGH violations before committing');
        console.log('2. Review MCP Doctrine Layer documentation: mcp-doctrine-layer/README.md');
        console.log('3. Run: npm run mcp-validate to re-check compliance');
        console.log('4. For emergency bypass: export MCP_DOCTRINE_BYPASS=PRODUCTION_INCIDENT');
        console.log('\n⚠️  Violations logged to Mantis audit system');
    }

    groupViolationsBySeverity() {
        return this.violations.reduce((groups, violation) => {
            const severity = violation.severity;
            if (!groups[severity]) groups[severity] = [];
            groups[severity].push(violation);
            return groups;
        }, {});
    }

    logBypassUsage(reason) {
        const bypassLog = {
            timestamp: new Date().toISOString(),
            bypass_reason: reason,
            user: process.env.USER || process.env.USERNAME || 'unknown',
            git_commit: this.getCurrentCommitHash(),
            files_bypassed: this.getStagedFiles(),
            requires_postmortem: true,
            postmortem_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        // Write bypass log
        const bypassLogPath = path.join(process.cwd(), 'mcp-doctrine-layer', 'logs', 'bypass_usage.jsonl');
        fs.appendFileSync(bypassLogPath, JSON.stringify(bypassLog) + '\n');
        
        console.log(`📋 Bypass usage logged: ${bypassLogPath}`);
    }

    getCurrentCommitHash() {
        try {
            return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
        } catch {
            return 'unknown';
        }
    }
}

// Main execution
if (require.main === module) {
    const validator = new MCPDoctrinePreCommitValidator();
    
    validator.validate().then(result => {
        if (result.success) {
            if (result.bypass) {
                process.exit(0); // Allow commit with bypass
            } else {
                console.log('✅ MCP Doctrine Layer validation passed');
                process.exit(0); // Allow commit
            }
        } else {
            console.error('\n❌ MCP Doctrine Layer validation failed');
            console.error('Commit blocked to maintain system integrity');
            process.exit(1); // Block commit
        }
    }).catch(error => {
        console.error('💥 Critical error in MCP Doctrine validation:', error);
        process.exit(1); // Block commit on critical errors
    });
}

module.exports = { MCPDoctrinePreCommitValidator };