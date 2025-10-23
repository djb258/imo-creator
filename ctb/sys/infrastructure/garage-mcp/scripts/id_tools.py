#!/usr/bin/env python3
"""
ID Tools - Generate and validate IDs for Garage-MCP
"""

import re
import uuid
import time
import random
from datetime import datetime
from typing import Optional, Dict, Any


# ULID character set (Crockford's Base32)
ULID_CHARSET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

# ID validation patterns
PROCESS_ID_PATTERN = re.compile(r'^PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$')
IDEMPOTENCY_KEY_PATTERN = re.compile(r'^IDEM-PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$')
UNIQUE_ID_PATTERN = re.compile(r'^[A-Z]{2,3}-\d{4}-[A-Z]{3,10}-\d{8}-[0-9A-Z]{26}$')


def generate_ulid() -> str:
    """
    Generate a ULID (Universally Unique Lexicographically Sortable Identifier)
    
    Returns:
        26-character ULID string
    """
    # Timestamp part (10 characters, base32 encoded milliseconds)
    timestamp_ms = int(time.time() * 1000)
    timestamp_part = _encode_base32(timestamp_ms, 10)
    
    # Random part (16 characters)
    random_part = ''.join(random.choices(ULID_CHARSET, k=16))
    
    return timestamp_part + random_part


def _encode_base32(value: int, length: int) -> str:
    """Encode integer to base32 with specified length"""
    result = ""
    for _ in range(length):
        result = ULID_CHARSET[value % 32] + result
        value //= 32
    return result


def make_unique_id(db_code: str, hive: str, subhive: str, entity: str, 
                  date: Optional[str] = None) -> str:
    """
    Generate unique ID in format: DB-HIVEHIVE-ENTITY-YYYYMMDD-ULID26
    
    Args:
        db_code: 2-3 character database code (e.g., 'SHQ', 'CLT')
        hive: 2-digit hive code (e.g., '01')
        subhive: 2-digit subhive code (e.g., '01')
        entity: 3-10 character entity type (e.g., 'USER', 'CLIENT')
        date: Optional date string (YYYYMMDD), defaults to today
    
    Returns:
        Complete unique ID
    
    Raises:
        ValueError: If parameters are invalid
    """
    # Validate inputs
    if not re.match(r'^[A-Z]{2,3}$', db_code):
        raise ValueError(f"db_code must be 2-3 uppercase letters: {db_code}")
    
    if not re.match(r'^\d{2}$', hive):
        raise ValueError(f"hive must be 2 digits: {hive}")
    
    if not re.match(r'^\d{2}$', subhive):
        raise ValueError(f"subhive must be 2 digits: {subhive}")
    
    if not re.match(r'^[A-Z]{3,10}$', entity):
        raise ValueError(f"entity must be 3-10 uppercase letters: {entity}")
    
    # Use current date if not provided
    if date is None:
        date = datetime.now().strftime('%Y%m%d')
    
    if not re.match(r'^\d{8}$', date):
        raise ValueError(f"date must be YYYYMMDD format: {date}")
    
    # Generate ULID
    ulid = generate_ulid()
    
    # Construct unique ID
    unique_id = f"{db_code}-{hive}{subhive}-{entity}-{date}-{ulid}"
    
    # Validate result
    if not UNIQUE_ID_PATTERN.match(unique_id):
        raise ValueError(f"Generated unique_id doesn't match pattern: {unique_id}")
    
    return unique_id


def make_process_id(plan_id: str, date: Optional[str] = None, 
                   time_str: Optional[str] = None, seq: int = 1) -> str:
    """
    Generate process ID in format: PROC-plan_id-YYYYMMDD-HHMMSS-seq
    
    Args:
        plan_id: Plan identifier (lowercase, alphanumeric, underscores)
        date: Optional date string (YYYYMMDD), defaults to today
        time_str: Optional time string (HHMMSS), defaults to now
        seq: Sequence number (1-999999), defaults to 1
    
    Returns:
        Complete process ID
    
    Raises:
        ValueError: If parameters are invalid
    """
    # Validate plan_id
    if not re.match(r'^[a-z0-9_]+$', plan_id):
        raise ValueError(f"plan_id must be lowercase alphanumeric with underscores: {plan_id}")
    
    # Use current date/time if not provided
    now = datetime.now()
    if date is None:
        date = now.strftime('%Y%m%d')
    if time_str is None:
        time_str = now.strftime('%H%M%S')
    
    # Validate inputs
    if not re.match(r'^\d{8}$', date):
        raise ValueError(f"date must be YYYYMMDD format: {date}")
    
    if not re.match(r'^\d{6}$', time_str):
        raise ValueError(f"time_str must be HHMMSS format: {time_str}")
    
    if not isinstance(seq, int) or seq < 1 or seq > 999999:
        raise ValueError(f"seq must be integer 1-999999: {seq}")
    
    # Format sequence with appropriate padding (3-6 digits)
    if seq < 1000:
        seq_str = f"{seq:03d}"
    else:
        seq_str = f"{seq:06d}"
    
    # Construct process ID
    process_id = f"PROC-{plan_id}-{date}-{time_str}-{seq_str}"
    
    # Validate result
    if not PROCESS_ID_PATTERN.match(process_id):
        raise ValueError(f"Generated process_id doesn't match pattern: {process_id}")
    
    return process_id


def make_idempotency_key(process_id: str) -> str:
    """
    Generate idempotency key from process ID
    
    Args:
        process_id: Valid process ID
    
    Returns:
        Idempotency key in format: IDEM-{process_id}
    
    Raises:
        ValueError: If process_id is invalid
    """
    # Validate process ID
    if not PROCESS_ID_PATTERN.match(process_id):
        raise ValueError(f"Invalid process_id format: {process_id}")
    
    # Generate idempotency key
    idem_key = f"IDEM-{process_id}"
    
    # Validate result
    if not IDEMPOTENCY_KEY_PATTERN.match(idem_key):
        raise ValueError(f"Generated idempotency key doesn't match pattern: {idem_key}")
    
    return idem_key


