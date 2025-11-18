"""
Backblaze B2 Client Module
S3-compatible client for Backblaze B2 storage.
"""

import os
import boto3
from botocore.client import Config


def get_b2_client():
    """
    Create and return an S3-compatible Backblaze B2 client.

    Reads the following environment variables:
    - B2_ENDPOINT: Backblaze B2 endpoint URL
    - B2_KEY_ID: Backblaze B2 Key ID
    - B2_APPLICATION_KEY: Backblaze B2 Application Key
    - B2_BUCKET: Backblaze B2 Bucket name

    Returns:
        tuple: (s3_client, bucket_name)
    """
    endpoint = os.getenv('B2_ENDPOINT')
    key_id = os.getenv('B2_KEY_ID')
    app_key = os.getenv('B2_APPLICATION_KEY')
    bucket = os.getenv('B2_BUCKET')

    if not all([endpoint, key_id, app_key, bucket]):
        raise ValueError(
            "Missing required B2 environment variables. "
            "Please set B2_ENDPOINT, B2_KEY_ID, B2_APPLICATION_KEY, and B2_BUCKET."
        )

    # Create S3-compatible client for Backblaze B2
    s3_client = boto3.client(
        's3',
        endpoint_url=endpoint,
        aws_access_key_id=key_id,
        aws_secret_access_key=app_key,
        config=Config(signature_version='s3v4')
    )

    return s3_client, bucket
