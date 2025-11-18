"""
Backblaze B2 Client Module
Native B2 API client for Backblaze B2 storage.
"""

import os
import base64
import requests


class B2Client:
    """Native Backblaze B2 API client"""

    def __init__(self, key_id, app_key, bucket_name):
        self.key_id = key_id
        self.app_key = app_key
        self.bucket_name = bucket_name
        self.auth_token = None
        self.api_url = None
        self.download_url = None
        self.bucket_id = None
        self._authorize()

    def _authorize(self):
        """Authorize with B2 and get auth token"""
        auth_url = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account"
        id_and_key = f"{self.key_id}:{self.app_key}"
        basic_auth = base64.b64encode(id_and_key.encode()).decode()

        headers = {'Authorization': f'Basic {basic_auth}'}
        response = requests.get(auth_url, headers=headers)

        if response.status_code != 200:
            raise Exception(f"B2 Authorization failed: {response.text}")

        auth_data = response.json()
        self.auth_token = auth_data['authorizationToken']
        self.api_url = auth_data['apiUrl']
        self.download_url = auth_data['downloadUrl']

        # Get bucket ID
        self._get_bucket_id()

    def _get_bucket_id(self):
        """Get the bucket ID for the specified bucket name"""
        url = f"{self.api_url}/b2api/v2/b2_list_buckets"
        headers = {'Authorization': self.auth_token}
        data = {'accountId': self.key_id, 'bucketName': self.bucket_name}

        response = requests.post(url, headers=headers, json=data)
        if response.status_code != 200:
            raise Exception(f"Failed to get bucket ID: {response.text}")

        buckets = response.json().get('buckets', [])
        if not buckets:
            raise Exception(f"Bucket '{self.bucket_name}' not found")

        self.bucket_id = buckets[0]['bucketId']

    def download_file(self, file_name, local_path):
        """Download a file from B2"""
        url = f"{self.download_url}/file/{self.bucket_name}/{file_name}"
        headers = {'Authorization': self.auth_token}

        response = requests.get(url, headers=headers, stream=True)
        if response.status_code == 404:
            raise FileNotFoundError(f"File '{file_name}' not found in bucket")
        elif response.status_code != 200:
            raise Exception(f"Failed to download file: {response.text}")

        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        return local_path

    def upload_file(self, local_path, file_name):
        """Upload a file to B2"""
        # Get upload URL
        url = f"{self.api_url}/b2api/v2/b2_get_upload_url"
        headers = {'Authorization': self.auth_token}
        data = {'bucketId': self.bucket_id}

        response = requests.post(url, headers=headers, json=data)
        if response.status_code != 200:
            raise Exception(f"Failed to get upload URL: {response.text}")

        upload_data = response.json()
        upload_url = upload_data['uploadUrl']
        upload_auth_token = upload_data['authorizationToken']

        # Calculate SHA1
        import hashlib
        with open(local_path, 'rb') as f:
            file_data = f.read()
            sha1 = hashlib.sha1(file_data).hexdigest()

        # Upload file
        upload_headers = {
            'Authorization': upload_auth_token,
            'X-Bz-File-Name': file_name,
            'Content-Type': 'application/octet-stream',
            'X-Bz-Content-Sha1': sha1
        }

        response = requests.post(upload_url, headers=upload_headers, data=file_data)
        if response.status_code != 200:
            raise Exception(f"Failed to upload file: {response.text}")

        return response.json()

    def list_files(self, max_files=100):
        """List files in the bucket"""
        url = f"{self.api_url}/b2api/v2/b2_list_file_names"
        headers = {'Authorization': self.auth_token}
        data = {
            'bucketId': self.bucket_id,
            'maxFileCount': max_files
        }

        response = requests.post(url, headers=headers, json=data)
        if response.status_code != 200:
            raise Exception(f"Failed to list files: {response.text}")

        return response.json().get('files', [])


def get_b2_client():
    """
    Create and return a native Backblaze B2 client.

    Reads the following environment variables:
    - B2_KEY_ID: Backblaze B2 Key ID
    - B2_APPLICATION_KEY: Backblaze B2 Application Key
    - B2_BUCKET: Backblaze B2 Bucket name

    Returns:
        B2Client: Authenticated B2 client instance
    """
    key_id = os.getenv('B2_KEY_ID')
    app_key = os.getenv('B2_APPLICATION_KEY')
    bucket = os.getenv('B2_BUCKET')

    if not all([key_id, app_key, bucket]):
        raise ValueError(
            "Missing required B2 environment variables. "
            "Please set B2_KEY_ID, B2_APPLICATION_KEY, and B2_BUCKET."
        )

    return B2Client(key_id, app_key, bucket)
