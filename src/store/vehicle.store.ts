import {create} from 'zustand';

export interface Vehicle {
  name: string;
  engine: string;
  fuel: string;
  year: number;
}

interface VehicleState {
  active: Vehicle;
  setActive: (v: Vehicle) => void;
}

export const useVehicleStore = create<VehicleState>(set => ({
  active: {
    name: 'EcoSport',
    engine: '1.6 Sigma',
    fuel: 'Flex',
    year: 2016,
  },
  setActive: v => set({active: v}),
}));

export function vehicleLabel(v: {name: string; engine: string; year: number; fuel: string}) {
  return `${v.name} ${v.engine} ${v.year} ${v.fuel}`;
}
