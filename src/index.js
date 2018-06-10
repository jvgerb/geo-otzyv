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
import MapProvider from './MapProvider';

const model = new Model();
const view = new View();
const serverProxy = new ServerProxy();
const mapProvider = new MapProvider();

var controller = new Controller(view, model, serverProxy, mapProvider);

export default controller;