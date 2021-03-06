import {init} from '../actions';

jest.mock('../openplatform');
import * as openplatform from '../openplatform';

describe('reducers', () => {
  describe('init', () => {
    it('initialises store', async () => {
      openplatform.getUser.mockImplementation(() => 'userId');
      openplatform.findOrCreateType
        .mockImplementationOnce((_, id) => {
          expect(id).toBe('QUIZ');
          return 'quiztype';
        })
        .mockImplementationOnce((_, id) => {
          expect(id).toBe('QUIZ_IMAGE');
          return 'imagetype';
        })
        .mockImplementationOnce((_, id) => {
          expect(id).toBe('PAGE');
          return 'pagetype';
        });
      openplatform.storage.find.mockImplementationOnce(() => ['x']);
      const dispatch = jest.fn();

      await init()(dispatch);

      expect(dispatch.mock.calls[0][0]).toEqual({type: 'LOADING_STARTED'});
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: 'INITIALISED',
        state: {
          storage: {
            pageType: 'pagetype',
            quizImageType: 'imagetype',
            quizType: 'quiztype',
            user: 'userId'
          },
          ui: {initialised: true, ownQuizzes: ['x']}
        }
      });
      expect(dispatch.mock.calls[2][0]).toEqual({type: 'LOADING_DONE'});
      expect(dispatch.mock.calls.length).toBe(3);
    });
  });
});
