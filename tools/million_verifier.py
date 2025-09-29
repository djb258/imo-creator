"""
Million Verifier Email Validation Tool
Custom integration for IMO-Creator with Composio MCP compliance
"""

import requests
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MillionVerifierTool:
    """Million Verifier API integration tool"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.millionverifier.com"
        # Alternative base URLs to try
        self.alt_base_urls = [
            "https://millionverifier.com/api",
            "https://api.millionverifier.com/api",
            "https://www.millionverifier.com/api"
        ]
        self.headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'IMO-Creator/1.0'
        }

    def verify_single_email(self, email: str, timeout: int = 30) -> Dict[str, Any]:
        """
        Verify a single email address

        Args:
            email (str): Email address to verify
            timeout (int): Request timeout in seconds

        Returns:
            Dict containing verification results
        """
        try:
            url = f"{self.base_url}/v3/verify"
            params = {
                'api': self.api_key,
                'email': email,
                'timeout': timeout
            }

            logger.info(f"Verifying email: {email}")
            response = requests.get(url, params=params, headers=self.headers, timeout=timeout)
            response.raise_for_status()

            result = response.json()

            # Add HEIR/ORBT compliance metadata
            result['heir_metadata'] = {
                'unique_id': f"HEIR-{datetime.now().strftime('%Y-%m-%d')}-VERIFY-{hash(email) % 10000:04d}",
                'process_id': f"PRC-MILLION-VERIFY-{int(datetime.now().timestamp())}",
                'orbt_layer': 2,
                'blueprint_version': "1.0",
                'timestamp': datetime.now().isoformat(),
                'tool': "million_verifier",
                'action': "verify_single"
            }

            return {
                'successful': True,
                'data': result,
                'error': None
            }

        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            return {
                'successful': False,
                'data': None,
                'error': f"API request failed: {str(e)}"
            }
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return {
                'successful': False,
                'data': None,
                'error': f"Unexpected error: {str(e)}"
            }

    def batch_verify_emails(self, emails: List[str], filename: str = None) -> Dict[str, Any]:
        """
        Submit a batch of emails for verification

        Args:
            emails (List[str]): List of email addresses to verify
            filename (str): Optional filename for the batch

        Returns:
            Dict containing batch submission results
        """
        try:
            if not filename:
                filename = f"batch_{int(datetime.now().timestamp())}.txt"

            url = f"{self.base_url}/v3/bulkapi/verifyfile"

            # Prepare the file data
            email_content = '\n'.join(emails)
            files = {
                'file_contents': (filename, email_content, 'text/plain')
            }

            data = {
                'api': self.api_key,
                'file_name': filename
            }

            logger.info(f"Submitting batch verification for {len(emails)} emails")
            response = requests.post(url, files=files, data=data, timeout=60)
            response.raise_for_status()

            result = response.json()

            # Add HEIR/ORBT compliance metadata
            result['heir_metadata'] = {
                'unique_id': f"HEIR-{datetime.now().strftime('%Y-%m-%d')}-BATCH-{hash(filename) % 10000:04d}",
                'process_id': f"PRC-MILLION-BATCH-{int(datetime.now().timestamp())}",
                'orbt_layer': 2,
                'blueprint_version': "1.0",
                'timestamp': datetime.now().isoformat(),
                'tool': "million_verifier",
                'action': "batch_verify",
                'email_count': len(emails)
            }

            return {
                'successful': True,
                'data': result,
                'error': None
            }

        except requests.exceptions.RequestException as e:
            logger.error(f"Batch API request failed: {str(e)}")
            return {
                'successful': False,
                'data': None,
                'error': f"Batch API request failed: {str(e)}"
            }
        except Exception as e:
            logger.error(f"Unexpected error in batch verification: {str(e)}")
            return {
                'successful': False,
                'data': None,
                'error': f"Unexpected error: {str(e)}"
            }

    def _try_endpoints(self, endpoint_path: str, params: dict, method: str = 'GET') -> Dict[str, Any]:
        """Try different base URLs for an endpoint"""
        urls_to_try = [
            f"{self.base_url}{endpoint_path}",
            f"https://millionverifier.com/api{endpoint_path}",
            f"https://api.millionverifier.com{endpoint_path}",
            f"https://www.millionverifier.com/api{endpoint_path}"
        ]

        last_error = None
        for url in urls_to_try:
            try:
                logger.info(f"Trying URL: {url}")
                if method.upper() == 'GET':
                    response = requests.get(url, params=params, headers=self.headers, timeout=10)
                else:
                    response = requests.post(url, data=params, headers=self.headers, timeout=10)

                if response.ok:
                    return {'successful': True, 'response': response, 'url': url}
                else:
                    logger.warning(f"URL {url} returned status {response.status_code}")
                    last_error = f"HTTP {response.status_code}: {response.reason}"
            except Exception as e:
                logger.warning(f"URL {url} failed: {str(e)}")
                last_error = str(e)

        return {'successful': False, 'error': last_error}

    def get_credits(self) -> Dict[str, Any]:
        """
        Get remaining API credits

        Returns:
            Dict containing credit information
        """
        try:
            params = {
                'api': self.api_key
            }

            # Try different endpoint variations
            endpoints_to_try = [
                "/v3/credits",
                "/credits",
                "/api/credits",
                "/v2/credits"
            ]

            logger.info("Fetching API credits")

            for endpoint in endpoints_to_try:
                result = self._try_endpoints(endpoint, params)
                if result['successful']:
                    response = result['response']
                    data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {'message': response.text}

                    # Add HEIR/ORBT compliance metadata
                    data['heir_metadata'] = {
                        'unique_id': f"HEIR-{datetime.now().strftime('%Y-%m-%d')}-CREDITS-{int(datetime.now().timestamp()) % 10000:04d}",
                        'process_id': f"PRC-MILLION-CREDITS-{int(datetime.now().timestamp())}",
                        'orbt_layer': 2,
                        'blueprint_version': "1.0",
                        'timestamp': datetime.now().isoformat(),
                        'tool': "million_verifier",
                        'action': "get_credits",
                        'endpoint_used': result['url']
                    }

                    return {
                        'successful': True,
                        'data': data,
                        'error': None
                    }

            return {
                'successful': False,
                'data': None,
                'error': "All credit endpoints failed. Please verify API key and service availability."
            }

        except Exception as e:
            logger.error(f"Unexpected error fetching credits: {str(e)}")
            return {
                'successful': False,
                'data': None,
                'error': f"Unexpected error: {str(e)}"
            }

    def get_batch_results(self, file_id: str) -> Dict[str, Any]:
        """
        Get results from a batch verification

        Args:
            file_id (str): The file ID from batch submission

        Returns:
            Dict containing batch results
        """
        try:
            url = f"{self.base_url}/v3/bulkapi/download"
            params = {
                'api': self.api_key,
                'file_id': file_id
            }

            logger.info(f"Fetching batch results for file_id: {file_id}")
            response = requests.get(url, params=params, headers=self.headers, timeout=30)
            response.raise_for_status()

            # Handle both JSON and CSV responses
            content_type = response.headers.get('content-type', '')
            if 'application/json' in content_type:
                result = response.json()
            else:
                # CSV response
                result = {
                    'file_id': file_id,
                    'format': 'csv',
                    'data': response.text,
                    'size': len(response.text)
                }

            # Add HEIR/ORBT compliance metadata
            result['heir_metadata'] = {
                'unique_id': f"HEIR-{datetime.now().strftime('%Y-%m-%d')}-RESULTS-{hash(file_id) % 10000:04d}",
                'process_id': f"PRC-MILLION-RESULTS-{int(datetime.now().timestamp())}",
                'orbt_layer': 2,
                'blueprint_version': "1.0",
                'timestamp': datetime.now().isoformat(),
                'tool': "million_verifier",
                'action': "get_batch_results",
                'file_id': file_id
            }

            return {
                'successful': True,
                'data': result,
                'error': None
            }

        except requests.exceptions.RequestException as e:
            logger.error(f"Batch results API request failed: {str(e)}")
            return {
                'successful': False,
                'data': None,
                'error': f"Batch results API request failed: {str(e)}"
            }
        except Exception as e:
            logger.error(f"Unexpected error fetching batch results: {str(e)}")
            return {
                'successful': False,
                'data': None,
                'error': f"Unexpected error: {str(e)}"
            }

# Composio MCP Tool Interface Functions
def handle_million_verifier_tool(tool_name: str, data: Dict[str, Any], unique_id: str, process_id: str, orbt_layer: int, blueprint_version: str) -> Dict[str, Any]:
    """
    Handle Million Verifier tool requests through Composio MCP interface

    Args:
        tool_name (str): The specific tool to execute
        data (Dict): Tool-specific parameters
        unique_id (str): HEIR unique identifier
        process_id (str): HEIR process identifier
        orbt_layer (int): ORBT layer identifier
        blueprint_version (str): Blueprint version

    Returns:
        Dict containing tool execution results
    """
    try:
        # Initialize Million Verifier with API key from config
        api_key = "7hLlWoR3DCDoDwDllpafUh4U9"
        mv_tool = MillionVerifierTool(api_key)

        # Route to appropriate tool function
        if tool_name.upper() == "VERIFY_EMAIL":
            email = data.get('email')
            if not email:
                return {
                    'successful': False,
                    'data': None,
                    'error': 'Email parameter is required'
                }
            timeout = data.get('timeout', 30)
            return mv_tool.verify_single_email(email, timeout)

        elif tool_name.upper() == "BATCH_VERIFY":
            emails = data.get('emails', [])
            if not emails:
                return {
                    'successful': False,
                    'data': None,
                    'error': 'Emails list is required'
                }
            filename = data.get('filename')
            return mv_tool.batch_verify_emails(emails, filename)

        elif tool_name.upper() == "GET_CREDITS":
            return mv_tool.get_credits()

        elif tool_name.upper() == "GET_RESULTS":
            file_id = data.get('file_id')
            if not file_id:
                return {
                    'successful': False,
                    'data': None,
                    'error': 'file_id parameter is required'
                }
            return mv_tool.get_batch_results(file_id)

        else:
            return {
                'successful': False,
                'data': None,
                'error': f'Unknown Million Verifier tool: {tool_name}'
            }

    except Exception as e:
        logger.error(f"Error handling Million Verifier tool {tool_name}: {str(e)}")
        return {
            'successful': False,
            'data': None,
            'error': f'Tool execution error: {str(e)}'
        }

if __name__ == "__main__":
    # Test the tool
    api_key = "7hLlWoR3DCDoDwDllpafUh4U9"
    mv = MillionVerifierTool(api_key)

    # Test getting credits
    credits_result = mv.get_credits()
    print("Credits test:", json.dumps(credits_result, indent=2))

    # Test single email verification
    test_email = "test@example.com"
    verify_result = mv.verify_single_email(test_email)
    print("Single verification test:", json.dumps(verify_result, indent=2))