def validate_process_id(process_id: str) -> bool:
    """Validate process ID format"""
    return PROCESS_ID_PATTERN.match(process_id) is not None


def validate_idempotency_key(idem_key: str) -> bool:
    """Validate idempotency key format"""
    return IDEMPOTENCY_KEY_PATTERN.match(idem_key) is not None


def validate_unique_id(unique_id: str) -> bool:
    """Validate unique ID format"""
    return UNIQUE_ID_PATTERN.match(unique_id) is not None


def parse_unique_id(unique_id: str) -> Optional[Dict[str, str]]:
    """
    Parse unique ID into components
    
    Args:
        unique_id: Unique ID to parse
    
    Returns:
        Dictionary with components or None if invalid
    """
    match = UNIQUE_ID_PATTERN.match(unique_id)
    if not match:
        return None
    
    parts = unique_id.split('-')
    if len(parts) != 5:
        return None
    
    hive_subhive = parts[1]
    
    return {
        'db_code': parts[0],
        'hive': hive_subhive[:2],
        'subhive': hive_subhive[2:4],
        'entity': parts[2],
        'date': parts[3],
        'ulid': parts[4]
    }


def parse_process_id(process_id: str) -> Optional[Dict[str, str]]:
    """
    Parse process ID into components
    
    Args:
        process_id: Process ID to parse
    
    Returns:
        Dictionary with components or None if invalid
    """
    match = PROCESS_ID_PATTERN.match(process_id)
    if not match:
        return None
    
    parts = process_id.split('-')
    if len(parts) < 5:
        return None
    
    # Handle multi-part plan_id (rejoin with dashes)
    plan_id = '-'.join(parts[1:-3])
    
    return {
        'prefix': parts[0],  # 'PROC'
        'plan_id': plan_id,
        'date': parts[-3],
        'time': parts[-2],
        'sequence': parts[-1]
    }


def generate_sample_ids() -> Dict[str, Any]:
    """Generate sample IDs for testing and documentation"""
    now = datetime.now()
    date_str = now.strftime('%Y%m%d')
    time_str = now.strftime('%H%M%S')
    
    samples = {
        'unique_ids': [
            make_unique_id('SHQ', '01', '01', 'USER', date_str),
            make_unique_id('CLT', '02', '03', 'CLIENT', date_str),
            make_unique_id('PAY', '04', '01', 'PAYMENT', date_str),
            make_unique_id('ART', '05', '01', 'ARTIFACT', date_str)
        ],
        'process_ids': [
            make_process_id('clients_intake', date_str, time_str, 1),
            make_process_id('payment_flow', date_str, time_str, 42),
            make_process_id('data_sync', date_str, time_str, 123)
        ]
    }
    
    # Add idempotency keys
    samples['idempotency_keys'] = [
        make_idempotency_key(pid) for pid in samples['process_ids']
    ]
    
    return samples


def main():
    """CLI interface for ID tools"""
    import sys
    import json
    
    if len(sys.argv) < 2:
        print("Usage: python id_tools.py <command> [args...]")
        print("Commands:")
        print("  sample          Generate sample IDs")
        print("  unique <db> <hive> <subhive> <entity>  Generate unique ID")
        print("  process <plan_id> [seq]                Generate process ID")
        print("  idem <process_id>                      Generate idempotency key")
        print("  validate <id>                          Validate ID format")
        print("  parse <id>                             Parse ID components")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    try:
        if command == 'sample':
            samples = generate_sample_ids()
            print(json.dumps(samples, indent=2))
            
        elif command == 'unique':
            if len(sys.argv) != 6:
                print("Usage: python id_tools.py unique <db> <hive> <subhive> <entity>")
                sys.exit(1)
            
            unique_id = make_unique_id(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
            print(unique_id)
            
        elif command == 'process':
            if len(sys.argv) < 3:
                print("Usage: python id_tools.py process <plan_id> [seq]")
                sys.exit(1)
            
            plan_id = sys.argv[2]
            seq = int(sys.argv[3]) if len(sys.argv) > 3 else 1
            
            process_id = make_process_id(plan_id, seq=seq)
            print(process_id)
            
        elif command == 'idem':
            if len(sys.argv) != 3:
                print("Usage: python id_tools.py idem <process_id>")
                sys.exit(1)
            
            idem_key = make_idempotency_key(sys.argv[2])
            print(idem_key)
            
        elif command == 'validate':
            if len(sys.argv) != 3:
                print("Usage: python id_tools.py validate <id>")
                sys.exit(1)
            
            id_str = sys.argv[2]
            
            if validate_process_id(id_str):
                print(f"✅ Valid process ID: {id_str}")
            elif validate_idempotency_key(id_str):
                print(f"✅ Valid idempotency key: {id_str}")
            elif validate_unique_id(id_str):
                print(f"✅ Valid unique ID: {id_str}")
            else:
                print(f"❌ Invalid ID format: {id_str}")
                sys.exit(1)
                
        elif command == 'parse':
            if len(sys.argv) != 3:
                print("Usage: python id_tools.py parse <id>")
                sys.exit(1)
            
            id_str = sys.argv[2]
            
            result = parse_process_id(id_str) or parse_unique_id(id_str)
            if result:
                print(json.dumps(result, indent=2))
            else:
                print(f"❌ Could not parse ID: {id_str}")
                sys.exit(1)
                
        else:
            print(f"Unknown command: {command}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()