// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client';

export type Path =
  | `/`
  | `/content/:type/:id`
  | `/doc/about`
  | `/doc/changelog`
  | `/doc/readme`
  | `/settings`
  | `/web`;

export type Params = {
  '/content/:type/:id': { type: string; id: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>();
export const { redirect } = utils<Path, Params>();
