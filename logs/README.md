# Logs Directory

This directory contains all logging output for the IMO Creator system.

## Log Files

### DeepWiki Logs

- **deepwiki_audit.log** - Audit trail of all DeepWiki automation runs
- **deepwiki_error.log** - Error log for failed DeepWiki runs

### CTB Doctrine Logs

- **ctb_enforcement.log** - CTB Doctrine compliance checks

### Security Logs

- **security_audit.log** - Security scan results (if configured)

## Log Format

### Audit Log Format
```
[TIMESTAMP] EVENT - Repo: repo_name, Branch: branch_name, Commit: commit_hash, Status: status
```

Example:
```
[2025-10-22T07:30:15Z] START - DeepWiki post-update hook execution
[2025-10-22T07:30:45Z] PROCESSING - Repo: imo-creator, Branch: master, Commit: a1b2c3d, Files: 5
[2025-10-22T07:32:10Z] SUCCESS - Repo: imo-creator, Branch: master, Commit: a1b2c3d
```

### Error Log Format
```
[TIMESTAMP] ERROR - Repo: repo_name, Branch: branch, Error: error_message
```

Example:
```
[2025-10-22T07:45:30Z] ERROR - Repo: imo-creator, Branch: master, Error: API timeout after 600s
```

## Log Rotation

Logs are automatically rotated based on the configuration in `global-config/global_manifest.yaml`:

- **Retention Period**: 90 days
- **Rotation Schedule**: Daily at 2 AM UTC
- **Archive Format**: gzip compressed

Archived logs are stored with the naming convention:
```
deepwiki_audit_YYYYMMDD.log.gz
```

## Viewing Logs

### Real-time monitoring
```bash
# Watch audit log
tail -f logs/deepwiki_audit.log

# Watch error log
tail -f logs/deepwiki_error.log
```

### Search logs
```bash
# Find all errors
grep ERROR logs/deepwiki_audit.log

# Find specific repository
grep "Repo: imo-creator" logs/deepwiki_audit.log

# Count successful runs today
grep "$(date +%Y-%m-%d)" logs/deepwiki_audit.log | grep SUCCESS | wc -l
```

### Log analysis
```bash
# Success rate calculation
TOTAL=$(grep -c "SUCCESS\|FAILED" logs/deepwiki_audit.log)
SUCCESS=$(grep -c "SUCCESS" logs/deepwiki_audit.log)
echo "Success rate: $((SUCCESS * 100 / TOTAL))%"
```

## Log Levels

Logs use the following levels:
- **INIT** - Initialization
- **START** - Process start
- **PROCESSING** - Currently processing
- **SUCCESS** - Successful completion
- **FAILED** - Failed execution
- **ERROR** - Error occurred
- **WARNING** - Warning message
- **SKIP** - Skipped execution

## Maintenance

### Manual log rotation
```bash
# Compress current log
gzip -c logs/deepwiki_audit.log > logs/deepwiki_audit_$(date +%Y%m%d).log.gz

# Clear log (keep file)
> logs/deepwiki_audit.log
```

### Delete old archives
```bash
# Delete archives older than 90 days
find logs/ -name "*.log.gz" -mtime +90 -delete
```

## Troubleshooting

### Log not updating
1. Check file permissions: `ls -la logs/`
2. Verify automation is enabled: `cat global-config/global_manifest.yaml | grep "deep_wiki:" -A 5`
3. Check disk space: `df -h`

### Large log files
1. Check log size: `du -h logs/`
2. Run manual rotation
3. Adjust retention period in configuration

### Missing logs
1. Recreate log files:
```bash
touch logs/deepwiki_audit.log
touch logs/deepwiki_error.log
```

2. Set proper permissions:
```bash
chmod 644 logs/*.log
```

## Support

For log-related issues:
- Ensure proper file permissions
- Check disk space availability
- Verify logging is enabled in configuration
- Contact: admin@bartonenterprises.com

---

**Last Updated**: 2025-10-22
**Version**: 1.0
