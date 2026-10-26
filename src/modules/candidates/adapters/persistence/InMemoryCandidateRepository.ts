import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

// Adaptador de salida: cumple el contrato CandidateRepository guardando los candidatos en un arreglo.
export class InMemoryCandidateRepository implements CandidateRepository {
  // La lista donde se guardan los candidatos. "private" = solo esta clase puede tocarla.
  private candidates: Candidate[];

  // El número que usará el próximo candidato. Solo sube, así que un id eliminado nunca se reutiliza.
  private nextId: number;

  constructor(initialCandidates: Candidate[] = []) {
    // Se copian la lista Y cada candidato, para no depender de los objetos originales.
    this.candidates = initialCandidates.map((candidate) => ({ ...candidate }));

    // El siguiente id es el mayor id existente + 1 (con lista vacía, empieza en 1).
    this.nextId = Math.max(0, ...initialCandidates.map((candidate) => candidate.id)) + 1;
  }

  // Devuelve COPIAS de los candidatos, para que nadie de afuera pueda modificar los originales.
  findAll = async (): Promise<Candidate[]> => this.candidates.map((candidate) => ({ ...candidate }));

  // Busca un candidato por id y devuelve una copia (o undefined si no existe).
  findById = async (id: number): Promise<Candidate | undefined> => {
    const candidate = this.candidates.find((item) => item.id === id);

    return candidate ? { ...candidate } : undefined;
  };

  // Guarda un candidato nuevo asignándole el siguiente id.
  save = async (newCandidate: NewCandidate): Promise<Candidate> => {
    const candidate: Candidate = { id: this.nextId++, ...newCandidate };
    this.candidates.push(candidate);

    // Se devuelve una copia: lo guardado queda protegido.
    return { ...candidate };
  };

  // Reemplaza los datos de un candidato existente conservando su id.
  update = async (id: number, data: NewCandidate): Promise<Candidate | undefined> => {
    // "findIndex" devuelve la posición del elemento, o -1 si no lo encuentra.
    const index = this.candidates.findIndex((item) => item.id === id);

    if (index === -1) {
      return undefined;
    }

    const updated: Candidate = { id, ...data };
    this.candidates[index] = updated;

    return { ...updated };
  };

  // Elimina un candidato. Devuelve true si existía, false si no.
  remove = async (id: number): Promise<boolean> => {
    const index = this.candidates.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    // "splice(posición, 1)" quita 1 elemento de la lista en esa posición.
    this.candidates.splice(index, 1);
    return true;
  };
}