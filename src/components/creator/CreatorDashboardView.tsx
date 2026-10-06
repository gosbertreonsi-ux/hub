import React, { useState } from 'react';
import {
  TrendingUp,
  Eye,
  Users,
  Award,
  Sparkles,
  DollarSign,
  ArrowRight,
  Music,
  CheckCircle2,
  Loader2,
  Video,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { INITIAL_CREATOR_ANALYTICS } from '../../data/seedData';
import { generateCreatorAdvice } from '../../services/geminiService';

export const CreatorDashboardView: React.FC = () => {
  const { currentUser, setIsCreateModalOpen } = useSocial();

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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-white select-none">
      {/* Top Banner matching oneImage.webp typography */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-[#121212] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-2xl">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
            Creator Intelligence Studio
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            {currentUser.displayName}
          </h1>
          <p className="text-xs text-neutral-400 max-w-md">
            Audience velocity, video completion metrics, and AI recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-full bg-white text-black font-extrabold text-xs flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg active:scale-95"
          >
            <Video className="w-4 h-4 stroke-[2.5]" />
            <span>Upload New Reel</span>
          </button>

          <button
            onClick={handleGenerateAdvice}
            disabled={isLoadingAdvice}
            className="px-5 py-3 rounded-full bg-[#202020] text-white font-extrabold text-xs hover:bg-[#282828] border border-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoadingAdvice ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>AI Growth Plan</span>
          </button>
        </div>
      </div>

      {/* AI Strategy Advisor Box */}
      {aiAdvice && (
        <div className="p-6 rounded-[32px] bg-[#161616] border border-white/20 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Sparkles className="w-4 h-4 text-white" />
              <span>{aiAdvice.title}</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              Gemini AI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {aiAdvice.actionableSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/5 text-xs text-neutral-300 leading-relaxed"
              >
                <div className="font-extrabold text-white mb-1">0{idx + 1}. Directive</div>
                {step}
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
            <Music className="w-4 h-4 text-white" />
            <span className="font-semibold text-white">Trending Track:</span>
            <span>{aiAdvice.recommendedAudio}</span>
          </div>
        </div>
      )}

      {/* 4 Massive Metric Cards (Directly matching $45689.05 bold financial style in oneImage.webp) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Reach */}
        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-2">
          <div className="text-neutral-400 text-xs font-semibold flex items-center justify-between">
            <span>Video Impressions</span>
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight font-display">
            {analytics.impressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold pt-1">
            +18.4% this month
          </div>
        </div>

        {/* Total Reach */}
        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-2">
          <div className="text-neutral-400 text-xs font-semibold flex items-center justify-between">
            <span>Unique Reach</span>
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight font-display">
            {analytics.reach.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold pt-1">
            +12.1% this month
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-2">
          <div className="text-neutral-400 text-xs font-semibold flex items-center justify-between">
            <span>Engagement Rate</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight font-display">
            {analytics.engagementRate}%
          </div>
          <div className="text-[11px] text-emerald-400 font-bold pt-1">
            Top tier tier 1
          </div>
        </div>

        {/* Follower Growth */}
        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-2">
          <div className="text-neutral-400 text-xs font-semibold flex items-center justify-between">
            <span>Net Growth</span>
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight font-display">
            +{analytics.followersGrowth}%
          </div>
          <div className="text-[11px] text-emerald-400 font-bold pt-1">
            +540 new followers
          </div>
        </div>
      </div>

      {/* Top Performing Content & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-[32px] bg-[#121212] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-white">
              Top Performing Publications
            </h3>
            <span className="text-xs text-neutral-400">Ranked by video views</span>
          </div>

          <div className="space-y-3">
            {analytics.topPosts.map(post => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/5"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-white/10"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {post.title}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {post.impressions.toLocaleString()} views
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-white tabular-nums">
                    {post.engagement}%
                  </div>
                  <div className="text-[10px] text-neutral-400">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Breakdown */}
        <div className="p-6 rounded-[32px] bg-[#121212] border border-white/10 shadow-xl space-y-4">
          <h3 className="font-display font-extrabold text-base text-white">
            Audience Distribution
          </h3>

          <div className="space-y-3.5 text-xs">
            {analytics.audienceCountries.map(item => (
              <div key={item.country} className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-300">
                    {item.country}
                  </span>
                  <span className="text-white font-extrabold tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-neutral-400">
            Primary engagement demographic: 18–34 creators.
          </div>
        </div>
      </div>
    </div>
  );
};
