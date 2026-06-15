import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEARCHABLE_ROOMS } from '../data/rooms';
import { useNavigationStore } from '../store/navigationStore';
import { FloorId, getFloorLabel } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setFrom, setTo } = useNavigationStore();
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const toSelectRef = useRef<HTMLSelectElement>(null);

  const handleFromChange = (value: string) => {
    setFromId(value);

    setTimeout(() => {
      const toSelect = toSelectRef.current;
      if (!toSelect) return;

      toSelect.focus();

      if ("showPicker" in toSelect) {
        try {
          (toSelect as HTMLSelectElement & {
            showPicker?: () => void;
          }).showPicker?.();
        } catch {
          // ignore browser limitations
        }
      }
    }, 150);
  };

  const handleFindRoute = () => {
    if (!fromId || !toId) return;
    setFrom(fromId);
    setTo(toId);
    
    // Sort items by floor for user readability
    const fromLabel = SEARCHABLE_ROOMS.find((r) => r.id === fromId)?.label ?? '';
    const toLabel = SEARCHABLE_ROOMS.find((r) => r.id === toId)?.label ?? '';
    
    navigate(
      `/navigate?from=${encodeURIComponent(fromLabel)}&to=${encodeURIComponent(
        toLabel
      )}&fromId=${fromId}&toId=${toId}`
    );
  };

  // Group rooms by floor to present a beautifully organized list to the user
  const groupedRooms = {
    ground: SEARCHABLE_ROOMS.filter((r) => r.floor === 'ground'),
    first:  SEARCHABLE_ROOMS.filter((r) => r.floor === 'first'),
    second: SEARCHABLE_ROOMS.filter((r) => r.floor === 'second'),
    third:  SEARCHABLE_ROOMS.filter((r) => r.floor === 'third'),
  };

  const getFloorName = (f: string) => {
    return getFloorLabel(f as FloorId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-700"></div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="text-center mb-10 z-10"
      >
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-blue-600/10 border border-blue-500/20 shadow-2xl flex items-center justify-center text-4xl">
          🧭
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2">
          Naviga<span className="text-blue-400">to</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg font-medium">
          Indoor Navigation · 4-Floor College Building
        </p>
      </motion.div>

      {/* Glassmorphic Search Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md glass-panel-dark rounded-3xl p-6 md:p-8 z-10 shadow-2xl"
      >
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <span>🗺️</span> Find Your Direction
        </h2>

        <div className="space-y-4">
          {/* FROM SELECT */}
          <div>
            <label className="block text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-1.5">
              Starting Location
            </label>
            <select
              value={fromId}
              onChange={(e) => handleFromChange(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-lg text-sm transition-all"
            >
              <option value="" className="bg-slate-900 text-slate-400">Select start room...</option>
              {(Object.keys(groupedRooms) as Array<keyof typeof groupedRooms>).map((floor) => (
                <optgroup key={floor} label={getFloorName(floor)} className="bg-slate-900 font-bold text-blue-400">
                  {groupedRooms[floor].map((room) => (
                    <option key={room.id} value={room.id} className="bg-slate-900 text-slate-200 font-normal">
                      {room.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* TO SELECT */}
          <div>
            <label className="block text-[10px] font-extrabold text-red-400 uppercase tracking-widest mb-1.5">
              Destination
            </label>
            <select
              ref={toSelectRef}
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-lg text-sm transition-all"
            >
              <option value="" className="bg-slate-900 text-slate-400">Select destination room...</option>
              {(Object.keys(groupedRooms) as Array<keyof typeof groupedRooms>).map((floor) => (
                <optgroup key={floor} label={getFloorName(floor)} className="bg-slate-900 font-bold text-red-400">
                  {groupedRooms[floor].map((room) => (
                    <option key={room.id} value={room.id} className="bg-slate-900 text-slate-200 font-normal">
                      {room.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={!fromId || !toId || fromId === toId}
            onClick={handleFindRoute}
            className="w-full mt-4 py-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>🚀</span> {fromId === toId && fromId ? 'Source & Destination match' : 'Plan Walk Route'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
