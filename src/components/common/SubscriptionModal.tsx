import React, { useState } from 'react';
import {
  X,
  Crown,
  Check,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Zap,
  ArrowRight,
  Flame,
  Lock,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const SubscriptionModal: React.FC = () => {
  const {
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    isSubscribed,
    currentUser,
    subscribeUser,
    cancelSubscription,
  } = useSocial();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'apple' | 'google'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isSubscriptionModalOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      subscribeUser(selectedPlan);
      setIsProcessing(false);
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        setIsSubscriptionModalOpen(false);
      }, 1500);
    }, 600);
  };

  const handleQuickTestToggle = () => {
    if (isSubscribed) {
      cancelSubscription();
    } else {
      subscribeUser('monthly');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none text-white animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsSubscriptionModalOpen(false)} />

      {/* Main Dialog */}
      <div className="relative z-10 w-full max-w-xl bg-[#111111] rounded-[36px] overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in zoom-in-95">
        {/* Header with PlayHub Theme */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-b from-[#1c160c] via-[#15120c] to-[#111111] border-b border-amber-500/20 text-center">
          <button
            onClick={() => setIsSubscriptionModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black shadow-lg shadow-amber-500/20 mb-3">
            <Crown className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider border border-amber-400/20 mb-2">
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>PLAYHUB BUSINESS MODEL</span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
            MIZIZI VIP Video Pass
          </h2>

          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            <span className="text-white font-semibold">Free to Enter & Create Account</span>. Viewing full 4K creator videos and <span className="text-amber-300 font-semibold">publishing posts & reels</span> requires an active VIP creator pass.
          </p>

          {/* Quick Instant Test Toggle */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleQuickTestToggle}
              className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                isSubscribed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/10 text-amber-300 border-amber-400/30 hover:bg-white/20'
              }`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>
                {isSubscribed ? 'VIP Active (Click to Re-lock for testing)' : 'Quick Test: Unlock VIP Instantly'}
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedPlan === 'monthly'
                  ? 'bg-[#1a1711] border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-[#151515] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Monthly VIP</span>
                  {selectedPlan === 'monthly' && (
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="font-display font-extrabold text-2xl text-white">$4.99</span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  Billed monthly. Cancel anytime with 1 click.
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-neutral-300 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-amber-400" />
                  <span>Publish Unlimited Posts & Reels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-amber-400" />
                  <span>Unlimited 4K Video Streams</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-amber-400" />
                  <span>Full Reels & Creator Content</span>
                </div>
              </div>
            </div>

            {/* Annual Plan (Featured) */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedPlan === 'annual'
                  ? 'bg-[#1c180e] border-amber-400 shadow-lg ring-1 ring-amber-400'
                  : 'bg-[#151515] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[9px] font-black uppercase tracking-wider shadow">
                Save 40% · Best Value
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Annual VIP Pass</span>
                  </span>
                  {selectedPlan === 'annual' && (
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="font-display font-extrabold text-2xl text-white">$39.99</span>
                  <span className="text-xs text-neutral-400">/ year</span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-snug">
                  Just $3.33/mo. Includes 2 exclusive creator passes.
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-neutral-300 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-amber-400" />
                  <span>All Monthly Perks Included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-amber-400" />
                  <span>VIP Gold Profile Crown</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'card', label: 'Credit Card', icon: '💳' },
                { id: 'mpesa', label: 'M-Pesa / Mobile', icon: '📱' },
                { id: 'apple', label: 'Apple Pay', icon: '' },
                { id: 'google', label: 'Google Pay', icon: 'G' },
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === method.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#161616] text-neutral-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-base">{method.icon}</span>
                  <span className="text-[10px] truncate">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="pt-2">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Activating VIP Pass...</span>
              ) : successToast ? (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" /> VIP Pass Activated!
                </span>
              ) : (
                <>
                  <Crown className="w-4 h-4 fill-black" />
                  <span>
                    Unlock Full Access • {selectedPlan === 'annual' ? '$39.99/yr' : '$4.99/mo'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Secure Encryption</span>
              </span>
              <span>•</span>
              <span>Cancel Anytime</span>
              <span>•</span>
              <span>Instant Unlock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
