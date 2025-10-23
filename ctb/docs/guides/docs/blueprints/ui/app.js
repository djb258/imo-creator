let manifest = null;
let progress = null;
const SLUG = new URL(location.href).searchParams.get('slug') || 'example';

// LLM endpoint configuration
const LLM_URL = new URLSearchParams(location.search).get('llm') || '/api/llm';

// LLM Settings state
let llmSettings = {
    provider: 'auto',
    model: '',
    expectJson: true
};

// Initialize LLM Settings UI
function initLLMSettings() {
    // Create LLM Settings panel HTML
    const settingsHTML = `
        <div id="llm-settings" style="
            position: fixed; 
            top: 10px; 
            right: 10px; 
            background: white; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            padding: 12px; 
            font-size: 12px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 220px;
        ">
            <div style="font-weight: bold; margin-bottom: 8px; color: #333;">LLM Settings</div>
            <div style="margin-bottom: 6px;">
                <label>Provider:</label>
                <select id="llm-provider" style="margin-left: 8px; font-size: 11px;">
                    <option value="auto">Auto</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="openai">OpenAI</option>
                </select>
            </div>
            <div style="margin-bottom: 6px;">
                <label>Model:</label>
                <input id="llm-model" type="text" placeholder="Optional" style="margin-left: 8px; width: 120px; font-size: 11px;">
            </div>
            <div style="margin-bottom: 8px;">
                <label>
                    <input id="llm-expect-json" type="checkbox" checked style="margin-right: 4px;">
                    Expect JSON
                </label>
            </div>
            <div style="font-size: 10px; color: #666; border-top: 1px solid #eee; padding-top: 6px;">
                Endpoint: <code style="background: #f5f5f5; padding: 1px 3px; border-radius: 2px;">${LLM_URL}</code>
                <div id="llm-status" style="margin-top: 4px; color: #999;">
                    <span>Status: </span><span id="llm-status-text">Checking...</span>
                </div>
            </div>
        </div>
    `;
    
    // Add to page if not already present
    if (!document.getElementById('llm-settings')) {
        document.body.insertAdjacentHTML('beforeend', settingsHTML);
        
        // Bind event listeners
        document.getElementById('llm-provider').addEventListener('change', (e) => {
            llmSettings.provider = e.target.value;
        });
        
        document.getElementById('llm-model').addEventListener('input', (e) => {
            llmSettings.model = e.target.value;
        });
        
        document.getElementById('llm-expect-json').addEventListener('change', (e) => {
            llmSettings.expectJson = e.target.checked;
        });
        
        // Check LLM endpoint status
        checkLLMStatus();
    }
}

// Check if LLM endpoint is available and what providers are configured
async function checkLLMStatus() {
    try {
        const response = await fetch(LLM_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'test' })
        });
        
        const result = await response.json();
        const statusEl = document.getElementById('llm-status-text');
        
        if (response.ok) {
            statusEl.textContent = `Ready (${result.provider})`;
            statusEl.style.color = '#28a745';
        } else if (result.error && (result.error.includes('API key not configured') || result.error.includes('No API keys configured'))) {
            statusEl.textContent = 'No API keys configured';
            statusEl.style.color = '#ffc107';
            statusEl.title = result.help || 'Add API keys to enable LLM assistance';
        } else {
            statusEl.textContent = 'Error: ' + result.error;
            statusEl.style.color = '#dc3545';
        }
    } catch (error) {
        const statusEl = document.getElementById('llm-status-text');
        statusEl.textContent = 'Endpoint unavailable';
        statusEl.style.color = '#dc3545';
    }
}

