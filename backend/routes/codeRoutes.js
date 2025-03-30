import express from 'express'
import { executeCode } from '../controller/codeController.js';

export const codeRoutes = express.Router();

codeRoutes.post('/execute', executeCode);