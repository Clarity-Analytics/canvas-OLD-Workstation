import { CanvasNGPage } from './app.po';

describe('canvas-ng App', function() {
  let page: CanvasNGPage;

  beforeEach(() => {
    page = new CanvasNGPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
