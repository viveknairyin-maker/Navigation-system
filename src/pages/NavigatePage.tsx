import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../store/navigationStore';
import { NAVIGATION_GRAPH } from '../data/graph';
import { findRoute } from '../engine/pathfinder';
import { generateDirections } from '../engine/directionGen';
import { FloorViewer } from '../components/navigation/FloorViewer';
import { RoutePanel } from '../components/navigation/RoutePanel';
import { DirectionsList } from '../components/navigation/DirectionsList';
import { FloorSwitchOverlay } from '../components/navigation/FloorSwitchOverlay';
import { FloorId, getFloorLabel } from '../types';

export const NavigatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fromId = searchParams.get('fromId') ?? '';
  const toId = searchParams.get('toId') ?? '';

  const {
    route,
    setRoute,
    currentFloor,
    setCurrentFloor,
    currentStepIndex,
    setCurrentStepIndex,
    animationPhase,
    reset,
    nextStep,
    prevStep,
  } = useNavigationStore();

  const [showFloorSwitch, setShowFloorSwitch] = useState(false);
  const [switchingToFloor, setSwitchingToFloor] = useState<FloorId>('ground');
  const [changeType, setChangeType] = useState<'staircase' | 'lift'>('staircase');
  const isTransitioningRef = useRef(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'map' | 'instructions'>('map');

  // Compute route on mount or parameters change
  useEffect(() => {
    if (!fromId || !toId) {
      navigate('/');
      return;
    }

    const pathIds = findRoute(NAVIGATION_GRAPH, fromId, toId);
    if (!pathIds || pathIds.length === 0) {
      alert("No navigable pathway found between these spaces. Please choose alternative spaces.");
      navigate('/');
      return;
    }

    const steps = generateDirections(pathIds, NAVIGATION_GRAPH);
    const fromNode = NAVIGATION_GRAPH.nodes[fromId];
    const toNode = NAVIGATION_GRAPH.nodes[toId];

    // Compute metrics
    const totalDist = pathIds.reduce((sum, current, idx) => {
      if (idx === 0) return 0;
      const prev = pathIds[idx - 1];
      const edge = NAVIGATION_GRAPH.edges.find(
        (e) => (e.from === prev && e.to === current) || (e.from === current && e.to === prev)
      );
      return sum + (edge ? edge.weight : 10);
    }, 0);

    const floorChanges = steps.filter((s) => s.isFloorChange).length;

    setRoute({
      steps,
      totalDistance: Math.round(totalDist * 0.8), // scale weight units to meters
      estimatedTime: Math.round(totalDist * 0.8 / 1.3), // speed ~1.3 m/s
      floorChanges,
      from: fromNode,
      to: toNode,
    });
    
    setCurrentFloor(fromNode.floor);
    setCurrentStepIndex(0);

    return () => {
      reset();
    };
  }, [fromId, toId, navigate, setRoute, setCurrentFloor, setCurrentStepIndex, reset]);

  // Monitor step changes to trigger smooth floor transition overlays
  useEffect(() => {
    if (!route || route.steps.length === 0) return;
    const currentStep = route.steps[currentStepIndex];
    if (!currentStep) return;

    // Check if step requires shifting to a different floor
    if (currentStep.floor !== currentFloor && !isTransitioningRef.current) {
      isTransitioningRef.current = true;
      setShowFloorSwitch(true);
      setSwitchingToFloor(currentStep.floor);
      setChangeType(currentStep.changeType || 'staircase');

      const timer = setTimeout(() => {
        setCurrentFloor(currentStep.floor);
        setShowFloorSwitch(false);
        isTransitioningRef.current = false;
      }, 1900);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, route, currentFloor, setCurrentFloor]);

  const pathNodes = route
    ? route.steps.map((s) => NAVIGATION_GRAPH.nodes[s.nodeId]).filter(Boolean)
    : [];

  const handleBackToHome = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col text-slate-100 overflow-hidden">
      
      {/* Page Header (Common on both mobile & desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/40 border-b border-slate-800/80 z-20 shadow-md">
        
        <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all shadow-md cursor-pointer select-none"
          >
            ⬅ Re-plan Route
          </button>

          {/* Mobile Tab Switcher: Map vs Instructions */}
          <div className="flex lg:hidden gap-1 bg-slate-950/45 p-1 rounded-xl border border-slate-800 select-none">
            <button
              onClick={() => setActiveMobileTab('map')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeMobileTab === 'map' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🗺️ Map
            </button>
            <button
              onClick={() => setActiveMobileTab('instructions')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeMobileTab === 'instructions' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📋 Steps
            </button>
          </div>
        </div>
        
        {/* Tabs for changing floor manually - Hidden on instructions tab on mobile */}
        <div className={`gap-1.5 bg-slate-950/40 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto select-none ${
          activeMobileTab === 'map' ? 'flex' : 'hidden lg:flex'
        }`}>
          {(['ground', 'first', 'second', 'third'] as FloorId[]).map((floor) => (
            <button
              key={floor}
              onClick={() => setCurrentFloor(floor)}
              className={`
                px-4 py-2 rounded-lg text-xs font-black capitalize transition-all duration-200 cursor-pointer
                ${currentFloor === floor
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              {getFloorLabel(floor)}
            </button>
          ))}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* LEFT AREA: SVG MAP VIEW & PROGRESS METRICS */}
        <div className={`flex-1 flex flex-col relative p-4 lg:p-6 overflow-auto ${
          activeMobileTab === 'map' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* The Blueprint Viewer Frame */}
          <div className="flex-1 relative flex items-center justify-center bg-slate-950/20 rounded-3xl border border-slate-800 p-2 md:p-4 overflow-hidden">
            <FloorViewer
              floor={currentFloor}
              pathNodes={pathNodes}
              activeStepIdx={currentStepIndex}
              onNodeClick={(id) => {
                // Jump to clicked node in route
                const stepIdx = route?.steps.findIndex((s) => s.nodeId === id);
                if (stepIdx !== undefined && stepIdx !== -1) {
                  setCurrentStepIndex(stepIdx);
                }
              }}
            />

            {/* Smooth Transfer Screen (Stairs / Lifts) */}
            <AnimatePresence mode="wait">
              {showFloorSwitch && (
                <FloorSwitchOverlay targetFloor={switchingToFloor} changeType={changeType} />
              )}
            </AnimatePresence>
          </div>

          {/* Step-by-Step Inline Navigation Buttons (under map) */}
          {route && (
            <div className="mt-4 flex items-center justify-between bg-slate-950/40 border border-slate-800 p-3.5 rounded-2xl gap-3">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="px-5 py-3 rounded-xl text-xs font-extrabold bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer select-none"
              >
                ◀ Previous
              </button>
              
              <span className="text-sm font-black text-slate-200 text-center">
                {route.steps[currentStepIndex]?.direction}
              </span>

              <button
                onClick={nextStep}
                disabled={currentStepIndex === route.steps.length - 1}
                className="px-5 py-3 rounded-xl text-xs font-extrabold bg-blue-600 text-white disabled:bg-emerald-600 hover:bg-blue-500 transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer select-none"
              >
                {currentStepIndex === route.steps.length - 1 ? 'Arrived!' : 'Next Instruction ▶'}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: STEPS PANEL */}
        <div className={`w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800 ${
          activeMobileTab === 'instructions' ? 'flex' : 'hidden lg:flex'
        }`}>
          <RoutePanel route={route} />
          <DirectionsList steps={route?.steps ?? []} currentFloor={currentFloor} />
        </div>

      </div>

    </div>
  );
};
