import React from 'react';
import { Route, getFloorLabel, FloorId } from '../../types';

interface Props {
  route: Route | null;
}

export const RoutePanel: React.FC<Props> = ({ route }) => {
  if (!route) {
    return (
      <div className="p-6 border-b border-slate-100 flex items-center justify-center h-40">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm font-medium">Calculating optimal route...</p>
        </div>
      </div>
    );
  }

  const mins = Math.floor(route.estimatedTime / 60);
  const secs = route.estimatedTime % 60;

  return (
    <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-blue-50/50 to-white">
      {/* Starting point and Destination */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mb-0.5">Start</p>
          <p className="text-base font-bold text-slate-800 truncate" title={route.from.label}>
            {route.from.label}
          </p>
          <p className="text-xs text-slate-400 font-medium">{getFloorLabel(route.from.floor)}</p>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-lg shadow-sm font-bold">
          ➔
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest mb-0.5">Destination</p>
          <p className="text-base font-bold text-slate-800 truncate" title={route.to.label}>
            {route.to.label}
          </p>
          <p className="text-xs text-slate-400 font-medium">{getFloorLabel(route.to.floor)}</p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center transition-all hover:bg-white hover:shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Distance</p>
          <p className="text-lg font-black text-slate-800">{route.totalDistance}m</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center transition-all hover:bg-white hover:shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
          <p className="text-lg font-black text-slate-800">
            {mins > 0 ? `${mins}m ${secs}s` : `${secs}s`}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center transition-all hover:bg-white hover:shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Transfers</p>
          <p className="text-lg font-black text-slate-800">{route.floorChanges}</p>
        </div>
      </div>
    </div>
  );
};
