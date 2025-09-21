import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { 
  Heart, 
  Phone, 
  ShoppingCart, 
  MessageCircle, 
  MapPin, 
  Star, 
  Clock, 
  AlertTriangle, 
  Shield,
  Mic,
  Globe,
  Calendar,
  Pill,
  Activity,
  Users,
  Brain,
  Stethoscope
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Language Selection Landing Page
const LanguageSelection = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const languages = [
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ];

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang.code);
    localStorage.setItem('arovia_language', lang.code);
    toast.success(`Language set to ${lang.name}`);
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Welcome to Arovia
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Rural Healthcare Made Simple & Accessible
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Language</h3>
            <p className="text-gray-600 mb-6">Select your preferred language to continue</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:scale-105"
                onClick={() => handleLanguageSelect(lang)}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4 pt-6">
            <Button variant="outline" className="flex items-center space-x-2">
              <Mic className="w-4 h-4" />
              <span>Voice Selection</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Text Selection</span>
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 pt-4">
            Healthcare services for everyone, in every language
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Dashboard
const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Book Doctor",
      description: "Find & book nearby doctors and specialists",
      icon: <Stethoscope className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      path: "/doctors"
    },
    {
      title: "Emergency Help",
      description: "24/7 emergency assistance & SOS",
      icon: <Shield className="w-8 h-8" />,
      color: "from-red-500 to-pink-500",
      path: "/emergency"
    },
    {
      title: "Buy Medicines",
      description: "Affordable medicines with discounts",
      icon: <ShoppingCart className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500", 
      path: "/medicines"
    },
    {
      title: "Dadi Chatbot",
      description: "Health advice from your caring AI grandmother",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "from-purple-500 to-violet-500",
      path: "/dadi-chat"
    },
    {
      title: "Health Planner",
      description: "AI-powered personalized health plans",
      icon: <Brain className="w-8 h-8" />,
      color: "from-orange-500 to-amber-500",
      path: "/health-planner"
    },
    {
      title: "Disease Radar",
      description: "Community health tracking & alerts",
      icon: <Activity className="w-8 h-8" />,
      color: "from-teal-500 to-cyan-500",
      path: "/disease-radar"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.02"%3E%3Cpath d="M50 0A50 50 0 1 1 0 50a50 50 0 0 1 50-50zm0 10A40 40 0 1 0 90 50 40 40 0 0 0 50 10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Arovia Healthcare
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare solutions for rural communities - accessible, affordable, and caring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg">
            <div className="flex items-center space-x-2 text-emerald-600">
              <Users className="w-5 h-5" />
              <span className="font-medium">1000+ Families Served</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Stethoscope className="w-5 h-5" />
              <span className="font-medium">50+ Verified Doctors</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <Heart className="w-5 h-5" />
              <span className="font-medium">24/7 Care Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Doctor Booking Component
const DoctorBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    patient_name: '',
    patient_age: '',
    symptoms: '',
    contact_number: '',
    preferred_time: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor) return;
    
    try {
      const bookingData = {
        ...bookingForm,
        doctor_id: selectedDoctor.id,
        patient_age: parseInt(bookingForm.patient_age)
      };
      
      await axios.post(`${API}/doctors/book`, bookingData);
      toast.success("Appointment booked successfully!");
      setSelectedDoctor(null);
      setBookingForm({
        patient_name: '',
        patient_age: '',
        symptoms: '',
        contact_number: '',
        preferred_time: ''
      });
    } catch (error) {
      toast.error("Failed to book appointment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Find & Book Doctors</h1>
          <p className="text-gray-600">Connect with qualified healthcare professionals near you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={doctor.photo} 
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="font-medium">Qualification:</span> {doctor.qualifications}</p>
                  <p className="text-sm"><span className="font-medium">Experience:</span> {doctor.experience_years} years</p>
                  <p className="text-sm"><span className="font-medium">Location:</span> {doctor.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{doctor.rating}</span>
                    </div>
                    <Badge variant={doctor.available ? "default" : "secondary"}>
                      {doctor.available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-green-600">
                    <span className="text-lg font-semibold">₹{doctor.consultation_fee}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{doctor.distance_km} km</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        disabled={!doctor.available}
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                        <DialogDescription>
                          Please fill in your details to book an appointment
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <Input
                          placeholder="Patient Name"
                          value={bookingForm.patient_name}
                          onChange={(e) => setBookingForm({...bookingForm, patient_name: e.target.value})}
                        />
                        <Input
                          type="number"
                          placeholder="Age"
                          value={bookingForm.patient_age}
                          onChange={(e) => setBookingForm({...bookingForm, patient_age: e.target.value})}
                        />
                        <Textarea
                          placeholder="Describe your symptoms"
                          value={bookingForm.symptoms}
                          onChange={(e) => setBookingForm({...bookingForm, symptoms: e.target.value})}
                        />
                        <Input
                          placeholder="Contact Number"
                          value={bookingForm.contact_number}
                          onChange={(e) => setBookingForm({...bookingForm, contact_number: e.target.value})}
                        />
                        <Input
                          placeholder="Preferred Time (e.g., Morning, Evening)"
                          value={bookingForm.preferred_time}
                          onChange={(e) => setBookingForm({...bookingForm, preferred_time: e.target.value})}
                        />
                        
                        <Button onClick={handleBooking} className="w-full">
                          Confirm Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${doctor.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Medicine Store Component
const MedicineStore = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${API}/medicines`);
      setMedicines(response.data);
    } catch (error) {
      toast.error("Failed to load medicines");
    }
  };

  const addToCart = (medicine) => {
    setCart([...cart, medicine]);
    toast.success(`${medicine.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Medicine Store</h1>
          <p className="text-gray-600">Affordable medicines with discounts and Arovia Coins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <Card key={medicine.id} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <img 
                  src={medicine.image} 
                  alt={medicine.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{medicine.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{medicine.category}</Badge>
                  <Badge variant="secondary">{medicine.brand}</Badge>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {medicine.discounted_price ? (
                      <>
                        <span className="text-lg font-semibold text-green-600">
                          ₹{medicine.discounted_price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{medicine.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-gray-800">
                        ₹{medicine.price}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">Stock: {medicine.stock}</span>
                </div>
                
                {medicine.prescription_required && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Prescription Required</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={() => addToCart(medicine)} 
                  className="w-full"
                  disabled={medicine.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dadi Chatbot Component
const DadiChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      const response = await axios.post(`${API}/chat/dadi`, {
        message: userMessage,
        user_id: 'user_123'
      });
      
      // Add Dadi's response to chat
      setMessages(prev => [...prev, { type: 'dadi', content: response.data.response }]);
    } catch (error) {
      toast.error("Failed to send message");
      setMessages(prev => [...prev, { type: 'dadi', content: "I'm sorry beta, I couldn't understand that. Can you ask again?" }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dadi Health Assistant</h1>
          <p className="text-gray-600">Your caring AI grandmother for health advice</p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="h-96 overflow-y-auto mb-4 space-y-4 border rounded-lg p-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                  <p>Ask Dadi anything about your health, medicines, or wellness!</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-purple-100 text-purple-800 border border-purple-200'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg border border-purple-200">
                    Dadi is thinking...
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Ask Dadi about your health..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={loading}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Emergency Help Component  
const EmergencyHelp = () => {
  const [contacts, setContacts] = useState([]);
  const [sosTriggered, setSosTriggered] = useState(false);

  useEffect(() => {
    fetchEmergencyContacts();
  }, []);

  const fetchEmergencyContacts = async () => {
    try {
      const response = await axios.get(`${API}/emergency/contacts`);
      setContacts(response.data);
    } catch (error) {
      toast.error("Failed to load emergency contacts");
    }
  };

  const triggerSOS = async () => {
    setSosTriggered(true);
    try {
      await axios.post(`${API}/emergency/sos`, {
        location: { lat: 23.2599, lng: 77.4126 } // Mock location
      });
      toast.success("SOS triggered! Emergency services notified.");
    } catch (error) {
      toast.error("Failed to trigger SOS");
    }
    setTimeout(() => setSosTriggered(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Emergency Help</h1>
          <p className="text-gray-600">24/7 emergency assistance - always free</p>
        </div>

        <div className="mb-8 text-center">
          <Button
            size="lg"
            className={`w-32 h-32 rounded-full text-xl font-bold transition-all duration-300 ${
              sosTriggered 
                ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' 
                : 'bg-red-500 hover:bg-red-600 hover:scale-110'
            }`}
            onClick={triggerSOS}
            disabled={sosTriggered}
          >
            {sosTriggered ? 'SOS SENT!' : 'SOS'}
          </Button>
          <p className="text-sm text-gray-600 mt-4">Tap for immediate emergency help</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    contact.type === 'hospital' ? 'bg-blue-100 text-blue-600' :
                    contact.type === 'ambulance' ? 'bg-green-100 text-green-600' :
                    contact.type === 'police' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {contact.type === 'hospital' ? <Heart className="w-6 h-6" /> :
                     contact.type === 'ambulance' ? <Shield className="w-6 h-6" /> :
                     contact.type === 'police' ? <Shield className="w-6 h-6" /> :
                     <Phone className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <Badge variant="outline" className="capitalize">{contact.type}</Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{contact.address}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{contact.distance_km} km away</span>
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <a href={`tel:${contact.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call {contact.phone}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Health Planner Component
const HealthPlanner = () => {
  const [formData, setFormData] = useState({
    age: '',
    symptoms: '',
    conditions: ''
  });
  const [healthPlan, setHealthPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const generateHealthPlan = async () => {
    if (!formData.age) {
      toast.error("Please enter your age");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/health/planner`, {
        user_data: formData,
        user_id: 'user_123'
      });
      
      setHealthPlan(response.data.health_plan);
      toast.success("Health plan generated successfully!");
    } catch (error) {
      toast.error("Failed to generate health plan");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Health Planner</h1>
          <p className="text-gray-600">Get personalized health and diet plans powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
              <CardDescription>Provide some basic information to generate your personalized plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Age</label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Current Symptoms (if any)</label>
                <Textarea
                  placeholder="Describe any current health concerns or symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Existing Health Conditions</label>
                <Textarea
                  placeholder="List any existing medical conditions or medications"
                  value={formData.conditions}
                  onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                />
              </div>
              
              <Button onClick={generateHealthPlan} disabled={loading} className="w-full">
                {loading ? 'Generating Plan...' : 'Generate My Health Plan'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Your Personalized Health Plan</CardTitle>
              <CardDescription>AI-generated recommendations based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              {healthPlan ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {healthPlan}
                  </pre>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-orange-300" />
                  <p>Fill out the form and click "Generate" to see your personalized health plan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Disease Radar Component
const DiseaseRadar = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDiseaseAlerts();
  }, []);

  const fetchDiseaseAlerts = async () => {
    try {
      const response = await axios.get(`${API}/disease/alerts`);
      setAlerts(response.data);
    } catch (error) {
      toast.error("Failed to load disease alerts");
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Village Disease Radar</h1>
          <p className="text-gray-600">Community health tracking and early disease detection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`shadow-lg border-l-4 ${getAlertColor(alert.alert_level)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-800">{alert.disease}</h3>
                  <Badge variant="outline" className={`capitalize ${
                    alert.alert_level === 'high' ? 'border-red-300 text-red-700' :
                    alert.alert_level === 'medium' ? 'border-yellow-300 text-yellow-700' :
                    'border-green-300 text-green-700'
                  }`}>
                    {alert.alert_level} risk
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Village:</span> {alert.village}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Cases:</span> {alert.cases_reported}
                </p>
                <p className="text-sm text-gray-700 mb-4">{alert.description}</p>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Prevention Tips:</h4>
                  <p className="text-sm text-blue-700">{alert.prevention_tips}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto mb-4 text-teal-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Alerts</h3>
            <p className="text-gray-600">Your community is healthy! We'll notify you of any health concerns.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanguageSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<DoctorBooking />} />
          <Route path="/medicines" element={<MedicineStore />} />
          <Route path="/dadi-chat" element={<DadiChat />} />
          <Route path="/emergency" element={<EmergencyHelp />} />
          <Route path="/health-planner" element={<HealthPlanner />} />
          <Route path="/disease-radar" element={<DiseaseRadar />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;