import { DomainError } from '../../../shared/DomainError';

// Interface: define la estructura de los objetos candidato.
export interface Candidate {
  id: number;
  name: string;
  email: string;
  city: string;
  experienceYears: number;
}

// Un candidato nuevo: los datos que se esperan recibir desde el cliente (todavía sin id).
export type NewCandidate = Omit<Candidate, 'id'>;

// Formato básico de correo: texto@dominio.ext, sin espacios.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida los datos recibidos y devuelve un NewCandidate limpio.
// Se reutiliza para crear y para editar: las reglas son las mismas.
export const parseNewCandidate = (input: unknown): NewCandidate => {
  const { name, email, city, experienceYears } = (input ?? {}) as Record<string, unknown>;

  // Regla 1: el nombre y el correo son obligatorios.
  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
    throw new DomainError('El nombre y el correo son obligatorios');
  }

  // Regla 2: el correo debe tener un formato válido.
  if (!EMAIL_PATTERN.test(email.trim())) {
    throw new DomainError('El correo no tiene un formato válido');
  }

  // Regla 3: la ciudad es obligatoria.
  if (typeof city !== 'string' || !city.trim()) {
    throw new DomainError('La ciudad es obligatoria');
  }

  // Regla 4: los años de experiencia son un número mayor o igual que 0.
  if (typeof experienceYears !== 'number' || !Number.isFinite(experienceYears) || experienceYears < 0) {
    throw new DomainError('Los años de experiencia deben ser un número igual o mayor que 0');
  }

  // Devuelve los datos limpios (sin espacios sobrantes).
  return { name: name.trim(), email: email.trim(), city: city.trim(), experienceYears };
};