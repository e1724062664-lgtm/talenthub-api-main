import { DomainError } from '../../../shared/DomainError';
import { parseNewCandidate } from './Candidate';

// Datos válidos de ejemplo (datos de prueba en español).
const validInput = { name: 'María Fernández', email: 'maria@example.com', city: 'Quito', experienceYears: 3 };

describe('parseNewCandidate', () => {
  it('returns the candidate data trimmed', () => {
    const result = parseNewCandidate({ ...validInput, name: ' María Fernández ', city: ' Quito ' });

    expect(result).toEqual(validInput);
  });

  it('accepts zero years of experience', () => {
    expect(parseNewCandidate({ ...validInput, experienceYears: 0 }).experienceYears).toBe(0);
  });

  it('throws when name or email is missing', () => {
    expect(() => parseNewCandidate({ ...validInput, name: '' })).toThrow(DomainError);
    expect(() => parseNewCandidate({ ...validInput, email: undefined })).toThrow('El nombre y el correo son obligatorios');
  });

  it('throws when the email format is not valid', () => {
    expect(() => parseNewCandidate({ ...validInput, email: 'correo-sin-arroba' })).toThrow(DomainError);
    expect(() => parseNewCandidate({ ...validInput, email: 'maria@' })).toThrow('El correo no tiene un formato válido');
  });

  it('throws when the city is missing', () => {
    expect(() => parseNewCandidate({ ...validInput, city: '   ' })).toThrow(DomainError);
    expect(() => parseNewCandidate({ ...validInput, city: undefined })).toThrow('La ciudad es obligatoria');
  });

  it('throws when experienceYears is not a number greater than or equal to 0', () => {
    const message = 'Los años de experiencia deben ser un número igual o mayor que 0';

    expect(() => parseNewCandidate({ ...validInput, experienceYears: -1 })).toThrow(DomainError);
    expect(() => parseNewCandidate({ ...validInput, experienceYears: '3' })).toThrow(message);
    expect(() => parseNewCandidate({ ...validInput, experienceYears: NaN })).toThrow(message);
  });
});