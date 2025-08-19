// Vercel API Route for SSOT processing with doctrine-safe IDs
import { NextApiRequest, NextApiResponse } from 'next'

// Import utilities with relative imports for Vercel compatibility
function _ts_ms() {
    return Date.now()
}

function _rand16(seed) {
    const crypto = require('crypto')
    const h = crypto.createHash('sha256').update(seed, 'utf8').digest()
    return Buffer.from(h.slice(0, 10)).toString('base64').replace(/[=]/g, '').replace(/[+/]/g, match => match === '+' ? '-' : '_')
}

function _compact_ts(ts_ms) {
    const t = new Date(ts_ms)
    const year = t.getUTCFullYear()
    const month = String(t.getUTCMonth() + 1).padStart(2, '0')
    const day = String(t.getUTCDate()).padStart(2, '0')
    const hour = String(t.getUTCHours()).padStart(2, '0')
    const minute = String(t.getUTCMinutes()).padStart(2, '0')
    const second = String(t.getUTCSeconds()).padStart(2, '0')
    return `${year}${month}${day}-${hour}${minute}${second}`
}

function generate_unique_id(ssot) {
    const db = process.env.DOCTRINE_DB || 'shq'
    const subhive = process.env.DOCTRINE_SUBHIVE || '03'
    const app = process.env.DOCTRINE_APP || 'imo'
    const ts_ms = ssot?.meta?._created_at_ms || _ts_ms()
    const app_name = (ssot?.meta?.app_name || 'imo-creator').trim()
    const seed = `${db}|${subhive}|${app}|${app_name}|${ts_ms}`
    const r = _rand16(seed)
    return `${db}-${subhive}-${app}-${_compact_ts(ts_ms)}-${r}`
}

function generate_process_id(ssot) {
    const db = process.env.DOCTRINE_DB || 'shq'
    const subhive = process.env.DOCTRINE_SUBHIVE || '03'
    const app = process.env.DOCTRINE_APP || 'imo'
    const ver = process.env.DOCTRINE_VER || '1'
    
    const stage = (ssot?.meta?.stage || 'overview').toLowerCase()
    const ts_ms = ssot?.meta?._created_at_ms || _ts_ms()
    const ymd = _compact_ts(ts_ms).split('-')[0]
    return `${db}.${subhive}.${app}.V${ver}.${ymd}.${stage}`
}

function ensure_ids(ssot) {
    ssot = {...(ssot || {})}
    const meta = {...(ssot.meta || {})}
    
    if (!meta._created_at_ms) {
        meta._created_at_ms = _ts_ms()
    }
    ssot.meta = meta
    
    const doctrine = {...(ssot.doctrine || {})}
    if (!doctrine.unique_id) {
        doctrine.unique_id = generate_unique_id(ssot)
    }
    if (!doctrine.process_id) {
        doctrine.process_id = generate_process_id(ssot)
    }
    if (!doctrine.schema_version) {
        doctrine.schema_version = 'HEIR/1.0'
    }
    ssot.doctrine = doctrine
    
    return ssot
}

function _scrub(o) {
    const OMIT = new Set(['timestamp_last_touched', '_created_at_ms', 'blueprint_version_hash'])
    
    if (typeof o === 'object' && o !== null && !Array.isArray(o)) {
        const result = {}
        Object.keys(o).sort().forEach(k => {
            if (!OMIT.has(k)) {
                result[k] = _scrub(o[k])
            }
        })
        return result
    }
    if (Array.isArray(o)) {
        return o.map(v => _scrub(v))
    }
    return o
}

function stamp_version_hash(ssot) {
    const crypto = require('crypto')
    const canon = JSON.stringify(_scrub(ssot))
    const h = crypto.createHash('sha256').update(canon, 'utf8').hexdigest()
    
    ssot = {...ssot}
    const doctrine = {...(ssot.doctrine || {})}
    doctrine.blueprint_version_hash = h
    ssot.doctrine = doctrine
    
    return ssot
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    
    try {
        let ssot = req.body?.ssot || {}
        ssot = ensure_ids(ssot)
        ssot = stamp_version_hash(ssot)
        
        return res.status(200).json({ ok: true, ssot })
        
    } catch (error) {
        console.error('SSOT processing error:', error)
        return res.status(500).json({ error: `Failed to process SSOT: ${error.message}` })
    }
}