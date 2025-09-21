import requests
import sys
import json
from datetime import datetime

class AroviaAPITester:
    def __init__(self, base_url="https://rural-wellness-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            self.failed_tests.append({'name': name, 'error': 'Timeout'})
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({'name': name, 'error': str(e)})
            return False, {}

    def test_basic_endpoints(self):
        """Test basic API endpoints"""
        print("\n" + "="*50)
        print("TESTING BASIC ENDPOINTS")
        print("="*50)
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test status endpoint
        status_data = {"client_name": "test_client"}
        self.run_test("Create Status Check", "POST", "status", 200, status_data)
        self.run_test("Get Status Checks", "GET", "status", 200)

    def test_doctor_endpoints(self):
        """Test doctor-related endpoints"""
        print("\n" + "="*50)
        print("TESTING DOCTOR ENDPOINTS")
        print("="*50)
        
        # Get all doctors
        success, doctors_data = self.run_test("Get All Doctors", "GET", "doctors", 200)
        
        if success and doctors_data:
            print(f"   Found {len(doctors_data)} doctors")
            
            # Test getting specific doctor
            if len(doctors_data) > 0:
                doctor_id = doctors_data[0].get('id')
                if doctor_id:
                    self.run_test("Get Specific Doctor", "GET", f"doctors/{doctor_id}", 200)
            
            # Test doctor booking
            booking_data = {
                "doctor_id": doctors_data[0].get('id', 'test_id'),
                "patient_name": "Test Patient",
                "patient_age": 30,
                "symptoms": "Fever and headache",
                "contact_number": "+91-9876543210",
                "preferred_time": "Morning"
            }
            self.run_test("Book Doctor Appointment", "POST", "doctors/book", 200, booking_data)

    def test_medicine_endpoints(self):
        """Test medicine-related endpoints"""
        print("\n" + "="*50)
        print("TESTING MEDICINE ENDPOINTS")
        print("="*50)
        
        # Get all medicines
        success, medicines_data = self.run_test("Get All Medicines", "GET", "medicines", 200)
        
        if success and medicines_data:
            print(f"   Found {len(medicines_data)} medicines")
            
            # Test category filter
            if len(medicines_data) > 0:
                category = medicines_data[0].get('category', 'Pain Relief')
                self.run_test("Get Medicines by Category", "GET", f"medicines/category/{category}", 200)

    def test_emergency_endpoints(self):
        """Test emergency-related endpoints"""
        print("\n" + "="*50)
        print("TESTING EMERGENCY ENDPOINTS")
        print("="*50)
        
        # Get emergency contacts
        success, contacts_data = self.run_test("Get Emergency Contacts", "GET", "emergency/contacts", 200)
        
        if success and contacts_data:
            print(f"   Found {len(contacts_data)} emergency contacts")
        
        # Test SOS trigger
        sos_data = {"location": {"lat": 23.2599, "lng": 77.4126}}
        self.run_test("Trigger SOS", "POST", "emergency/sos", 200, sos_data)

    def test_ai_endpoints(self):
        """Test AI-powered endpoints (Critical for Arovia)"""
        print("\n" + "="*50)
        print("TESTING AI ENDPOINTS (CRITICAL)")
        print("="*50)
        
        # Test Dadi Chatbot
        dadi_data = {
            "message": "I have a headache and fever. What should I do?",
            "user_id": "test_user_123"
        }
        print("Testing Dadi Chatbot (may take 10-15 seconds for AI response)...")
        success, response = self.run_test("Dadi Chatbot", "POST", "chat/dadi", 200, dadi_data, timeout=45)
        
        if success and response:
            ai_response = response.get('response', '')
            print(f"   AI Response preview: {ai_response[:100]}...")
        
        # Test Health Planner
        health_data = {
            "user_data": {
                "age": "35",
                "symptoms": "Joint pain and fatigue",
                "conditions": "Diabetes"
            },
            "user_id": "test_user_123"
        }
        print("Testing Health Planner (may take 10-15 seconds for AI response)...")
        success, response = self.run_test("Health Planner", "POST", "health/planner", 200, health_data, timeout=45)
        
        if success and response:
            health_plan = response.get('health_plan', '')
            print(f"   Health Plan preview: {health_plan[:100]}...")
        
        # Test Symptom Analysis
        symptom_data = {
            "symptoms": "Cough and chest pain",
            "age": "45",
            "user_id": "test_user_123"
        }
        print("Testing Symptom Analysis (may take 10-15 seconds for AI response)...")
        success, response = self.run_test("Symptom Analysis", "POST", "symptoms/analyze", 200, symptom_data, timeout=45)
        
        if success and response:
            analysis = response.get('analysis', '')
            print(f"   Analysis preview: {analysis[:100]}...")

    def test_disease_radar_endpoints(self):
        """Test disease radar endpoints"""
        print("\n" + "="*50)
        print("TESTING DISEASE RADAR ENDPOINTS")
        print("="*50)
        
        # Get disease alerts
        success, alerts_data = self.run_test("Get Disease Alerts", "GET", "disease/alerts", 200)
        
        if success:
            print(f"   Found {len(alerts_data) if alerts_data else 0} disease alerts")
        
        # Test disease reporting
        report_data = {
            "village": "Test Village",
            "disease": "Common Cold"
        }
        self.run_test("Report Disease", "POST", "disease/report", 200, report_data)

    def test_reminder_endpoints(self):
        """Test reminder endpoints"""
        print("\n" + "="*50)
        print("TESTING REMINDER ENDPOINTS")
        print("="*50)
        
        # Test get user reminders
        self.run_test("Get User Reminders", "GET", "reminders/test_user_123", 200)
        
        # Test create reminder
        reminder_data = {
            "user_id": "test_user_123",
            "reminder_type": "medicine",
            "title": "Take Blood Pressure Medicine",
            "description": "Take your daily BP medication",
            "time": "08:00",
            "frequency": "daily"
        }
        self.run_test("Create Reminder", "POST", "reminders", 200, reminder_data)

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Arovia Healthcare Platform API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        
        # Run all test suites
        self.test_basic_endpoints()
        self.test_doctor_endpoints()
        self.test_medicine_endpoints()
        self.test_emergency_endpoints()
        self.test_ai_endpoints()  # Critical for Arovia
        self.test_disease_radar_endpoints()
        self.test_reminder_endpoints()
        
        # Print final results
        print("\n" + "="*60)
        print("FINAL TEST RESULTS")
        print("="*60)
        print(f"📊 Tests passed: {self.tests_passed}/{self.tests_run}")
        print(f"✅ Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests ({len(self.failed_tests)}):")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"   {i}. {test['name']}")
                if 'expected' in test:
                    print(f"      Expected: {test['expected']}, Got: {test['actual']}")
                if 'error' in test:
                    print(f"      Error: {test['error']}")
                if 'response' in test:
                    print(f"      Response: {test['response']}")
        
        return 0 if self.tests_passed == self.tests_run else 1

def main():
    tester = AroviaAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())