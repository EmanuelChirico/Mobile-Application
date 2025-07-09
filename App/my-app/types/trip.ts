export type Trip = {
  id: number;
  title: string;
  location: string;
  image?: string;
  isFavorite?: boolean;
};

export type NewTrip = {
  title: string;
  description: string;
  image_base64?: string | null;
  category: string;
  location: string;
};
