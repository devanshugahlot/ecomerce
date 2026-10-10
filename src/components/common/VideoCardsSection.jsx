import React, { useState } from 'react';
import { Play, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const VIDEO_CARDS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    age: '29 yrs',
    rating: 5,
    title: 'Extend spray helped me last 3X longer without any numbness!',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    productName: 'Extend — Delay Spray',
    price: 499
  },
  {
    id: 2,
    name: 'Vikram Verma',
    age: '34 yrs',
    rating: 5,
    title: 'Surge capsules boosted my stamina in just 10 days of daily use.',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    productName: 'Surge — Stamina Capsules',
    price: 599
  },
  {
    id: 3,
    name: 'Aman Deep',
    age: '38 yrs',
    rating: 5,
    title: 'Alpha Shilajit resin is 100% pure! Best energy booster.',
    thumbnail: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    productName: 'Alpha — Shilajit Gold Resin',
    price: 899
  },
  {
    id: 4,
    name: 'Karan Malhotra',
    age: '31 yrs',
    rating: 5,
    title: 'Discreet packaging was 100% plain with zero product details.',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    productName: 'Longer & Stronger Combo',
    price: 999
  },
  {
    id: 5,
    name: 'Deepak Rao',
    age: '27 yrs',
    rating: 5,
    title: 'Stopped my hair shedding within 4 weeks. Highly recommend!',
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    productName: 'Hypril Hair Regrowth Serum',
    price: 699
  }
];

export const VideoCardsSection = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow-label text-[#0D472E]">REAL STORIES</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900">
            Real People, Real Results
          </h2>
        </div>

        {/* Carousel Circular Arrow Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button className="w-10 h-10 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center hover:border-slate-900 hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-slate-900 text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 5 Portrait 9:16 Video Cards Slider */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {VIDEO_CARDS.map((v) => (
          <div
            key={v.id}
            onClick={() => setActiveVideo(v)}
            className="group relative aspect-video-portrait rounded-[20px] overflow-hidden bg-slate-900 cursor-pointer border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <img
              src={v.thumbnail}
              alt={v.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-[#0D472E] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0D472E] group-hover:text-white transition-all shadow-lg">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>

            {/* Bottom Card Info */}
            <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-white text-[11px]">{v.rating}.0 • Verified User</span>
              </div>
              <h4 className="font-heading font-bold text-xs line-clamp-2 leading-tight">{v.title}</h4>
              <p className="text-[10px] text-slate-300 font-medium">{v.name} ({v.age})</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Popup Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-slate-900 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video-portrait w-full bg-black relative">
              <video src={activeVideo.videoUrl} controls autoPlay className="w-full h-full object-cover"></video>

              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 text-slate-900 flex items-center justify-between">
                <div>
                  <h5 className="font-heading font-bold text-xs">{activeVideo.productName}</h5>
                  <span className="text-xs font-black text-[#0D472E]">₹{activeVideo.price}</span>
                </div>
                <button onClick={() => setActiveVideo(null)} className="bg-[#0D472E] text-white text-xs py-2 px-4 rounded-full font-bold">
                  View Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
