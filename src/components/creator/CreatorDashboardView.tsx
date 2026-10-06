import React, { useState } from 'react';
import {
  TrendingUp,
  Eye,
  Users,
  Award,
  Sparkles,
  BarChart2,
  DollarSign,
  ArrowUpRight,
  Music,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { INITIAL_CREATOR_ANALYTICS } from '../../data/seedData';
import { generateCreatorAdvice } from '../../services/geminiService';

export const CreatorDashboardView: React.FC = () => {
  const { currentUser } = useSocial();

  const [aiAdvice, setAiAdvice] = useState<{
    title: string;
    actionableSteps: string[];
    recommendedAudio: string;
  } | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  const analytics = INITIAL_CREATOR_ANALYTICS;

  const handleGenerateAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
      const advice = await generateCreatorAdvice(
        currentUser.category || 'Visual Storytelling',
        currentUser.followersCount
      );
      setAiAdvice(advice);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-8 select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>MIZIZI Creator Studio</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-neutral-900 dark:text-neutral-100">
            Welcome, {currentUser.displayName}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Audience engagement, performance analytics, and growth recommendations for the past 30 days.
          </p>
        </div>

        <button
          onClick={handleGenerateAdvice}
          disabled={isLoadingAdvice}
          className="px-4 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 shrink-0 disabled:opacity-50"
        >
          {isLoadingAdvice ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Get AI Strategy Plan</span>
        </button>
      </div>

      {/* AI Strategy Advisor Box (if generated) */}
      {aiAdvice && (
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-500/30 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-neutral-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{aiAdvice.title}</span>
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
              Tailored by Gemini
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {aiAdvice.actionableSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed"
              >
                <div className="font-bold text-amber-500 mb-1">Step {idx + 1}</div>
                {step}
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500">
            <Music className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              Recommended Audio:
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {aiAdvice.recommendedAudio}
            </span>
          </div>
        </div>
      )}

      {/* 4 Metric Cards (Clean tabular numbers, no compound pills) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Impressions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Impressions</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {analytics.impressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 pt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last mo</span>
          </div>
        </div>

        {/* Reach */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Total Reach</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {analytics.reach.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 pt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.1% vs last mo</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Engagement</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {analytics.engagementRate}%
          </div>
          <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 pt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Top 5% of creators</span>
          </div>
        </div>

        {/* Follower Growth */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Monthly Growth</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
            +{analytics.followersGrowth}%
          </div>
          <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 pt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+540 new followers</span>
          </div>
        </div>
      </div>

      {/* Top Performing Content & Audience Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Posts Table (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Top Performing Content
            </h3>
            <span className="text-xs text-neutral-400">Ranked by reach</span>
          </div>

          <div className="space-y-3">
            {analytics.topPosts.map(post => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {post.title}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {post.impressions.toLocaleString()} views
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-amber-500 tabular-nums">
                    {post.engagement}%
                  </div>
                  <div className="text-[10px] text-neutral-400">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Breakdown (1 col) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-sm text-neutral-900 dark:text-neutral-100">
            Top Audience Locations
          </h3>

          <div className="space-y-3 text-xs">
            {analytics.audienceCountries.map(item => (
              <div key={item.country} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {item.country}
                  </span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-bold tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400">
            Audience age: 68% 18–34 years old.
          </div>
        </div>
      </div>

      {/* Creator Monetization Program Status */}
      <div className="p-5 rounded-3xl bg-neutral-900 text-white border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm">MIZIZI Creator Fund: Verified</div>
            <div className="text-xs text-neutral-400">
              Eligible for brand sponsorships, tips, and revenue sharing on Reels.
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Payout method linked: M-PESA & Bank Wire (TZS/KES/USD)')}
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
        >
          Manage Payouts
        </button>
      </div>
    </div>
  );
};