// LLM API function with settings support
async function callLLM({system, prompt, json, provider, model}) {
    try {
        // Use explicit parameters or fall back to UI settings
        const finalJson = json !== undefined ? json : llmSettings.expectJson;
        const finalProvider = provider && provider !== 'auto' ? provider : (llmSettings.provider !== 'auto' ? llmSettings.provider : undefined);
        const finalModel = model || llmSettings.model || undefined;
        
        const requestBody = {
            prompt,
            json: finalJson,
            max_tokens: 1024
        };
        
        if (system) {
            requestBody.system = system;
        }
        if (finalProvider) {
            requestBody.provider = finalProvider;
        }
        if (finalModel) {
            requestBody.model = finalModel;
        }
        
        const response = await fetch(LLM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        return result;
    } catch (error) {
        console.warn('LLM endpoint failed:', error.message);
        // Fallback to copy-to-clipboard with helpful message
        const fallbackPrompt = system ? `${system}\n\n${prompt}` : prompt;
        await navigator.clipboard.writeText(fallbackPrompt);
        
        // Show helpful message based on error
        let message = 'LLM unavailable — prompt copied to clipboard. ';
        if (error.message.includes('API key not configured') || error.message.includes('No API keys configured')) {
            message += 'Add API keys to Vercel environment variables to enable LLM assistance.';
        } else {
            message += error?.message || '';
        }
        alert(message);
        return null;
    }
}

async function loadData() {
    try {
        const manifestResponse = await fetch(`../${SLUG}/manifest.yaml`);
        if (manifestResponse.ok) {
            const manifestText = await manifestResponse.text();
            manifest = parseYAML(manifestText);
        }
    } catch (e) {
        console.log('Could not load manifest:', e);
    }

    try {
        const progressResponse = await fetch(`../${SLUG}/progress.json`);
        if (progressResponse.ok) {
            progress = await progressResponse.json();
        }
    } catch (e) {
        console.log('Could not load progress:', e);
    }

    updateUI();
    loadMermaidDiagram();
    initLLMSettings();
}

function parseYAML(text) {
    const lines = text.split('\n');
    const result = {
        process: '',
        version: '',
        mission: {},
        universals: {},
        buckets: {
            input: { stages: [] },
            middle: { stages: [] },
            output: { stages: [] }
        }
    };
    
    let currentBucket = null;
    let currentStage = null;
    
    for (const line of lines) {
        if (line.startsWith('process:')) {
            result.process = line.split(':')[1].trim();
        } else if (line.startsWith('version:')) {
            result.version = line.split(':')[1].trim();
        } else if (line.includes('input:') && line.trim() === 'input:') {
            currentBucket = 'input';
        } else if (line.includes('middle:') && line.trim() === 'middle:') {
            currentBucket = 'middle';
        } else if (line.includes('output:') && line.trim() === 'output:') {
            currentBucket = 'output';
        } else if (line.includes('- key:') && currentBucket) {
            currentStage = { key: line.split('key:')[1].trim() };
            result.buckets[currentBucket].stages.push(currentStage);
        } else if (line.includes('title:') && currentStage) {
            currentStage.title = line.split('title:')[1].trim().replace(/['"]/g, '');
        }
    }
    
    return result;
}

function getBucketReadiness(bucketName) {
    if (!progress || !progress.buckets || !progress.buckets[bucketName]) {
        return 100;
    }
    
    const bucket = progress.buckets[bucketName];
    const total = Object.keys(bucket).length;
    if (total === 0) return 100;
    
    const done = Object.values(bucket).filter(status => status === 'done').length;
    return Math.floor((done / total) * 100);
}

function updateUI() {
    const processName = document.getElementById('process-name');
    const readinessBadge = document.getElementById('readiness-badge');
    const readinessText = document.getElementById('readiness-text');
    
    if (processName && manifest) {
        processName.textContent = `${manifest.process} v${manifest.version}`;
    }
    
    if (readinessBadge && progress) {
        const percent = progress.overall.percent;
        readinessBadge.className = 'badge ' + (percent >= 80 ? 'done' : percent >= 40 ? 'wip' : 'todo');
        if (readinessText) {
            readinessText.textContent = `${percent}% Ready`;
        }
    }
    
    const scaffoldBtn = document.getElementById('copy-scaffold');
    if (scaffoldBtn) {
        const overallPercent = progress?.overall?.percent || 0;
        scaffoldBtn.disabled = overallPercent < 80;
    }
    
    ['input', 'middle', 'output'].forEach(bucket => {
        const btn = document.getElementById(`copy-${bucket}`);
        if (btn) {
            const readiness = getBucketReadiness(bucket);
            btn.disabled = readiness < 60;
        }
        
        const badge = document.getElementById(`${bucket}-badge`);
        if (badge) {
            const readiness = getBucketReadiness(bucket);
            badge.className = 'small-badge badge ' + (readiness >= 80 ? 'done' : readiness >= 40 ? 'wip' : 'todo');
            badge.textContent = `${readiness}%`;
        }
    });
}

function exportYAML() {
    fetch(`../${SLUG}/manifest.yaml`)
        .then(res => res.text())
        .then(text => {
            const blob = new Blob([text], { type: 'text/yaml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${SLUG}_manifest.yaml`;
            a.click();
        })
        .catch(err => alert('Could not export YAML: ' + err));
}

function exportJSON() {
    if (!manifest) {
        alert('Manifest not loaded yet');
        return;
    }
    
    const jsonWrapper = {
        _format: 'blueprint-json-v1',
        slug: SLUG,
        manifest: manifest,
        progress: progress || {}
    };
    
    const blob = new Blob([JSON.stringify(jsonWrapper, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${SLUG}_blueprint.json`;
    a.click();
}

function copyClaudeScaffold() {
    if (!manifest) {
        alert('Manifest not loaded yet');
        return;
    }
    
    fetch(`../${SLUG}/manifest.yaml`)
        .then(res => res.text())
        .then(manifestYaml => {
            const prompt = `Create a complete scaffold implementation for this blueprint.

MANIFEST:
\`\`\`yaml
${manifestYaml}
\`\`\`

REQUIREMENTS:
- Implement all stages with proper error handling
- Follow idempotency patterns using the specified idempotency key
- Include comprehensive tests for each stage
- Implement proper logging and observability with events
- Handle retries and timeouts as specified
- Respect data policies and security constraints
- Generate process_id and run_id using proper conventions

DELIVERABLES:
1. Complete Python implementation with FastAPI endpoints
2. Stage handlers for all buckets (input/middle/output)
3. Event emission at key points
4. Test fixtures and validation
5. Docker setup if needed`;

            navigator.clipboard.writeText(prompt);
            alert('Claude scaffold prompt copied to clipboard!');
        })
        .catch(err => alert('Could not generate scaffold prompt: ' + err));
}

function copyBucketPrompt(bucket) {
    if (!manifest || !manifest.buckets[bucket]) {
        alert('Manifest not loaded yet');
        return;
    }
    
    const stages = manifest.buckets[bucket].stages;
    const bucketUpper = bucket.toUpperCase();
    
    const focusAreas = {
        input: `- Implement ingestion pipeline with schema validation
- Set up fixture-based testing with good/bad examples  
- Configure idempotency using specified key
- Emit intake events at each stage
- Validate against trust boundaries`,
        middle: `- Set up staging/vault with working store
- Implement transformation pipeline (map_columns, normalize)
- Add HEIR validation gates and invariants
- Build simulator for testing transformations
- Handle retries with exponential backoff`,
        output: `- Implement promotion gate with validation rules
- Configure UPSERT with conflict resolution
- Set up event emission for promoted records
- Handle retention policies (${manifest.universals?.data_policy?.retention || 'P30D'})
- Manage notifications and side effects`
    };
    
    const prompt = `Implement the ${bucketUpper} bucket for process "${manifest.process}".

STAGES TO IMPLEMENT:
${stages.map(s => `- ${s.key}: ${s.title}`).join('\n')}

CURRENT PROGRESS:
${Object.entries(progress?.buckets?.[bucket] || {}).map(([k,v]) => `- ${k}: ${v}`).join('\n')}

FOCUS AREAS:
${focusAreas[bucket]}

MANIFEST CONTEXT:
- Process: ${manifest.process} v${manifest.version}
- Mission: ${manifest.mission?.north_star || 'Not specified'}
- Idempotency: ${manifest.universals?.idempotency?.key || 'Not configured'}
- Retries: max=${manifest.universals?.retries?.max || 0}, backoff=${manifest.universals?.retries?.backoff || 'none'}

Please generate:
1. Stage implementation classes
2. Validation logic
3. Event emitters
4. Test cases with fixtures
5. Error handling`;

    navigator.clipboard.writeText(prompt);
    alert(`${bucketUpper} bucket prompt copied to clipboard!`);
}

function loadMermaidDiagram() {
    fetch(`../${SLUG}/tree_overview.mmd`)
        .then(res => res.ok ? res.text() : null)
        .then(text => {
            if (text) {
                const diagramElement = document.getElementById('overview-diagram');
                if (diagramElement) {
                    diagramElement.textContent = text;
                    if (typeof mermaid !== 'undefined') {
                        mermaid.contentLoaded();
                    }
                }
            }
        })
        .catch(() => console.log('Using default diagram'));
}

let currentStage = null;
let inputManifest = null;

function renderInputPage() {
    const slug = new URL(location.href).searchParams.get('slug') || 'imo';
    
    Promise.all([
        fetch(`../${slug}/manifest.yaml`).then(r => r.text()),
        fetch(`../${slug}/progress.json`).then(r => r.ok ? r.json() : null),
        fetch(`../${slug}/ladder_input.mmd`).then(r => r.ok ? r.text() : null)
    ]).then(([manifestYaml, progress, ladderMmd]) => {
        inputManifest = parseYAML(manifestYaml);
        
        // Update badge
        const badge = document.getElementById('input-badge');
        if (badge && progress) {
            const inputProgress = progress.buckets?.input || {};
            const total = Object.keys(inputProgress).length;
            const done = Object.values(inputProgress).filter(s => s === 'done').length;
            const percent = total > 0 ? Math.floor((done / total) * 100) : 0;
            badge.className = 'badge ' + (percent >= 80 ? 'done' : percent >= 40 ? 'wip' : 'todo');
            badge.textContent = `${percent}%`;
        }
        
        // Load ladder diagram
        if (ladderMmd) {
            document.getElementById('ladder-diagram').textContent = ladderMmd;
            mermaid.contentLoaded();
        }
        
        // Populate context
        document.getElementById('mission-text').textContent = inputManifest.mission?.north_star || 'Not specified';
        document.getElementById('universals-text').textContent = JSON.stringify({
            idempotency: inputManifest.universals?.idempotency,
            retries: inputManifest.universals?.retries,
            limits: inputManifest.universals?.limits
        }, null, 2);
        
        // Build stage dropdown
        const stageSelector = document.getElementById('stage-selector');
        const inputStages = inputManifest.buckets?.input?.stages || [];
        stageSelector.innerHTML = '';
        
        inputStages.forEach((stage, idx) => {
            const option = document.createElement('option');
            option.value = stage.key;
            option.textContent = `${stage.key} - ${stage.title}`;
            stageSelector.appendChild(option);
        });
        
        stageSelector.addEventListener('change', () => loadStage(stageSelector.value));
        
        if (inputStages.length > 0) {
            loadStage(inputStages[0].key);
        }
    }).catch(err => {
        console.error('Error loading input page:', err);
        document.getElementById('save-feedback').textContent = 'Error loading manifest';
    });
}

function loadStage(stageKey) {
    const stages = inputManifest?.buckets?.input?.stages || [];
    currentStage = stages.find(s => s.key === stageKey);
    
    if (!currentStage) return;
    
    // Update stage info
    document.getElementById('stage-info').textContent = `${currentStage.key} (${currentStage.kind}) - ${currentStage.title}`;
    
    // Show/hide Source Strategy selector for 'sources' stage
    const strategyGroup = document.getElementById('source-strategy-group');
    if (stageKey === 'sources') {
        strategyGroup.style.display = 'block';
        const mode = currentStage.fields?.mode || 'design';
        document.getElementById(`mode-${mode}`).checked = true;
    } else {
        strategyGroup.style.display = 'none';
    }
    
    // Load guidance
    updateGuidance(stageKey);
    
    // Load fields into editor
    const editor = document.getElementById('json-editor');
    editor.value = JSON.stringify(currentStage.fields || {}, null, 2);
    
    // Bind Source Strategy radio buttons
    document.querySelectorAll('input[name="source-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (currentStage && currentStage.key === 'sources') {
                const fields = JSON.parse(editor.value || '{}');
                fields.mode = e.target.value;
                editor.value = JSON.stringify(fields, null, 2);
            }
        });
    });
}

function updateGuidance(stageKey) {
    const guidanceMap = {
        one_liner: {
            guidance: 'Define what this input accepts and rejects in one clear sentence.',
            examples: [
                'Accept: Valid CSV roster files under 50MB',
                'Reject: Malformed data, oversized files, unauthorized sources'
            ]
        },
        sources: {
            guidance: 'Choose your source strategy and define data sources.',
            examples: [
                'Design mode: Create new schema from scratch',
                'Integrate mode: Map from existing external source',
                'Include triggers (manual, webhook, cron) and prechecks'
            ]
        },
        contract: {
            guidance: 'Define the canonical input schema and idempotency key.',
            examples: [
                'Schema ref: docs/schemas/input.schema.json',
                'Idempotency: {file_sha256}_{timestamp}'
            ]
        },
        intake_steps: {
            guidance: 'List the processing steps for incoming data.',
            examples: [
                'Steps: ["validate", "sanitize", "transform", "store"]',
                'Configure retries and timeouts'
            ]
        },
        fixtures: {
            guidance: 'Provide test fixtures and acceptance criteria.',
            examples: [
                'Good fixture: valid_roster.csv',
                'Bad fixture: malformed_data.csv',
                'Assertions: ["accepted", "rejected", "quarantined"]'
            ]
        }
    };
    
    const guidance = guidanceMap[stageKey] || { guidance: '', examples: [] };
    document.getElementById('stage-guidance').innerHTML = `<p>${guidance.guidance}</p>`;
    
    const examplesList = document.getElementById('good-examples');
    examplesList.innerHTML = '';
    guidance.examples.forEach(ex => {
        const li = document.createElement('li');
        li.textContent = ex;
        examplesList.appendChild(li);
    });
}

async function draftFromLLM() {
    // Check if we're on middle page
    if (currentMiddleStage) {
        return draftFromLLMMiddle();
    }
    
    if (!currentStage) return;
    
    const mode = currentStage.fields?.mode || 'design';
    let prompt = '';
    
    if (currentStage.key === 'sources' && mode === 'design') {
        prompt = `Draft a schema_draft and 2 sample_records for ${inputManifest.process} canonical input.
Return only JSON for fields.design:
{
  "schema_draft": { ... },
  "sample_records": [ ... ]
}`;
    } else if (currentStage.key === 'sources' && mode === 'integrate') {
        prompt = `Propose provider, external_schema_ref, and mapping from external to canonical.
Return only JSON for fields.integrate:
{
  "provider": "...",
  "external_schema_ref": "...",
  "mapping": [{"from": "ext.field", "to": "canonical.field"}, ...]
}`;
    } else {
        prompt = `Generate appropriate fields for ${currentStage.key} stage (${currentStage.title}).
Return only valid JSON.`;
    }
    
    // Try LLM endpoint first, fallback to clipboard
    const result = await callLLM({
        prompt,
        json: true
    });
    
    if (result && (result.json || result.text)) {
        const editor = document.getElementById('json-editor');
        try {
            const responseData = result.json || JSON.parse(result.text);
            const currentFields = JSON.parse(editor.value || '{}');
            const mergedFields = { ...currentFields, ...responseData };
            editor.value = JSON.stringify(mergedFields, null, 2);
            alert(`LLM response from ${result.provider} (${result.model}) merged into editor! Review and save when ready.`);
        } catch (e) {
            console.warn('Failed to parse LLM response:', e);
            alert('LLM responded but format was unexpected. Check console for details.');
        }
    }
}

function tightenFields() {
    const editor = document.getElementById('json-editor');
    try {
        const fields = JSON.parse(editor.value);
        // Remove null/empty values
        const cleaned = Object.entries(fields).reduce((acc, [k, v]) => {
            if (v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)) {
                acc[k] = v;
            }
            return acc;
        }, {});
        editor.value = JSON.stringify(cleaned, null, 2);
    } catch (e) {
        alert('Invalid JSON in editor');
    }
}

function saveStage() {
    // Check if we're on middle page
    if (currentMiddleStage && middleManifest) {
        return saveMiddleStage();
    }
    
    if (!currentStage || !inputManifest) return;
    
    const editor = document.getElementById('json-editor');
    try {
        const updatedFields = JSON.parse(editor.value);
        
        // Update the stage in manifest
        const stages = inputManifest.buckets.input.stages;
        const stageIndex = stages.findIndex(s => s.key === currentStage.key);
        if (stageIndex >= 0) {
            stages[stageIndex].fields = updatedFields;
        }
        
        // Try to save via API
        const slug = new URL(location.href).searchParams.get('slug') || 'imo';
        
        fetch(`http://localhost:7002/blueprints/${slug}/manifest`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/yaml' },
            body: convertToYAML(inputManifest)
        }).then(res => {
            if (res.ok) {
                document.getElementById('save-feedback').innerHTML = `
                    <span style="color: green;">✓ Saved!</span> Now run:<br>
                    <code>python tools/blueprint_score.py ${slug}</code><br>
                    <code>python tools/blueprint_visual.py ${slug}</code>
                `;
            } else {
                showCurlFallback(slug);
            }
        }).catch(() => {
            showCurlFallback(slug);
        });
        
    } catch (e) {
        alert('Invalid JSON in editor: ' + e.message);
    }
}

