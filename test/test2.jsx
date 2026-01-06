import React, { useState, useEffect } from 'react';
import { Car, Bike, Truck, Clock, MapPin, Calendar, ThermometerSun, Droplets, User, Search, Settings, Bell, MoreVertical } from 'lucide-react';

const ParkingDashboard = () => {
  const ZONES = ['A', 'B', 'C', 'D'];
  const SLOTS_PER_ZONE = 24;
  const RATES = {
    voiture: { label: 'Car', hourly: 5, icon: Car },
    moto: { label: 'Bike', hourly: 3, icon: Bike },
    camion: { label: 'Truck', hourly: 9, icon: Truck }
  };

  const [activeZone, setActiveZone] = useState('A');
  const [slots, setSlots] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bookingDate, setBookingDate] = useState('2025-09-23');
  const [arriveTime, setArriveTime] = useState('12:00');
  const [exitTime, setExitTime] = useState('15:00');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    initializeSlots();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const initializeSlots = () => {
    const allSlots = {};
    ZONES.forEach(zone => {
      allSlots[zone] = Array.from({ length: SLOTS_PER_ZONE }, (_, i) => ({
        id: `${zone}${i + 1}`,
        number: i + 1,
        occupied: Math.random() > 0.6,
        zone
      }));
    });
    setSlots(allSlots);
    
    // Add some demo vehicles
    const demoVehicles = [
      { plateNumber: 'XY68ZTR', type: 'voiture', slot: 'A17', entryTime: new Date(Date.now() - 3 * 60 * 60 * 1000 - 2 * 60 * 1000 - 39 * 1000).toISOString() }
    ];
    setVehicles(demoVehicles);
  };

  const getSlotPosition = (index) => {
    const positions = [
      { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 0, col: 5 }, { row: 0, col: 6 },
      { row: 1, col: 0 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 1, col: 6 },
      { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 },
    ];
    return positions[index] || { row: 0, col: 0 };
  };

  const formatDuration = (isoTime) => {
    const start = new Date(isoTime);
    const now = currentTime;
    const diff = now - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const currentParked = vehicles[0];
  const occupiedSlots = Object.values(slots).flat().filter(s => s.occupied).length;
  const totalSlots = ZONES.length * SLOTS_PER_ZONE;
  const occupancyRate = ((occupiedSlots / totalSlots) * 100).toFixed(0);

  const getMostUsedZone = () => {
    const zoneCounts = {};
    ZONES.forEach(zone => {
      zoneCounts[zone] = slots[zone]?.filter(s => s.occupied).length || 0;
    });
    return Object.entries(zoneCounts).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-white">Parkzone</h1>
              <nav className="flex gap-2">
                <button className="px-6 py-2 bg-gray-900 text-white rounded-full font-medium">Dashboard</button>
                <button className="px-6 py-2 text-gray-300 hover:text-white transition">Massage</button>
                <button className="px-6 py-2 text-gray-300 hover:text-white transition">Reservation</button>
                <button className="px-6 py-2 text-gray-300 hover:text-white transition">Management</button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-white hover:bg-gray-700 rounded-full transition">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-white hover:bg-gray-700 rounded-full transition">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-white hover:bg-gray-700 rounded-full transition">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 ml-2">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <div className="font-semibold text-sm">Danny Hong</div>
                  <div className="text-xs text-gray-300">Parking user</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Parking Area */}
          <div className="col-span-2 bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Downtown Plaza Parking</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Zone Selector */}
            <div className="flex gap-2 mb-6">
              {ZONES.map(zone => (
                <button
                  key={zone}
                  onClick={() => setActiveZone(zone)}
                  className={`px-8 py-2 rounded-full font-medium transition ${
                    activeZone === zone
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Zone {zone}
                </button>
              ))}
            </div>

            {/* Parking Grid */}
            <div className="relative">
              <div className="grid grid-cols-7 gap-3">
                {slots[activeZone]?.slice(0, 19).map((slot, idx) => {
                  const pos = getSlotPosition(idx);
                  return (
                    <div
                      key={slot.id}
                      style={{ gridRow: pos.row + 1, gridColumn: pos.col + 1 }}
                      onClick={() => !slot.occupied && setSelectedSlot(slot.id)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
                        slot.occupied
                          ? 'bg-white border-2 border-gray-300'
                          : selectedSlot === slot.id
                          ? 'bg-yellow-200 border-2 border-yellow-400'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-yellow-400'
                      }`}
                    >
                      {slot.occupied ? (
                        <Car className="w-8 h-8 text-gray-800" />
                      ) : (
                        <span className="text-gray-400 font-medium">{slot.id}</span>
                      )}
                      {!slot.occupied && (
                        <span className="text-xs text-gray-400 mt-1">{slot.id}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Parking Overview */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Parking Overview</h3>
                <button className="p-1 hover:bg-gray-100 rounded transition">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="flex gap-1 mb-4 h-20">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      i < occupancyRate / 2 ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    Zone {getMostUsedZone()}
                  </div>
                  <div className="text-gray-900 font-medium">Most used zone</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    2h 15m
                  </div>
                  <div className="text-gray-900 font-medium">Avg parking</div>
                </div>
              </div>
            </div>

            {/* Book Parking */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Book your parking</h3>
                <button className="p-1 hover:bg-gray-100 rounded transition">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Date</label>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Arrive</label>
                    <input
                      type="time"
                      value={arriveTime}
                      onChange={(e) => setArriveTime(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl p-3 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Exit</label>
                    <input
                      type="time"
                      value={exitTime}
                      onChange={(e) => setExitTime(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl p-3 outline-none text-gray-900"
                    />
                  </div>
                </div>

                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-xl transition">
                  Booking
                </button>
              </div>
            </div>

            {/* Nearby Options */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Nearby Parking Options</h3>
                <button className="p-1 hover:bg-gray-100 rounded transition">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Object.entries(RATES).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="bg-gray-50 rounded-xl p-4 mb-2">
                      <value.icon className="w-8 h-8 text-gray-600 mx-auto" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{value.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Environmental Info */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Environmental Info</h3>
              <button className="p-1 hover:bg-gray-100 rounded transition">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ThermometerSun className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-gray-600">Temperature</div>
                    <div className="text-lg font-bold text-gray-900">25°C</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600">Humidity</div>
                    <div className="text-lg font-bold text-gray-900">60%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Parked */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Current parked</h3>
              <button className="p-1 hover:bg-gray-100 rounded transition">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {currentParked && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Price per hour</div>
                    <div className="font-bold text-gray-900">$5.00 - $9.00</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Car number</div>
                    <div className="font-bold text-gray-900">{currentParked.plateNumber}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Parking Slot</div>
                    <div className="font-bold text-gray-900">Slot {currentParked.slot}</div>
                  </div>
                </div>

                <div>
                  <div className="text-gray-600 text-sm mb-2">Duration</div>
                  <div className="text-4xl font-bold text-gray-900 mb-4">
                    {formatDuration(currentParked.entryTime)}
                  </div>
                </div>

                <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition">
                  Extend
                </button>
              </div>
            )}
          </div>

          {/* Stats placeholder */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Total Slots</span>
                <span className="font-bold text-gray-900">{totalSlots}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Occupied</span>
                <span className="font-bold text-gray-900">{occupiedSlots}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <span className="text-gray-600">Occupancy</span>
                <span className="font-bold text-gray-900">{occupancyRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDashboard;