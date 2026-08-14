"use client";
import { Region, GameState } from '../shared/types';
import { useState, SVGProps } from "react"
import {mapPaths} from './mapPaths';


type MapProps = {
    gameState: GameState,
    onClaimRegion: (regionId: number, newStatus: string) => void,
    onSetRegionLock: (regionId: number, locked: boolean) => void

}
export function MapPage({gameState, onClaimRegion, onSetRegionLock}: MapProps) {
    // Master map element

    const [selectedRegion, setSelectedRegion] = useState<number>(0);

    console.log(gameState);
    console.log(gameState.regions);
    console.log(selectedRegion);

    return (
        <div className="max-w-4xl space-y-4">
            <MapControls gameState={gameState} selectedRegion={selectedRegion} onClaimRegion={onClaimRegion} onSetRegionLock={onSetRegionLock} />
            < MapArea gameState={gameState} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
        </div>
    )
}

type MapControlsProps = {
    gameState: GameState,
    selectedRegion: number,
    onClaimRegion: (regionId: number, newStatus: string) => void,
    onSetRegionLock: (regionId: number, locked: boolean) => void

}

function MapControls({gameState, selectedRegion, onClaimRegion, onSetRegionLock}: MapControlsProps) {
    // Buttons that control claiming of region
    const region = gameState.regions[selectedRegion];
    return (
        <div className="border rounded-xl bg-gray-100 p-4 shadow-sm space-y-3">
            <div className="text-xl font-semibold">{region.name}</div>
            <div className="flex gap-3">
                <button className="rounded-lg px-3 py-1.5 bg-gray-400 hover:bg-gray-500 transition" onClick={() => onClaimRegion(selectedRegion, "none")}>None</button>
                <button className="rounded-lg px-3 py-1.5 bg-red-400 hover:bg-red-500 transition" onClick={() => onClaimRegion(selectedRegion, "red")}>Red</button>
                <button className="rounded-lg px-3 py-1.5 bg-blue-400 hover:bg-blue-500 transition" onClick={() => onClaimRegion(selectedRegion, "blue")}>Blue</button>
                <button className="rounded-lg px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 transition" onClick={() => onSetRegionLock(selectedRegion, region.locked ? false : true)}>{region.locked ? "Unlock" : "Lock"}</button>
            </div>
        </div>
    )
    
}

type MapRegionProps = {
    region: Region,
    selectedRegion: number,
    setSelectedRegion: (regionId: number) => void,
}

function MapRegion({region, selectedRegion, setSelectedRegion}: MapRegionProps) {
    
    const fillColor = 
        region.status === "red" && region.locked === true ? "#ff0000" :
        region.status === "blue" && region.locked === true ? "#0070ff" :
        region.status === "red" ? "#f07070" :
        region.status === "blue" ? "#70b0f0" :
        "#e0e0e0";
    const borderWidth =
        region.id === selectedRegion ? "2px" : "0.5px";
    
    return (
    <path
        d={mapPaths[region.id]}
        clipPath="url(#pd729bc216b)"
        style={{
            fill: fillColor,
            stroke: "#000000",
            strokeWidth: borderWidth,
            }}
        onClick={() => setSelectedRegion(region.id)}
    />
    );


}

type MapAreaProps = {
    gameState: GameState,
    selectedRegion: number,
    setSelectedRegion: (regionId: number) => void
}

function MapArea ({gameState, selectedRegion, setSelectedRegion}: MapAreaProps) {
    // Actual map area
    return (

  <svg
    className="map"
    width={959.161}
    height={460.8}
    viewBox="0 0 1019.371 345.6"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  
  >
    <defs>
      <style>{"*{stroke-linejoin:round;stroke-linecap:butt}"}</style>
    </defs>
    <g id="figure_1">
      <path
        d="M0 345.6h719.37V0H0z"
        style={{
          fill: "#fff",
        }}
        id="patch_1"
      />
      <g id="axes_1">
        <path
          d="M0 345.6h719.37V0H0z"
          style={{
            fill: "#202529",
          }}
          id="patch_2"
          />
          {gameState.regions.map(region => (
            <MapRegion
            key={region.id}
            region={region}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            />
          ))}
          
      </g>
    </g>
    <defs>
      <clipPath id="pd729bc216b">
        <path d="M0 0h719.371v345.6H0z" />
      </clipPath>
    </defs>
  </svg>
    );
}


