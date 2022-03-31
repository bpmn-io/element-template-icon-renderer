import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

export function getElementTemplate(element) {
  return getBusinessObject(element).get('zeebe:modelerTemplate');
}

export function getModelerTemplateIcon(element) {
  const modelerTemplateIcon = findExtension(element, 'zeebe:ModelerTemplateIcon');
  return modelerTemplateIcon && modelerTemplateIcon.get('body');
}

export function findExtension(element, type) {
  const businessObject = getBusinessObject(element);

  let extensionElements;

  if (is(businessObject, 'bpmn:ExtensionElements')) {
    extensionElements = businessObject;
  } else {
    extensionElements = businessObject.get('extensionElements');
  }

  if (!extensionElements) {
    return null;
  }

  return extensionElements.get('values').find((value) => {
    return is(value, type);
  });
}