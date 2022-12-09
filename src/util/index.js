import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

/**
 * Get icon defined on a moddle element.
 *
 * @param { ModdleElement } element
 * @param { string } iconProperty
 *
 * @return { string }
 */
export function getModelerTemplateIcon(element, iconProperty) {
  iconProperty = iconProperty || 'zeebe:modelerTemplateIcon';

  return getBusinessObject(element).get(iconProperty);
}
