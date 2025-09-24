import React, { useContext } from 'react';
import { Calendar, MapPin, Users, Check, Download, MessageCircle, Phone, Mail, Clock, Wifi, Car, Coffee, Waves, QrCode, Share2, CreditCard } from 'lucide-react';

// Mock context for demonstration - replace with your actual HotelContext
const HotelContext = React.createContext();

// Mock data - replace with your actual context data
const mockContextData = {
  currency: '$',
  Carttotal: 1299.99,
  formData: {
    checkIn: '2024-03-15',
    checkOut: '2024-03-18',
    guests: 2,
    rooms: 1
  },
  roomDetails: {
    name: 'Ocean View Deluxe Suite',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    location: 'Maldives Resort & Spa',
    amenities: ['Free WiFi', 'Valet Parking', 'Room Service', 'Ocean View']
  },
  CartItem: [
    {
      id: 1,
      name: 'Ocean View Deluxe Suite',
      nights: 3,
      price: 433.33,
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
    }
  ]
};

const Bookings = () => {
  // Use mock data - replace with: const { currency, Carttotal, formData, roomDetails, CartItem } = useContext(HotelContext);
  const { currency, Carttotal, formData, roomDetails, CartItem } = mockContextData;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const getDaysUntilCheckIn = () => {
    const today = new Date();
    const checkInDate = new Date(formData.checkIn);
    const diffTime = checkInDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi': return <Wifi className="w-4 h-4" />;
      case 'valet parking': return <Car className="w-4 h-4" />;
      case 'room service': return <Coffee className="w-4 h-4" />;
      case 'ocean view': return <Waves className="w-4 h-4" />;
      default: return <Check className="w-4 h-4" />;
    }
  };

  const confirmationNumber = "HTL-789-MXYZ";
  const daysUntil = getDaysUntilCheckIn();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
            <Check className="w-5 h-5" />
            Booking Confirmed
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Your Reservation
          </h1>
          <p className="text-slate-300 text-lg">Confirmation #: {confirmationNumber}</p>
          {daysUntil > 0 && (
            <p className="text-purple-400 font-semibold mt-2">{daysUntil} days until your stay</p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Confirmation Status */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-3xl p-6 border border-green-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">Payment Confirmed</h2>
                    <p className="text-green-300">Your booking has been successfully processed</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-2xl">{currency}{Carttotal}</div>
                  <div className="text-green-300 text-sm">Paid in full</div>
                </div>
              </div>
            </div>

            {/* Room Details Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-500 group">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative overflow-hidden rounded-2xl md:w-64 h-48 group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={roomDetails.image} 
                    alt={roomDetails.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-slate-800">Confirmed</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{roomDetails.name}</h3>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span>{roomDetails.location}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {roomDetails.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-slate-300 bg-white/5 rounded-lg p-2">
                        {getAmenityIcon(amenity)}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Your Stay Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 border-l-4 border-green-400">
                    <div className="text-slate-400 text-sm mb-1">Check-in</div>
                    <div className="text-white font-semibold text-lg">{formatDate(formData.checkIn)}</div>
                    <div className="text-slate-300 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      After 3:00 PM
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">Guests</div>
                    <div className="text-white font-semibold text-lg flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {formData.guests} Guests
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 border-l-4 border-red-400">
                    <div className="text-slate-400 text-sm mb-1">Check-out</div>
                    <div className="text-white font-semibold text-lg">{formatDate(formData.checkOut)}</div>
                    <div className="text-slate-300 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Before 11:00 AM
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">Duration</div>
                    <div className="text-white font-semibold text-lg">
                      {calculateNights()} Nights
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Need Help?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <div className="text-white font-medium">Call Hotel</div>
                    <div className="text-slate-300 text-sm">24/7 Support</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <div className="text-left">
                    <div className="text-white font-medium">Live Chat</div>
                    <div className="text-slate-300 text-sm">Online now</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div className="text-left">
                    <div className="text-white font-medium">Email</div>
                    <div className="text-slate-300 text-sm">Get support</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Summary & Actions */}
          <div className="space-y-6">
            {/* Booking Receipt */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                Payment Receipt
              </h3>
              
              <div className="space-y-4">
                {CartItem.map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-white font-semibold">
                        {currency}{item.price}/night
                      </div>
                    </div>
                    <div className="text-slate-300 text-sm">
                      {item.nights} nights × {currency}{item.price}
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center text-slate-300 mb-2">
                    <span>Subtotal</span>
                    <span>{currency}{(Carttotal * 0.85).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 mb-2">
                    <span>Taxes & Fees</span>
                    <span>{currency}{(Carttotal * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between items-center text-white text-xl font-bold">
                      <span>Total Paid</span>
                      <span className="text-green-400">{currency}{Carttotal}</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-green-400 text-sm bg-green-500/20 px-2 py-1 rounded-full">
                        ✓ Payment Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h4 className="text-white font-bold mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
                <button className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300">
                  <QrCode className="w-4 h-4" />
                  Show QR Code
                </button>
                <button className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300">
                  <Share2 className="w-4 h-4" />
                  Share Details
                </button>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-6 border border-blue-400/30">
              <div className="text-center">
                <div className="text-blue-400 font-bold text-sm mb-2">📋 IMPORTANT</div>
                <div className="text-white font-semibold mb-2">Bring Valid ID</div>
                <div className="text-slate-300 text-sm">Please bring a government-issued photo ID matching your booking name for check-in</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;