function showCurlFallback(slug) {
    const yamlContent = convertToYAML(inputManifest);
    const feedback = document.getElementById('save-feedback');
    feedback.innerHTML = `
        <span style="color: orange;">API not running. Save manually:</span><br>
        <textarea style="width: 100%; height: 100px; font-family: monospace; font-size: 11px;">
${yamlContent}</textarea>
        <br>Save to: docs/blueprints/${slug}/manifest.yaml
        <br>Then run:<br>
        <code>python tools/blueprint_score.py ${slug}</code><br>
        <code>python tools/blueprint_visual.py ${slug}</code>
    `;
}

function convertToYAML(obj) {
    // Simple YAML converter (basic implementation)
    return `process: ${obj.process}
version: ${obj.version}
mission:
  north_star: "${obj.mission.north_star}"
  success_metrics: ${JSON.stringify(obj.mission.success_metrics)}
  constraints: ${JSON.stringify(obj.mission.constraints)}
  risks: ${JSON.stringify(obj.mission.risks)}
universals: ${JSON.stringify(obj.universals, null, 2).replace(/\n/g, '\n  ')}
buckets:
  input:
    stages:
${obj.buckets.input.stages.map(s => `      - key: ${s.key}
        title: "${s.title}"
        kind: ${s.kind}
        fields: ${JSON.stringify(s.fields, null, 2).replace(/\n/g, '\n          ')}
        required_fields: ${JSON.stringify(s.required_fields)}
        ${s.milestones ? `milestones: ${JSON.stringify(s.milestones)}` : ''}`).join('\n')}
  middle:
    stages: ${JSON.stringify(obj.buckets.middle.stages, null, 2).replace(/\n/g, '\n    ')}
  output:
    stages: ${JSON.stringify(obj.buckets.output.stages, null, 2).replace(/\n/g, '\n    ')}`;
}

