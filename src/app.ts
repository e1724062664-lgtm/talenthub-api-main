import express from 'express';

import { InMemoryVacancyRepository } from './modules/vacancies/adapters/persistence/InMemoryVacancyRepository';
import { VancacyService } from './modules/vacancies/application/VacancyService';
import { createVacancyRouter } from './modules/vacancies/adapters/http/vacancyRoutes';
import { errorHandler, notFoundHandler } from './shared/httpErrorHandlers';

const app = express();

app.use(express.json());

//1) Respositorio donde se guardan las vacantes
const vacancyRepository = new InMemoryVacancyRepository([
    {id: 1, title: 'Desarrollador Backend', company:'Tech Ander', modality: 'remoto', salary: 800},
    {id: 2, title: 'Analista de Datos', company:'DataSur', modality: 'híbrido', salary: 1200},
]);

//2) Servicio (casos de uso)
const vancacyService = new VancacyService(vacancyRepository);

//3) Rutas: se le entrega el servicio y se monta bajo el prefijo /vacancies
app.use('/vacancies', createVacancyRouter(vancacyService));

app.use(notFoundHandler);

app.use(errorHandler);

export default app;