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


export default function IconsRenderer(
    bpmnRenderer,
    config,
    eventBus
) {
  this._bpmnRenderer = bpmnRenderer;
  this._config = config || {};

  BaseRenderer.call(this, eventBus, HIGH_PRIORITY);
}

inherits(IconsRenderer, BaseRenderer);

IconsRenderer.prototype.canRender = function(element) {

  if (isLabel(element)) {
    return false;
  }

  return (
    is(element, 'bpmn:Task') &&
    !!getModelerTemplateIcon(element)
  );
};

IconsRenderer.prototype.drawShape = function(parentGfx, element) {

  var renderer = this._bpmnRenderer.handlers['bpmn:Task'];

  var gfx = renderer(parentGfx, element);

  var modelerTemplateIcon = getModelerTemplateIcon(element);

  var icon = svgCreate('image');
  svgAttr(icon, {
    href: modelerTemplateIcon,
    x: 4,
    y: 4
  });

  svgAppend(parentGfx, icon);

  return gfx;
};

IconsRenderer.$inject = [
  'bpmnRenderer',
  'config.bpmnRenderer',
  'eventBus',
];