function rescoreAndVisuals() {
    const slug = new URL(location.href).searchParams.get('slug') || 'imo';
    const feedback = document.getElementById('save-feedback');
    
    feedback.innerHTML = `
        <span style="color: blue;">Run these commands to re-score:</span><br>
        <code>python tools/blueprint_score.py ${slug}</code><br>
        <code>python tools/blueprint_visual.py ${slug}</code><br>
        Then refresh this page.
    `;
}

let currentMiddleStage = null;
let middleManifest = null;

function renderMiddlePage() {
    const slug = new URL(location.href).searchParams.get('slug') || 'imo';
    
    Promise.all([
        fetch(`../${slug}/manifest.yaml`).then(r => r.text()),
        fetch(`../${slug}/progress.json`).then(r => r.ok ? r.json() : null),
        fetch(`../${slug}/ladder_middle.mmd`).then(r => r.ok ? r.text() : null)
    ]).then(([manifestYaml, progress, ladderMmd]) => {
        middleManifest = parseYAML(manifestYaml);
        
        // Update badge
        const badge = document.getElementById('middle-badge');
        if (badge && progress) {
            const middleProgress = progress.buckets?.middle || {};
            const total = Object.keys(middleProgress).length;
            const done = Object.values(middleProgress).filter(s => s === 'done').length;
            const percent = total > 0 ? Math.floor((done / total) * 100) : 0;
            badge.className = 'badge ' + (percent >= 80 ? 'done' : percent >= 40 ? 'wip' : 'todo');
            badge.textContent = `${percent}%`;
        }
        
        // Load ladder diagram
        if (ladderMmd) {
            document.getElementById('ladder-diagram').textContent = ladderMmd;
            mermaid.contentLoaded();
        }
        
        // Populate context
        document.getElementById('mission-text').textContent = middleManifest.mission?.north_star || 'Not specified';
        document.getElementById('universals-text').textContent = JSON.stringify({
            idempotency: middleManifest.universals?.idempotency,
            retries: middleManifest.universals?.retries,
            limits: middleManifest.universals?.limits
        }, null, 2);
        
        // Build stage dropdown
        const stageSelector = document.getElementById('stage-selector');
        const middleStages = middleManifest.buckets?.middle?.stages || [];
        stageSelector.innerHTML = '';
        
        middleStages.forEach((stage, idx) => {
            const option = document.createElement('option');
            option.value = stage.key;
            option.textContent = `${stage.key} - ${stage.title}`;
            stageSelector.appendChild(option);
        });
        
        stageSelector.addEventListener('change', () => loadMiddleStage(stageSelector.value));
        
        if (middleStages.length > 0) {
            loadMiddleStage(middleStages[0].key);
        }
    }).catch(err => {
        console.error('Error loading middle page:', err);
        document.getElementById('save-feedback').textContent = 'Error loading manifest';
    });
}

