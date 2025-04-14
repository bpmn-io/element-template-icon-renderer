import TestContainer from 'mocha-test-container-support';

import BpmnViewer from 'bpmn-js/lib/Viewer';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import {
  bootstrapViewer,
  inject,
  insertCSS
} from 'bpmn-js/test/helper';

import {
  query as domQuery
} from 'min-dom';

import {
  attr as svgAttr
} from 'tiny-svg';

import zeebeModdleDescriptors from 'zeebe-bpmn-moddle/resources/zeebe.json';

import RendererModule from '../..';

import {
  getModelerTemplateIcon
} from '../../src/util';

import diagramXML from '../fixtures/icons.bpmn';

const singleStart = window.__env__ && window.__env__.SINGLE_START === 'renderer';

insertCSS(
  'diagram.css',
  require('bpmn-js/dist/assets/diagram-js.css').default
);

insertCSS(
  'bpmn-js.css',
  require('bpmn-js/dist/assets/bpmn-js.css').default
);

insertCSS(
  'bpmn-font.css',
  require('bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css').default
);

insertCSS(
  'test.css',
  require('../test.css').default
);


describe('elementTemplateIconRenderer', function() {

  describe('integration support', function() {

    it('should work with viewer', function() {

      // when
      const viewer = new BpmnViewer({
        container: 'body',
        additionalModules: [ RendererModule ]
      });

      // then
      expect(viewer.get('elementTemplateIconRenderer')).to.exist;
    });


    it('should work with modeler', function() {

      // when
      const modeler = new BpmnModeler({
        container: 'body',
        additionalModules: [ RendererModule ]
      });

      // then
      expect(modeler.get('elementTemplateIconRenderer')).to.exist;
    });


    it('should work without moddle descriptors (zeebe)', async function() {

      // given
      const viewer = new BpmnViewer({
        container: 'body',
        additionalModules: [ RendererModule ]
      });

      await viewer.importXML(diagramXML);

      const elementRegistry = viewer.get('elementRegistry');
      const element = elementRegistry.get('SendGridTask');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
    });


    it('should work with moddle descriptors (zeebe)', async function() {

      // given
      const viewer = new BpmnViewer({
        container: 'body',
        additionalModules: [ RendererModule ],
        moddleExtensions: { zeebe: zeebeModdleDescriptors }
      });

      await viewer.importXML(diagramXML);

      const elementRegistry = viewer.get('elementRegistry');
      const element = elementRegistry.get('SendGridTask');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
    });


    it('should work with custom icon property', async function() {

      // given
      const viewer = new BpmnViewer({
        container: 'body',
        elementTemplateIconRenderer: {
          iconProperty: 'foo:icon'
        },
        additionalModules: [ RendererModule ]
      });

      await viewer.importXML(diagramXML);

      const elementRegistry = viewer.get('elementRegistry');
      const element = elementRegistry.get('OtherVendorIconTask');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
    });

  });


  describe('render', function() {

    beforeEach(function() {
      const modelerContainer = document.createElement('div');
      modelerContainer.classList.add('canvas');

      const container = TestContainer.get(this);

      container.appendChild(modelerContainer);
    });

    beforeEach(bootstrapViewer(diagramXML, {
      additionalModules: [ RendererModule ],
      moddleExtensions: { zeebe: zeebeModdleDescriptors }
    }));


    (singleStart ? it.only : it)('should render icon', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('SendGridTask');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
      expect(getHref(iconGfx)).to.eql(getModelerTemplateIcon(element));

      expect(svgAttr(iconGfx, 'width')).to.eql('18');
      expect(svgAttr(iconGfx, 'height')).to.eql('18');
      expect(svgAttr(iconGfx, 'x')).to.eql('5');
      expect(svgAttr(iconGfx, 'y')).to.eql('5');
    }));


    it('should render icon - HTTPS', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('HTTPSIcon');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
      expect(getHref(iconGfx)).to.eql(getModelerTemplateIcon(element));
    }));


    it('should render - no template', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('NoTemplate');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
      expect(getHref(iconGfx)).to.eql(getModelerTemplateIcon(element));
    }));


    it('should render - blank start event', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('StartEvent_None');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
    }));


    it('should render - typed start event', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('StartEvent_Message');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
    }));


    it('should NOT render - label', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('StartEvent_None_label');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.not.exist;
    }));


    it('should render - typed end event', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('EndEvent');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
    }));


    it('should render - end event', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('EndEvent');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
    }));


    it('should render - boundary event', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('BoundaryEvent_Error');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.exist;
    }));


    it('should NOT render - no icon', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('NoIcon');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.not.exist;
    }));


    it('should pass attrs', inject(function(elementRegistry, eventBus, graphicsFactory) {

      // given
      const element = elementRegistry.get('SendGridTask'),
            gfx = elementRegistry.getGraphics(element);

      eventBus.on([ 'render.shape', 'render.connection' ], 2000, (event, context) => {
        context.attrs = {
          ...context.attrs,
          stroke: 'fuchsia'
        };
      });

      // when
      graphicsFactory.update('shape', element, gfx);

      // then
      const visuals = getVisuals(gfx);

      expect(visuals).to.exist;
      expect(svgAttr(domQuery('rect', visuals), 'stroke')).to.eql('fuchsia');
    }));

  });

});


// helpers /////////

function getVisuals(node) {
  return domQuery('.djs-visual', node);
}

function getImage(node) {
  const visuals = getVisuals(node);
  return visuals && domQuery('image', node);
}

function getHref(node) {
  return svgAttr(node, 'href');
}