/**
 * Application entry point
 */

// Load application styles
import './styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

import View from './View';
import Model from './Model';
import Controller from './Controller';
import LocalRepository from './LocalRepository';

const model = new Model();
const view = new NView();
const localRepository = new LocalRepository();

const controller = new NewController(view, model, localRepository);

export default controller;