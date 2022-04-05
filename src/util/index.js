import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

export function getModelerTemplateIcon(element) {
  var modelerTemplateIcon = getBusinessObject(element).get('zeebe:modelerTemplateIcon');
  return modelerTemplateIcon;
}
