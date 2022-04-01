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
  require('bpmn-js/dist/assets/diagram-js.css')
);

insertCSS(
  'bpmn-js.css',
  require('bpmn-js/dist/assets/bpmn-js.css')
);

insertCSS(
  'bpmn-font.css',
  require('bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css')
);

insertCSS(
  'test.css',
  require('../test.css')
);


describe('elementTemplatesIconsRenderer', function() {


  describe('integration support', function() {


    it('should work with viewer', function() {

      // when
      const viewer = new BpmnViewer({
        container: 'body',
        additionalModules: [ RendererModule ]
      });

      // then
      expect(viewer.get('elementTemplatesIconsRenderer')).to.exist;
    });


    it('should work with modeler', function() {

      // when
      const modeler = new BpmnModeler({
        container: 'body',
        additionalModules: [ RendererModule ]
      });

      // then
      expect(modeler.get('elementTemplatesIconsRenderer')).to.exist;
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


    it('should NOT render - label', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('StartEvent_1_label');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.not.exist;
    }));


    it('should NOT render - start event', inject(function(elementRegistry) {

      // given
      const element = elementRegistry.get('StartEvent_1');

      const gfx = elementRegistry.getGraphics(element);

      // when
      const iconGfx = getImage(gfx);

      // then
      expect(iconGfx).to.not.exist;
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