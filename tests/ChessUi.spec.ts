import 'mocha';
import { expect } from 'chai';
import { ChessUiFactory } from './factories';
import { ChessUi } from '../src/ts/lib/ui/ChessUi';

/**
 * ChessUiHtml Tests
 */
describe('Test ChessUi', () => {
    let ui: ChessUi;

    before(() => {
        ui = ChessUiFactory();
    });

    it('should be constructable', () => {
        expect(ui).to.be.instanceOf(ChessUi);
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
