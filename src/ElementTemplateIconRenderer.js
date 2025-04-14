import inherits from 'inherits-browser';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  getBusinessObject,
  is,
  isAny
} from 'bpmn-js/lib/util/ModelUtil';

import {
  isLabel
} from 'bpmn-js/lib/util/LabelUtil';


import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import {
  getModelerTemplateIcon
} from './util';

var HIGH_PRIORITY = 1250;


export default function ElementTemplateIconRenderer(
    config,
    bpmnRenderer,
    eventBus) {

  this._bpmnRenderer = bpmnRenderer;

  this._iconProperty = config && config.iconProperty;

  BaseRenderer.call(this, eventBus, HIGH_PRIORITY);
}

inherits(ElementTemplateIconRenderer, BaseRenderer);

ElementTemplateIconRenderer.prototype.canRender = function(element) {

  if (isLabel(element)) {
    return false;
  }

  return !!(
    isAny(element, [ 'bpmn:Activity', 'bpmn:Event' ]) && this._getIcon(element)
  );
};

ElementTemplateIconRenderer.prototype._getIcon = function(element) {
  return getModelerTemplateIcon(element, this._iconProperty);
};

ElementTemplateIconRenderer.prototype.drawShape = function(parentGfx, element, attrs = {}) {

  var renderer = this._bpmnRenderer.handlers[
    [
      'bpmn:BoundaryEvent',
      'bpmn:CallActivity',
      'bpmn:EndEvent',
      'bpmn:IntermediateCatchEvent',
      'bpmn:IntermediateThrowEvent',
      'bpmn:StartEvent',
      'bpmn:Task',

      // specialized subprocess before general
      'bpmn:AdHocSubProcess',
      'bpmn:Transaction',
      'bpmn:SubProcess'
    ].find(t => is(element, t))
  ];

  var gfx = renderer(parentGfx, element, { ...attrs, renderIcon: false });

  var icon = this._getIcon(element);

  var size = 18;

  var padding = is(element, 'bpmn:Activity') ? {
    x: 5,
    y: 5
  } : {
    x: (element.width - size) / 2,
    y: (element.height - size) / 2
  };

  var img = svgCreate('image');
  svgAttr(img, {
    href: icon,
    width: size,
    height: size,
    ...padding
  });

  svgAppend(parentGfx, img);

  return gfx;
};

ElementTemplateIconRenderer.$inject = [
  'config.elementTemplateIconRenderer',
  'bpmnRenderer',
  'eventBus'
];


// helpers //////////////

export function hasEventDefinition(element, eventType) {
  const businessObject = getBusinessObject(element);

  return (businessObject.eventDefinitions || []).length;
}