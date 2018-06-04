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
import ServerProxy from './ServerProxy';

const model = new Model();
const view = new View();
const serverProxy = new ServerProxy();

const controller = new Controller(view, model, serverProxy);

export default controller;