function loadMiddleStage(stageKey) {
    const stages = middleManifest?.buckets?.middle?.stages || [];
    currentMiddleStage = stages.find(s => s.key === stageKey);
    
    if (!currentMiddleStage) return;
    
    // Update stage info
    document.getElementById('stage-info').textContent = `${currentMiddleStage.key} (${currentMiddleStage.kind}) - ${currentMiddleStage.title}`;
    
    // Show HEIR info for gates stage
    const heirInfo = document.getElementById('heir-info');
    if (stageKey === 'gates') {
        heirInfo.style.display = 'block';
    } else {
        heirInfo.style.display = 'none';
    }
    
    // Load guidance
    updateMiddleGuidance(stageKey);
    
    // Load fields into editor
    const editor = document.getElementById('json-editor');
    editor.value = JSON.stringify(currentMiddleStage.fields || {}, null, 2);
}

function updateMiddleGuidance(stageKey) {
    const guidanceMap = {
        frame: {
            guidance: 'Describe the value this Middle stage adds - normalization, validation, enrichment.',
            examples: [
                'Normalize customer data to canonical format',
                'Enrich records with geographic and demographic data',
                'Validate business rules before promotion'
            ]
        },
        state_machine: {
            guidance: 'Define processing states, start state, terminal states, and responsible teams.',
            examples: [
                'States: ["ingest", "transform", "validate", "stage"]',
                'Start: "ingest", Terminal: ["stage", "failed"]',
                'Owners: ["backend", "data-eng"]'
            ]
        },
        gates: {
            guidance: 'Define validation gates, invariants, and optional HEIR rulesets for runtime validation.',
            examples: [
                'Gates: ["email_valid", "country_iso", "age_range"]',
                'Invariants: ["age >= 0", "email contains @"]',
                'HEIR: "heir://imo@>=1.0.0" for versioned rules'
            ]
        },
        transform: {
            guidance: 'List idempotent transformation steps, lookups, retries, and resource limits.',
            examples: [
                'Steps: ["map_columns", "normalize_email", "geocode"]',
                'Lookups: ["geoip", "crm:account", "postal_codes"]',
                'Budget: $10 for external API calls'
            ]
        },
        tests: {
            guidance: 'Provide test fixtures and assertions for the transformation pipeline.',
            examples: [
                'Fixtures: ["happy_path.json", "edge_cases.json"]',
                'Asserts: ["pass", "fail:invalid_email", "fail:missing_country"]'
            ]
        },
        staging: {
            guidance: 'Configure working store, write strategy, document keys, and events.',
            examples: [
                'Working store: "firebase" or "neon"',
                'Write kind: "upsert" (safer) or "replace"',
                'Events: ["middle.step.start", "middle.step.done"]'
            ]
        }
    };
    
    const guidance = guidanceMap[stageKey] || { guidance: '', examples: [] };
    document.getElementById('stage-guidance').innerHTML = `<p>${guidance.guidance}</p>`;
    
    const examplesList = document.getElementById('good-examples');
    examplesList.innerHTML = '';
    guidance.examples.forEach(ex => {
        const li = document.createElement('li');
        li.textContent = ex;
        examplesList.appendChild(li);
    });
}

