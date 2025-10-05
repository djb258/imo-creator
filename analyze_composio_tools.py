#!/usr/bin/env python3
"""
Analyze Composio Tools Data
===========================

Script to analyze the latest Composio tools data and create an updated summary.
This helps identify:
- Total number of tools available
- Toolkits and their tool counts
- Custom tools vs standard Composio tools
- Changes from the previous summary
"""

import json
from collections import defaultdict

def analyze_composio_tools():
    """Analyze the latest Composio tools data from latest-composio-tools.json"""

    try:
        with open('latest-composio-tools.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: latest-composio-tools.json not found")
        return
    except json.JSONDecodeError as e:
        print(f"Error reading JSON: {e}")
        return

    # Extract basic statistics
    total_items = data.get('total_items', 0)
    total_pages = data.get('total_pages', 0)
    current_page = data.get('current_page', 1)
    items = data.get('items', [])

    print(f"=== Composio Tools Analysis ===")
    print(f"Total Items: {total_items:,}")
    print(f"Total Pages: {total_pages}")
    print(f"Current Page: {current_page}")
    print(f"Items on this page: {len(items)}")

    # Analyze toolkits from the current page
    toolkit_stats = defaultdict(lambda: {'count': 0, 'tools': []})

    for item in items:
        toolkit = item.get('toolkit', {})
        toolkit_slug = toolkit.get('slug', 'unknown')
        toolkit_name = toolkit.get('name', 'unknown')
        toolkit_logo = toolkit.get('logo', '')

        tool_name = item.get('name', 'unknown')
        tool_slug = item.get('slug', 'unknown')

        toolkit_stats[toolkit_slug]['count'] += 1
        toolkit_stats[toolkit_slug]['name'] = toolkit_name
        toolkit_stats[toolkit_slug]['logo'] = toolkit_logo
        toolkit_stats[toolkit_slug]['tools'].append({
            'name': tool_name,
            'slug': tool_slug,
            'description': item.get('description', '')[:100] + '...' if len(item.get('description', '')) > 100 else item.get('description', '')
        })

    print(f"\n=== Toolkits Found (Page {current_page}) ===")
    for toolkit_slug, stats in toolkit_stats.items():
        print(f"\n{stats['name']} ({toolkit_slug}):")
        print(f"  Tools: {stats['count']}")
        print(f"  Logo: {stats['logo']}")
        print(f"  Sample tools:")
        for tool in stats['tools'][:3]:  # Show first 3 tools
            print(f"    - {tool['name']}: {tool['description']}")
        if len(stats['tools']) > 3:
            print(f"    ... and {len(stats['tools']) - 3} more")

    # Create updated summary structure for what we can see
    summary = {
        "page_analyzed": current_page,
        "total_items_in_composio": total_items,
        "total_pages": total_pages,
        "toolkits_on_this_page": len(toolkit_stats),
        "tools_on_this_page": len(items),
        "toolkits": {}
    }

    for toolkit_slug, stats in toolkit_stats.items():
        summary["toolkits"][toolkit_slug] = {
            "name": stats['name'],
            "logo": stats['logo'],
            "tool_count_on_page": stats['count'],
            "tools": stats['tools']
        }

    # Save the analysis
    with open('composio-tools-analysis.json', 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\n=== Analysis Complete ===")
    print(f"Saved detailed analysis to: composio-tools-analysis.json")
    print(f"\nNote: This analysis covers only page {current_page} of {total_pages}.")
    print(f"The actual total of {total_items:,} tools spans all pages.")

    # Compare with old summary if exists
    try:
        with open('composio-tools-summary.json', 'r') as f:
            old_summary = json.load(f)

        print(f"\n=== Comparison with Previous Summary ===")
        print(f"Previous: {old_summary.get('total_tools', 0)} tools, {old_summary.get('total_toolkits', 0)} toolkits")
        print(f"Current: {total_items:,} tools across {total_pages} pages")
        print(f"Growth: {total_items - old_summary.get('total_tools', 0):,} new tools")

    except FileNotFoundError:
        print(f"\nNo previous summary found for comparison.")

    return summary

if __name__ == "__main__":
    analyze_composio_tools()