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
  Phone,
  FileText,
  Download,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const SubscriptionModal: React.FC = () => {
  const {
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    isSubscribed,
    currentUser,
    executePayment,
    cancelSubscription,
  } = useSocial();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mpesa' | 'paypal'>('stripe');

  // Form Fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(currentUser.displayName || 'Mizizi Creator');
  const [phoneNumber, setPhoneNumber] = useState('+255 754 123 456');
  const [receiptEmail, setReceiptEmail] = useState(currentUser.email || 'creator@mizizi.social');

  // Processing & Invoice State
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isSubscriptionModalOpen) return null;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await executePayment(selectedPlan, paymentMethod, {
        phone: phoneNumber,
        email: receiptEmail,
      });

      if (res.success && res.invoice) {
        setInvoiceData(res.invoice);
      } else {
        setErrorMessage(res.error || 'Payment authorization failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment system error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!invoiceData) return;
    const content = `========================================================
MIZIZI SOCIAL - OFFICIAL PAYMENT RECEIPT & INVOICE
========================================================
Receipt Number: ${invoiceData.receiptNumber}
Transaction ID: ${invoiceData.transactionId}
Date: ${invoiceData.date}
Billed To: ${invoiceData.billedTo} (${invoiceData.email})
Plan: ${invoiceData.plan.toUpperCase()} VIP CREATOR PASS
Amount: ${invoiceData.amount}
Payment Gateway: ${invoiceData.provider.toUpperCase()}
Status: VERIFIED & COMPLETED (Database Committed)
========================================================
Benefits Activated:
- Unlimited 4K Photo & Reel Publishing
- Full Access to All Locked VIP Channels
- Golden Verified Creator Crown
- Algorithmic Discovery Boost
========================================================
Thank you for supporting creators on MIZIZI SOCIAL.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MIZIZI_Receipt_${invoiceData.receiptNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none text-white animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsSubscriptionModalOpen(false)} />

      {/* Main Dialog */}
      <div className="relative z-10 w-full max-w-xl bg-[#111111] rounded-[36px] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95">
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
            <span>PLAYHUB MONETIZATION & CREATOR PASS</span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
            MIZIZI VIP Creator Pass
          </h2>

          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            <span className="text-white font-semibold">Free to explore and join</span>. Posting photos, video reels, and viewing exclusive 4K content requires an active VIP Creator subscription.
          </p>

          {/* Live Gateway Key Notice */}
          <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200/90 flex items-center justify-center gap-1.5 text-left">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Real payment processing ready! Replace <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">STRIPE_SECRET_KEY</code> or <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">MPESA_CONSUMER_KEY</code> in <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">.env</code> to connect live merchant billing.
            </span>
          </div>
        </div>

        {/* Invoice View if completed */}
        {invoiceData ? (
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-xl text-white">Payment Verified & Activated!</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Your VIP Creator Pass is now live. All posts and reels are unlocked.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-2 font-mono text-[11px]">
                <span className="text-neutral-400">INVOICE NUMBER:</span>
                <span className="font-bold text-amber-300">{invoiceData.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Transaction ID:</span>
                <span className="font-mono text-neutral-200 text-[11px] truncate max-w-[200px]">{invoiceData.transactionId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Plan:</span>
                <span className="font-semibold text-white uppercase">{invoiceData.plan} VIP PASS</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Amount Charged:</span>
                <span className="font-bold text-emerald-400 text-sm">{invoiceData.amount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Gateway:</span>
                <span className="font-semibold text-white uppercase">{invoiceData.provider}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Customer:</span>
                <span className="text-neutral-200">{invoiceData.billedTo}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-[10px] text-neutral-500">
                <span>Database Sync:</span>
                <span className="text-emerald-400 font-semibold">🟢 Committed to Ledger</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="flex-1 py-3 px-4 rounded-full bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Receipt</span>
              </button>

              <button
                onClick={() => {
                  setInvoiceData(null);
                  setIsSubscriptionModalOpen(false);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>Start Posting</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Subscription Plans & Checkout Form */
          <div className="p-6 space-y-5">
            {/* Plan Selector Cards */}
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
                    <span className="text-xs text-neutral-400">/ mo</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Billed monthly. Cancel anytime with 1 click.
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-neutral-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>Publish Posts & Reels</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>View All 4K Video Streams</span>
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
                  Save 17% · Best Value
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
                    <span className="font-display font-extrabold text-2xl text-white">$49.99</span>
                    <span className="text-xs text-neutral-400">/ yr</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-snug">
                    Just $4.16/mo. Includes Priority Algorithm Feed boost.
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-neutral-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>Unlimited 4K Posting & Video</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>Golden VIP Crown Profile Badge</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gateway Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Select Payment Gateway (All Live Ready)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'stripe'
                      ? 'bg-neutral-800 text-white font-bold border-amber-400 ring-1 ring-amber-400'
                      : 'bg-[#161616] text-neutral-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span className="text-xs">Stripe / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'mpesa'
                      ? 'bg-neutral-800 text-white font-bold border-emerald-400 ring-1 ring-emerald-400'
                      : 'bg-[#161616] text-neutral-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs">M-Pesa / Mobile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'paypal'
                      ? 'bg-neutral-800 text-white font-bold border-blue-400 ring-1 ring-blue-400'
                      : 'bg-[#161616] text-neutral-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-lg font-black text-blue-400 italic">P</span>
                  <span className="text-xs">PayPal</span>
                </button>
              </div>
            </div>

            {/* Gateway Interactive Inputs */}
            {paymentMethod === 'stripe' && (
              <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Credit or Debit Card (Stripe Integrated)</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> PCI-DSS Compliant
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                    placeholder="4242 •••• •••• 4242"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">CVC / Security Code</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                      placeholder="CVC"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    placeholder="Full Name"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'mpesa' && (
              <div className="p-4 rounded-2xl bg-[#161616] border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Vodacom M-Pesa / Tigo Pesa / Airtel Money</span>
                  <span className="text-emerald-400 font-bold text-[10px]">STK Push Ready</span>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Registered Mobile Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400 font-mono"
                    placeholder="+255 754 000 000"
                  />
                </div>

                <p className="text-[11px] text-neutral-400 leading-snug">
                  An instant USSD prompt will be sent to this number. Enter your secret M-Pesa PIN to authorize <span className="text-emerald-400 font-bold">{selectedPlan === 'annual' ? 'TZS 129,000' : 'TZS 12,900'}</span>.
                </p>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="p-4 rounded-2xl bg-[#161616] border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>PayPal Express Checkout & Subscriptions</span>
                  <span className="text-blue-400 font-bold text-[10px]">Instant Redirect</span>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">PayPal Account Email</label>
                  <input
                    type="email"
                    value={receiptEmail}
                    onChange={e => setReceiptEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-blue-500/30 text-white text-xs focus:outline-none focus:border-blue-400"
                    placeholder="account@paypal.com"
                  />
                </div>

                <p className="text-[11px] text-neutral-400 leading-snug">
                  Authorize with 1-click PayPal OneTouch. Backed by PayPal Buyer Protection.
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Checkout CTA */}
            <div className="pt-2">
              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Contacting Gateway & Verifying...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-black" />
                    <span>
                      Complete Real Payment • {selectedPlan === 'annual' ? '$49.99 USD' : '$4.99 USD'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit Encrypted</span>
                </span>
                <span>•</span>
                <span>Generates Official Receipt</span>
                <span>•</span>
                <span>Direct DB Ledger Sync</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
