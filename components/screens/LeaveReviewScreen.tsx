'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { Star, CheckCircle2, ArrowRight } from 'lucide-react';

export const LeaveReviewScreen: React.FC = () => {
  const { screenParams, pros, addReview, navigate, showToast } = useApp();

  const proId = screenParams?.proId || 'pro_1';
  const pro = pros.find((p) => p.id === proId) || pros[0];

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('Bòs la te trè pwofesyonèl, li rive alè epi li rezoud pwoblèm nan san pèdi tan!');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Ponktwèl', 'Travay pwòp']);

  const feedbackLabels: Record<number, string> = {
    1: 'Trè move eksperyans',
    2: 'Pa twò bon',
    3: 'Kòrèk / Mwayen',
    4: 'Trè bon travay',
    5: 'Ekselan travay! ⭐️',
  };

  const tagOptions = [
    'Ponktwèl',
    'Travay pwòp',
    'Respekte pri a',
    'Bon kominikasyon',
    'Vit e efikas',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Tanpri ekri yon ti kòmantè.');
      return;
    }

    addReview(pro.id, rating, comment);
    showToast('Mèsi! Kòmantè ou anrejistre avèk siksè.');
    navigate('pro_profile', { proId: pro.id });
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title="Evalye Sèvis la"
        onBack={() => navigate('pro_profile', { proId: pro.id })}
      />

      <div className="p-5 max-w-md mx-auto space-y-4">
        {/* Pro Header */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] flex items-center gap-3 shadow-2xs">
          <img
            src={pro.avatar}
            alt={pro.name}
            className="w-14 h-14 rounded-2xl object-cover border border-[#E5EBE7]"
          />
          <div>
            <h4 className="text-xs font-black text-[#17231C]">{pro.name}</h4>
            <p className="text-[11px] text-[#66736B]">{pro.title}</p>
            <span className="text-[10px] text-[#159447] font-bold">
              ★ {pro.rating} ({pro.reviewsCount} avi)
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl border border-[#E5EBE7] space-y-4 shadow-2xs">
          <div className="text-center">
            <label className="block text-xs font-bold text-[#17231C] mb-2">
              Kijan ou jije kalite travay la?
            </label>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition-transform active:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-[#D99A2B] text-[#D99A2B]'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-[#159447]">
              {feedbackLabels[hoverRating || rating]}
            </span>
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-2">
              Chwazi sa ou plis apresye:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tagOptions.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#159447] text-white shadow-xs'
                        : 'bg-[#F7F9F8] border border-[#E5EBE7] text-[#66736B]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment text area */}
          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1.5">
              Kòmantè ou:
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Pataje detay eksperyans ou ak pwofesyonèl sa a pou ede lòt moun..."
              className="w-full p-3 bg-[#F7F9F8] border border-[#E5EBE7] rounded-2xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#159447]/20 active:scale-98 transition-all"
          >
            <span>Pibliye Evalyasyon an</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
