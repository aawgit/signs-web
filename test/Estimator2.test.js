import * as fs from 'fs';
import browserEnv from 'browser-env';
import {getPose2} from '../src/service/detector.service'

browserEnv(['navigator']);
describe('estimator test', ()=>{
    it('only reads a file yet', async ()=>{
        try {
            var base = process.env.PWD;
            const img = fs.readFileSync(base+'/test/data/img1.jpg');
            const pose = await getPose2(img)
            console.log(pose)
          } catch (err) {
            console.error(err);
          }
    }, 10000)
})