async function draftFromLLMMiddle() {
    if (!currentMiddleStage) return;
    
    const slug = middleManifest?.process || 'imo';
    const stageKey = currentMiddleStage.key;
    let prompt = '';
    
    switch (stageKey) {
        case 'frame':
            prompt = `Process ${slug} — MIDDLE/frame. Draft a one-liner describing the value we add (normalize/enrich/validate). Return ONLY JSON for {"one_liner": "..."}`;
            break;
        case 'state_machine':
            prompt = `Process ${slug} — MIDDLE/state_machine. Propose states[], start, terminal[], owners[]. Return ONLY JSON for those fields.`;
            break;
        case 'gates':
            prompt = `Process ${slug} — MIDDLE/gates. Propose gates[], invariants[], approvals[] (optional). If helpful, suggest heir_ruleset_id and mode ('learn' or 'strict'). Return ONLY JSON for those fields.`;
            break;
        case 'transform':
            prompt = `Process ${slug} — MIDDLE/transform. Propose idempotent steps[], optional lookups[], and set retries{max,backoff}, timeout_ms, budget_usd. Return ONLY JSON for those fields.`;
            break;
        case 'tests':
            prompt = `Process ${slug} — MIDDLE/tests. Provide fixtures[] (one happy, one negative) and asserts[] (expected pass/fail with reasons). Return ONLY JSON for those fields.`;
            break;
        case 'staging':
            prompt = `Process ${slug} — MIDDLE/staging. Choose working_store ('firebase' or 'neon'), write_kind, document_keys[], and events[]. Return ONLY JSON for those fields.`;
            break;
        default:
            prompt = `Generate appropriate fields for ${stageKey} stage (${currentMiddleStage.title}). Return only valid JSON.`;
    }
    
    // Try LLM endpoint first, fallback to clipboard
    const result = await callLLM({
        prompt,
        json: true
    });
    
    if (result && (result.json || result.text)) {
        const editor = document.getElementById('json-editor');
        try {
            const responseData = result.json || JSON.parse(result.text);
            const currentFields = JSON.parse(editor.value || '{}');
            const mergedFields = { ...currentFields, ...responseData };
            editor.value = JSON.stringify(mergedFields, null, 2);
            alert(`LLM response from ${result.provider} (${result.model}) merged into editor! Review and save when ready.`);
        } catch (e) {
            console.warn('Failed to parse LLM response:', e);
            alert('LLM responded but format was unexpected. Check console for details.');
        }
    }
}

function saveMiddleStage() {
    if (!currentMiddleStage || !middleManifest) return;
    
    const editor = document.getElementById('json-editor');
    try {
        const updatedFields = JSON.parse(editor.value);
        
        // Update the stage in manifest
        const stages = middleManifest.buckets.middle.stages;
        const stageIndex = stages.findIndex(s => s.key === currentMiddleStage.key);
        if (stageIndex >= 0) {
            stages[stageIndex].fields = updatedFields;
        }
        
        // Try to save via API
        const slug = new URL(location.href).searchParams.get('slug') || 'imo';
        
        fetch(`http://localhost:7002/blueprints/${slug}/manifest`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/yaml' },
            body: convertToYAML(middleManifest)
        }).then(res => {
            if (res.ok) {
                document.getElementById('save-feedback').innerHTML = `
                    <span style="color: green;">✓ Saved!</span> Now run:<br>
                    <code>python tools/blueprint_score.py ${slug}</code><br>
                    <code>python tools/blueprint_visual.py ${slug}</code>
                `;
            } else {
                showMiddleCurlFallback(slug);
            }
        }).catch(() => {
            showMiddleCurlFallback(slug);
        });
        
    } catch (e) {
        alert('Invalid JSON in editor: ' + e.message);
    }
}

function showMiddleCurlFallback(slug) {
    const yamlContent = convertToYAML(middleManifest);
    const feedback = document.getElementById('save-feedback');
    feedback.innerHTML = `
        <span style="color: orange;">API not running. Save manually:</span><br>
        <textarea style="width: 100%; height: 100px; font-family: monospace; font-size: 11px;">
${yamlContent}</textarea>
        <br>Save to: docs/blueprints/${slug}/manifest.yaml
        <br>Then run:<br>
        <code>python tools/blueprint_score.py ${slug}</code><br>
        <code>python tools/blueprint_visual.py ${slug}</code>
    `;
}

