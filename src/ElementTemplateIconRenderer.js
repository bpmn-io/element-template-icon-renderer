import inherits from 'inherits';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  is
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
    is(element, 'bpmn:Task') && this._getIcon(element)
  );
};

ElementTemplateIconRenderer.prototype._getIcon = function(element) {
  return getModelerTemplateIcon(element, this._iconProperty);
};

ElementTemplateIconRenderer.prototype.drawShape = function(parentGfx, element) {

  var renderer = this._bpmnRenderer.handlers['bpmn:Task'];

  var gfx = renderer(parentGfx, element);

  var icon = this._getIcon(element);

  var img = svgCreate('image');
  svgAttr(img, {
    href: icon,
    x: 5,
    y: 5,
    width: 18,
    height: 18
  });

  svgAppend(parentGfx, img);

  return gfx;
};

ElementTemplateIconRenderer.$inject = [
  'config.elementTemplateIconRenderer',
  'bpmnRenderer',
  'eventBus'
];