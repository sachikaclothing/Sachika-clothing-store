import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

export default function SizeChartModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('inches'); // 'inches' or 'cm'

  if (!isOpen) return null;

  const sizeData = [
    { size: 'XS', bustIn: '34', bustCm: '86', waistIn: '30', waistCm: '76', hipIn: '38', hipCm: '96', lengthIn: '44-46', lengthCm: '112-117' },
    { size: 'S', bustIn: '36', bustCm: '91', waistIn: '32', waistCm: '81', hipIn: '40', hipCm: '101', lengthIn: '44-46', lengthCm: '112-117' },
    { size: 'M', bustIn: '38', bustCm: '96', waistIn: '34', waistCm: '86', hipIn: '42', hipCm: '106', lengthIn: '45-47', lengthCm: '114-119' },
    { size: 'L', bustIn: '40', bustCm: '101', waistIn: '36', waistCm: '91', hipIn: '44', hipCm: '112', lengthIn: '45-47', lengthCm: '114-119' },
    { size: 'XL', bustIn: '42', bustCm: '106', waistIn: '38', waistCm: '96', hipIn: '46', hipCm: '117', lengthIn: '46-48', lengthCm: '117-122' },
    { size: 'XXL', bustIn: '44', bustCm: '112', waistIn: '40', waistCm: '101', hipIn: '48', hipCm: '122', lengthIn: '46-48', lengthCm: '117-122' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#240e33] to-[#12051a] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-100">Standard Ethnic Size Guide</h3>
              <p className="text-xs text-gray-300">Find your perfect tailored fit for Kurtis & 3pc Suit Ensembles</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-600">Garment Measurements:</span>
            <div className="bg-gray-100 p-1 rounded-lg flex items-center text-xs font-bold">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 rounded-md transition ${unit === 'inches' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-black'}`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition ${unit === 'cm' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-black'}`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-amber-50/60 text-gray-700 font-bold border-b border-gray-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Bust</th>
                  <th className="p-3">Waist</th>
                  <th className="p-3">Hip</th>
                  <th className="p-3">Length (Long/Short)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sizeData.map((row) => (
                  <tr key={row.size} className="hover:bg-rose-50/40 transition">
                    <td className="p-3 font-bold text-rose-700 bg-gray-50/50">{row.size}</td>
                    <td className="p-3 text-gray-800 font-medium">
                      {unit === 'inches' ? `${row.bustIn}"` : `${row.bustCm} cm`}
                    </td>
                    <td className="p-3 text-gray-800 font-medium">
                      {unit === 'inches' ? `${row.waistIn}"` : `${row.waistCm} cm`}
                    </td>
                    <td className="p-3 text-gray-800 font-medium">
                      {unit === 'inches' ? `${row.hipIn}"` : `${row.hipCm} cm`}
                    </td>
                    <td className="p-3 text-gray-600">
                      {unit === 'inches' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measuring Guidance */}
          <div className="mt-5 bg-amber-50/80 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <CheckCircle2 className="w-4 h-4 text-amber-700" />
              <span>Pro Tailoring Fitting Tips:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
              <li><b>Bust:</b> Measure around the fullest part of your bust while keeping the tape comfortably loose.</li>
              <li><b>Waist:</b> Measure around the narrowest natural crease of your waistline.</li>
              <li><b>Kurti Fit:</b> Our designs include 2 inches of comfortable stitching ease for effortless movement and dining comfort.</li>
              <li><b>Alteration Margin:</b> All 3pc Suits and Kurtis have a 1.5-inch hidden fabric margin inside both side seams for easy custom loosening.</li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow"
            >
              Done & Select My Size
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
