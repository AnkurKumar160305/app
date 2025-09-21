from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# LLM Chat setup
emergent_llm_key = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class Doctor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    specialization: str
    qualifications: str
    experience_years: int
    consultation_fee: int
    location: str
    distance_km: float
    rating: float
    available: bool
    phone: str
    photo: str

class DoctorBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    doctor_id: str
    patient_name: str
    patient_age: int
    symptoms: str
    contact_number: str
    preferred_time: str
    booking_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    message: str
    response: str
    chat_type: str  # 'dadi_chat', 'symptom_analysis', 'health_plan'
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Medicine(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    discounted_price: Optional[float] = None
    category: str
    brand: str
    prescription_required: bool
    stock: int
    image: str

class EmergencyContact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # 'hospital', 'ambulance', 'doctor', 'police'
    phone: str
    address: str
    distance_km: float

class HealthReminder(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    reminder_type: str  # 'medicine', 'vaccination', 'checkup'
    title: str
    description: str
    time: str
    frequency: str  # 'daily', 'weekly', 'monthly'
    active: bool = True

class DiseaseAlert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    village: str
    disease: str
    cases_reported: int
    alert_level: str  # 'low', 'medium', 'high'
    description: str
    prevention_tips: str
    date_reported: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Mock Data Creation Functions
async def create_mock_doctors():
    mock_doctors = [
        {
            "name": "Dr. Rajesh Kumar",
            "specialization": "General Medicine",
            "qualifications": "MBBS, MD",
            "experience_years": 15,
            "consultation_fee": 300,
            "location": "Village Health Center",
            "distance_km": 2.5,
            "rating": 4.5,
            "available": True,
            "phone": "+91-9876543210",
            "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face"
        },
        {
            "name": "Dr. Priya Sharma",
            "specialization": "Pediatrics",
            "qualifications": "MBBS, DCH",
            "experience_years": 12,
            "consultation_fee": 400,
            "location": "Children's Clinic",
            "distance_km": 1.8,
            "rating": 4.8,
            "available": True,
            "phone": "+91-9876543211",
            "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face"
        },
        {
            "name": "Dr. Amit Patel (Ayurveda)",
            "specialization": "Ayurvedic Medicine",
            "qualifications": "BAMS, MD (Ayurveda)",
            "experience_years": 20,
            "consultation_fee": 250,
            "location": "Ayurveda Kendra",
            "distance_km": 3.2,
            "rating": 4.6,
            "available": True,
            "phone": "+91-9876543212",
            "photo": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face"
        },
        {
            "name": "Dr. Sunita Devi",
            "specialization": "Gynecology",
            "qualifications": "MBBS, MS (OBG)",
            "experience_years": 18,
            "consultation_fee": 500,
            "location": "Women's Health Clinic",
            "distance_km": 4.1,
            "rating": 4.7,
            "available": False,
            "phone": "+91-9876543213",
            "photo": "https://images.unsplash.com/photo-1594824286080-87def7821c4e?w=200&h=200&fit=crop&crop=face"
        }
    ]
    
    existing_count = await db.doctors.count_documents({})
    if existing_count == 0:
        for doctor_data in mock_doctors:
            doctor = Doctor(**doctor_data)
            await db.doctors.insert_one(doctor.dict())

async def create_mock_medicines():
    mock_medicines = [
        {
            "name": "Paracetamol 500mg",
            "description": "For fever and pain relief",
            "price": 25.0,
            "discounted_price": 20.0,
            "category": "Pain Relief",
            "brand": "Cipla",
            "prescription_required": False,
            "stock": 100,
            "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop"
        },
        {
            "name": "Amoxicillin 250mg",
            "description": "Antibiotic for bacterial infections",
            "price": 80.0,
            "category": "Antibiotics",
            "brand": "Sun Pharma",
            "prescription_required": True,
            "stock": 50,
            "image": "https://images.unsplash.com/photo-1550572017-edd951aa8ac6?w=300&h=200&fit=crop"
        },
        {
            "name": "Vitamin D3 Tablets",
            "description": "For bone health and immunity",
            "price": 150.0,
            "discounted_price": 120.0,
            "category": "Vitamins",
            "brand": "Mankind",
            "prescription_required": False,
            "stock": 75,
            "image": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop"
        },
        {
            "name": "Ashwagandha Capsules",
            "description": "Natural stress relief and immunity booster",
            "price": 200.0,
            "discounted_price": 160.0,
            "category": "Ayurvedic",
            "brand": "Himalaya",
            "prescription_required": False,
            "stock": 60,
            "image": "https://images.unsplash.com/photo-1556228149-d75a6dd90b2d?w=300&h=200&fit=crop"
        }
    ]
    
    existing_count = await db.medicines.count_documents({})
    if existing_count == 0:
        for medicine_data in mock_medicines:
            medicine = Medicine(**medicine_data)
            await db.medicines.insert_one(medicine.dict())

async def create_mock_emergency_contacts():
    mock_contacts = [
        {
            "name": "District Hospital",
            "type": "hospital", 
            "phone": "108",
            "address": "Main Road, District Center",
            "distance_km": 5.2
        },
        {
            "name": "Village Ambulance Service",
            "type": "ambulance",
            "phone": "+91-9876501234",
            "address": "Village Health Center",
            "distance_km": 2.5
        },
        {
            "name": "Police Station",
            "type": "police",
            "phone": "100",
            "address": "Village Police Station",
            "distance_km": 1.8
        }
    ]
    
    existing_count = await db.emergency_contacts.count_documents({})
    if existing_count == 0:
        for contact_data in mock_contacts:
            contact = EmergencyContact(**contact_data)
            await db.emergency_contacts.insert_one(contact.dict())

# Initialize mock data on startup
@app.on_event("startup")
async def startup_event():
    await create_mock_doctors()
    await create_mock_medicines()
    await create_mock_emergency_contacts()

# Basic routes
@api_router.get("/")
async def root():
    return {"message": "Welcome to Arovia Healthcare Platform"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Doctor routes
@api_router.get("/doctors", response_model=List[Doctor])
async def get_doctors():
    doctors = await db.doctors.find().to_list(1000)
    return [Doctor(**doctor) for doctor in doctors]

@api_router.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: str):
    doctor = await db.doctors.find_one({"id": doctor_id})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return Doctor(**doctor)

@api_router.post("/doctors/book", response_model=DoctorBooking)
async def book_doctor(booking: DoctorBooking):
    booking_dict = booking.dict()
    await db.doctor_bookings.insert_one(booking_dict)
    return booking

# Medicine routes
@api_router.get("/medicines", response_model=List[Medicine])
async def get_medicines():
    medicines = await db.medicines.find().to_list(1000)
    return [Medicine(**medicine) for medicine in medicines]

@api_router.get("/medicines/category/{category}")
async def get_medicines_by_category(category: str):
    medicines = await db.medicines.find({"category": category}).to_list(1000)
    return [Medicine(**medicine) for medicine in medicines]

# Emergency routes
@api_router.get("/emergency/contacts", response_model=List[EmergencyContact])
async def get_emergency_contacts():
    contacts = await db.emergency_contacts.find().to_list(1000)
    return [EmergencyContact(**contact) for contact in contacts]

@api_router.post("/emergency/sos")
async def trigger_sos(location: dict):
    # Log SOS trigger - in real app would send alerts
    sos_log = {
        "id": str(uuid.uuid4()),
        "location": location,
        "timestamp": datetime.now(timezone.utc),
        "status": "triggered"
    }
    await db.sos_logs.insert_one(sos_log)
    return {"message": "SOS triggered successfully", "sos_id": sos_log["id"]}

# Dadi Chatbot route
@api_router.post("/chat/dadi")
async def dadi_chat(user_message: dict):
    try:
        # Initialize Dadi chatbot with warm, caring personality
        chat = LlmChat(
            api_key=emergent_llm_key,
            session_id=f"dadi_chat_{user_message.get('user_id', 'anonymous')}",
            system_message="""You are 'Dadi' - a loving, caring grandmother figure who helps with health advice for rural Indian families. 
            You speak warmly and caringly, like a grandmother would. You provide practical health tips, medicine reminders, 
            and general wellness advice. Keep responses short, caring, and easy to understand. Always be encouraging and supportive.
            Focus on simple, practical healthcare advice suitable for rural areas."""
        ).with_model("openai", "gpt-4o-mini")
        
        message = UserMessage(text=user_message.get("message", ""))
        response = await chat.send_message(message)
        
        # Save chat history
        chat_record = ChatMessage(
            user_id=user_message.get('user_id', 'anonymous'),
            message=user_message.get("message", ""),
            response=response,
            chat_type="dadi_chat"
        )
        await db.chat_messages.insert_one(chat_record.dict())
        
        return {"response": response, "chat_id": chat_record.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# Health Planner route (Premium feature)
@api_router.post("/health/planner")
async def health_planner(request: dict):
    try:
        user_data = request.get("user_data", {})
        symptoms = user_data.get("symptoms", "")
        age = user_data.get("age", "")
        conditions = user_data.get("conditions", "")
        
        # Initialize health planner AI
        chat = LlmChat(
            api_key=emergent_llm_key,
            session_id=f"health_plan_{request.get('user_id', 'anonymous')}",
            system_message=f"""You are an AI health planner for rural Indian healthcare. Create personalized weekly health and diet plans.
            Consider local availability of foods and medicines. Provide practical, affordable suggestions.
            Focus on: diet recommendations, exercise suitable for rural areas, preventive care tips, and general wellness advice.
            Keep suggestions simple and culturally appropriate for Indian rural families."""
        ).with_model("openai", "gpt-4o-mini")
        
        prompt = f"""Create a weekly health plan for:
        Age: {age}
        Current symptoms/conditions: {symptoms or 'General wellness'}
        Existing conditions: {conditions or 'None mentioned'}
        
        Please provide:
        1. Diet recommendations (using locally available foods)
        2. Simple exercises
        3. Health tips
        4. Medicine/supplement suggestions if needed
        5. Warning signs to watch for
        
        Keep it practical for rural Indian families."""
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        # Save health plan
        plan_record = ChatMessage(
            user_id=request.get('user_id', 'anonymous'),
            message=prompt,
            response=response,
            chat_type="health_plan"
        )
        await db.chat_messages.insert_one(plan_record.dict())
        
        return {"health_plan": response, "plan_id": plan_record.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health planner error: {str(e)}")

# Symptom Analysis route
@api_router.post("/symptoms/analyze")
async def analyze_symptoms(request: dict):
    try:
        symptoms = request.get("symptoms", "")
        age = request.get("age", "")
        
        chat = LlmChat(
            api_key=emergent_llm_key,
            session_id=f"symptom_analysis_{request.get('user_id', 'anonymous')}",
            system_message="""You are a medical AI assistant for rural healthcare in India. Analyze symptoms and provide helpful guidance.
            IMPORTANT: Always recommend consulting a doctor for proper diagnosis. Provide general information only.
            Focus on: possible causes, home remedies, when to seek immediate medical attention, and preventive measures.
            Keep advice practical and suitable for rural Indian context."""
        ).with_model("openai", "gpt-4o-mini")
        
        prompt = f"""Analyze these symptoms for a {age} year old person:
        Symptoms: {symptoms}
        
        Please provide:
        1. Possible common causes (educational purpose only)
        2. Safe home remedies if applicable
        3. When to immediately consult a doctor
        4. General care tips
        5. Prevention advice
        
        Remember to emphasize consulting a qualified doctor for proper diagnosis and treatment."""
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        # Save analysis
        analysis_record = ChatMessage(
            user_id=request.get('user_id', 'anonymous'),
            message=prompt,
            response=response,
            chat_type="symptom_analysis"
        )
        await db.chat_messages.insert_one(analysis_record.dict())
        
        return {"analysis": response, "analysis_id": analysis_record.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Symptom analysis error: {str(e)}")

# Disease Radar routes
@api_router.get("/disease/alerts", response_model=List[DiseaseAlert])
async def get_disease_alerts():
    alerts = await db.disease_alerts.find().to_list(1000)
    return [DiseaseAlert(**alert) for alert in alerts]

@api_router.post("/disease/report")
async def report_disease(report: dict):
    # In real app, this would analyze patterns and create alerts
    village = report.get("village", "")
    disease = report.get("disease", "")
    
    # Check if alert exists for this village+disease combo
    existing = await db.disease_alerts.find_one({"village": village, "disease": disease})
    
    if existing:
        # Increment case count
        await db.disease_alerts.update_one(
            {"village": village, "disease": disease},
            {"$inc": {"cases_reported": 1}}
        )
    else:
        # Create new alert
        alert = DiseaseAlert(
            village=village,
            disease=disease,
            cases_reported=1,
            alert_level="low",
            description=f"New cases of {disease} reported in {village}",
            prevention_tips="Maintain hygiene, drink clean water, seek medical advice if symptoms persist"
        )
        await db.disease_alerts.insert_one(alert.dict())
    
    return {"message": "Disease report recorded"}

# Reminders routes
@api_router.get("/reminders/{user_id}", response_model=List[HealthReminder])
async def get_user_reminders(user_id: str):
    reminders = await db.health_reminders.find({"user_id": user_id, "active": True}).to_list(1000)
    return [HealthReminder(**reminder) for reminder in reminders]

@api_router.post("/reminders", response_model=HealthReminder)
async def create_reminder(reminder: HealthReminder):
    reminder_dict = reminder.dict()
    await db.health_reminders.insert_one(reminder_dict)
    return reminder

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()