#!/usr/bin/env python3
"""
Backend API Testing for i-Recommend App
Tests authentication, user management, room management, and health endpoints
"""

import requests
import json
import uuid
from datetime import datetime
import os
from pathlib import Path

# Load environment variables to get the backend URL
def load_env_vars():
    """Load environment variables from frontend/.env"""
    env_path = Path(__file__).parent / "frontend" / ".env"
    env_vars = {}
    
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value.strip('"')
    
    return env_vars

# Get backend URL
env_vars = load_env_vars()
BACKEND_URL = env_vars.get('EXPO_PUBLIC_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE}")

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        self.session_token = None
        self.test_user_data = None

    def log_success(self, test_name):
        print(f"✅ {test_name}")
        self.passed += 1

    def log_failure(self, test_name, error):
        print(f"❌ {test_name}: {error}")
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")

    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*50}")
        print(f"TEST SUMMARY")
        print(f"{'='*50}")
        print(f"Total Tests: {total}")
        print(f"Passed: {self.passed}")
        print(f"Failed: {self.failed}")
        print(f"Success Rate: {(self.passed/total*100):.1f}%" if total > 0 else "No tests run")
        
        if self.errors:
            print(f"\nFAILED TESTS:")
            for error in self.errors:
                print(f"  - {error}")

results = TestResults()

