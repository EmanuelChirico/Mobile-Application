import axios from 'axios';
import { API_BASE_URL } from '../constants/constants';
import { Category } from '../types/category';

const API_URL = `${API_BASE_URL}/api/tipology`;

export async function fetchCategories(): Promise<string[]> {
  const response = await axios.get(API_URL);
  return response.data.map((item: Category) => item.nome);
}

export async function addCategory(nome: string): Promise<string> {
  const response = await axios.post(API_URL, { nome });
  return response.data.nome;
}

export async function deleteCategory(nome: string): Promise<void> {
  await axios.delete(`${API_URL}/${encodeURIComponent(nome)}`);
}
