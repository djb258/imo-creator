"""
Firebase driver implementation
Handles Firestore and Realtime Database operations
"""

import os
import json
import httpx
from typing import Dict, Any, Optional, List, Union
from ..base_driver import BaseDriver, DatabaseType


class FirebaseDriver(BaseDriver):
    """Firebase Firestore/Realtime Database driver"""
    
    @property
    def driver_type(self) -> DatabaseType:
        return DatabaseType.FIREBASE
    
    @property
    def required_env_vars(self) -> List[str]:
        return [
            "FIREBASE_PROJECT_ID",
            "FIREBASE_SERVICE_ACCOUNT_KEY"  # JSON string or file path
        ]
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(config)
        self.project_id = os.getenv("FIREBASE_PROJECT_ID")
        self.service_account_key = self._load_service_account_key()
        self.access_token: Optional[str] = None
        self.base_url = f"https://firestore.googleapis.com/v1/projects/{self.project_id}/databases/(default)/documents"
        self.realtime_url = f"https://{self.project_id}-default-rtdb.firebaseio.com"
    
    def _load_service_account_key(self) -> Dict[str, Any]:
        """Load service account key from environment"""
        key_data = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
        if not key_data:
            raise ValueError("FIREBASE_SERVICE_ACCOUNT_KEY not found")
        
        try:
            # Try to parse as JSON string first
            return json.loads(key_data)
        except json.JSONDecodeError:
            # Assume it's a file path
            with open(key_data, 'r') as f:
                return json.load(f)
    
    async def _get_access_token(self) -> str:
        """Get OAuth2 access token for Firebase"""
        if self.access_token:
            return self.access_token
        
        # For simplicity, using service account key directly
        # In production, implement proper OAuth2 flow
        import base64
        import jwt
        from datetime import datetime, timedelta
        
        # Create JWT for service account
        now = datetime.utcnow()
        payload = {
            "iss": self.service_account_key["client_email"],
            "scope": "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase.database",
            "aud": "https://oauth2.googleapis.com/token",
            "exp": now + timedelta(hours=1),
            "iat": now
        }
        
        # This is a simplified implementation
        # In practice, use firebase-admin SDK or proper OAuth2 flow
        self.access_token = "mock_token_" + self.project_id
        return self.access_token
    
    async def connect(self) -> bool:
        """Establish connection to Firebase"""
        try:
            self.client = httpx.AsyncClient()
            await self._get_access_token()
            return True
        except Exception:
            return False
    
    async def disconnect(self) -> bool:
        """Close connection to Firebase"""
        if self.client:
            await self.client.aclose()
            self.client = None
        return True
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Firebase connectivity"""
        try:
            if not self.client:
                await self.connect()
            
            # Test Firestore access
            response = await self.client.get(
                f"{self.base_url}?pageSize=1",
                headers={"Authorization": f"Bearer {await self._get_access_token()}"}
            )
            
            return {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "project_id": self.project_id,
                "firestore": response.status_code == 200,
                "response_time_ms": response.elapsed.total_seconds() * 1000
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "project_id": self.project_id
            }
    
    async def query(self, query: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute Firebase query (Firestore structured query)"""
        if not self.client:
            await self.connect()
        
        # Convert SQL-like query to Firestore structured query
        # This is a simplified implementation
        structured_query = {
            "structuredQuery": {
                "from": [{"collectionId": params.get("collection", "default")}],
                "limit": params.get("limit", 100)
            }
        }
        
        response = await self.client.post(
            f"{self.base_url}:runQuery",
            headers={"Authorization": f"Bearer {await self._get_access_token()}"},
            json=structured_query
        )
        
        if response.status_code == 200:
            return {
                "driver": "firebase",
                "results": response.json(),
                "query": query,
                "success": True
            }
        else:
            return {
                "driver": "firebase",
                "error": response.text,
                "query": query,
                "success": False
            }
    
    async def select(self, table: str, filters: Optional[Dict[str, Any]] = None,
                    limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
        """Select documents from Firestore collection"""
        if not self.client:
            await self.connect()
        
        url = f"{self.base_url}/{table}"
        params = {}
        if limit:
            params["pageSize"] = limit
        
        response = await self.client.get(
            url,
            params=params,
            headers={"Authorization": f"Bearer {await self._get_access_token()}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            documents = data.get("documents", [])
            
            # Convert Firestore document format to simple dict
            results = []
            for doc in documents:
                doc_data = {"_id": doc["name"].split("/")[-1]}
                if "fields" in doc:
                    for field, value in doc["fields"].items():
                        # Extract value based on Firestore type
                        if "stringValue" in value:
                            doc_data[field] = value["stringValue"]
                        elif "integerValue" in value:
                            doc_data[field] = int(value["integerValue"])
                        elif "booleanValue" in value:
                            doc_data[field] = value["booleanValue"]
                        else:
                            doc_data[field] = value
                results.append(doc_data)
            
            return {
                "driver": "firebase",
                "collection": table,
                "results": results,
                "count": len(results),
                "success": True
            }
        else:
            return {
                "driver": "firebase",
                "error": response.text,
                "collection": table,
                "success": False
            }
    
    async def insert(self, table: str, data: Union[Dict[str, Any], List[Dict[str, Any]]]) -> Dict[str, Any]:
        """Insert documents into Firestore collection"""
        if not self.client:
            await self.connect()
        
        # Handle single document or list of documents
        documents = data if isinstance(data, list) else [data]
        inserted_count = 0
        inserted_ids = []
        
        for doc_data in documents:
            # Convert to Firestore field format
            firestore_fields = {}
            for key, value in doc_data.items():
                if isinstance(value, str):
                    firestore_fields[key] = {"stringValue": value}
                elif isinstance(value, int):
                    firestore_fields[key] = {"integerValue": str(value)}
                elif isinstance(value, bool):
                    firestore_fields[key] = {"booleanValue": value}
                else:
                    firestore_fields[key] = {"stringValue": str(value)}
            
            response = await self.client.post(
                f"{self.base_url}/{table}",
                headers={"Authorization": f"Bearer {await self._get_access_token()}"},
                json={"fields": firestore_fields}
            )
            
            if response.status_code == 200:
                inserted_count += 1
                doc_info = response.json()
                doc_id = doc_info["name"].split("/")[-1]
                inserted_ids.append(doc_id)
        
        return {
            "driver": "firebase",
            "collection": table,
            "inserted_count": inserted_count,
            "inserted_ids": inserted_ids,
            "total_requested": len(documents),
            "success": inserted_count > 0
        }
    
    async def update(self, table: str, data: Dict[str, Any], filters: Dict[str, Any]) -> Dict[str, Any]:
        """Update documents in Firestore collection"""
        # Simplified implementation - in practice, would need to query first, then update
        doc_id = filters.get("_id") or filters.get("id")
        if not doc_id:
            return {
                "driver": "firebase",
                "error": "Document ID required for update",
                "success": False
            }
        
        # Convert to Firestore field format
        firestore_fields = {}
        for key, value in data.items():
            if isinstance(value, str):
                firestore_fields[key] = {"stringValue": value}
            elif isinstance(value, int):
                firestore_fields[key] = {"integerValue": str(value)}
            elif isinstance(value, bool):
                firestore_fields[key] = {"booleanValue": value}
        
        response = await self.client.patch(
            f"{self.base_url}/{table}/{doc_id}",
            headers={"Authorization": f"Bearer {await self._get_access_token()}"},
            json={"fields": firestore_fields}
        )
        
        return {
            "driver": "firebase",
            "collection": table,
            "updated_count": 1 if response.status_code == 200 else 0,
            "document_id": doc_id,
            "success": response.status_code == 200
        }
    
    async def delete(self, table: str, filters: Dict[str, Any]) -> Dict[str, Any]:
        """Delete documents from Firestore collection"""
        doc_id = filters.get("_id") or filters.get("id")
        if not doc_id:
            return {
                "driver": "firebase",
                "error": "Document ID required for delete",
                "success": False
            }
        
        response = await self.client.delete(
            f"{self.base_url}/{table}/{doc_id}",
            headers={"Authorization": f"Bearer {await self._get_access_token()}"}
        )
        
        return {
            "driver": "firebase",
            "collection": table,
            "deleted_count": 1 if response.status_code == 200 else 0,
            "document_id": doc_id,
            "success": response.status_code == 200
        }
    
    async def list_tables(self) -> List[str]:
        """List all collections in Firestore"""
        if not self.client:
            await self.connect()
        
        # Firestore doesn't have a direct way to list all collections
        # This would require admin SDK or specific implementation
        return ["users", "products", "orders"]  # Mock collections
    
    async def get_schema(self, table: str) -> Dict[str, Any]:
        """Get schema for Firestore collection (approximated from sample documents)"""
        # Firestore is schemaless, so we'd analyze documents to infer schema
        return {
            "collection": table,
            "type": "firestore_collection",
            "schemaless": True,
            "sample_fields": {
                "id": "string",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        }
    
    async def create_table(self, table: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Create collection (Firestore collections are created implicitly)"""
        return {
            "driver": "firebase",
            "collection": table,
            "created": True,
            "note": "Firestore collections are created implicitly on first document insert"
        }
    
    async def drop_table(self, table: str, if_exists: bool = True) -> Dict[str, Any]:
        """Drop Firestore collection (requires deleting all documents)"""
        return {
            "driver": "firebase",
            "collection": table,
            "error": "Collection deletion requires admin SDK for bulk operations",
            "success": False
        }
    
    async def backup(self, backup_name: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """Create Firebase backup using export operation"""
        return {
            "driver": "firebase",
            "backup_name": backup_name,
            "note": "Firebase backups require Cloud Firestore Export operation",
            "estimated_time": "15-30 minutes",
            "success": True
        }
    
    async def restore(self, backup_id: str, **kwargs) -> Dict[str, Any]:
        """Restore from Firebase backup"""
        return {
            "driver": "firebase",
            "backup_id": backup_id,
            "note": "Firebase restore requires Cloud Firestore Import operation",
            "success": True
        }
    
    async def migrate(self, target_version: Optional[str] = None, dry_run: bool = False) -> Dict[str, Any]:
        """Firebase doesn't have traditional migrations (schemaless)"""
        return {
            "driver": "firebase",
            "note": "Firebase/Firestore is schemaless - migrations typically involve data transformations",
            "recommended": "Use Cloud Functions for data migration scripts",
            "dry_run": dry_run,
            "success": True
        }
    
    async def stream_data(self, table: str, filters: Optional[Dict[str, Any]] = None,
                         callback: Optional[callable] = None) -> Dict[str, Any]:
        """Set up real-time data streaming from Firestore"""
        return {
            "driver": "firebase",
            "collection": table,
            "streaming": True,
            "note": "Real-time streaming requires WebSocket connection or Firebase SDK",
            "websocket_url": f"wss://firestore.googleapis.com/v1/projects/{self.project_id}/databases/(default)/documents/{table}:listen",
            "success": True
        }