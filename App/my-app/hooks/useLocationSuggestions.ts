import { useState } from 'react';
import axios from 'axios';

export const useLocationSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          'User-Agent': 'MobileApp/1.0 (your@email.com)',
          'Accept-Language': 'it',
        },
      });
      const results = response.data.map((item: any) => item.display_name);
      setSuggestions(results);
    } catch (err) {
      console.error('Errore nel suggerimento:', err);
    }
  };

  return { suggestions, fetchSuggestions };
};
