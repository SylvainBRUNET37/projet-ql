import { Builder, By, until, WebDriver } from 'selenium-webdriver';

(async function enableDisableToggleTest(): Promise<void> {
  let driver: WebDriver = await new Builder().forBrowser('chrome').build();

  try {
    // Naviguer vers la page de gestion des équipements
    await driver.get('http://localhost:5173/home');

    // Localiser le bouton "Enable" ou "Disable" pour un équipement spécifique
    const toggleButton = await driver.findElement(By.xpath("//tr[td[contains(text(),'XX-2505')]]//button[contains(text(),'Enable') or contains(text(),'Disable')]"));

    // Capturer le texte actuel du bouton (Enable ou Disable)
    const initialText = await toggleButton.getText();

    // Cliquer sur le bouton
    await toggleButton.click();

    // Attendre que le texte du bouton change
    await driver.wait(async () => {
      const updatedText = await toggleButton.getText();
      return updatedText !== initialText;
    }, 5000);

    // Vérifier que le texte a changé
    const updatedText = await toggleButton.getText();
    if (initialText === 'Enable' && updatedText === 'Disable') {
      console.log('Test Passed: Button changed from Enable to Disable.');
    } else if (initialText === 'Disable' && updatedText === 'Enable') {
      console.log('Test Passed: Button changed from Disable to Enable.');
    } else {
      console.error('Test Failed: Button text did not change as expected.');
    }

  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    // Fermer le navigateur
    await driver.quit();
  }
})();
