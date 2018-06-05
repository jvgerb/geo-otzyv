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
import Map from './Map';

const model = new Model(),
    view = new View(),
    serverProxy = new ServerProxy(),
    map = new Map();

const controller = new Controller(view, model, serverProxy, map);

export default controller;