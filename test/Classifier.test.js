const runPreprocessSteps = require('../src/components/Classifier')

describe('examples', () => {
    it('handles a basic assertion', () => {
      expect(42).toBe(42);
    })
})

describe('classifier', ()=>{
    it('pre process correctly', ()=>{
        const correctlyPreprocessed = []
        const preProcessed = runPreprocessSteps()
        expeect(preProcessed).toBe(correctlyPreprocessed)
    })
})