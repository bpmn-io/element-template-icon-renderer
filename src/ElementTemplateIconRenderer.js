import inherits from 'inherits-browser';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  getBusinessObject,
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

var HIGH_PRIORITY = 1250,
    ICON_BOX_SIZE = 14,
    ICON_CIRCLE_RADIUS = Math.ceil(ICON_BOX_SIZE / Math.sqrt(2)),
    PADDING = {
      x: 5,
      y: 5
    };

/**
 *
 * @param {{ iconProperty?: string }|undefined} config
 * @param {import('bpmn-js/lib/draw/BpmnRenderer').default} bpmnRenderer
 * @param {import('diagram-js/lib/core/EventBus').default} eventBus
 */
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
    isAny(element, [ 'bpmn:Task', 'bpmn:Event' ]) && this._getIcon(element)
  );
};

ElementTemplateIconRenderer.prototype._getIcon = function(element) {
  return getModelerTemplateIcon(element, this._iconProperty);
};

ElementTemplateIconRenderer.prototype.drawShape = function(parentGfx, element, attrs = {}) {
  var gfx = this._bpmnRenderer.drawShape(parentGfx, element, attrs);

  var icon = this._getIcon(element);

  var size = ICON_BOX_SIZE,
      r = ICON_CIRCLE_RADIUS;

  var circleCenterPosition = {
    x: element.width - PADDING.x,
    y: PADDING.y
  };

  var outline = svgCreate('circle', {
    cx: circleCenterPosition.x,
    cy: circleCenterPosition.y,
    r,
    fill: 'white',
    stroke: 'black'
  });

  var img = svgCreate('image');
  svgAttr(img, {
    href: icon,
    width: size,
    height: size,
    x: circleCenterPosition.x - size / 2,
    y: circleCenterPosition.y - size / 2
  });

  svgAppend(parentGfx, outline);
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