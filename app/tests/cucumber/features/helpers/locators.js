class LocatorsHelper {
  constructor() {}

  getTextFromElement(cssSelector) {
    let element = browser.element(cssSelector);
    element.waitForExist();
    return element.getText();
  }

  getTextFromElements(cssSelector, index) {
    browser.waitForExist(cssSelector);
    // this.client.element('.pu-highlighttext').waitForExist();
    let elements = browser.elements(cssSelector);
    if (index < 0) {
      index += elements.value.length;
    }
    let elementId = elements.value[index].ELEMENT;
    let text = browser.elementIdText(elementId).value;
    return text;
  }
}

export default new LocatorsHelper();
