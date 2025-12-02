import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { carbonApi } from '../lib/api';
import { Calculator as CalcIcon, Zap, Car, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface FormData {
  electricityKwh: string;
  transportKm: string;
  transportType: string;
  wasteKg: string;
}

export const Calculator = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    electricityKwh: '',
    transportKm: '',
    transportType: 'car',
    wasteKg: '',
  });
  const [result, setResult] = useState<{
    totalCO2: number;
    category: string;
    breakdown: { electricity: number; transport: number; waste: number };
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateCarbonFootprint = async (e: React.FormEvent) => {
    e.preventDefault();

    const electricity = parseFloat(formData.electricityKwh) || 0;
    const transport = parseFloat(formData.transportKm) || 0;
    const waste = parseFloat(formData.wasteKg) || 0;

    const transportEmissionFactors: Record<string, number> = {
      car: 0.21,
      motorcycle: 0.12,
      bus: 0.089,
      rickshaw: 0,
      bicycle: 0,
    };

    const electricityCO2 = electricity * 0.82;
    const transportCO2 = transport * (transportEmissionFactors[formData.transportType] || 0.21);
    const wasteCO2 = waste * 0.5;

    const totalCO2 = electricityCO2 + transportCO2 + wasteCO2;

    let category = 'Low';
    if (totalCO2 > 100) category = 'High';
    else if (totalCO2 > 50) category = 'Medium';

    setResult({
      totalCO2: parseFloat(totalCO2.toFixed(2)),
      category,
      breakdown: {
        electricity: parseFloat(electricityCO2.toFixed(2)),
        transport: parseFloat(transportCO2.toFixed(2)),
        waste: parseFloat(wasteCO2.toFixed(2)),
      },
    });

    if (user) {
      try {
        await carbonApi.create({
          electricityKwh: electricity,
          transportationKm: transport,
          transportationType: formData.transportType,
          wasteKg: waste,
          totalCo2Kg: totalCO2,
          category,
        });
      } catch (error) {
        console.error('Error saving carbon footprint:', error);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Low':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'High':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <CalcIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Carbon Footprint Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Calculate your daily carbon emissions and understand your environmental impact
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Enter Your Daily Activities
            </h2>

            <form onSubmit={calculateCarbonFootprint} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Electricity Usage (kWh per day)
                </label>
                <input
                  type="number"
                  name="electricityKwh"
                  value={formData.electricityKwh}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 10"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Average household in Bangladesh uses 8-12 kWh/day
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Car className="h-5 w-5 mr-2 text-blue-500" />
                  Daily Transportation (km)
                </label>
                <input
                  type="number"
                  name="transportKm"
                  value={formData.transportKm}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transportation Type
                </label>
                <select
                  name="transportType"
                  value={formData.transportType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="car">Private Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bus">Bus/Public Transport</option>
                  <option value="rickshaw">Rickshaw (Electric/Manual)</option>
                  <option value="bicycle">Bicycle/Walking</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                  Waste Generated (kg per day)
                </label>
                <input
                  type="number"
                  name="wasteKg"
                  value={formData.wasteKg}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 2"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Average person generates 1-3 kg waste per day
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Calculate Carbon Footprint
              </button>
            </form>
          </div>

          {result && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Your Carbon Footprint
              </h2>

              <div className="text-center mb-8">
                <p className="text-6xl font-bold text-green-600 mb-2">
                  {result.totalCO2}
                </p>
                <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4">kg CO₂ per day</p>
                <div className={`inline-block px-6 py-2 rounded-full ${getCategoryColor(result.category)} bg-opacity-10 font-bold text-lg`}>
                  {result.category} Impact
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      Electricity
                    </span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {result.breakdown.electricity} kg CO₂
                    </span>
                  </div>
                  <div className="bg-yellow-200 dark:bg-yellow-700 h-2 rounded-full">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(result.breakdown.electricity / result.totalCO2) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <Car className="h-5 w-5 mr-2 text-blue-500" />
                      Transportation
                    </span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {result.breakdown.transport} kg CO₂
                    </span>
                  </div>
                  <div className="bg-blue-200 dark:bg-blue-700 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(result.breakdown.transport / result.totalCO2) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                      Waste
                    </span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {result.breakdown.waste} kg CO₂
                    </span>
                  </div>
                  <div className="bg-red-200 dark:bg-red-700 h-2 rounded-full">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(result.breakdown.waste / result.totalCO2) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">Recommendations:</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {result.breakdown.electricity > 8 && (
                    <li className="flex items-start">
                      <TrendingDown className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      Switch to energy-efficient appliances and LED bulbs
                    </li>
                  )}
                  {result.breakdown.transport > 5 && (
                    <li className="flex items-start">
                      <TrendingDown className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      Use public transport or carpool to reduce emissions
                    </li>
                  )}
                  {result.breakdown.waste > 1 && (
                    <li className="flex items-start">
                      <TrendingDown className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      Reduce plastic use and compost organic waste
                    </li>
                  )}
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
                    Plant trees to offset your carbon emissions
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
