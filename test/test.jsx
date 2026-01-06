import React, { useState, useEffect } from 'react';
import { Car, Bike, Truck, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const ParkingSystem = () => {
  const TOTAL_SLOTS = 20;
  const RATES = {
    voiture: { first: 5, additional: 3 },
    moto: { first: 3, additional: 2 },
    camion: { first: 10, additional: 5 }
  };

  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('voiture');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    initializeSlots();
  }, []);

  const initializeSlots = () => {
    const initialSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      number: i + 1,
      occupied: false
    }));
    setSlots(initialSlots);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const getFirstAvailableSlot = () => {
    return slots.find(slot => !slot.occupied);
  };

  const addVehicle = () => {
    if (!plateNumber.trim()) {
      showMessage('Veuillez entrer une immatriculation', 'error');
      return;
    }

    const existingVehicle = vehicles.find(v => 
      v.plateNumber === plateNumber && !v.exitTime
    );

    if (existingVehicle) {
      showMessage('Ce véhicule est déjà stationné', 'error');
      return;
    }

    const availableSlot = getFirstAvailableSlot();

    if (!availableSlot) {
      showMessage('Parking complet ! Aucune place disponible', 'error');
      return;
    }

    const newVehicle = {
      plateNumber: plateNumber.toUpperCase(),
      type: vehicleType,
      entryTime: new Date().toISOString(),
      exitTime: null,
      slotNumber: availableSlot.number
    };

    setVehicles([...vehicles, newVehicle]);
    setSlots(slots.map(slot => 
      slot.number === availableSlot.number 
        ? { ...slot, occupied: true } 
        : slot
    ));

    showMessage(`Véhicule ${plateNumber} stationné à la place ${availableSlot.number}`, 'success');
    setPlateNumber('');
  };

  const removeVehicle = (plateNum) => {
    const vehicle = vehicles.find(v => v.plateNumber === plateNum && !v.exitTime);
    
    if (!vehicle) return;

    const exitTime = new Date();
    const entryTime = new Date(vehicle.entryTime);
    const durationMs = exitTime - entryTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

    const rate = RATES[vehicle.type];
    const cost = durationHours <= 1 
      ? rate.first 
      : rate.first + (durationHours - 1) * rate.additional;

    const updatedVehicles = vehicles.map(v => 
      v.plateNumber === plateNum && !v.exitTime
        ? { ...v, exitTime: exitTime.toISOString(), cost, duration: durationHours }
        : v
    );

    setVehicles(updatedVehicles);
    setSlots(slots.map(slot => 
      slot.number === vehicle.slotNumber 
        ? { ...slot, occupied: false } 
        : slot
    ));

    showMessage(
      `Véhicule ${plateNum} sorti. Durée: ${durationHours}h - Montant: ${cost} MAD`,
      'success'
    );
  };

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'moto': return <Bike className="w-5 h-5" />;
      case 'camion': return <Truck className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const occupiedCount = slots.filter(s => s.occupied).length;
  const availableCount = TOTAL_SLOTS - occupiedCount;
  const activeVehicles = vehicles.filter(v => !v.exitTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🅿️ Système de Gestion de Parking
          </h1>
          <p className="text-gray-600">Gestion intelligente et efficace de votre parking</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle /> : <XCircle />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">{TOTAL_SLOTS}</div>
            <div className="text-blue-100">Places totales</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">{availableCount}</div>
            <div className="text-green-100">Places disponibles</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">{occupiedCount}</div>
            <div className="text-orange-100">Places occupées</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Vehicle Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un véhicule</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Immatriculation
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addVehicle()}
                  placeholder="Ex: 123-ABC"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de véhicule
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="voiture">Voiture (5 MAD/h)</option>
                  <option value="moto">Moto (3 MAD/h)</option>
                  <option value="camion">Camion (10 MAD/h)</option>
                </select>
              </div>

              <button
                onClick={addVehicle}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg"
              >
                Ajouter le véhicule
              </button>
            </div>
          </div>

          {/* Parking Grid */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan du parking</h2>
            
            <div className="grid grid-cols-5 gap-3">
              {slots.map(slot => (
                <div
                  key={slot.number}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition ${
                    slot.occupied
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {slot.number}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Vehicles */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Véhicules stationnés ({activeVehicles.length})
          </h2>

          {activeVehicles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun véhicule stationné</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeVehicles.map(vehicle => {
                const entryTime = new Date(vehicle.entryTime);
                return (
                  <div key={vehicle.plateNumber} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getVehicleIcon(vehicle.type)}
                        <span className="font-bold text-lg">{vehicle.plateNumber}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Place {vehicle.slotNumber}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{entryTime.toLocaleString('fr-FR')}</span>
                    </div>

                    <button
                      onClick={() => removeVehicle(vehicle.plateNumber)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition"
                    >
                      Sortir
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History */}
        {vehicles.filter(v => v.exitTime).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Historique</h2>
            
            <div className="space-y-3">
              {vehicles.filter(v => v.exitTime).reverse().slice(0, 5).map((vehicle, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getVehicleIcon(vehicle.type)}
                    <div>
                      <div className="font-bold">{vehicle.plateNumber}</div>
                      <div className="text-sm text-gray-600">
                        {vehicle.duration}h de stationnement
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                    <DollarSign className="w-5 h-5" />
                    {vehicle.cost} MAD
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingSystem;