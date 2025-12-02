import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';

const ecoTips = [
  {
    title: 'Use Jute Bags Instead of Plastic',
    description: 'Bangladesh is the world\'s leading jute producer. Switch to jute bags for shopping to reduce plastic waste and support local industry.',
    impact: 'High',
  },
  {
    title: 'Install Solar Panels',
    description: 'Bangladesh has excellent solar potential. Installing solar panels can reduce electricity costs and carbon emissions significantly.',
    impact: 'High',
  },
  {
    title: 'Use Public Transport',
    description: 'Take buses, trains, or share rides instead of driving alone. This reduces traffic congestion and air pollution in cities like Dhaka.',
    impact: 'High',
  },
  {
    title: 'Harvest Rainwater',
    description: 'Collect rainwater during monsoon season for washing, gardening, and other non-drinking purposes to conserve water.',
    impact: 'Medium',
  },
  {
    title: 'Compost Kitchen Waste',
    description: 'Turn vegetable peels and food scraps into nutrient-rich compost for plants instead of sending them to landfills.',
    impact: 'Medium',
  },
  {
    title: 'Switch to LED Bulbs',
    description: 'LED bulbs use 75% less energy than traditional bulbs and last much longer, reducing both electricity bills and carbon emissions.',
    impact: 'Medium',
  },
  {
    title: 'Plant Native Trees',
    description: 'Plant indigenous trees like mango, jackfruit, or neem. They adapt well to Bangladesh\'s climate and provide shade and fruits.',
    impact: 'High',
  },
  {
    title: 'Reduce AC Usage',
    description: 'Use fans, natural ventilation, and keep windows open during cooler hours to reduce air conditioning dependency.',
    impact: 'Medium',
  },
  {
    title: 'Buy Local Produce',
    description: 'Purchase vegetables and fruits from local farmers\' markets to reduce transportation emissions and support local economy.',
    impact: 'Medium',
  },
  {
    title: 'Fix Water Leaks',
    description: 'Repair dripping taps and leaking pipes immediately. A small leak can waste thousands of liters of water annually.',
    impact: 'Low',
  },
  {
    title: 'Use Cloth Napkins',
    description: 'Replace paper napkins with reusable cloth ones to reduce paper waste and save trees.',
    impact: 'Low',
  },
  {
    title: 'Unplug Devices',
    description: 'Unplug chargers and electronics when not in use. Phantom power consumption accounts for 5-10% of electricity usage.',
    impact: 'Low',
  },
  {
    title: 'Start a Kitchen Garden',
    description: 'Grow vegetables like tomatoes, chilies, and herbs on your rooftop or balcony. It provides fresh produce and reduces carbon footprint.',
    impact: 'Medium',
  },
  {
    title: 'Avoid Single-Use Plastics',
    description: 'Say no to plastic straws, cups, and cutlery. Carry your own reusable alternatives when going out.',
    impact: 'High',
  },
  {
    title: 'Support Eco-Friendly Brands',
    description: 'Choose products from companies that use sustainable practices and eco-friendly packaging.',
    impact: 'Medium',
  },
];

export const Tips = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ecoTips.length);
    setCurrentTip(randomIndex);
  }, []);

  const getNewTip = () => {
    setIsRotating(true);
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * ecoTips.length);
      } while (newIndex === currentTip);
      setCurrentTip(newIndex);
      setIsRotating(false);
    }, 300);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const tip = ecoTips[currentTip];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Lightbulb className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Eco Tips for Bangladesh
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Daily tips to help you live more sustainably
          </p>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-8 transition-transform ${isRotating ? 'scale-95' : 'scale-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getImpactColor(tip.impact)}`}>
              {tip.impact} Impact
            </span>
            <button
              onClick={getNewTip}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className={`h-5 w-5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>New Tip</span>
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {tip.title}
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {tip.description}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-red-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Why Every Action Matters</h3>
          <p className="text-green-50 mb-4">
            Bangladesh is highly vulnerable to climate change. With rising sea levels threatening coastal areas
            and extreme weather becoming more common, every sustainable action contributes to a safer future.
          </p>
          <p className="text-green-50">
            By adopting eco-friendly habits, you not only reduce your carbon footprint but also inspire others
            in your community to join the movement toward a greener Bangladesh.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {ecoTips.slice(0, 6).map((tip, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setCurrentTip(index)}
            >
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getImpactColor(tip.impact)}`}>
                {tip.impact}
              </span>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {tip.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
