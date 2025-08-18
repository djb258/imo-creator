"""Tests for LLM endpoint functionality"""
import pytest
import json
from unittest.mock import patch, Mock
from fastapi.testclient import TestClient
from src.server.main import app

client = TestClient(app)

def test_llm_endpoint_missing_prompt():
    """Test LLM endpoint with missing prompt"""
    response = client.post("/llm", json={})
    assert response.status_code == 400
    assert "Prompt is required" in response.json()["error"]

def test_llm_endpoint_no_api_keys():
    """Test LLM endpoint with no API keys configured"""
    with patch.dict('os.environ', {}, clear=True):
        response = client.post("/llm", json={"prompt": "test"})
        assert response.status_code == 502
        assert "No API key configured" in response.json()["error"]

@patch('requests.post')
def test_llm_endpoint_anthropic_success(mock_post):
    """Test successful Anthropic API call"""
    # Mock successful Anthropic response
    mock_response = Mock()
    mock_response.ok = True
    mock_response.json.return_value = {
        "content": [{"text": "Test response"}]
    }
    mock_post.return_value = mock_response
    
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test'}):
        response = client.post("/llm", json={
            "prompt": "test prompt",
            "system": "test system"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["text"] == "Test response"
        assert data["provider"] == "anthropic"
        assert "model" in data

@patch('requests.post')
def test_llm_endpoint_anthropic_json_mode(mock_post):
    """Test Anthropic API call with JSON mode"""
    # Mock tool use response
    mock_response = Mock()
    mock_response.ok = True
    mock_response.json.return_value = {
        "content": [{
            "type": "tool_use",
            "input": {"response": {"test": "data"}}
        }]
    }
    mock_post.return_value = mock_response
    
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test'}):
        response = client.post("/llm", json={
            "prompt": "test prompt",
            "json": True
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["json"] == {"test": "data"}
        assert data["provider"] == "anthropic"

@patch('requests.post')
def test_llm_endpoint_openai_success(mock_post):
    """Test successful OpenAI API call"""
    # Mock successful OpenAI response
    mock_response = Mock()
    mock_response.ok = True
    mock_response.json.return_value = {
        "choices": [{
            "message": {"content": "Test response"}
        }]
    }
    mock_post.return_value = mock_response
    
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'sk-test', 'LLM_PROVIDER': 'openai'}):
        response = client.post("/llm", json={
            "prompt": "test prompt"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["text"] == "Test response"
        assert data["provider"] == "openai"

@patch('requests.post')
def test_llm_endpoint_api_error(mock_post):
    """Test API error handling"""
    # Mock API error
    mock_response = Mock()
    mock_response.ok = False
    mock_response.json.return_value = {
        "error": {"message": "API Error"}
    }
    mock_post.return_value = mock_response
    
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test'}):
        response = client.post("/llm", json={
            "prompt": "test prompt"
        })
        
        assert response.status_code == 502
        assert "API Error" in response.json()["error"]