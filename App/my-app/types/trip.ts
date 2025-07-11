export type Trip = {
  id: number;
  title: string;
  location: string;
  description?: string;
  images?: string[]; // array di immagini base64
  isFavorite?: boolean;
  category?: string;
  start_date?: string;
  end_date?: string;
};

export type NewTrip = {
  title: string;
  description: string;
  images?: string[]; // array base64
  category: string;
  location: string;
  start_date?: string;
  end_date?: string;
};