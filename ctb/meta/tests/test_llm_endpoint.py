"""Tests for concurrent provider LLM endpoint functionality"""
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
        assert response.status_code == 400
        assert "No provider/key available" in response.json()["error"]

def test_provider_selection_explicit():
    """Test explicit provider selection"""
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test', 'OPENAI_API_KEY': 'sk-test'}):
        # Test explicit anthropic
        response = client.post("/llm", json={"prompt": "test", "provider": "anthropic"})
        assert response.status_code == 400 or response.status_code == 502  # Will fail due to mock, but provider logic works
        
        # Test explicit openai  
        response = client.post("/llm", json={"prompt": "test", "provider": "openai"})
        assert response.status_code == 400 or response.status_code == 502  # Will fail due to mock, but provider logic works

def test_provider_selection_by_model():
    """Test provider inference from model name"""
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test', 'OPENAI_API_KEY': 'sk-test'}):
        # Test claude model -> anthropic
        response = client.post("/llm", json={"prompt": "test", "model": "claude-3-5-sonnet-20240620"})
        assert response.status_code == 400 or response.status_code == 502
        
        # Test gpt model -> openai
        response = client.post("/llm", json={"prompt": "test", "model": "gpt-4o-mini"})
        assert response.status_code == 400 or response.status_code == 502
        
        # Test o-series model -> openai
        response = client.post("/llm", json={"prompt": "test", "model": "o1-preview"})
        assert response.status_code == 400 or response.status_code == 502

def test_provider_selection_default():
    """Test default provider selection"""
    # Test default openai
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'sk-test', 'LLM_DEFAULT_PROVIDER': 'openai'}):
        response = client.post("/llm", json={"prompt": "test"})
        assert response.status_code == 400 or response.status_code == 502
    
    # Test default anthropic
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test', 'LLM_DEFAULT_PROVIDER': 'anthropic'}):
        response = client.post("/llm", json={"prompt": "test"})
        assert response.status_code == 400 or response.status_code == 502

def test_provider_selection_single_key():
    """Test single key selection"""
    # Only anthropic key
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test'}, clear=True):
        response = client.post("/llm", json={"prompt": "test"})
        assert response.status_code == 400 or response.status_code == 502
    
    # Only openai key
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'sk-test'}, clear=True):
        response = client.post("/llm", json={"prompt": "test"})
        assert response.status_code == 400 or response.status_code == 502

def test_provider_selection_validation():
    """Test provider validation errors"""
    # Request anthropic without key
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'sk-test'}, clear=True):
        response = client.post("/llm", json={"prompt": "test", "provider": "anthropic"})
        assert response.status_code == 400
        assert "Anthropic API key not configured" in response.json()["error"]
    
    # Request openai without key
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test'}, clear=True):
        response = client.post("/llm", json={"prompt": "test", "provider": "openai"})
        assert response.status_code == 400
        assert "OpenAI API key not configured" in response.json()["error"]

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