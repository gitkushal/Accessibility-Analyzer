const puppeteer = require("puppeteer")
const axeCore = require("axe-core")
const fs = require("fs")
const path = require("path")

class AccessibilityService{
    constructor(){
        this.browser = null;
    }

    async initBrowser(){
        if(!this.browser){
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox','--disable-setuid-sandbox']
            });
        }
        return this.browser;
    }

    async scanUrl(url){
        try{
            const browser = await this.initBrowser();
            const page = await browser.newPage();

            await page.goto(url, {waitUntil:'networkidle2'});

            await page.addScriptTag({
                path: require.resolve('axe-core/axe.min.js')
            });

            const results = await page.evaluate(() => {
                return new Promise((resolve) => {
                    axe.run((err,results) => {
                        if(err) throw err;
                        resolve(results);
                    });
                });
            });

            await page.close();

            return this.formatResults(results);
        }
        catch(error){
            console.log('Scan Failed : ', error.message);
            throw new Error(`Failed to scan URL : ${error.message}`);
        }
    }

    formatResults(axeResults){
    const violations = axeResults.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(node => ({
        html: node.html,
        target: node.target
      }))
    }));

   return {
      issueCount: violations.length,
      violations: violations,
      passes: axeResults.passes.length
    }; 

    }

    async closeBrowser(){
        if(this.browser){
            await this.browser.close();
            this.browser = null;
        }
    }
}

module.exports = new AccessibilityService();