function runSimulator() {
    const slug = new URL(location.href).searchParams.get('slug') || 'imo';
    
    // Check if simflow exists
    fetch('../../tools/simflow/run.py', { method: 'HEAD' })
        .then(res => {
            if (res.ok) {
                const feedback = document.getElementById('save-feedback');
                feedback.innerHTML = `
                    <span style="color: blue;">Run simulator to test idempotency:</span><br>
                    <code>python tools/simflow/run.py --slug ${slug} --runs 2 --reset</code>
                `;
            } else {
                throw new Error('Simflow not found');
            }
        })
        .catch(() => {
            const feedback = document.getElementById('save-feedback');
            feedback.innerHTML = `
                <span style="color: orange;">Simulator not available.</span><br>
                Add simflow later to test idempotency & joins.<br>
                Expected: <code>tools/simflow/run.py</code>
            `;
        });
}

let currentOutputStage = null;
let outputManifest = null;

function renderOutputPage() {
    const slug = new URL(location.href).searchParams.get('slug') || 'imo';
    
    Promise.all([
        fetch(`../${slug}/manifest.yaml`).then(r => r.text()),
        fetch(`../${slug}/progress.json`).then(r => r.ok ? r.json() : null),
        fetch(`../${slug}/ladder_output.mmd`).then(r => r.ok ? r.text() : null)
    ]).then(([manifestYaml, progress, ladderMmd]) => {
        outputManifest = parseYAML(manifestYaml);
        
        // Update badge
        const badge = document.getElementById('output-badge');
        if (badge && progress) {
            const outputProgress = progress.buckets?.output || {};
            const total = Object.keys(outputProgress).length;
            const done = Object.values(outputProgress).filter(s => s === 'done').length;
            const percent = total > 0 ? Math.floor((done / total) * 100) : 0;
            badge.className = 'badge ' + (percent >= 80 ? 'done' : percent >= 40 ? 'wip' : 'todo');
            badge.textContent = `${percent}%`;
        }
        
        // Load ladder diagram
        if (ladderMmd) {
            document.getElementById('ladder-diagram').textContent = ladderMmd;
            mermaid.contentLoaded();
        }
        
        // Populate context
        document.getElementById('mission-text').textContent = outputManifest.mission?.north_star || 'Not specified';
        document.getElementById('universals-text').textContent = JSON.stringify({
            idempotency: outputManifest.universals?.idempotency,
            retries: outputManifest.universals?.retries,
            limits: outputManifest.universals?.limits
        }, null, 2);
        
        // Build stage dropdown
        const stageSelector = document.getElementById('stage-selector');
        const outputStages = outputManifest.buckets?.output?.stages || [];
        stageSelector.innerHTML = '';
        
        outputStages.forEach((stage, idx) => {
            const option = document.createElement('option');
            option.value = stage.key;
            option.textContent = `${stage.key} - ${stage.title}`;
            stageSelector.appendChild(option);
        });
        
        stageSelector.addEventListener('change', () => loadOutputStage(stageSelector.value));
        
        if (outputStages.length > 0) {
            loadOutputStage(outputStages[0].key);
        }
    }).catch(err => {
        console.error('Error loading output page:', err);
        document.getElementById('save-feedback').textContent = 'Error loading manifest';
    });
}

function loadOutputStage(stageKey) {
    const stages = outputManifest?.buckets?.output?.stages || [];
    currentOutputStage = stages.find(s => s.key === stageKey);
    
    if (!currentOutputStage) return;
    
    // Update stage info
    document.getElementById('stage-info').textContent = `${currentOutputStage.key} (${currentOutputStage.kind}) - ${currentOutputStage.title}`;
    
    // Show promotion info for promotion stage
    const promotionInfo = document.getElementById('promotion-info');
    if (stageKey === 'promotion') {
        promotionInfo.style.display = 'block';
    } else {
        promotionInfo.style.display = 'none';
    }
    
    // Load guidance
    updateOutputGuidance(stageKey);
    
    // Load fields into editor
    const editor = document.getElementById('json-editor');
    editor.value = JSON.stringify(currentOutputStage.fields || {}, null, 2);
}

function updateOutputGuidance(stageKey) {
    const guidanceMap = {
        frame: {
            guidance: 'Describe what this output delivers and who benefits from it.',
            examples: [
                'Publish clean customer roster to ops dashboard',
                'Deliver validated leads to partner API endpoint',
                'Export enriched data for downstream analytics'
            ]
        },
        destinations: {
            guidance: 'Specify where data goes, who consumes it, and any side effects.',
            examples: [
                'Destinations: ["neon:vault.customers", "dashboard:roster_view"]',
                'Consumers: ["Ops team", "Partner API", "Analytics pipeline"]',
                'Side effects: ["notification emails", "S3 exports"]'
            ]
        },
        promotion: {
            guidance: 'Define schema, promotion gate logic, and audit requirements.',
            examples: [
                'Schema: "docs/schemas/imo_output.schema.json"',
                'Gate: "validator.status==\'pass\' && audit.present==true"',
                'Audit: ["run_id", "hash", "actor", "timestamp"]'
            ]
        },
        publish: {
            guidance: 'Configure UPSERT behavior, notifications, retention, and events.',
            examples: [
                'UPSERT: "ON CONFLICT (natural_key) DO UPDATE"',
                'Notifications: ["email:ops@acme", "webhook:/partner/notify"]',
                'Events: ["output.promoted", "notify.sent", "export.complete"]'
            ]
        }
    };
    
    const guidance = guidanceMap[stageKey] || { guidance: '', examples: [] };
    document.getElementById('stage-guidance').innerHTML = `<p>${guidance.guidance}</p>`;
    
    const examplesList = document.getElementById('good-examples');
    examplesList.innerHTML = '';
    guidance.examples.forEach(ex => {
        const li = document.createElement('li');
        li.textContent = ex;
        examplesList.appendChild(li);
    });
}


