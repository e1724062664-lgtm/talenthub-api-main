import { InMemoryCandidateRepository } from './InMemoryCandidateRepository';

// Datos de ejemplo (datos de prueba en español).
const sampleCandidate = { name: 'María Fernández', email: 'maria@example.com', city: 'Quito', experienceYears: 3 };

describe('InMemoryCandidateRepository', () => {
  it('starts empty when no initial candidates are given', async () => {
    const repository = new InMemoryCandidateRepository();

    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a candidate, assigns increasing ids and lists them', async () => {
    const repository = new InMemoryCandidateRepository();

    const first = await repository.save(sampleCandidate);
    const second = await repository.save(sampleCandidate);

    expect(first).toEqual({ id: 1, ...sampleCandidate });
    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('continues the ids after the highest initial id', async () => {
    const repository = new InMemoryCandidateRepository([{ id: 7, ...sampleCandidate }]);

    const saved = await repository.save(sampleCandidate);

    expect(saved.id).toBe(8);
  });

  it('finds a candidate by id and returns undefined when it does not exist', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(sampleCandidate);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('updates an existing candidate and keeps its id', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(sampleCandidate);

    const updated = await repository.update(saved.id, { ...sampleCandidate, city: 'Cuenca' });

    expect(updated).toEqual({ id: saved.id, ...sampleCandidate, city: 'Cuenca' });
    expect(await repository.update(999, sampleCandidate)).toBeUndefined();
  });

  it('removes a candidate and reports whether it existed', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(sampleCandidate);

    expect(await repository.remove(saved.id)).toBe(true);
    expect(await repository.findAll()).toEqual([]);
    expect(await repository.remove(saved.id)).toBe(false);
  });

  it('returns copies, so changing them does not change what is stored', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(sampleCandidate);

    // Se modifican las copias recibidas.
    const list = await repository.findAll();
    list[0].name = 'Nombre alterado';
    list.pop();
    saved.city = 'Ciudad alterada';

    // Lo guardado sigue intacto.
    expect(await repository.findAll()).toEqual([{ id: 1, ...sampleCandidate }]);
  });
});