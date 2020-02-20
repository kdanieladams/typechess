import 'mocha';
import { expect } from 'chai';
import { ChessUiHtmlFactory } from './factories';
import { ChessUiHtml } from '../src/ts/lib/ui/ChessUiHtml';

/**
 * ChessUiHtml Tests
 */
describe('Test ChessUiHtml', () => {
    let ui: ChessUiHtml;

    before(() => {
        ui = ChessUiHtmlFactory();
    });

    it('should be constructable', () => {
        expect(ui).to.be.instanceOf(ChessUiHtml);
    });

    describe('getUiDiv()', () => {
        it('should provide it\'s bound ui_div element', () => {
            let ui_div = ui.getUiDiv();
            expect(ui_div).to.be.instanceOf(HTMLDivElement);
        });
    });
    
    describe('draw()', () => {
        it('should draw without errors', () => {
            let err: Error;
    
            try {
                ui.draw(0, 0, []);
            }
            catch(e) {
                err = e;
            }
    
            expect(err).to.be.undefined;
        });
    }); 
});
