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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-black flex items-center justify-center transition-all"
          aria-label="Close quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-neutral-200">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            Personalized Wellness Quiz
          </span>
        </div>

        {/* Step 1: Primary Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-heading font-black text-black">
                What is your primary wellness focus?
              </h2>
              <p className="text-xs text-neutral-500">Select your main goal for a targeted formulation recommendation.</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {concerns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectConcern(c.id)}
                  className="w-full p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-black hover:shadow-2xs transition-all text-left flex items-center justify-between group min-h-[48px]"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-black group-hover:text-black transition-colors">{c.title}</h4>
                      <p className="text-xs text-neutral-500">{c.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Duration */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-heading font-black text-black">
                How long have you had this goal?
              </h2>
              <p className="text-xs text-neutral-500">Helps us determine recommendation regimen.</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {durations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDuration(d.id)}
                  className="w-full p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-black transition-all text-left flex items-center justify-between group min-h-[48px]"
                >
                  <div>
                    <h4 className="font-heading font-bold text-sm text-black">{d.title}</h4>
                    <p className="text-xs text-neutral-500">{d.subtitle}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Format Preference */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-heading font-black text-black">
                Preferred product format?
              </h2>
              <p className="text-xs text-neutral-500">Select what fits your routine best.</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {preferences.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreference(p.id)}
                  className="w-full p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-black transition-all text-left flex items-center justify-between group min-h-[48px]"
                >
                  <div>
                    <h4 className="font-heading font-bold text-sm text-black">{p.title}</h4>
                    <p className="text-xs text-neutral-500">{p.subtitle}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Recommendation Result */}
        {step === 4 && recommendedProd && (
          <div className="space-y-5 animate-fadeIn">
            <div className="space-y-1 text-center">
              <span className="text-[10px] font-bold text-black uppercase tracking-widest block bg-neutral-100 py-1 px-3 rounded-full inline-block">
                MATCHED FOR YOU
              </span>
              <h2 className="text-2xl font-heading font-black text-black">
                Your Recommended Wellness Routine
              </h2>
            </div>

            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-4 shadow-2xs">
              <img
                src={recommendedProd.images ? recommendedProd.images[0] : recommendedProd.image}
                alt={recommendedProd.name}
                className="w-24 h-24 rounded-xl object-cover bg-white shrink-0 border border-neutral-200"
              />
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold text-neutral-500">
                  {recommendedProd.category} ★ {recommendedProd.rating}
                </span>
                <h3 className="font-heading font-bold text-sm text-black">{recommendedProd.name}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2">{recommendedProd.benefitSummary}</p>
                <div className="pt-2 flex items-center justify-between sm:justify-start gap-4">
                  <span className="text-lg font-black text-black">₹{recommendedProd.price}</span>
                  <span className="text-xs text-neutral-400 line-through">₹{recommendedProd.originalPrice}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to={`/products/${recommendedProd.slug}`}
                onClick={onClose}
                className="btn-primary w-full py-3.5 font-bold rounded-full min-h-[48px] text-center flex items-center justify-center gap-2"
              >
                <span>View Product & Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleReset}
                className="w-full text-center text-xs text-neutral-500 hover:text-black font-semibold py-2 flex items-center justify-center gap-1 min-h-[36px]"
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