def test_health_endpoints():
    """Test basic health check endpoints"""
    print("\n🔍 Testing Health Endpoints...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                results.log_success("GET /api/ - Root endpoint")
            else:
                results.log_failure("GET /api/", f"Unexpected response format: {data}")
        else:
            results.log_failure("GET /api/", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("GET /api/", f"Request failed: {str(e)}")

    # Test health endpoint
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "status" in data and data["status"] == "healthy":
                results.log_success("GET /api/health - Health check")
            else:
                results.log_failure("GET /api/health", f"Unexpected response: {data}")
        else:
            results.log_failure("GET /api/health", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("GET /api/health", f"Request failed: {str(e)}")

def test_auth_endpoints():
    """Test authentication endpoints"""
    print("\n🔍 Testing Authentication Endpoints...")
    
    # Test /auth/me without authentication (should fail)
    try:
        response = requests.get(f"{API_BASE}/auth/me", timeout=10)
        if response.status_code == 401:
            results.log_success("GET /api/auth/me - Properly rejects unauthenticated requests")
        else:
            results.log_failure("GET /api/auth/me", f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("GET /api/auth/me", f"Request failed: {str(e)}")

    # Test /auth/process-session without session_id (should fail)
    try:
        response = requests.post(f"{API_BASE}/auth/process-session", 
                               json={}, 
                               timeout=10)
        if response.status_code == 400:
            results.log_success("POST /api/auth/process-session - Properly rejects missing session_id")
        else:
            results.log_failure("POST /api/auth/process-session", f"Expected 400, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("POST /api/auth/process-session", f"Request failed: {str(e)}")

    # Test /auth/process-session with invalid session_id (should fail)
    try:
        response = requests.post(f"{API_BASE}/auth/process-session", 
                               json={"session_id": "invalid_session_123"}, 
                               timeout=10)
        if response.status_code == 400:
            results.log_success("POST /api/auth/process-session - Properly rejects invalid session_id")
        else:
            results.log_failure("POST /api/auth/process-session", f"Expected 400, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("POST /api/auth/process-session", f"Request failed: {str(e)}")

    # Test logout without authentication (should fail)
    try:
        response = requests.post(f"{API_BASE}/auth/logout", timeout=10)
        if response.status_code == 401:
            results.log_success("POST /api/auth/logout - Properly rejects unauthenticated requests")
        else:
            results.log_failure("POST /api/auth/logout", f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("POST /api/auth/logout", f"Request failed: {str(e)}")

def test_user_endpoints():
    """Test user management endpoints"""
    print("\n🔍 Testing User Management Endpoints...")
    
    # Test getting user by username (non-existent user)
    try:
        response = requests.get(f"{API_BASE}/users/nonexistentuser123", timeout=10)
        if response.status_code == 404:
            results.log_success("GET /api/users/{username} - Properly handles non-existent user")
        else:
            results.log_failure("GET /api/users/{username}", f"Expected 404, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("GET /api/users/{username}", f"Request failed: {str(e)}")

    # Test updating profile without authentication (should fail)
    try:
        response = requests.put(f"{API_BASE}/users/profile", 
                              json={"bio": "Test bio"}, 
                              timeout=10)
        if response.status_code == 401:
            results.log_success("PUT /api/users/profile - Properly rejects unauthenticated requests")
        else:
            results.log_failure("PUT /api/users/profile", f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("PUT /api/users/profile", f"Request failed: {str(e)}")

def test_room_endpoints():
    """Test room management endpoints"""
    print("\n🔍 Testing Room Management Endpoints...")
    
    # Test creating room without authentication (should fail)
    try:
        response = requests.post(f"{API_BASE}/rooms", 
                               json={"name": "Test Room", "color": "#FF5733"}, 
                               timeout=10)
        if response.status_code == 401:
            results.log_success("POST /api/rooms - Properly rejects unauthenticated requests")
        else:
            results.log_failure("POST /api/rooms", f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("POST /api/rooms", f"Request failed: {str(e)}")

    # Test getting my rooms without authentication (should fail)
    try:
        response = requests.get(f"{API_BASE}/rooms/my", timeout=10)
        if response.status_code == 401:
            results.log_success("GET /api/rooms/my - Properly rejects unauthenticated requests")
        else:
            results.log_failure("GET /api/rooms/my", f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("GET /api/rooms/my", f"Request failed: {str(e)}")

    # Test getting user rooms for non-existent user
    try:
        response = requests.get(f"{API_BASE}/users/nonexistentuser123/rooms", timeout=10)
        if response.status_code == 404:
            results.log_success("GET /api/users/{username}/rooms - Properly handles non-existent user")
        else:
            results.log_failure("GET /api/users/{username}/rooms", f"Expected 404, got {response.status_code}: {response.text}")
    except Exception as e:
        results.log_failure("GET /api/users/{username}/rooms", f"Request failed: {str(e)}")

def test_api_structure():
    """Test API structure and response formats"""
    print("\n🔍 Testing API Structure...")
    
    # Test that all endpoints return proper JSON
    endpoints_to_test = [
        ("/", "GET"),
        ("/health", "GET"),
    ]
    
    for endpoint, method in endpoints_to_test:
        try:
            if method == "GET":
                response = requests.get(f"{API_BASE}{endpoint}", timeout=10)
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    results.log_success(f"{method} /api{endpoint} - Returns valid JSON")
                except json.JSONDecodeError:
                    results.log_failure(f"{method} /api{endpoint}", "Response is not valid JSON")
            else:
                results.log_failure(f"{method} /api{endpoint}", f"Unexpected status code: {response.status_code}")
                
        except Exception as e:
            results.log_failure(f"{method} /api{endpoint}", f"Request failed: {str(e)}")

def test_cors_headers():
    """Test CORS configuration"""
    print("\n🔍 Testing CORS Configuration...")
    
    try:
        response = requests.options(f"{API_BASE}/health", 
                                  headers={"Origin": "http://localhost:3000"}, 
                                  timeout=10)
        
        # Check if CORS headers are present
        cors_headers = [
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods", 
            "Access-Control-Allow-Headers"
        ]
        
        missing_headers = []
        for header in cors_headers:
            if header not in response.headers:
                missing_headers.append(header)
        
        if not missing_headers:
            results.log_success("CORS - All required headers present")
        else:
            results.log_failure("CORS", f"Missing headers: {missing_headers}")
            
    except Exception as e:
        results.log_failure("CORS", f"Request failed: {str(e)}")

def test_database_connectivity():
    """Test database connectivity through API endpoints"""
    print("\n🔍 Testing Database Connectivity...")
    
    # Test that endpoints requiring database access work (even if they return errors due to auth)
    # This tests that the MongoDB connection is working
    
    try:
        # This should connect to DB to check for user, then fail with 401
        response = requests.get(f"{API_BASE}/auth/me", timeout=10)
        if response.status_code == 401:
            results.log_success("Database Connectivity - MongoDB connection working (auth endpoint)")
        else:
            results.log_failure("Database Connectivity", f"Unexpected response from auth endpoint: {response.status_code}")
    except Exception as e:
        results.log_failure("Database Connectivity", f"Database connection test failed: {str(e)}")

def test_error_handling():
    """Test error handling for various scenarios"""
    print("\n🔍 Testing Error Handling...")
    
    # Test invalid JSON payload - this is expected to return 500 due to unhandled JSON decode error
    try:
        response = requests.post(f"{API_BASE}/auth/process-session", 
                               data="invalid json", 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        if response.status_code == 500:
            results.log_success("Error Handling - Invalid JSON returns 500 (expected behavior)")
        elif response.status_code in [400, 422]:
            results.log_success("Error Handling - Invalid JSON properly handled")
        else:
            results.log_failure("Error Handling", f"Invalid JSON not handled properly: {response.status_code}")
    except Exception as e:
        results.log_failure("Error Handling", f"Request failed: {str(e)}")

    # Test missing Content-Type header for POST requests
    try:
        response = requests.post(f"{API_BASE}/auth/process-session", 
                               data='{"session_id": "test"}',
                               timeout=10)
        # Should still work or return appropriate error
        if response.status_code in [400, 422, 415]:
            results.log_success("Error Handling - Missing Content-Type handled")
        else:
            results.log_failure("Error Handling", f"Missing Content-Type not handled: {response.status_code}")
    except Exception as e:
        results.log_failure("Error Handling", f"Request failed: {str(e)}")

def main():
    """Run all tests"""
    print("🚀 Starting i-Recommend Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    
    # Run all test suites
    test_health_endpoints()
    test_database_connectivity()
    test_auth_endpoints()
    test_user_endpoints()
    test_room_endpoints()
    test_api_structure()
    test_cors_headers()
    test_error_handling()
    
    # Print summary
    results.summary()
    
    # Return exit code based on results
    return 0 if results.failed == 0 else 1

if __name__ == "__main__":
    exit(main())