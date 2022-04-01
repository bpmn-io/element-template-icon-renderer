import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

export function getModelerTemplateIcon(element) {
  var modelerTemplateIcon = findExtension(element, 'zeebe:ModelerTemplateIcon');
  return modelerTemplateIcon && (modelerTemplateIcon.$body || modelerTemplateIcon.body);
}

export function findExtension(element, type) {
  var businessObject = getBusinessObject(element);

  var extensionElements;

  if (is(businessObject, 'bpmn:ExtensionElements')) {
    extensionElements = businessObject;
  } else {
    extensionElements = businessObject.get('extensionElements');
  }

  if (!extensionElements) {
    return null;
  }

  return extensionElements.get('values').find((value) => {

    // make sure we can read the model without moddle descriptors to be required
    return value && value.$type.toLowerCase() === type.toLowerCase();
  });
}