async function draftFromLLMOutput() {
    if (!currentOutputStage) return;
    
    const slug = outputManifest?.process || 'imo';
    const stageKey = currentOutputStage.key;
    let prompt = '';
    
    switch (stageKey) {
        case 'frame':
            prompt = `Process ${slug} — OUTPUT/frame. Draft a one-liner describing what we publish and for whom. Return ONLY JSON for {"one_liner": "..."}.`;
            break;
        case 'destinations':
            prompt = `Process ${slug} — OUTPUT/destinations. Propose destinations[] (like "neon:vault.table", "dashboard:view"), consumers[], side_effects[]. Return ONLY JSON for those fields.`;
            break;
        case 'promotion':
            prompt = `Process ${slug} — OUTPUT/promotion. Provide schema_ref (like "docs/schemas/${slug}_output.schema.json"), promotion_gate (tie to validator/HEIR), and audit fields ["run_id", "hash", "actor"]. Return ONLY JSON for those fields.`;
            break;
        case 'publish':
            prompt = `Process ${slug} — OUTPUT/publish. Provide idempotent upsert_rule, notifications[] (emails/webhooks), retention, events ["output.promoted", "notify.sent"]. Return ONLY JSON for those fields.`;
            break;
        default:
            prompt = `Generate appropriate fields for ${stageKey} stage (${currentOutputStage.title}). Return only valid JSON.`;
    }
    
    // Try LLM endpoint first, fallback to clipboard
    const result = await callLLM({
        prompt,
        json: true
    });
    
    if (result && (result.json || result.text)) {
        const editor = document.getElementById('json-editor');
        try {
            const responseData = result.json || JSON.parse(result.text);
            const currentFields = JSON.parse(editor.value || '{}');
            const mergedFields = { ...currentFields, ...responseData };
            editor.value = JSON.stringify(mergedFields, null, 2);
            alert(`LLM response from ${result.provider} (${result.model}) merged into editor! Review and save when ready.`);
        } catch (e) {
            console.warn('Failed to parse LLM response:', e);
            alert('LLM responded but format was unexpected. Check console for details.');
        }
    }
}

function saveStage() {
    // Check if we're on output page
    if (currentOutputStage && outputManifest) {
        return saveOutputStage();
    }
    
    // Check if we're on middle page
    if (currentMiddleStage && middleManifest) {
        return saveMiddleStage();
    }
    
    if (!currentStage || !inputManifest) return;
    
    const editor = document.getElementById('json-editor');
    try {
        const updatedFields = JSON.parse(editor.value);
        
        // Update the stage in manifest
        const stages = inputManifest.buckets.input.stages;
        const stageIndex = stages.findIndex(s => s.key === currentStage.key);
        if (stageIndex >= 0) {
            stages[stageIndex].fields = updatedFields;
        }
        
        // Try to save via API
        const slug = new URL(location.href).searchParams.get('slug') || 'imo';
        
        fetch(`http://localhost:7002/blueprints/${slug}/manifest`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/yaml' },
            body: convertToYAML(inputManifest)
        }).then(res => {
            if (res.ok) {
                document.getElementById('save-feedback').innerHTML = `
                    <span style="color: green;">✓ Saved!</span> Now run:<br>
                    <code>python tools/blueprint_score.py ${slug}</code><br>
                    <code>python tools/blueprint_visual.py ${slug}</code>
                `;
            } else {
                showCurlFallback(slug);
            }
        }).catch(() => {
            showCurlFallback(slug);
        });
        
    } catch (e) {
        alert('Invalid JSON in editor: ' + e.message);
    }
}

function saveOutputStage() {
    if (!currentOutputStage || !outputManifest) return;
    
    const editor = document.getElementById('json-editor');
    try {
        const updatedFields = JSON.parse(editor.value);
        
        // Update the stage in manifest
        const stages = outputManifest.buckets.output.stages;
        const stageIndex = stages.findIndex(s => s.key === currentOutputStage.key);
        if (stageIndex >= 0) {
            stages[stageIndex].fields = updatedFields;
        }
        
        // Try to save via API
        const slug = new URL(location.href).searchParams.get('slug') || 'imo';
        
        fetch(`http://localhost:7002/blueprints/${slug}/manifest`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/yaml' },
            body: convertToYAML(outputManifest)
        }).then(res => {
            if (res.ok) {
                document.getElementById('save-feedback').innerHTML = `
                    <span style="color: green;">✓ Saved!</span> Now run:<br>
                    <code>python tools/blueprint_score.py ${slug}</code><br>
                    <code>python tools/blueprint_visual.py ${slug}</code>
                `;
            } else {
                showOutputCurlFallback(slug);
            }
        }).catch(() => {
            showOutputCurlFallback(slug);
        });
        
    } catch (e) {
        alert('Invalid JSON in editor: ' + e.message);
    }
}

function showOutputCurlFallback(slug) {
    const yamlContent = convertToYAML(outputManifest);
    const feedback = document.getElementById('save-feedback');
    feedback.innerHTML = `
        <span style="color: orange;">API not running. Save manually:</span><br>
        <textarea style="width: 100%; height: 100px; font-family: monospace; font-size: 11px;">
${yamlContent}</textarea>
        <br>Save to: docs/blueprints/${slug}/manifest.yaml
        <br>Then run:<br>
        <code>python tools/blueprint_score.py ${slug}</code><br>
        <code>python tools/blueprint_visual.py ${slug}</code>
    `;
}

document.addEventListener('DOMContentLoaded', loadData);