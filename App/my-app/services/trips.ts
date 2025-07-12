import axios from 'axios';
import { API_BASE_URL } from '../constants/constants';
import { Trip } from '../types/trip';
import { NewTrip } from '../types/trip';

export async function fetchTrips(): Promise<Trip[]> {
  const res = await axios.get(`${API_BASE_URL}/api/trips`);
  return res.data.map((trip: any): Trip => ({
    id: trip.id,
    title: trip.title,
    location: trip.location,
    images: trip.images || null,
    isFavorite: trip.isFavorite,
  }));
}

export async function deleteTrip(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api/trips/${id}`);
}

export async function createTrip(trip: NewTrip): Promise<void> {
  await axios.post(`${API_BASE_URL}/api/trips`, trip);
}