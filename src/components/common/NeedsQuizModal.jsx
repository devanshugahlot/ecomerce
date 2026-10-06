import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../../utils/mockProducts';

export const NeedsQuizModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    concern: '',
    duration: '',
    preference: ''
  });

  if (!isOpen) return null;

  const concerns = [
    { id: 'enlargement', title: 'Size & Blood Flow Enhancement', subtitle: 'Natural herbal oil for tissue support & vigor', icon: '⚡' },
    { id: 'delay', title: 'Endurance & Climax Delay', subtitle: 'Extended performance gel for timing control', icon: '⏱️' }
  ];

  const durations = [
    { id: 'recent', title: 'Less than 3 months', subtitle: 'Noticeable changes recently' },
    { id: 'longterm', title: 'Over 6 months', subtitle: 'Persistent performance goal' },
    { id: 'prevention', title: 'General Enhancement', subtitle: 'Optimizing intimate confidence' }
  ];

  const preferences = [
    { id: 'oil', title: 'Topical Massage Oil', subtitle: 'Deep absorption, 100ml bottle' },
    { id: 'gel', title: 'Fast-acting Performance Gel', subtitle: 'Cooling sensation, 50ml pump' }
  ];

  const handleSelectConcern = (cId) => {
    setAnswers({ ...answers, concern: cId });
    setStep(2);
  };

  const handleSelectDuration = (dId) => {
    setAnswers({ ...answers, duration: dId });
    setStep(3);
  };

  const handleSelectPreference = (pId) => {
    setAnswers({ ...answers, preference: pId });
    setStep(4);
  };

  const getRecommendation = () => {
    if (answers.concern === 'delay' || answers.preference === 'gel') {
      return MOCK_PRODUCTS[1] || MOCK_PRODUCTS[0];
    }
    return MOCK_PRODUCTS[0];
  };

  const recommendedProd = getRecommendation();

  const handleReset = () => {
    setAnswers({ concern: '', duration: '', preference: '' });
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1F1D]/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF7F2] border border-[#E4E0D8] rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-[#E4E0D8] text-[#5B655F] hover:text-[#1B1F1D] flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#0F3D2B]/10 text-[#0F3D2B] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B8924A]" />
            1-Min Hypril™ Wellness Quiz
          </span>
        </div>

        {/* Step 1: Primary Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#1B1F1D]">
                What is your primary intimate wellness focus?
              </h2>
              <p className="text-xs text-[#5B655F]">Select your main goal for a targeted Hypril™ recommendation.</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {concerns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectConcern(c.id)}
                  className="w-full p-4 rounded-2xl bg-white border border-[#E4E0D8] hover:border-[#0F3D2B] hover:shadow-md transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#1B1F1D] group-hover:text-[#0F3D2B] transition-colors">{c.title}</h4>
                      <p className="text-xs text-[#5B655F]">{c.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5B655F] group-hover:text-[#0F3D2B] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Duration */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#1B1F1D]">
                How long have you had this goal?
              </h2>
              <p className="text-xs text-[#5B655F]">Helps us determine application routine.</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {durations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDuration(d.id)}
                  className="w-full p-4 rounded-2xl bg-white border border-[#E4E0D8] hover:border-[#0F3D2B] transition-all text-left flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-sm text-[#1B1F1D] group-hover:text-[#0F3D2B]">{d.title}</h4>
                    <p className="text-xs text-[#5B655F]">{d.subtitle}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5B655F] group-hover:text-[#0F3D2B]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Format Preference */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#1B1F1D]">
                Preferred product format?
              </h2>
              <p className="text-xs text-[#5B655F]">Select what fits your routine best.</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {preferences.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreference(p.id)}
                  className="w-full p-4 rounded-2xl bg-white border border-[#E4E0D8] hover:border-[#0F3D2B] transition-all text-left flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-sm text-[#1B1F1D] group-hover:text-[#0F3D2B]">{p.title}</h4>
                    <p className="text-xs text-[#5B655F]">{p.subtitle}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5B655F] group-hover:text-[#0F3D2B]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Recommendation Result */}
        {step === 4 && recommendedProd && (
          <div className="space-y-5 animate-fadeIn">
            <div className="space-y-1 text-center">
              <span className="text-[10px] font-extrabold text-[#0F3D2B] uppercase tracking-widest block">
                MATCHED FOR YOU
              </span>
              <h2 className="text-2xl font-serif font-extrabold text-[#1B1F1D]">
                Your Recommended Hypril Routine
              </h2>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E4E0D8] flex flex-col sm:flex-row items-center gap-4 shadow-sm">
              <img
                src={recommendedProd.images ? recommendedProd.images[0] : recommendedProd.image}
                alt={recommendedProd.name}
                className="w-24 h-24 rounded-xl object-cover bg-[#FAF7F2] shrink-0"
              />
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-[#B8924A]">
                  {recommendedProd.category} ★ {recommendedProd.rating}
                </span>
                <h3 className="font-extrabold text-sm text-[#1B1F1D]">{recommendedProd.name}</h3>
                <p className="text-xs text-[#5B655F] line-clamp-2">{recommendedProd.benefitSummary}</p>
                <div className="pt-2 flex items-center justify-between sm:justify-start gap-4">
                  <span className="text-lg font-black text-[#0F3D2B]">₹{recommendedProd.price}</span>
                  <span className="text-xs text-[#5B655F] line-through">₹{recommendedProd.originalPrice}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to={`/products/${recommendedProd.slug}`}
                onClick={onClose}
                className="btn-primary w-full py-3.5 font-bold shadow-glow-forest text-center flex justify-center"
              >
                <span>View Product & Claim Offer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleReset}
                className="w-full text-center text-xs text-[#5B655F] hover:text-[#1B1F1D] font-semibold py-2 flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
