import * as Location from "expo-location";
import { useState } from "react";
import { ClickedLocation, Store } from "../utils/map";

interface MapState {
  selectedStore: Store | null;
  stores: Store[];
  userLocation: Location.LocationObject | null;
  isLoading: boolean;
  isMapReady: boolean;
  isLocationReady: boolean;
  showAddressSearch: boolean;
  clickedLocation: ClickedLocation | null;
  showStoreList: boolean;
}

interface MapStateSetters {
  setSelectedStore: (store: Store | null) => void;
  setStores: (stores: Store[]) => void;
  setUserLocation: (location: Location.LocationObject | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsMapReady: (ready: boolean) => void;
  setIsLocationReady: (ready: boolean) => void;
  setShowAddressSearch: (show: boolean) => void;
  setClickedLocation: (location: ClickedLocation | null) => void;
  setShowStoreList: (show: boolean) => void;
}

export type MapStateReturn = MapState & MapStateSetters;

export function useMapState(): MapStateReturn {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [clickedLocation, setClickedLocation] =
    useState<ClickedLocation | null>(null);
  const [showStoreList, setShowStoreList] = useState(false);

  return {
    // States
    selectedStore,
    stores,
    userLocation,
    isLoading,
    isMapReady,
    isLocationReady,
    showAddressSearch,
    clickedLocation,
    showStoreList,
    // Setters
    setSelectedStore,
    setStores,
    setUserLocation,
    setIsLoading,
    setIsMapReady,
    setIsLocationReady,
    setShowAddressSearch,
    setClickedLocation,
    setShowStoreList,
  };
}
